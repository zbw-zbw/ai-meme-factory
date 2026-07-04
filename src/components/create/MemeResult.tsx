"use client";

import type { MemeItem, MemeStyle } from "@/types/meme";
import { styleConfigs } from "@/lib/meme-styles";
import { downloadMeme } from "@/lib/meme-renderer";
import { useToast } from "@/components/Toast";
import { DownloadIcon, CopyIcon, RefreshIcon, ShareIcon } from "@/components/Icons";
import MemeCanvas from "./MemeCanvas";

interface MemeResultProps {
  item: MemeItem;
  index: number;
  onRegenerate?: (style: MemeStyle) => void;
  isRegenerating?: boolean;
}

export default function MemeResult({ item, index, onRegenerate, isRegenerating }: MemeResultProps) {
  const config = styleConfigs[item.style];
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      const response = await fetch(item.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showToast("已复制到剪贴板");
    } catch {
      showToast("复制失败", "error");
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(item.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${item.style}-${item.caption.slice(0, 12)}.jpg`, { type: blob.type });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${config.name}表情包 - ${item.caption}`,
          text: item.caption,
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        showToast("已复制到剪贴板，可手动分享", "success");
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        showToast("分享失败", "error");
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animation: `bounce-in 0.6s ease-out ${index * 0.15}s both` }}
    >
      {/* Image preview */}
      <MemeCanvas item={item} />

      {/* Regenerating spinner overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      )}

      {/* Bottom action bar */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[0.7rem] font-medium text-white"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.name}
          </span>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(item.style)}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1 rounded-lg bg-card-hover px-2 py-1 text-[0.7rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="重新生成"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
            title="分享"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
            title="复制"
          >
            <CopyIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => downloadMeme(item)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            下载
          </button>
        </div>
      </div>
    </div>
  );
}
