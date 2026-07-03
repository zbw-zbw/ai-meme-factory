"use client";

import type { MemeItem, MemeStyle, GenerateStatus } from "@/types/meme";
import type { ProgressPhase } from "@/types/create";
import { styleConfigs } from "@/lib/meme-styles";
import MemeResult from "./MemeResult";
import {
  SparklesIcon,
  ImageIcon,
  AlertIcon,
  RefreshIcon,
  DownloadIcon,
  TrashIcon,
  CopyIcon,
  StyleIcon,
} from "@/components/Icons";

interface MemeResultGridProps {
  results: MemeItem[];
  status: GenerateStatus;
  progressPhase: ProgressPhase;
  selectedStyles: MemeStyle[];
  errorMessage?: string;
  onDownloadAll: () => void;
  onCopyAll: () => void;
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

const phaseDescriptions: Record<ProgressPhase, string> = {
  idle: "",
  caption: "AI 正在为你创作有趣文案...",
  image: "AI 正在绘制卡通插图...",
  render: "正在合成表情包图片...",
  done: "",
  error: "",
};

export default function MemeResultGrid({
  results,
  status,
  progressPhase,
  selectedStyles,
  errorMessage,
  onDownloadAll,
  onCopyAll,
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

  // Generating skeleton with phase progress
  if (status === "generating") {
    return (
      <div>
        <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
          <SparklesIcon className="h-6 w-6 text-primary-dark" />
          生成结果
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {selectedStyles.map((style, idx) => (
            <div
              key={style}
              className={`relative flex aspect-square items-center justify-center rounded-2xl ${skeletonBgMap[style]} overflow-hidden`}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`,
                  animationDuration: '1.5s',
                  animationDelay: `${idx * 0.3}s`,
                }}
              />

              {/* Icon */}
              <StyleIcon
                name={styleConfigs[style].icon}
                className="h-12 w-12"
                style={{ color: skeletonIconColor[style], opacity: 0.4 }}
              />
            </div>
          ))}
        </div>

        {/* Phase indicator */}
        {phaseDescriptions[progressPhase] && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                progressPhase === 'caption' ? 'scale-125 bg-primary' : 'bg-border'
              }`} />
              <span className={`text-[0.8rem] transition-colors duration-300 ${
                progressPhase === 'caption' ? 'font-medium text-text-dark' : 'text-text-light'
              }`}>文案</span>
            </div>
            <div className="h-px w-6 bg-border-light" />
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                progressPhase === 'image' ? 'scale-125 bg-primary' : 'bg-border'
              }`} />
              <span className={`text-[0.8rem] transition-colors duration-300 ${
                progressPhase === 'image' ? 'font-medium text-text-dark' : 'text-text-light'
              }`}>插图</span>
            </div>
            <div className="h-px w-6 bg-border-light" />
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                progressPhase === 'render' ? 'scale-125 bg-primary' : 'bg-border'
              }`} />
              <span className={`text-[0.8rem] transition-colors duration-300 ${
                progressPhase === 'render' ? 'font-medium text-text-dark' : 'text-text-light'
              }`}>合成</span>
            </div>
          </div>
        )}

        <p className="mt-3 text-center text-[0.85rem] text-text-muted">
          {phaseDescriptions[progressPhase]}
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
        <div className="mt-5 grid grid-cols-3 gap-3">
          <button
            onClick={onDownloadAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            下载
          </button>
          <button
            onClick={onCopyAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md cursor-pointer"
          >
            <CopyIcon className="h-4 w-4" />
            复制
          </button>
          <button
            onClick={onClear}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md cursor-pointer"
          >
            <TrashIcon className="h-4 w-4" />
            清空
          </button>
        </div>
      )}
    </div>
  );
}
