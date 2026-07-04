import Link from "next/link";
import { SparklesIcon, ImageIcon, ArrowRightIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      {/* Big 404 */}
      <h1 className="gradient-title font-display text-[5rem] font-black leading-none sm:text-[7rem]">
        404
      </h1>
      <p className="mt-2 text-[1.1rem] font-medium text-text-dark">
        页面走丢了
      </p>
      <p className="mt-1 text-[0.9rem] text-text-muted">
        这个页面不存在或已被移除
      </p>

      {/* Quick links */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.95rem] no-underline"
        >
          <SparklesIcon className="h-4 w-4" />
          回到首页
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-[0.95rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark"
        >
          <ArrowRightIcon className="h-4 w-4" />
          去做表情包
        </Link>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-[0.95rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark"
        >
          <ImageIcon className="h-4 w-4" />
          看看画廊
        </Link>
      </div>
    </main>
  );
}
