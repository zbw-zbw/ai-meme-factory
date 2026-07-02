"use client";

import type { GenerateStatus } from "@/types/meme";
import { SparklesIcon, RefreshIcon } from "@/components/Icons";

interface GenerateButtonProps {
  status: GenerateStatus;
  canGenerate: boolean;
  onClick: () => void;
}

export default function GenerateButton({ status, canGenerate, onClick }: GenerateButtonProps) {
  const isDisabled = !canGenerate || status === "generating";

  const getLabel = () => {
    switch (status) {
      case "idle":
        return "生成表情包";
      case "generating":
        return "AI正在创作中...";
      case "done":
        return "再来一组";
      case "error":
        return "重试";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "idle":
        return <SparklesIcon className="h-5 w-5" />;
      case "done":
        return <RefreshIcon className="h-5 w-5" />;
      case "error":
        return <RefreshIcon className="h-5 w-5" />;
      default:
        return null;
    }
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
        {getLabel()}
      </span>
    </button>
  );
}
