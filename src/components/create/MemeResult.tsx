"use client";

import type { MemeItem, MemeStyle } from "@/types/meme";
import { styleConfigs } from "@/lib/meme-styles";
import { downloadMeme } from "@/lib/meme-renderer";
import { DownloadIcon, CopyIcon, RefreshIcon } from "@/components/Icons";
import MemeCanvas from "./MemeCanvas";

interface MemeResultProps {
  item: MemeItem;
  index: number;
  onRegenerate?: (style: MemeStyle) => void;
}

export default function MemeResult({ item, index, onRegenerate }: MemeResultProps) {
  const config = styleConfigs[item.style];

  const handleCopy = async () => {
    try {
      const response = await fetch(item.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    } catch {
      // silently fail
    }
  };

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animation: `bounce-in 0.6s ease-out ${index * 0.15}s both` }}
    >
      {/* Image preview */}
      <MemeCanvas item={item} />

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
              className="inline-flex items-center gap-1 rounded-lg bg-card-hover px-2 py-1 text-[0.7rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
              title="重新生成"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
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
