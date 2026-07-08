import type { MemeStyle, MemeItem, IconName } from '@/types/meme';
import { getStyleConfig } from './meme-styles';

const CANVAS_SIZE = 480;
const ICON_SIZE = 96;
const LABEL_FONT_SIZE = 14;

function getDPR(): number {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
}

function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('toBlob failed')); return; }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsDataURL(blob);
      },
      type,
      quality
    );
  });
}

const gradientCache = new Map<string, string[]>();
function parseGradientColors(gradient: string): string[] {
  const cached = gradientCache.get(gradient);
  if (cached) return cached;
  const matches = gradient.match(/#[0-9A-Fa-f]{6}/g) || [];
  gradientCache.set(gradient, matches);
  return matches;
}

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
  const scale = (size * getDPR()) / 24;
  ctx.translate(cx * getDPR(), cy * getDPR());
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(path);
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  const outerR = (size * getDPR()) / 2;
  const innerR = outerR * 0.4;
  ctx.translate(cx * getDPR(), cy * getDPR());
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
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
  const stopColors = parseGradientColors(config.bgGradient);

  const gradient = ctx.createLinearGradient(0, 0, size * getDPR(), size * getDPR());
  stopColors.forEach((color, i) => {
    gradient.addColorStop(i / Math.max(stopColors.length - 1, 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size * getDPR(), size * getDPR());

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
    // Add sparkle/star decorations
    ctx.globalAlpha = 0.06;
    const starPositions = [
      { x: 0.25, y: 0.22, s: 16 }, { x: 0.75, y: 0.18, s: 14 },
      { x: 0.88, y: 0.55, s: 18 }, { x: 0.15, y: 0.65, s: 12 },
    ];
    for (const p of starPositions) {
      drawStar(ctx, p.x * size, p.y * size, p.s, config.accentColor);
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 3 * getDPR();
    const r = 20 * getDPR();
    ctx.beginPath();
    ctx.roundRect(8 * getDPR(), 8 * getDPR(), size * getDPR() - 16 * getDPR(), size * getDPR() - 16 * getDPR(), r);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else if (style === 'savage') {
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * getDPR();
    for (let i = -size; i < size * 2; i += 24) {
      ctx.beginPath();
      ctx.moveTo((i + 0) * getDPR(), 0);
      ctx.lineTo((i + size) * getDPR(), size * getDPR());
      ctx.stroke();
    }
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = config.accentColor;
    ctx.fillRect(0, 0, size * getDPR(), 6 * getDPR());
    ctx.fillRect(0, (size - 6) * getDPR(), size * getDPR(), 6 * getDPR());
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 3 * getDPR();
    const bLen = 40 * getDPR();
    const inset = 20 * getDPR();
    ctx.beginPath(); ctx.moveTo(inset, inset + bLen); ctx.lineTo(inset, inset); ctx.lineTo(inset + bLen, inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * getDPR() - inset - bLen, inset); ctx.lineTo(size * getDPR() - inset, inset); ctx.lineTo(size * getDPR() - inset, inset + bLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(inset, size * getDPR() - inset - bLen); ctx.lineTo(inset, size * getDPR() - inset); ctx.lineTo(inset + bLen, size * getDPR() - inset); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(size * getDPR() - inset - bLen, size * getDPR() - inset); ctx.lineTo(size * getDPR() - inset, size * getDPR() - inset); ctx.lineTo(size * getDPR() - inset, size * getDPR() - inset - bLen); ctx.stroke();
    ctx.globalAlpha = 1;
    // Add lightning bolt accents
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 2 * getDPR();
    for (let i = 0; i < 3; i++) {
      const sx = (0.15 + i * 0.35) * size * getDPR();
      const sy = (0.3 + i * 0.15) * size * getDPR();
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 8 * getDPR(), sy + 12 * getDPR());
      ctx.lineTo(sx + 4 * getDPR(), sy + 12 * getDPR());
      ctx.lineTo(sx - 4 * getDPR(), sy + 20 * getDPR());
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (style === 'chill') {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = config.accentColor;
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      const waveY = (size * (0.75 + layer * 0.08)) * getDPR();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= size * getDPR(); x += getDPR()) {
        const waveHeight = Math.sin((x / getDPR() / size) * Math.PI * 3 + layer) * (10 + layer * 4) * getDPR();
        ctx.lineTo(x, waveY + waveHeight);
      }
      ctx.lineTo(size * getDPR(), size * getDPR());
      ctx.lineTo(0, size * getDPR());
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
      ctx.arc(x * getDPR(), y * getDPR(), 4 * getDPR(), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Add fish silhouettes
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 3; i++) {
      const fx = (0.2 + i * 0.3) * size;
      const fy = (0.4 + (i % 2) * 0.15) * size;
      drawIcon(ctx, 'fish', fx, fy, 20, config.accentColor);
    }
    ctx.globalAlpha = 1;
  } else if (style === 'formal') {
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 1 * getDPR();
    const gridStep = 30 * getDPR();
    for (let x = 0; x <= size * getDPR(); x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size * getDPR()); ctx.stroke();
    }
    for (let y = 0; y <= size * getDPR(); y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size * getDPR(), y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 2 * getDPR();
    ctx.strokeRect(12 * getDPR(), 12 * getDPR(), (size - 24) * getDPR(), (size - 24) * getDPR());
    ctx.lineWidth = 1 * getDPR();
    ctx.strokeRect(18 * getDPR(), 18 * getDPR(), (size - 36) * getDPR(), (size - 36) * getDPR());
    ctx.globalAlpha = 1;
    // Subtle diagonal "MEME" watermark
    ctx.globalAlpha = 0.03;
    ctx.save();
    ctx.font = `900 ${80 * getDPR()}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = config.accentColor;
    ctx.translate(size * getDPR() * 0.5, size * getDPR() * 0.5);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MEME', 0, 0);
    ctx.restore();
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
  const maxLineWidth = size * 0.82 * getDPR();

  ctx.font = `${config.fontWeight} ${config.fontSize * getDPR()}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cleanCaption = caption.replace(/\n/g, ' ');
  const lines = wrapText(ctx, cleanCaption, maxLineWidth);
  const lineHeight = config.fontSize * 1.4 * getDPR();
  const totalHeight = lines.length * lineHeight;
  const baseY = (textY !== undefined ? textY : size * 0.7) * getDPR();
  const startY = baseY - totalHeight / 2 + lineHeight / 2;

  if (style === 'savage') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4 * getDPR();
    ctx.lineJoin = 'round';
    lines.forEach((line, i) => {
      ctx.strokeText(line, (size * 0.5) * getDPR(), startY + i * lineHeight);
    });
  } else if (style === 'cute') {
    ctx.save();
    ctx.shadowColor = 'rgba(190, 18, 60, 0.15)';
    ctx.shadowBlur = 4 * getDPR();
    ctx.shadowOffsetY = 2 * getDPR();
    ctx.fillStyle = config.textColor;
    lines.forEach((line, i) => {
      ctx.fillText(line, (size * 0.5) * getDPR(), startY + i * lineHeight);
    });
    ctx.restore();
    return lines.length;
  }

  ctx.fillStyle = config.textColor;
  lines.forEach((line, i) => {
    ctx.fillText(line, (size * 0.5) * getDPR(), startY + i * lineHeight);
  });

  return lines.length;
}

function drawLabel(ctx: CanvasRenderingContext2D, style: MemeStyle, size: number) {
  const config = getStyleConfig(style);
  const label = config.name;
  const paddingX = 18 * getDPR();
  const paddingY = 7 * getDPR();
  const labelY = (size * 0.92) * getDPR();

  ctx.font = `600 ${LABEL_FONT_SIZE * getDPR()}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = LABEL_FONT_SIZE * getDPR() + paddingY * 2;
  const boxX = (size * getDPR() - boxWidth) / 2;
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
  ctx.fillText(label, (size * 0.5) * getDPR(), labelY);
}

function drawBrandWatermark(ctx: CanvasRenderingContext2D, style: MemeStyle, size: number) {
  const config = getStyleConfig(style);
  ctx.font = `400 ${10 * getDPR()}px "Noto Sans SC", sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.globalAlpha = style === 'savage' ? 0.3 : 0.2;
  ctx.fillStyle = style === 'savage' ? '#FFFFFF' : config.accentColor;
  ctx.fillText('AI表情包工厂', (size - 16) * getDPR(), (size - 14) * getDPR());
  ctx.globalAlpha = 1;
}

/**
 * Render meme using Canvas-only mode (vector icons + patterns).
 */
async function renderCanvasOnly(
  text: string,
  style: MemeStyle,
  caption: string,
  icon: IconName,
): Promise<MemeItem> {
  // Wait for fonts to be ready before rendering text
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }

  const config = getStyleConfig(style);
  const canvas = document.createElement('canvas');
  const displaySize = CANVAS_SIZE;
  canvas.width = displaySize * getDPR();
  canvas.height = displaySize * getDPR();

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Rounded corner clipping
  const cornerRadius = 24 * getDPR();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, displaySize * getDPR(), displaySize * getDPR(), cornerRadius);
  ctx.clip();

  drawBackground(ctx, style, displaySize);

  // Icon badge
  const iconCx = displaySize * 0.5;
  const iconCy = displaySize * 0.35;
  const badgeRadius = ICON_SIZE * 0.75;
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = config.accentColor;
  ctx.beginPath();
  ctx.arc(iconCx * getDPR(), iconCy * getDPR(), badgeRadius * getDPR(), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  drawIcon(ctx, icon, iconCx, iconCy, ICON_SIZE, config.accentColor);
  drawCaption(ctx, style, caption, displaySize);
  drawLabel(ctx, style, displaySize);
  drawBrandWatermark(ctx, style, displaySize);

  ctx.restore();

  const dataUrl = await canvasToBlob(canvas, 'image/jpeg', 0.85);
  canvas.width = 0;
  canvas.height = 0;

  return {
    id: `meme-${style}-${Date.now()}`,
    style,
    originalText: text,
    caption,
    icon,
    dataUrl,
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
  return new Promise((resolve, reject) => {
    const config = getStyleConfig(style);
    const canvas = document.createElement('canvas');
    const displaySize = CANVAS_SIZE;
    canvas.width = displaySize * getDPR();
    canvas.height = displaySize * getDPR();

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Fallback to canvas-only
      resolve(renderCanvasOnly(text, style, caption, icon));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    const imgTimeout = setTimeout(() => reject(new Error('Image load timeout')), 30000);
    img.onload = async () => {
      clearTimeout(imgTimeout);
      // Rounded corner clipping
      const cornerRadius = 24 * getDPR();
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, displaySize * getDPR(), displaySize * getDPR(), cornerRadius);
      ctx.clip();

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
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displaySize * getDPR(), displaySize * getDPR());

      // Semi-transparent overlay for text readability
      ctx.fillStyle = style === 'savage'
        ? 'rgba(15, 23, 42, 0.45)'
        : style === 'cute'
          ? 'rgba(255, 241, 242, 0.35)'
          : style === 'chill'
            ? 'rgba(236, 254, 255, 0.35)'
            : 'rgba(248, 250, 252, 0.4)';
      ctx.fillRect(0, 0, displaySize * getDPR(), displaySize * getDPR());

      // Style-specific border accent
      if (style === 'savage') {
        ctx.fillStyle = config.accentColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, displaySize * getDPR(), 5 * getDPR());
        ctx.fillRect(0, (displaySize - 5) * getDPR(), displaySize * getDPR(), 5 * getDPR());
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = config.accentColor;
        ctx.lineWidth = 3 * getDPR();
        const r = 16 * getDPR();
        ctx.beginPath();
        ctx.roundRect(6 * getDPR(), 6 * getDPR(), displaySize * getDPR() - 12 * getDPR(), displaySize * getDPR() - 12 * getDPR(), r);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw caption at bottom area (text overlay on image)
      // Add dark shadow for readability on image background
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6 * getDPR();
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * getDPR();

      // Force white text on AI images for contrast
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${config.fontWeight} ${config.fontSize * getDPR()}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxLineWidth = displaySize * 0.82 * getDPR();
      const cleanCaption = caption.replace(/\n/g, ' ');
      const lines = wrapText(ctx, cleanCaption, maxLineWidth);
      const lineHeight = config.fontSize * 1.5 * getDPR();
      const totalHeight = lines.length * lineHeight;
      const startY = (displaySize * 0.72) * getDPR() - totalHeight / 2 + lineHeight / 2;

      // Black stroke for all text on image
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = 3 * getDPR();
      ctx.lineJoin = 'round';
      lines.forEach((line, i) => {
        const y = startY + i * lineHeight;
        ctx.strokeText(line, (displaySize * 0.5) * getDPR(), y);
      });

      ctx.restore();

      // Draw label
      drawLabel(ctx, style, displaySize);

      // Watermark
      drawBrandWatermark(ctx, style, displaySize);

      ctx.restore();

      const dataUrl = await canvasToBlob(canvas, 'image/jpeg', 0.85);
      canvas.width = 0;
      canvas.height = 0;

      resolve({
        id: `meme-${style}-${Date.now()}`,
        style,
        originalText: text,
        caption,
        icon,
        dataUrl,
        createdAt: Date.now(),
      });
    };

    img.onerror = () => {
      clearTimeout(imgTimeout);
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
 * Always returns a Promise<MemeItem>.
 */
export function renderMemeToCanvas(
  text: string,
  style: MemeStyle,
  caption: string,
  icon: IconName,
  imageUrl?: string,
): Promise<MemeItem> {
  if (imageUrl) {
    return renderWithAIImage(text, style, caption, icon, imageUrl);
  }
  return renderCanvasOnly(text, style, caption, icon);
}

export function downloadMeme(item: MemeItem, format: "jpeg" | "png" = "jpeg"): void {
  if (typeof document === "undefined") return;
  const link = document.createElement("a");
  const ext = format === "png" ? "png" : "jpg";

  // If PNG requested and we have a JPEG data URL, we need to re-render
  // The dataUrl is already JPEG, so for PNG we need to convert via canvas
  if (format === "png" && item.dataUrl.startsWith("data:image/jpeg")) {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        link.href = await canvasToBlob(canvas, "image/png", 1);
        canvas.width = 0;
        canvas.height = 0;
        link.download = `${item.caption.slice(0, 12)}-${item.style}.${ext}`;
        link.click();
      }
    };
    img.src = item.dataUrl;
    return;
  }

  link.href = item.dataUrl;
  link.download = `${item.caption.slice(0, 12)}-${item.style}.${ext}`;
  link.click();
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

export function saveBatchToGallery(
  items: MemeItem[],
  onOverflow?: (droppedCount: number) => void,
): void {
  if (typeof window === 'undefined' || items.length === 0) return;
  try {
    const existing = getGalleryItems();
    const newItems = items.map((item) => ({ ...item }));
    const allItems = [...newItems, ...existing];
    if (allItems.length > 30 && onOverflow) {
      onOverflow(allItems.length - 30);
    }
    const updated = allItems.slice(0, 30);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be full, try removing old items
    try {
      const existing = getGalleryItems().slice(0, 10);
      const newItems = items.map((item) => ({ ...item }));
      localStorage.setItem(GALLERY_KEY, JSON.stringify([...newItems, ...existing]));
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

// ===== Favorites Storage (localStorage) =====
const FAVORITES_KEY = 'ai-meme-factory-favorites';

export function getFavoriteIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleFavorite(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavoriteIds();
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    return favorites.has(id);
  } catch {
    return false;
  }
}

// ===== Recent Prompts Storage (localStorage) =====
const RECENT_KEY = 'ai-meme-factory-recent';

export function getRecentPrompts(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addRecentPrompt(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentPrompts().filter(p => p !== text);
    const updated = [text, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

/**
 * Pre-render example memes for showcase (e.g., Hero, Demo sections).
 * Returns an array of 4 MemeItems, one per style.
 */
let _cachedExamples: MemeItem[] | null = null;

export async function preRenderExamples(): Promise<MemeItem[]> {
  if (typeof document === 'undefined') return [];
  if (_cachedExamples) return _cachedExamples;

  const examples = [
    { text: '不想上班', style: 'cute' as MemeStyle, caption: '好想抱抱毛绒玩具', icon: 'heart' as IconName },
    { text: '不想上班', style: 'savage' as MemeStyle, caption: '上班是不可能上班的', icon: 'fire' as IconName },
    { text: '不想上班', style: 'chill' as MemeStyle, caption: '摸鱼一时爽 一直摸一直爽', icon: 'fish' as IconName },
    { text: '不想上班', style: 'formal' as MemeStyle, caption: '关于今日出勤的补充说明', icon: 'briefcase' as IconName },
  ];

  const result = await Promise.all(
    examples.map(ex => renderCanvasOnly(ex.text, ex.style, ex.caption, ex.icon))
  );
  _cachedExamples = result;
  return result;
}

let _cachedDemoExamples: MemeItem[] | null = null;

/**
 * Pre-render demo examples with different text than Hero examples.
 */
export async function preRenderDemoExamples(): Promise<MemeItem[]> {
  if (typeof document === 'undefined') return [];
  if (_cachedDemoExamples) return _cachedDemoExamples;

  const examples = [
    { text: '这个需求能不能别改了', style: 'cute' as MemeStyle, caption: '改需求不乖哦', icon: 'heart' as IconName },
    { text: '这个需求能不能别改了', style: 'savage' as MemeStyle, caption: '再改就辞职不干了', icon: 'fire' as IconName },
    { text: '这个需求能不能别改了', style: 'chill' as MemeStyle, caption: '改吧改吧 无所谓了', icon: 'fish' as IconName },
    { text: '这个需求能不能别改了', style: 'formal' as MemeStyle, caption: '关于需求变更的审批流程', icon: 'briefcase' as IconName },
  ];

  const result = await Promise.all(
    examples.map(ex => renderCanvasOnly(ex.text, ex.style, ex.caption, ex.icon))
  );
  _cachedDemoExamples = result;
  return result;
}
