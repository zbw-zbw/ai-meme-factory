"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="text-center">
        <span className="mb-4 inline-block text-[5rem]">😵</span>
        <h1 className="gradient-title mb-3 text-[2rem] font-black sm:text-[2.5rem]">
          404 - 页面走丢了
        </h1>
        <p className="mb-8 text-[1.1rem] text-text-muted">
          这个页面不存在，去生成表情包吧！
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl px-8 py-4 text-[1.1rem] font-bold text-white no-underline transition-transform duration-200 hover:scale-105"
          style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
        >
          回到首页
        </Link>
      </div>
    </main>
  );
}
