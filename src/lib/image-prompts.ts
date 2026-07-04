/**
 * Build image generation prompts based on meme style and user text.
 * Each style gets a distinct visual treatment with random variations.
 */

import type { MemeStyle } from '@/types/meme';

// Variation modifiers for diversity between generations
const cuteVariations = [
  'cherry blossom petals floating around',
  'soft rainbow light in background',
  'sparkly confetti scattered around',
  'cotton candy clouds surrounding',
  'tiny ribbon bows decorations',
];

const savageVariations = [
  'cracked earth texture in background',
  'dramatic thunderstorm clouds',
  'neon red warning signs around edges',
  'splattered paint effect background',
  'glitch distortion elements',
];

const chillVariations = [
  'gentle falling snowflakes',
  'kite flying in the distance',
  'hammock between palm trees',
  'slow-moving river with lily pads',
  'cozy blanket and hot cocoa nearby',
];

const formalVariations = [
  'neat organized bookshelf in background',
  'framed certificate on wall',
  'tidy desk with pen holder',
  'pie chart or bar graph decoration',
  'clean whiteboard with bullet points',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const styleImagePrompts: Record<MemeStyle, (text: string, caption: string) => string> = {
  cute: (text, caption) =>
    `A cute chibi cartoon sticker illustration of "${caption}". ` +
    `Kawaii style, pastel pink background, soft rounded shapes, ` +
    `big sparkly eyes, rosy cheeks, floating hearts and stars, ` +
    `${pickRandom(cuteVariations)}, ` +
    `warm cozy atmosphere, flat illustration, meme sticker art, ` +
    `vibrant but soft colors, simple clean composition, no text`,

  savage: (text, caption) =>
    `A spicy sarcastic cartoon sticker illustration of "${caption}". ` +
    `Dark moody background with red accents, sharp angular shapes, ` +
    `comic book style, bold dramatic lighting, ` +
    `expression of annoyance or sass, fire or lightning elements, ` +
    `${pickRandom(savageVariations)}, ` +
    `high contrast, meme sticker art, ` +
    `intense vivid colors, no text`,

  chill: (text, caption) =>
    `A relaxed lazy cartoon sticker illustration of "${caption}". ` +
    `Cool blue and teal background, wavy organic shapes, ` +
    `lo-fi aesthetic, chill vibes, fish or ocean elements, ` +
    `dreamy soft focus, floating bubbles or clouds, ` +
    `${pickRandom(chillVariations)}, ` +
    `flat illustration, meme sticker art, ` +
    `calming cool colors, no text`,

  formal: (text, caption) =>
    `A professional but humorous cartoon sticker illustration of "${caption}". ` +
    `Clean light gray and navy background, geometric shapes, ` +
    `minimalist illustration style, office setting elements, ` +
    `slightly awkward or formal atmosphere, ` +
    `${pickRandom(formalVariations)}, ` +
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
