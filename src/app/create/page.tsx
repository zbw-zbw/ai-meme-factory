"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import TextInput from "@/components/create/TextInput";
import StyleSelector from "@/components/create/StyleSelector";
import GenerateButton from "@/components/create/GenerateButton";
import MemeResultGrid from "@/components/create/MemeResultGrid";
import { renderMemeToCanvas, downloadMeme } from "@/lib/meme-renderer";
import { ALL_STYLES } from "@/lib/meme-styles";
import type { MemeStyle, MemeItem, GenerateStatus } from "@/types/meme";

interface ApiResponse {
  success: boolean;
  data?: {
    memes: Array<{
      style: MemeStyle;
      caption: string;
      emoji: string;
    }>;
    demoMode?: boolean;
  };
  error?: string;
  code?: string;
}

function CreatePageContent() {
  const searchParams = useSearchParams();
  const [inputText, setInputText] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<MemeStyle[]>([...ALL_STYLES]);
  const [status, setStatus] = useState<GenerateStatus>("idle");
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
        return;
      }

      if (data.data.demoMode) {
        setDemoMode(true);
      }

      // Render each meme to Canvas
      const newResults: MemeItem[] = data.data.memes.map((meme) =>
        renderMemeToCanvas(inputText.trim(), meme.style, meme.caption, meme.emoji),
      );

      setResults(newResults);
      setStatus("done");
    } catch {
      setErrorMessage("网络错误，请检查连接后重试");
      setStatus("error");
    }
  }, [canGenerate, status, inputText, selectedStyles]);

  const handleDownloadAll = useCallback(() => {
    results.forEach((item, i) => {
      setTimeout(() => downloadMeme(item), i * 300);
    });
  }, [results]);

  const handleClear = useCallback(() => {
    setResults([]);
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("idle");
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
                canGenerate={canGenerate}
                onClick={handleGenerate}
              />
            </div>

            {/* Right column: results */}
            <div className="lg:w-[60%]">
              <MemeResultGrid
                results={results}
                status={status}
                selectedStyles={selectedStyles}
                errorMessage={errorMessage}
                onDownloadAll={handleDownloadAll}
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
