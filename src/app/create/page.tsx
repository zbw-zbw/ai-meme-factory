"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import TextInput from "@/components/create/TextInput";
import StyleSelector from "@/components/create/StyleSelector";
import GenerateButton from "@/components/create/GenerateButton";
import MemeResultGrid from "@/components/create/MemeResultGrid";
import { renderMemeToCanvas, downloadMeme, saveToGallery } from "@/lib/meme-renderer";
import { ALL_STYLES } from "@/lib/meme-styles";
import type { MemeStyle, MemeItem, GenerateStatus, IconName } from "@/types/meme";

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

export type ProgressPhase = 'idle' | 'caption' | 'image' | 'render' | 'done' | 'error';

function CreatePageContent() {
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<MemeStyle[]>([...ALL_STYLES]);
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [progressPhase, setProgressPhase] = useState<ProgressPhase>("idle");
  const [results, setResults] = useState<MemeItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoMode, setDemoMode] = useState(false);

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
      }

      // Phase 2: Render memes (may be async if AI images are involved)
      setProgressPhase(data.data.aiImageMode ? "render" : "image");
      const renderPromises = data.data.memes.map((meme) =>
        renderMemeToCanvas(inputText.trim(), meme.style, meme.caption, meme.icon, meme.imageUrl),
      );

      // Wait for all renders (some may be sync, some async with image loading)
      const newResults: MemeItem[] = await Promise.all(renderPromises);

      // Save each result to gallery (localStorage)
      newResults.forEach((item) => {
        saveToGallery(item);
      });

      setResults(newResults);
      setStatus("done");
      setProgressPhase("done");
    } catch {
      setErrorMessage("网络错误，请检查连接后重试");
      setStatus("error");
      setProgressPhase("error");
    }
  }, [canGenerate, status, inputText, selectedStyles]);

  const handleDownloadAll = useCallback(() => {
    results.forEach((item, i) => {
      setTimeout(() => downloadMeme(item), i * 300);
    });
  }, [results]);

  const handleCopyAll = useCallback(async () => {
    try {
      for (const item of results) {
        const response = await fetch(item.dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
      }
    } catch {
      // Fallback: just copy the first one as data URL
      try {
        await navigator.clipboard.writeText(results[0]?.dataUrl || "");
      } catch {
        // Silently fail
      }
    }
  }, [results]);

  const handleClear = useCallback(() => {
    setResults([]);
    setStatus("idle");
    setProgressPhase("idle");
    setErrorMessage("");
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setProgressPhase("idle");
    setErrorMessage("");
    setTimeout(() => handleGenerate(), 100);
  }, [handleGenerate]);

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
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Left column: input & controls */}
            <div className="lg:w-[40%]">
              <TextInput value={inputText} onChange={setInputText} />
              <StyleSelector selected={selectedStyles} onChange={setSelectedStyles} />
              <GenerateButton
                status={status}
                progressPhase={progressPhase}
                canGenerate={canGenerate}
                onClick={handleGenerate}
              />
            </div>

            {/* Right column: results */}
            <div className="lg:w-[60%]">
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
              />
            </div>
          </div>

          {/* Demo mode banner */}
          {demoMode && (
            <div className="mt-6 rounded-xl border border-border bg-card-hover px-4 py-3 text-center text-[0.85rem] text-text-muted">
              当前使用演示模式，接入 AI 后效果更好
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
