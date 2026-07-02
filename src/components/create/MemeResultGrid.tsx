"use client";

import type { MemeItem, MemeStyle, GenerateStatus } from "@/types/meme";
import { styleConfigs } from "@/lib/meme-styles";
import MemeResult from "./MemeResult";
import {
  SparklesIcon,
  ImageIcon,
  AlertIcon,
  RefreshIcon,
  DownloadIcon,
  TrashIcon,
  StyleIcon,
} from "@/components/Icons";

interface MemeResultGridProps {
  results: MemeItem[];
  status: GenerateStatus;
  selectedStyles: MemeStyle[];
  errorMessage?: string;
  onDownloadAll: () => void;
  onClear: () => void;
  onRetry: () => void;
}

const skeletonBgMap: Record<MemeStyle, string> = {
  cute: "bg-cute-bg",
  savage: "bg-savage-bg",
  chill: "bg-chill-bg",
  formal: "bg-formal-bg",
};

const skeletonIconColor: Record<MemeStyle, string> = {
  cute: "#FB7185",
  savage: "#F43F5E",
  chill: "#06B6D4",
  formal: "#475569",
};

export default function MemeResultGrid({
  results,
  status,
  selectedStyles,
  errorMessage,
  onDownloadAll,
  onClear,
  onRetry,
}: MemeResultGridProps) {
  // Empty state
  if (status === "idle" && results.length === 0) {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
          <SparklesIcon className="h-6 w-6 text-primary-dark" />
          生成结果
        </h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-light py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card-hover">
            <ImageIcon className="h-8 w-8 text-text-light" />
          </div>
          <p className="mt-3 text-[0.95rem] text-text-muted">
            输入文字，点击生成，表情包马上就来
          </p>
        </div>
      </div>
    );
  }

  // Generating skeleton
  if (status === "generating") {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
          <SparklesIcon className="h-6 w-6 text-primary-dark" />
          生成结果
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {selectedStyles.map((style) => (
            <div
              key={style}
              className={`flex aspect-square items-center justify-center rounded-2xl ${skeletonBgMap[style]} animate-pulse`}
            >
              <StyleIcon
                name={styleConfigs[style].icon}
                className="h-12 w-12"
                style={{ color: skeletonIconColor[style], opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[0.9rem] text-text-muted">
          AI 正在为你创作表情包...
        </p>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
          <SparklesIcon className="h-6 w-6 text-primary-dark" />
          生成结果
        </h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl py-16"
          style={{ backgroundColor: "#FEF2F2" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <AlertIcon className="h-8 w-8 text-savage-accent" />
          </div>
          <p className="mt-3 text-[0.95rem] text-text-dark">
            {errorMessage || "生成失败，请重试"}
          </p>
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-[0.9rem] font-bold text-white transition-transform duration-200 hover:scale-105 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
          >
            <RefreshIcon className="h-4 w-4" />
            重试
          </button>
        </div>
      </div>
    );
  }

  // Done
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
        <SparklesIcon className="h-6 w-6 text-primary-dark" />
        生成结果
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {results.map((item, i) => (
          <MemeResult key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Bottom actions */}
      {results.length > 0 && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={onDownloadAll}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            全部下载
          </button>
          <button
            onClick={onClear}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md cursor-pointer"
          >
            <TrashIcon className="h-4 w-4" />
            清空重来
          </button>
        </div>
      )}
    </div>
  );
}
