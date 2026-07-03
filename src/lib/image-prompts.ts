/**
 * Build image generation prompts based on meme style and user text.
 * Each style gets a distinct visual treatment for the AI-generated background.
 */

import type { MemeStyle } from '@/types/meme';

const styleImagePrompts: Record<MemeStyle, (text: string, caption: string) => string> = {
  cute: (text, caption) =>
    `A cute chibi cartoon sticker illustration of "${caption}". ` +
    `Kawaii style, pastel pink background, soft rounded shapes, ` +
    `big sparkly eyes, rosy cheeks, floating hearts and stars, ` +
    `warm cozy atmosphere, flat illustration, meme sticker art, ` +
    `vibrant but soft colors, simple clean composition, no text`,

  savage: (text, caption) =>
    `A spicy sarcastic cartoon sticker illustration of "${caption}". ` +
    `Dark moody background with red accents, sharp angular shapes, ` +
    `comic book style, bold dramatic lighting, ` +
    `expression of annoyance or sass, fire or lightning elements, ` +
    `high contrast, meme sticker art, ` +
    `intense vivid colors, no text`,

  chill: (text, caption) =>
    `A relaxed lazy cartoon sticker illustration of "${caption}". ` +
    `Cool blue and teal background, wavy organic shapes, ` +
    `lo-fi aesthetic, chill vibes, fish or ocean elements, ` +
    `dreamy soft focus, floating bubbles or clouds, ` +
    `flat illustration, meme sticker art, ` +
    `calming cool colors, no text`,

  formal: (text, caption) =>
    `A professional but humorous cartoon sticker illustration of "${caption}". ` +
    `Clean light gray and navy background, geometric shapes, ` +
    `minimalist illustration style, office setting elements, ` +
    `slightly awkward or formal atmosphere, ` +
    `structured composition, clean lines, meme sticker art, ` +
    `muted professional colors with subtle warmth, no text`,
};

/**
 * Generate an image prompt for a specific meme style.
 * The prompt is in English for better model comprehension.
 */
export function buildImagePrompt(
  userInput: string,
  caption: string,
  style: MemeStyle,
): string {
  return styleImagePrompts[style](userInput, caption);
}
