import { NextRequest, NextResponse } from 'next/server';
import type { MemeStyle, IconName } from '@/types/meme';
import { callDeepSeek, DeepSeekError, isApiKeyConfigured } from '@/lib/deepseek';
import { SYSTEM_PROMPT, buildUserPrompt, getDefaultIcon } from '@/lib/prompts';
import { getMockCaption } from '@/lib/mock-data';

const VALID_STYLES: MemeStyle[] = ['cute', 'savage', 'chill', 'formal'];
const VALID_ICONS: IconName[] = ['heart', 'fire', 'fish', 'briefcase'];

// ===== Rate Limiting (in-memory) =====
const requestMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per IP per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestMap.get(ip) || [];
  const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recent.push(now);
  requestMap.set(ip, recent);
  return true;
}

// Cleanup old entries periodically
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, requests] of requestMap.entries()) {
    const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) {
      requestMap.delete(ip);
    } else {
      requestMap.set(ip, recent);
    }
  }
}

// ===== Request/Response Types =====

interface RequestBody {
  text: string;
  styles: MemeStyle[];
}

interface MemeResult {
  style: MemeStyle;
  caption: string;
  icon: IconName;
}

interface ResponseBody {
  success: boolean;
  data?: {
    memes: MemeResult[];
    demoMode?: boolean;
  };
  error?: string;
  code?: string;
}

// ===== JSON Extraction =====

function extractJson(content: string): unknown | null {
  // Clean markdown code block markers
  let cleaned = content.trim();

  // Remove ```json ... ``` or ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue to fallback
  }

  // Try to find JSON object with regex
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Continue
    }
  }

  return null;
}

function validateMemeResult(item: unknown, validStyles: MemeStyle[]): MemeResult | null {
  if (typeof item !== 'object' || item === null) return null;
  const obj = item as Record<string, unknown>;

  const style = obj.style;
  const caption = obj.caption;
  const icon = obj.icon;

  if (typeof style !== 'string' || !VALID_STYLES.includes(style as MemeStyle)) {
    return null;
  }
  if (!validStyles.includes(style as MemeStyle)) {
    return null;
  }
  if (typeof caption !== 'string' || caption.length === 0) {
    return null;
  }

  const validStyle = style as MemeStyle;
  const validCaption = caption.slice(0, 50); // Safety cap

  // Validate icon field - must be one of the allowed values
  let validIcon: IconName;
  if (typeof icon === 'string' && VALID_ICONS.includes(icon as IconName)) {
    validIcon = icon as IconName;
  } else {
    validIcon = getDefaultIcon(validStyle) as IconName;
  }

  return { style: validStyle, caption: validCaption, icon: validIcon };
}

// ===== Mock Fallback =====

function generateMockResults(text: string, styles: MemeStyle[]): MemeResult[] {
  return styles.map((style) => {
    const mock = getMockCaption(text, style);
    return {
      style,
      caption: mock.caption,
      icon: mock.icon,
    };
  });
}

// ===== Main Handler =====

// Vercel Serverless Function max duration (seconds)
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  cleanupRateLimit();

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit check
  if (!checkRateLimit(ip)) {
    const body: ResponseBody = {
      success: false,
      error: '请求太频繁，请稍后再试',
      code: 'RATE_LIMITED',
    };
    return NextResponse.json(body, { status: 429 });
  }

  // Parse and validate request body
  let reqBody: RequestBody;
  try {
    reqBody = await request.json();
  } catch {
    const body: ResponseBody = {
      success: false,
      error: '请求格式错误',
      code: 'BAD_REQUEST',
    };
    return NextResponse.json(body, { status: 400 });
  }

  const { text, styles } = reqBody;

  // Validate text
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    const body: ResponseBody = {
      success: false,
      error: '输入文字不能为空',
      code: 'EMPTY_TEXT',
    };
    return NextResponse.json(body, { status: 400 });
  }

  if (text.length > 100) {
    const body: ResponseBody = {
      success: false,
      error: '输入文字不能超过100个字符',
      code: 'TEXT_TOO_LONG',
    };
    return NextResponse.json(body, { status: 400 });
  }

  // Validate styles
  if (!Array.isArray(styles) || styles.length === 0) {
    const body: ResponseBody = {
      success: false,
      error: '请至少选择一种风格',
      code: 'NO_STYLE',
    };
    return NextResponse.json(body, { status: 400 });
  }

  const validStyles = styles.filter(
    (s): s is MemeStyle => typeof s === 'string' && VALID_STYLES.includes(s as MemeStyle),
  );

  if (validStyles.length === 0) {
    const body: ResponseBody = {
      success: false,
      error: '风格选择无效',
      code: 'INVALID_STYLE',
    };
    return NextResponse.json(body, { status: 400 });
  }

  // Check if API key is configured
  if (!isApiKeyConfigured()) {
    // Demo mode fallback
    const mockResults = generateMockResults(text.trim(), validStyles);
    const body: ResponseBody = {
      success: true,
      data: {
        memes: mockResults,
        demoMode: true,
      },
    };
    return NextResponse.json(body, { status: 200 });
  }

  // Build prompts
  const userPrompt = buildUserPrompt(text.trim(), validStyles);

  // Call DeepSeek API
  try {
    const content = await callDeepSeek([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);

    // Parse JSON response
    const parsed = extractJson(content);

    if (!parsed || typeof parsed !== 'object') {
      const body: ResponseBody = {
        success: false,
        error: 'AI 返回格式异常，请重试',
        code: 'PARSE_ERROR',
      };
      return NextResponse.json(body, { status: 500 });
    }

    const parsedObj = parsed as Record<string, unknown>;
    const memesArray = parsedObj.memes;

    if (!Array.isArray(memesArray)) {
      const body: ResponseBody = {
        success: false,
        error: 'AI 返回格式异常，请重试',
        code: 'PARSE_ERROR',
      };
      return NextResponse.json(body, { status: 500 });
    }

    // Validate and filter results
    const validResults: MemeResult[] = [];
    for (const item of memesArray) {
      const validated = validateMemeResult(item, validStyles);
      if (validated) {
        validResults.push(validated);
      }
    }

    // If AI didn't return all requested styles, fill with mock data
    for (const style of validStyles) {
      if (!validResults.find((r) => r.style === style)) {
        const mock = getMockCaption(text.trim(), style);
        validResults.push({
          style,
          caption: mock.caption,
          icon: mock.icon,
        });
      }
    }

    const body: ResponseBody = {
      success: true,
      data: {
        memes: validResults,
      },
    };
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    let errorMessage = '生成失败，请重试';
    let errorCode = 'UNKNOWN';
    let statusCode = 500;

    if (err instanceof DeepSeekError) {
      switch (err.code) {
        case 'API_KEY_MISSING':
          // Fallback to mock
          const mockResults = generateMockResults(text.trim(), validStyles);
          const mockBody: ResponseBody = {
            success: true,
            data: {
              memes: mockResults,
              demoMode: true,
            },
          };
          return NextResponse.json(mockBody, { status: 200 });

        case 'TIMEOUT':
          errorMessage = 'AI 生成超时，请重试';
          errorCode = 'TIMEOUT';
          statusCode = 504;
          break;

        case 'API_ERROR':
          errorMessage = 'AI 服务暂时不可用';
          errorCode = 'AI_UNAVAILABLE';
          statusCode = 502;
          break;

        default:
          errorMessage = '生成失败，请重试';
          errorCode = err.code;
          statusCode = 500;
      }
    }

    const body: ResponseBody = {
      success: false,
      error: errorMessage,
      code: errorCode,
    };
    return NextResponse.json(body, { status: statusCode });
  }
}
