"use client";

import type { GenerateStatus } from "@/types/meme";
import type { ProgressPhase } from "@/types/create";
import { SparklesIcon, RefreshIcon } from "@/components/Icons";

interface GenerateButtonProps {
  status: GenerateStatus;
  progressPhase: ProgressPhase;
  canGenerate: boolean;
  onClick: () => void;
  onCancel?: () => void;
}

const phaseLabels: Record<ProgressPhase, string> = {
  idle: "生成表情包",
  caption: "AI 正在构思文案...",
  image: "AI 正在绘制插图...",
  render: "正在合成表情包...",
  done: "再来一组",
  error: "重试",
};

export default function GenerateButton({ status, progressPhase, canGenerate, onClick, onCancel }: GenerateButtonProps) {
  const isDisabled = !canGenerate || status === "generating";

  const getIcon = () => {
    if (status === "generating") return null;
    if (status === "idle") return <SparklesIcon className="h-5 w-5" />;
    return <RefreshIcon className="h-5 w-5" />;
  };

  return (
    <div className="mt-6 flex w-full items-stretch gap-2">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`btn-primary flex-1 rounded-xl px-6 py-3.5 text-[1rem] no-underline transition-all duration-200 ${
          isDisabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          {status === "generating" && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          {getIcon()}
          {phaseLabels[progressPhase]}
        </span>
      </button>
      {status === "generating" && onCancel && (
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-card px-4 py-3 text-[0.95rem] font-medium text-text-muted transition-colors hover:border-red-400 hover:text-red-500 cursor-pointer"
        >
          取消
        </button>
      )}
    </div>
  );
}
