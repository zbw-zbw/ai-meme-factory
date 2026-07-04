import { NextRequest, NextResponse } from 'next/server';
import type { MemeStyle, IconName } from '@/types/meme';
import { callDeepSeek, DeepSeekError, isApiKeyConfigured } from '@/lib/deepseek';
import { generateImage, HFError, isHFConfigured, runWithConcurrency } from '@/lib/huggingface';
import { SYSTEM_PROMPT, buildUserPrompt, getDefaultIcon } from '@/lib/prompts';
import { buildImagePrompt } from '@/lib/image-prompts';
import { getMockCaption } from '@/lib/mock-data';

const VALID_STYLES: MemeStyle[] = ['cute', 'savage', 'chill', 'formal'];
const VALID_ICONS: IconName[] = ['heart', 'fire', 'fish', 'briefcase'];

// ===== Rate Limiting (in-memory) =====
const requestMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestMap.get(ip) || [];
  const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  requestMap.set(ip, recent);
  return true;
}

function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, requests] of requestMap.entries()) {
    const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) requestMap.delete(ip);
    else requestMap.set(ip, recent);
  }
}

// ===== Types =====

interface RequestBody {
  text: string;
  styles: MemeStyle[];
}

interface MemeResult {
  style: MemeStyle;
  caption: string;
  icon: IconName;
  imageUrl?: string; // AI-generated background image (base64 data URL)
}

interface ResponseBody {
  success: boolean;
  data?: {
    memes: MemeResult[];
    demoMode?: boolean;
    aiImageMode?: boolean;
  };
  error?: string;
  code?: string;
}

// ===== JSON Extraction =====

function extractJson(content: string): unknown | null {
  let cleaned = content.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) cleaned = codeBlockMatch[1].trim();
  try { return JSON.parse(cleaned); } catch { /* continue */ }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { /* continue */ }
  }
  return null;
}

function validateMemeResult(item: unknown, validStyles: MemeStyle[]): MemeResult | null {
  if (typeof item !== 'object' || item === null) return null;
  const obj = item as Record<string, unknown>;
  if (typeof obj.style !== 'string' || !VALID_STYLES.includes(obj.style as MemeStyle)) return null;
  if (!validStyles.includes(obj.style as MemeStyle)) return null;
  if (typeof obj.caption !== 'string' || obj.caption.length === 0) return null;

  const validStyle = obj.style as MemeStyle;
  const validCaption = obj.caption.slice(0, 50);
  let validIcon: IconName;
  if (typeof obj.icon === 'string' && VALID_ICONS.includes(obj.icon as IconName)) {
    validIcon = obj.icon as IconName;
  } else {
    validIcon = getDefaultIcon(validStyle) as IconName;
  }

  return { style: validStyle, caption: validCaption, icon: validIcon };
}

// ===== Mock Fallback =====

function generateMockResults(text: string, styles: MemeStyle[]): MemeResult[] {
  return styles.map((style) => {
    const mock = getMockCaption(text, style);
    return { style, caption: mock.caption, icon: mock.icon };
  });
}

// ===== AI Image Generation (with error tolerance) =====

async function generateMemeImage(
  userInput: string,
  caption: string,
  style: MemeStyle,
): Promise<string | undefined> {
  try {
    const prompt = buildImagePrompt(userInput, caption, style);
    return await generateImage(prompt);
  } catch (err) {
    // Image generation failure is non-fatal: fall back to Canvas-only rendering
    console.warn(`[HF] Image generation failed for ${style}:`, err instanceof Error ? err.message : err);
    return undefined;
  }
}

// ===== Main Handler =====

export const maxDuration = 60; // Increased for image generation

export async function POST(request: NextRequest) {
  cleanupRateLimit();

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, error: '请求太频繁，请稍后再试', code: 'RATE_LIMITED' }, { status: 429 });
  }

  // Parse request
  let reqBody: RequestBody;
  try {
    reqBody = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: '请求格式错误', code: 'BAD_REQUEST' }, { status: 400 });
  }

  const { text, styles } = reqBody;

  // Validate text
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ success: false, error: '输入文字不能为空', code: 'EMPTY_TEXT' }, { status: 400 });
  }
  if (text.length > 100) {
    return NextResponse.json({ success: false, error: '输入文字不能超过100个字符', code: 'TEXT_TOO_LONG' }, { status: 400 });
  }

  // Validate styles
  if (!Array.isArray(styles) || styles.length === 0) {
    return NextResponse.json({ success: false, error: '请至少选择一种风格', code: 'NO_STYLE' }, { status: 400 });
  }

  const validStyles = styles.filter(
    (s): s is MemeStyle => typeof s === 'string' && VALID_STYLES.includes(s as MemeStyle),
  );
  if (validStyles.length === 0) {
    return NextResponse.json({ success: false, error: '风格选择无效', code: 'INVALID_STYLE' }, { status: 400 });
  }

  const cleanText = text.trim();

  // Demo mode: no API keys configured
  if (!isApiKeyConfigured()) {
    return NextResponse.json({
      success: true,
      data: { memes: generateMockResults(cleanText, validStyles), demoMode: true },
    });
  }

  // ===== Phase 1: Generate captions with DeepSeek =====
  let captionResults: MemeResult[];
  try {
    const userPrompt = buildUserPrompt(cleanText, validStyles);
    const content = await callDeepSeek([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);

    const parsed = extractJson(content);
    if (!parsed || typeof parsed !== 'object') {
      return NextResponse.json({ success: false, error: 'AI 返回格式异常，请重试', code: 'PARSE_ERROR' }, { status: 500 });
    }

    const parsedObj = parsed as Record<string, unknown>;
    const memesArray = parsedObj.memes;
    if (!Array.isArray(memesArray)) {
      return NextResponse.json({ success: false, error: 'AI 返回格式异常，请重试', code: 'PARSE_ERROR' }, { status: 500 });
    }

    captionResults = [];
    for (const item of memesArray) {
      const validated = validateMemeResult(item, validStyles);
      if (validated) captionResults.push(validated);
    }

    // Fill missing styles with mock
    for (const style of validStyles) {
      if (!captionResults.find((r) => r.style === style)) {
        const mock = getMockCaption(cleanText, style);
        captionResults.push({ style, caption: mock.caption, icon: mock.icon });
      }
    }
  } catch (err) {
    if (err instanceof DeepSeekError && err.code === 'API_KEY_MISSING') {
      return NextResponse.json({
        success: true,
        data: { memes: generateMockResults(cleanText, validStyles), demoMode: true },
      });
    }
    const errorMessage = err instanceof DeepSeekError
      ? err.code === 'TIMEOUT' ? 'AI 生成超时，请重试'
        : err.code === 'API_ERROR' ? 'AI 服务暂时不可用'
          : '生成失败，请重试'
      : '生成失败，请重试';
    const errorCode = err instanceof DeepSeekError ? err.code : 'UNKNOWN';
    return NextResponse.json({ success: false, error: errorMessage, code: errorCode }, { status: 500 });
  }

  // ===== Phase 2: Generate AI images (if HF is configured) =====
  let aiImageMode = false;

  if (isHFConfigured()) {
    aiImageMode = true;

    // Generate images with concurrency limit to avoid overwhelming HF API
    const imageResults = await runWithConcurrency(
      captionResults.map((meme) => () => generateMemeImage(cleanText, meme.caption, meme.style)),
      2,
    );

    // Attach images to results
    captionResults = captionResults.map((meme, i) => ({
      ...meme,
      imageUrl: imageResults[i], // undefined if generation failed
    }));
  }

  return NextResponse.json({
    success: true,
    data: {
      memes: captionResults,
      aiImageMode,
    },
  });
}
