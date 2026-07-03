import type { MemeStyle, MemeItem, IconName } from '@/types/meme';
import { getStyleConfig } from './meme-styles';

const CANVAS_SIZE = 480;
const ICON_SIZE = 96;
const LABEL_FONT_SIZE = 14;
const DPR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

// ===== SVG path data for each icon =====
const iconPaths: Record<IconName, string> = {
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  fire: 'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.35 4 10.04 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z',
  fish: 'M2 12c2-4 5-6 9-6 4 0 7 2 9 6-2 4-5 6-9 6-4 0-7-2-9-6zm9-3a3 3 0 100 6 3 3 0 000-6zm10 3l3-3v6l-3-3z',
  briefcase: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
};

function drawIcon(ctx: CanvasRenderingContext2D, icon: IconName, cx: number, cy: number, size: number, color: string) {
  const pathData = iconPaths[icon];
  const path = new Path2D(pathData);
  ctx.save();
  const scale = (size * DPR) / 24;
  ctx.translate(cx * DPR, cy * DPR);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(path);
  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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
  const stopColors: string[] = [];
  const regex = /#[0-9A-Fa-f]{6}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(config.bgGradient)) !== null) {
    stopColors.push(match[0]);
  }

  const gradient = ctx.createLinearGradient(0, 0, size * DPR, size * DPR);
  stopColors.forEach((color, i) => {
    gradient.addColorStop(i / Math.max(stopColors.length - 1, 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size * DPR, size * DPR);

  // Style-specific decorative patterns
  if (style === 'cute') {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = config.accentColor;
    const positions = [
      { x: 0.12, y: 0.1, s: 28 }, { x: 0.85, y: 0.15, s: 22 },
      { x: 0.92, y: 0.8, s: 30 }, { x: 0.08, y: 0.82, s: 24 },
      { x: 0.5, y: 0.05, s: 20 }, { x: 0.3, y: 0.92, s: 26 },
    ];
    for (const p of positions) {
      drawIcon(ctx, 'heart', p.x * size, p.y * size, p.s, config.accentColor);
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 3 * DPR;
    const r = 20 * DPR;
    ctx.beginPath();
    ctx.roundRect(8 * DPR, 8 * DPR, size * DPR - 16 * DPR, size * DPR - 16 * DPR, r);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else if (style === 'savage') {
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * DPR;
    for (let i = -size; i < size * 2; i += 24) {
      ctx.beginPath();
      ctx.moveTo((i + 0) * DPR, 0);
      ctx.lineTo((i + size) * DPR, size * DPR);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(0, 0, size * DPR, 6 * DPR);
    ctx.fillRect(0, (size - 6) * DPR, size * DPR, 6 * DPR);
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 3 * DPR;
    const bLen = 40 * DPR;
    const inset = 20 * DPR;
    ctx.beginPath(); ctx.moveTo(inset, inset + bLen); ctx.lineTo(inset, inset); ctx.lineTo(inset + bLen, inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * DPR - inset - bLen, inset); ctx.lineTo(size * DPR - inset, inset); ctx.lineTo(size * DPR - inset, inset + bLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(inset, size * DPR - inset - bLen); ctx.lineTo(inset, size * DPR - inset); ctx.lineTo(inset + bLen, size * DPR - inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * DPR - inset - bLen, size * DPR - inset); ctx.lineTo(size * DPR - inset, size * DPR - inset); ctx.lineTo(size * DPR - inset, size * DPR - inset - bLen); ctx.stroke();
    ctx.globalAlpha = 1;
  } else if (style === 'chill') {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = config.accentColor;
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      const waveY = (size * (0.75 + layer * 0.08)) * DPR;
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= size * DPR; x += DPR) {
        const waveHeight = Math.sin((x / DPR / size) * Math.PI * 3 + layer) * (10 + layer * 4) * DPR;
        ctx.lineTo(x, waveY + waveHeight);
      }
      ctx.lineTo(size * DPR, size * DPR);
      ctx.lineTo(0, size * DPR);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = config.accentColor;
    for (let i = 0; i < 8; i++) {
      const x = (0.1 + (i % 4) * 0.25) * size;
      const y = (0.08 + Math.floor(i / 4) * 0.08) * size;
      ctx.beginPath();
      ctx.arc(x * DPR, y * DPR, 4 * DPR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (style === 'formal') {
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 1 * DPR;
    const gridStep = 30 * DPR;
    for (let x = 0; x <= size * DPR; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size * DPR); ctx.stroke();
    }
    for (let y = 0; y <= size * DPR; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size * DPR, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 2 * DPR;
    ctx.strokeRect(12 * DPR, 12 * DPR, (size - 24) * DPR, (size - 24) * DPR);
    ctx.lineWidth = 1 * DPR;
    ctx.strokeRect(18 * DPR, 18 * DPR, (size - 36) * DPR, (size - 36) * DPR);
    ctx.globalAlpha = 1;
  }
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  style: MemeStyle,
  caption: string,
  size: number,
  textY?: number, // Override for AI image mode
): number {
  const config = getStyleConfig(style);
  const maxLineWidth = size * 0.82 * DPR;

  ctx.font = `${config.fontWeight} ${config.fontSize * DPR}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cleanCaption = caption.replace(/\n/g, ' ');
  const lines = wrapText(ctx, cleanCaption, maxLineWidth);
  const lineHeight = config.fontSize * 1.4 * DPR;
  const totalHeight = lines.length * lineHeight;
  const baseY = (textY !== undefined ? textY : size * 0.7) * DPR;
  const startY = baseY - totalHeight / 2 + lineHeight / 2;

  if (style === 'savage') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4 * DPR;
    ctx.lineJoin = 'round';
    lines.forEach((line, i) => {
      ctx.strokeText(line, (size * 0.5) * DPR, startY + i * lineHeight);
    });
  } else if (style === 'cute') {
    ctx.save();
    ctx.shadowColor = 'rgba(190, 18, 60, 0.15)';
    ctx.shadowBlur = 4 * DPR;
    ctx.shadowOffsetY = 2 * DPR;
    ctx.fillStyle = config.textColor;
    lines.forEach((line, i) => {
      ctx.fillText(line, (size * 0.5) * DPR, startY + i * lineHeight);
    });
    ctx.restore();
    return lines.length;
  }

  ctx.fillStyle = config.textColor;
  lines.forEach((line, i) => {
    ctx.fillText(line, (size * 0.5) * DPR, startY + i * lineHeight);
  });

  return lines.length;
}

function drawLabel(ctx: CanvasRenderingContext2D, style: MemeStyle, size: number) {
  const config = getStyleConfig(style);
  const label = config.name;
  const paddingX = 18 * DPR;
  const paddingY = 7 * DPR;
  const labelY = (size * 0.92) * DPR;

  ctx.font = `600 ${LABEL_FONT_SIZE * DPR}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = LABEL_FONT_SIZE * DPR + paddingY * 2;
  const boxX = (size * DPR - boxWidth) / 2;
  const boxY = labelY - boxHeight / 2;
  const radius = boxHeight / 2;

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = config.accentColor;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, radius);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, (size * 0.5) * DPR, labelY);
}

function drawBrandWatermark(ctx: CanvasRenderingContext2D, style: MemeStyle, size: number) {
  const config = getStyleConfig(style);
  ctx.font = `400 ${10 * DPR}px "Noto Sans SC", sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.globalAlpha = style === 'savage' ? 0.3 : 0.2;
  ctx.fillStyle = style === 'savage' ? '#FFFFFF' : config.accentColor;
  ctx.fillText('AI表情包工厂', (size - 16) * DPR, (size - 14) * DPR);
  ctx.globalAlpha = 1;
}

/**
 * Render meme using Canvas-only mode (vector icons + patterns).
 */
function renderCanvasOnly(
  text: string,
  style: MemeStyle,
  caption: string,
  icon: IconName,
): MemeItem {
  const config = getStyleConfig(style);
  const canvas = document.createElement('canvas');
  const displaySize = CANVAS_SIZE;
  canvas.width = displaySize * DPR;
  canvas.height = displaySize * DPR;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  drawBackground(ctx, style, displaySize);

  // Icon badge
  const iconCx = displaySize * 0.5;
  const iconCy = displaySize * 0.35;
  const badgeRadius = ICON_SIZE * 0.75;
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = config.accentColor;
  ctx.beginPath();
  ctx.arc(iconCx * DPR, iconCy * DPR, badgeRadius * DPR, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  drawIcon(ctx, icon, iconCx, iconCy, ICON_SIZE, config.accentColor);
  drawCaption(ctx, style, caption, displaySize);
  drawLabel(ctx, style, displaySize);
  drawBrandWatermark(ctx, style, displaySize);

  return {
    id: `meme-${style}-${Date.now()}`,
    style,
    originalText: text,
    caption,
    icon,
    dataUrl: canvas.toDataURL('image/png'),
    createdAt: Date.now(),
  };
}

/**
 * Render meme using AI-generated image as background + text overlay.
 * Falls back to Canvas-only if image fails to load.
 */
function renderWithAIImage(
  text: string,
  style: MemeStyle,
  caption: string,
  icon: IconName,
  imageUrl: string,
): Promise<MemeItem> {
  return new Promise((resolve) => {
    const config = getStyleConfig(style);
    const canvas = document.createElement('canvas');
    const displaySize = CANVAS_SIZE;
    canvas.width = displaySize * DPR;
    canvas.height = displaySize * DPR;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Fallback to canvas-only
      resolve(renderCanvasOnly(text, style, caption, icon));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw AI image as full background (cover mode)
      const imgRatio = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > 1) {
        sh = img.width;
        sy = (img.height - sh) / 2;
      } else {
        sw = img.height;
        sx = (img.width - sw) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displaySize * DPR, displaySize * DPR);

      // Semi-transparent overlay for text readability
      ctx.fillStyle = style === 'savage'
        ? 'rgba(15, 23, 42, 0.45)'
        : style === 'cute'
          ? 'rgba(255, 241, 242, 0.35)'
          : style === 'chill'
            ? 'rgba(236, 254, 255, 0.35)'
            : 'rgba(248, 250, 252, 0.4)';
      ctx.fillRect(0, 0, displaySize * DPR, displaySize * DPR);

      // Style-specific border accent
      if (style === 'savage') {
        ctx.fillStyle = config.accentColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, displaySize * DPR, 5 * DPR);
        ctx.fillRect(0, (displaySize - 5) * DPR, displaySize * DPR, 5 * DPR);
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = config.accentColor;
        ctx.lineWidth = 3 * DPR;
        const r = 16 * DPR;
        ctx.beginPath();
        ctx.roundRect(6 * DPR, 6 * DPR, displaySize * DPR - 12 * DPR, displaySize * DPR - 12 * DPR, r);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw caption at bottom area (text overlay on image)
      // Add dark shadow for readability on image background
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6 * DPR;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * DPR;

      // Force white text on AI images for contrast
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${config.fontWeight} ${config.fontSize * DPR}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxLineWidth = displaySize * 0.82 * DPR;
      const cleanCaption = caption.replace(/\n/g, ' ');
      const lines = wrapText(ctx, cleanCaption, maxLineWidth);
      const lineHeight = config.fontSize * 1.5 * DPR;
      const totalHeight = lines.length * lineHeight;
      const startY = (displaySize * 0.72) * DPR - totalHeight / 2 + lineHeight / 2;

      // Black stroke for all text on image
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 3 * DPR;
      ctx.lineJoin = 'round';
      lines.forEach((line, i) => {
        const y = startY + i * lineHeight;
        ctx.strokeText(line, (displaySize * 0.5) * DPR, y);
      });

      ctx.restore();

      // Draw label
      drawLabel(ctx, style, displaySize);

      // Watermark
      drawBrandWatermark(ctx, style, displaySize);

      resolve({
        id: `meme-${style}-${Date.now()}`,
        style,
        originalText: text,
        caption,
        icon,
        dataUrl: canvas.toDataURL('image/png'),
        createdAt: Date.now(),
      });
    };

    img.onerror = () => {
      // Fallback to canvas-only rendering
      resolve(renderCanvasOnly(text, style, caption, icon));
    };

    img.src = imageUrl;
  });
}

/**
 * Main render entry point.
 * If imageUrl is provided (AI-generated), renders with image background + text overlay.
 * Otherwise, falls back to Canvas-only rendering (vector icons + patterns).
 */
export function renderMemeToCanvas(
  text: string,
  style: MemeStyle,
  caption: string,
  icon: IconName,
  imageUrl?: string,
): MemeItem | Promise<MemeItem> {
  if (imageUrl) {
    return renderWithAIImage(text, style, caption, icon, imageUrl);
  }
  return renderCanvasOnly(text, style, caption, icon);
}

export function downloadMeme(item: MemeItem): void {
  const a = document.createElement('a');
  a.href = item.dataUrl;
  a.download = `meme-${item.style}-${item.createdAt}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ===== Gallery Storage (localStorage) =====
const GALLERY_KEY = 'ai-meme-factory-gallery';

export function saveToGallery(item: MemeItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getGalleryItems();
    const newItem = { ...item };
    const updated = [newItem, ...existing].slice(0, 30);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be full, try removing old items
    try {
      const existing = getGalleryItems().slice(0, 10);
      localStorage.setItem(GALLERY_KEY, JSON.stringify([item, ...existing]));
    } catch {
      // Give up silently
    }
  }
}

export function getGalleryItems(): MemeItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    if (!data) return [];
    return JSON.parse(data) as MemeItem[];
  } catch {
    return [];
  }
}

export function deleteGalleryItem(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const items = getGalleryItems().filter((item) => item.id !== id);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function clearGallery(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GALLERY_KEY);
}
