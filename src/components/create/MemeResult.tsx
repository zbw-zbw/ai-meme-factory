"use client";

import { useState, useEffect } from "react";
import type { MemeItem, MemeStyle } from "@/types/meme";
import { styleConfigs } from "@/lib/meme-styles";
import { downloadMeme, renderMemeToCanvas } from "@/lib/meme-renderer";
import { useToast } from "@/components/Toast";
import { DownloadIcon, CopyIcon, RefreshIcon, ShareIcon, CloseIcon } from "@/components/Icons";
import MemeCanvas from "./MemeCanvas";

// Inline edit icon (no EditIcon in Icons.tsx)
function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

interface MemeResultProps {
  item: MemeItem;
  index: number;
  onRegenerate?: (style: MemeStyle) => void;
  isRegenerating?: boolean;
  onEdit?: (item: MemeItem) => void;
}

export default function MemeResult({ item, index, onRegenerate, isRegenerating, onEdit }: MemeResultProps) {
  const config = styleConfigs[item.style];
  const { showToast } = useToast();
  const [showLightbox, setShowLightbox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.caption);
  const [prevCaption, setPrevCaption] = useState(item.caption);

  // Keep edit text in sync when the underlying caption changes (e.g. after regenerate).
  // Uses render-time state adjustment (React-recommended) instead of an effect to avoid cascading renders.
  if (item.caption !== prevCaption) {
    setPrevCaption(item.caption);
    setEditText(item.caption);
  }

  // Close lightbox on ESC key
  useEffect(() => {
    if (!showLightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLightbox(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showLightbox]);

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

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      showToast("文案不能为空", "error");
      return;
    }
    try {
      // Re-render with new caption, keeping same style and icon
      const newItem = await renderMemeToCanvas(item.originalText, item.style, editText.trim(), item.icon);
      // Update the displayed image via parent callback
      onEdit?.(newItem);
      setIsEditing(false);
      showToast("文案已更新", "success");
    } catch {
      showToast("渲染失败", "error");
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animation: `bounce-in 0.6s ease-out ${index * 0.15}s both` }}
    >
      {/* Image preview - click to enlarge */}
      <button
        onClick={() => setShowLightbox(true)}
        className="block w-full cursor-pointer border-none bg-transparent p-0"
        aria-label="点击放大预览"
      >
        <MemeCanvas item={item} />
      </button>

      {/* Regenerating spinner overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Edit caption mode */}
      {isEditing && (
        <div className="p-3" style={{ animation: "fade-in 0.2s ease-out" }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full resize-none rounded-xl border-2 border-border-light bg-bg p-3 text-[0.9rem] text-text-dark focus:border-primary focus:outline-none"
            rows={2}
            maxLength={50}
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => { setIsEditing(false); setEditText(item.caption); }}
              className="rounded-lg px-3 py-1.5 text-[0.8rem] text-text-muted hover:text-text-dark cursor-pointer border-none bg-transparent"
            >
              取消
            </button>
            <button
              onClick={handleSaveEdit}
              className="rounded-lg bg-primary px-4 py-1.5 text-[0.8rem] font-medium text-white cursor-pointer border-none"
            >
              保存
            </button>
          </div>
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
              aria-label="重新生成"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1 rounded-lg bg-card-hover px-2 py-1 text-[0.7rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
              aria-label="编辑文案"
              title="编辑文案"
            >
              <EditIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
            title="分享"
            aria-label="分享表情包"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer"
            title="复制"
            aria-label="复制表情包"
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

      {/* Lightbox - click image to enlarge */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
          onClick={() => setShowLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.dataUrl}
              alt={item.caption}
              className="max-h-[85vh] max-w-[85vw] rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-dark shadow-md hover:bg-white cursor-pointer border-none"
              aria-label="关闭"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-black/50 px-4 py-3 backdrop-blur-sm">
              <p className="truncate text-[0.9rem] text-white">{item.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
