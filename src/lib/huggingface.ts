/**
 * HuggingFace Inference API wrapper for text-to-image generation.
 * Uses SDXL model for high-quality cartoon/meme-style images.
 */

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface HFConfig {
  apiKey: string;
  model: string;
  width: number;
  height: number;
  timeout: number;
}

export const defaultHFConfig: HFConfig = {
  apiKey: process.env.HF_TOKEN || '',
  model: process.env.HF_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0',
  width: 512,
  height: 512,
  timeout: 60000, // Image generation takes longer
};

export class HFError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'HFError';
    this.code = code;
  }
}

export function isHFConfigured(): boolean {
  return !!process.env.HF_TOKEN;
}

/**
 * Call HuggingFace Inference API to generate an image from text prompt.
 * Returns base64 data URL of the generated image.
 */
export async function generateImage(
  prompt: string,
  config: HFConfig = defaultHFConfig,
): Promise<string> {
  if (!config.apiKey) {
    throw new HFError('API_KEY_MISSING', 'HuggingFace token is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const url = `https://router.huggingface.co/hf-inference/models/${config.model}`;

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: config.width,
          height: config.height,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }),
      signal: controller.signal,
    };

    let response = await fetch(url, options);

    // Model cold-start: 503 with estimated_time - wait and retry once
    if (response.status === 503) {
      const errorBody = await response.json().catch(() => ({}));
      const estimatedTime =
        (errorBody as { estimated_time?: number }).estimated_time || 10;
      await sleep(Math.min(estimatedTime * 1000, 15000));
      // Retry once
      response = await fetch(url, options);
      if (response.status === 503) {
        throw new HFError('MODEL_LOADING', '模型仍在加载中，请稍后重试');
      }
    }

    // Rate limited
    if (response.status === 429) {
      throw new HFError('RATE_LIMITED', '请求过于频繁，请稍后再试');
    }

    // Content-Type check: HF returns image blob on success
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.startsWith('image/')) {
      const errorText = await response.text().catch(() => '');
      throw new HFError(
        'API_ERROR',
        `HuggingFace API returned ${response.status}: ${errorText.slice(0, 200)}`,
      );
    }

    // Convert image blob to base64 data URL
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Determine mime type from content-type
    const mime = contentType.split(';')[0].trim() || 'image/jpeg';
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    if (err instanceof HFError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new HFError('TIMEOUT', '图片生成超时，请重试');
    }
    throw new HFError(
      'NETWORK_ERROR',
      `Network error: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Run async tasks with a concurrency limit, preserving result order.
 * Results are placed at their original task index so callers can map by index.
 */
async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  const run = async (): Promise<void> => {
    while (cursor < tasks.length) {
      const index = cursor++;
      results[index] = await tasks[index]();
    }
  };

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) || 1 },
    () => run(),
  );
  await Promise.all(workers);
  return results;
}

export { runWithConcurrency };
