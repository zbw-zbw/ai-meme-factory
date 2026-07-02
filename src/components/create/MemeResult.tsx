"use client";

import type { MemeItem } from "@/types/meme";
import { styleConfigs } from "@/lib/meme-styles";
import { downloadMeme } from "@/lib/meme-renderer";
import { DownloadIcon } from "@/components/Icons";
import MemeCanvas from "./MemeCanvas";

interface MemeResultProps {
  item: MemeItem;
  index: number;
}

export default function MemeResult({ item, index }: MemeResultProps) {
  const config = styleConfigs[item.style];

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animation: `bounce-in 0.6s ease-out ${index * 0.15}s both` }}
    >
      {/* Image preview */}
      <MemeCanvas item={item} />

      {/* Bottom action bar */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span
          className="rounded-full px-2.5 py-1 text-[0.7rem] font-medium text-white"
          style={{ backgroundColor: config.accentColor }}
        >
          {config.name}
        </span>
        <button
          onClick={() => downloadMeme(item)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
        >
          <DownloadIcon className="h-4 w-4" />
          下载
        </button>
      </div>
    </div>
  );
}
