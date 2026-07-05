export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: { message: { content: string } }[];
}

export interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

export const defaultConfig: DeepSeekConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  model: 'deepseek-chat',
  temperature: 0.8,
  maxTokens: 800,
  timeout: 30000,
};

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  config: DeepSeekConfig = defaultConfig,
): Promise<string> {
  if (!config.apiKey) {
    throw new DeepSeekError('API_KEY_MISSING', 'DeepSeek API key is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new DeepSeekError(
        'API_ERROR',
        `DeepSeek API returned ${response.status}: ${errorText.slice(0, 200)}`,
      );
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new DeepSeekError('EMPTY_RESPONSE', 'DeepSeek returned empty content');
    }

    return content;
  } catch (err) {
    if (err instanceof DeepSeekError) {
      throw err;
    }
    if (err instanceof Error && err.name === 'AbortError') {
      throw new DeepSeekError('TIMEOUT', 'Request timed out');
    }
    throw new DeepSeekError('NETWORK_ERROR', `Network error: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

export class DeepSeekError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'DeepSeekError';
    this.code = code;
  }
}

export function isApiKeyConfigured(): boolean {
  return !!process.env.DEEPSEEK_API_KEY;
}
