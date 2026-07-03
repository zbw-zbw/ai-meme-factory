"use client";

import type { GenerateStatus } from "@/types/meme";
import type { ProgressPhase } from "@/app/create/page";
import { SparklesIcon, RefreshIcon } from "@/components/Icons";

interface GenerateButtonProps {
  status: GenerateStatus;
  progressPhase: ProgressPhase;
  canGenerate: boolean;
  onClick: () => void;
}

const phaseLabels: Record<ProgressPhase, string> = {
  idle: "生成表情包",
  caption: "AI 正在构思文案...",
  image: "AI 正在绘制插图...",
  render: "正在合成表情包...",
  done: "再来一组",
  error: "重试",
};

export default function GenerateButton({ status, progressPhase, canGenerate, onClick }: GenerateButtonProps) {
  const isDisabled = !canGenerate || status === "generating";

  const getIcon = () => {
    if (status === "generating") return null;
    if (status === "idle") return <SparklesIcon className="h-5 w-5" />;
    return <RefreshIcon className="h-5 w-5" />;
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`mt-6 w-full rounded-xl px-6 py-3.5 text-[1rem] font-bold text-white transition-all duration-200 no-underline ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "animate-pulse-glow cursor-pointer hover:scale-[1.02]"
      }`}
      style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
    >
      <span className="inline-flex items-center gap-2">
        {status === "generating" && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {getIcon()}
        {phaseLabels[progressPhase]}
      </span>
    </button>
  );
}
