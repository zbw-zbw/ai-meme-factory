import type { MemeStyle, MemeItem } from '@/types/meme';
import { getStyleConfig } from './meme-styles';

const CANVAS_SIZE = 480;
const EMOJI_FONT_SIZE = 96;
const LABEL_FONT_SIZE = 14;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const chars = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (const char of chars) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawBackground(ctx: CanvasRenderingContext2D, style: MemeStyle, size: number) {
  const config = getStyleConfig(style);

  // Parse gradient stops from CSS-like gradient string
  const stopColors: string[] = [];
  const regex = /#[0-9A-Fa-f]{6}/g;
  const gradientStr = config.bgGradient;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(gradientStr)) !== null) {
    stopColors.push(match[0]);
  }

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  stopColors.forEach((color, i) => {
    gradient.addColorStop(i / Math.max(stopColors.length - 1, 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Style-specific decorations
  if (style === 'cute') {
    // Semi-transparent small circles
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = config.accentColor;
    const positions = [
      { x: size * 0.15, y: size * 0.12 },
      { x: size * 0.82, y: size * 0.2 },
      { x: size * 0.9, y: size * 0.85 },
      { x: size * 0.1, y: size * 0.78 },
      { x: size * 0.5, y: size * 0.05 },
    ];
    positions.forEach((p, i) => {
      const r = (12 + (i % 3) * 8) * DPR;
      ctx.beginPath();
      ctx.arc(p.x * DPR, p.y * DPR, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  } else if (style === 'savage') {
    // Diagonal line texture in corners
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * DPR;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo((size + i * 30) * DPR, 0);
      ctx.lineTo(0, (size + i * 30) * DPR);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (style === 'chill') {
    // Wavy bottom decoration
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = config.accentColor;
    ctx.beginPath();
    const waveY = size * 0.88 * DPR;
    ctx.moveTo(0, waveY);
    for (let x = 0; x <= size * DPR; x += DPR) {
      const waveHeight = Math.sin((x / DPR / size) * Math.PI * 3) * 12 * DPR;
      ctx.lineTo(x, waveY + waveHeight);
    }
    ctx.lineTo(size * DPR, size * DPR);
    ctx.lineTo(0, size * DPR);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (style === 'formal') {
    // Inner border
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 2 * DPR;
    const inset = 8 * DPR;
    ctx.strokeRect(inset, inset, size * DPR - inset * 2, size * DPR - inset * 2);
    ctx.globalAlpha = 1;
  }
}

function drawEmoji(ctx: CanvasRenderingContext2D, emoji: string, size: number) {
  ctx.font = `${EMOJI_FONT_SIZE * DPR}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, (size * 0.5) * DPR, (size * 0.35) * DPR);
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  style: MemeStyle,
  caption: string,
  size: number,
): number {
  const config = getStyleConfig(style);
  const maxLineWidth = size * 0.8 * DPR;

  ctx.font = `${config.fontWeight} ${config.fontSize * DPR}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Clean caption: replace newlines with spaces
  const cleanCaption = caption.replace(/\n/g, ' ');
  const lines = wrapText(ctx, cleanCaption, maxLineWidth);
  const lineHeight = config.fontSize * 1.4 * DPR;
  const totalHeight = lines.length * lineHeight;
  const startY = (size * 0.68) * DPR - totalHeight / 2 + lineHeight / 2;

  if (style === 'savage') {
    // White stroke outline for savage style
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3 * DPR;
    ctx.lineJoin = 'round';
    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      ctx.strokeText(line, (size * 0.5) * DPR, y);
    });
  }

  ctx.fillStyle = config.textColor;
  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.fillText(line, (size * 0.5) * DPR, y);
  });

  return lines.length;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  style: MemeStyle,
  size: number,
) {
  const config = getStyleConfig(style);
  const label = config.name;
  const paddingX = 16 * DPR;
  const paddingY = 6 * DPR;
  const labelY = (size * 0.9) * DPR;

  ctx.font = `500 ${LABEL_FONT_SIZE * DPR}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = LABEL_FONT_SIZE * DPR + paddingY * 2;
  const boxX = (size * DPR - boxWidth) / 2;
  const boxY = labelY - boxHeight / 2;
  const radius = boxHeight / 2;

  // Rounded rect background
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = config.accentColor;
  ctx.beginPath();
  ctx.moveTo(boxX + radius, boxY);
  ctx.lineTo(boxX + boxWidth - radius, boxY);
  ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
  ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
  ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
  ctx.lineTo(boxX + radius, boxY + boxHeight);
  ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
  ctx.lineTo(boxX, boxY + radius);
  ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Label text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, (size * 0.5) * DPR, labelY);
}

export function renderMemeToCanvas(
  text: string,
  style: MemeStyle,
  caption: string,
  emoji: string,
): MemeItem {
  const config = getStyleConfig(style);

  const canvas = document.createElement('canvas');
  const displaySize = CANVAS_SIZE;
  const actualSize = displaySize * DPR;

  canvas.width = actualSize;
  canvas.height = actualSize;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Scale context for DPR
  // All drawing functions already account for DPR, so no additional scale needed
  drawBackground(ctx, style, displaySize);
  drawEmoji(ctx, emoji, displaySize);
  drawCaption(ctx, style, caption, displaySize);
  drawLabel(ctx, style, displaySize);

  const dataUrl = canvas.toDataURL('image/png');

  return {
    id: `meme-${style}-${Date.now()}`,
    style,
    originalText: text,
    caption,
    emoji,
    dataUrl,
    createdAt: Date.now(),
  };
}

export function downloadMeme(item: MemeItem): void {
  const a = document.createElement('a');
  a.href = item.dataUrl;
  a.download = `meme-${item.style}-${item.createdAt}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
