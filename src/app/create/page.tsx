"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import TextInput from "@/components/create/TextInput";
import StyleSelector from "@/components/create/StyleSelector";
import GenerateButton from "@/components/create/GenerateButton";
import MemeResultGrid from "@/components/create/MemeResultGrid";
import { useToast } from "@/components/Toast";
import { CloseIcon } from "@/components/Icons";
import { renderMemeToCanvas, downloadMeme, saveBatchToGallery, addRecentPrompt } from "@/lib/meme-renderer";
import { ALL_STYLES, styleConfigs } from "@/lib/meme-styles";
import type { MemeStyle, MemeItem, GenerateStatus, IconName } from "@/types/meme";
import type { ProgressPhase } from "@/types/create";

interface ApiResponse {
  success: boolean;
  data?: {
    memes: Array<{
      style: MemeStyle;
      caption: string;
      icon: IconName;
      imageUrl?: string;
    }>;
    demoMode?: boolean;
    aiImageMode?: boolean;
  };
  error?: string;
  code?: string;
}

function CreatePageContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [inputText, setInputText] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<MemeStyle[]>([...ALL_STYLES]);
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [progressPhase, setProgressPhase] = useState<ProgressPhase>("idle");
  const [results, setResults] = useState<MemeItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [regeneratingStyle, setRegeneratingStyle] = useState<MemeStyle | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  // Pre-fill from URL ?text= param
  useEffect(() => {
    const textParam = searchParams.get("text");
    if (textParam) {
      setInputText(decodeURIComponent(textParam));
    }
  }, [searchParams]);

  const canGenerate = inputText.trim().length > 0 && selectedStyles.length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || status === "generating") return;

    setStatus("generating");
    setProgressPhase("caption");
    setResults([]);
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim(), styles: selectedStyles }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success || !data.data) {
        setErrorMessage(data.error || "生成失败，请重试");
        setStatus("error");
        setProgressPhase("error");
        return;
      }

      if (data.data.demoMode) {
        setDemoMode(true);
      } else {
        setDemoMode(false);
      }

      // Phase 2: Render memes (may be async if AI images are involved)
      setProgressPhase(data.data.aiImageMode ? "render" : "image");
      const renderPromises = data.data.memes.map((meme) =>
        renderMemeToCanvas(inputText.trim(), meme.style, meme.caption, meme.icon, meme.imageUrl),
      );

      // Wait for all renders (some may be sync, some async with image loading)
      const newResults: MemeItem[] = await Promise.all(renderPromises);

      // Save all results to gallery (localStorage) in one batch write
      saveBatchToGallery(newResults);
      addRecentPrompt(inputText.trim());
      setGenerationCount(c => c + 1);

      setResults(newResults);
      setStatus("done");
      setProgressPhase("done");
    } catch {
      setErrorMessage("网络错误，请检查连接后重试");
      setStatus("error");
      setProgressPhase("error");
    }
  }, [canGenerate, status, inputText, selectedStyles]);

  // Ctrl+Enter / Cmd+Enter shortcut to trigger generation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (canGenerate && status !== "generating") {
          e.preventDefault();
          handleGenerate();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canGenerate, status, handleGenerate]);

  const handleDownloadAll = useCallback(() => {
    results.forEach((item, i) => {
      setTimeout(() => downloadMeme(item), i * 300);
    });
    showToast("已开始下载", "success");
  }, [results, showToast]);

  const handleCopyAll = useCallback(async () => {
    if (results.length === 0) return;
    try {
      const first = results[0];
      const response = await fetch(first.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      showToast("已复制第一张到剪贴板", "success");
    } catch {
      showToast("复制失败", "error");
    }
  }, [results, showToast]);

  const handleClear = useCallback(() => {
    setResults([]);
    setStatus("idle");
    setProgressPhase("idle");
    setErrorMessage("");
    showToast("已清空", "info");
  }, [showToast]);

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setProgressPhase("idle");
    setErrorMessage("");
    setTimeout(() => handleGenerate(), 100);
  }, [handleGenerate]);

  const handleRegenerateSingle = useCallback(async (style: MemeStyle) => {
    if (regeneratingStyle === style) return; // prevent double click
    setRegeneratingStyle(style);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim(), styles: [style] }),
      });
      const data = await response.json();
      if (data.success && data.data?.memes?.[0]) {
        const meme = data.data.memes[0];
        const newItem = await Promise.resolve(
          renderMemeToCanvas(inputText.trim(), meme.style, meme.caption, meme.icon, meme.imageUrl)
        );
        setResults(prev => prev.map(r => r.style === style ? (newItem as MemeItem) : r));
        showToast(`已重新生成${styleConfigs[style].name}`, "success");
      }
    } catch {
      showToast("重新生成失败", "error");
    } finally {
      setRegeneratingStyle(null);
    }
  }, [inputText, showToast, regeneratingStyle]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-20 pb-12">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <nav className="mb-6 flex items-center gap-2 text-[0.85rem]">
            <Link
              href="/"
              className="text-text-muted no-underline transition-colors hover:text-text-dark"
            >
              首页
            </Link>
            <span className="text-text-light">/</span>
            <span className="font-medium text-text-dark">生成表情包</span>
          </nav>

          {/* Two-column layout */}
          <div className="flex flex-col gap-8 md:flex-row md:gap-8 lg:gap-10">
            {/* Left column: input & controls */}
            <div className="md:w-[40%]">
              <TextInput value={inputText} onChange={setInputText} refreshTrigger={generationCount} />
              <StyleSelector selected={selectedStyles} onChange={setSelectedStyles} />
              <GenerateButton
                status={status}
                progressPhase={progressPhase}
                canGenerate={canGenerate}
                onClick={handleGenerate}
              />
            </div>

            {/* Right column: results */}
            <div className="md:w-[60%]">
              <MemeResultGrid
                results={results}
                status={status}
                progressPhase={progressPhase}
                selectedStyles={selectedStyles}
                errorMessage={errorMessage}
                onDownloadAll={handleDownloadAll}
                onCopyAll={handleCopyAll}
                onClear={handleClear}
                onRetry={handleRetry}
                onRegenerateSingle={handleRegenerateSingle}
                regeneratingStyle={regeneratingStyle}
              />
            </div>
          </div>

          {/* Demo mode banner */}
          {demoMode && (
            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-border bg-card-hover px-4 py-3 text-center text-[0.85rem] text-text-muted">
              <span>当前使用演示模式，接入 AI 后效果更好</span>
              <button
                onClick={() => setDemoMode(false)}
                className="text-text-light hover:text-text-dark cursor-pointer border-none bg-transparent"
                aria-label="关闭提示"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <CreatePageContent />
    </Suspense>
  );
}
