"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshIcon, SparklesIcon } from "@/components/Icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card-hover">
        <SparklesIcon className="h-10 w-10 text-primary-dark" />
      </div>
      <h1 className="mt-6 font-display text-[2rem] font-bold text-text-dark">
        出了点小问题
      </h1>
      <p className="mt-2 text-[0.95rem] text-text-muted">
        页面加载时遇到了错误，请重试
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.95rem] cursor-pointer"
        >
          <RefreshIcon className="h-4 w-4" />
          重试
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-[0.95rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
