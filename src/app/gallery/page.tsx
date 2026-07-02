import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
        <div className="text-center">
          <span className="mb-4 inline-block text-[5rem]">🖼️</span>
          <h1 className="gradient-title mb-3 text-[2rem] font-black sm:text-[2.5rem]">
            我的画廊
          </h1>
          <p className="mb-8 text-[1.1rem] text-text-muted">功能开发中，敬请期待...</p>
          <Link
            href="/"
            className="inline-block rounded-xl px-6 py-3 text-[0.95rem] font-medium text-text-muted no-underline transition-colors hover:text-text-dark"
          >
            ← 返回首页
          </Link>
        </div>
      </main>
    </>
  );
}
