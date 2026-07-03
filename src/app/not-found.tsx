"use client";

import Link from "next/link";
import { LogoIcon, AlertIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card-hover">
            <AlertIcon className="h-10 w-10 text-primary-dark" />
          </div>
        </div>
        <h1 className="gradient-title mb-3 text-[2rem] font-black sm:text-[2.5rem]">
          404 - 页面走丢了
        </h1>
        <p className="mb-8 text-[1.1rem] text-text-muted">
          这个页面不存在，去生成表情包吧
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-[1.1rem] no-underline transition-transform duration-200 hover:scale-105"
        >
          <LogoIcon className="h-5 w-5" />
          回到首页
        </Link>
      </div>
    </main>
  );
}
