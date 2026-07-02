"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { styleConfigs } from "@/lib/meme-styles";
import {
  getGalleryItems,
  deleteGalleryItem,
  clearGallery,
  downloadMeme,
} from "@/lib/meme-renderer";
import type { MemeItem } from "@/types/meme";
import {
  ImageIcon,
  DownloadIcon,
  TrashIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/Icons";

export default function GalleryPage() {
  const [items, setItems] = useState<MemeItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getGalleryItems());
    setLoaded(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteGalleryItem(id);
    setItems(getGalleryItems());
  }, []);

  const handleClear = useCallback(() => {
    clearGallery();
    setItems([]);
  }, []);

  const handleDownload = useCallback((item: MemeItem) => {
    downloadMeme(item);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-20 pb-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[0.85rem]">
            <Link
              href="/"
              className="text-text-muted no-underline transition-colors hover:text-text-dark"
            >
              首页
            </Link>
            <span className="text-text-light">/</span>
            <span className="font-medium text-text-dark">我的画廊</span>
          </nav>

          {/* Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-[1.75rem] font-bold text-text-dark sm:text-[2rem]">
                <ImageIcon className="h-7 w-7 text-primary-dark" />
                我的画廊
              </h1>
              <p className="mt-2 text-[0.95rem] text-text-muted">
                {loaded && items.length > 0
                  ? `共 ${items.length} 张表情包，本地存储，不会上传`
                  : "生成的表情包会自动保存到这里"}
              </p>
            </div>

            {/* Action buttons */}
            {items.length > 0 && (
              <div className="flex gap-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-text-muted shadow-sm border border-border-light transition-all duration-200 hover:text-text-dark hover:shadow-md no-underline"
                >
                  <SparklesIcon className="h-4 w-4" />
                  继续创作
                </Link>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-savage-accent shadow-sm border border-border-light transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                  <TrashIcon className="h-4 w-4" />
                  清空全部
                </button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {loaded && items.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-light py-20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card-hover">
                <ImageIcon className="h-10 w-10 text-text-light" />
              </div>
              <p className="mt-4 text-[1rem] font-medium text-text-muted">
                还没有作品
              </p>
              <p className="mt-1 text-[0.85rem] text-text-light">
                生成表情包后会自动保存到这里
              </p>
              <Link
                href="/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[0.95rem] font-bold text-white no-underline transition-transform duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
              >
                去生成表情包
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Gallery grid */}
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, i) => {
                const config = styleConfigs[item.style];
                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ animation: `bounce-in 0.5s ease-out ${i * 0.08}s both` }}
                  >
                    {/* Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.dataUrl}
                      alt={item.caption}
                      className="aspect-square w-full object-cover"
                    />

                    {/* Info bar */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <span
                        className="rounded-full px-2.5 py-1 text-[0.7rem] font-medium text-white"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        {config.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-card-hover text-text-muted transition-colors hover:text-text-dark cursor-pointer"
                          title="下载"
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-card-hover text-text-muted transition-colors hover:text-savage-accent cursor-pointer"
                          title="删除"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="px-3 pb-2">
                      <p className="truncate text-[0.75rem] text-text-light" title={item.caption}>
                        {item.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom: create more */}
          {items.length > 0 && (
            <div className="mt-10 text-center">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-[1rem] font-bold text-white no-underline transition-transform duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
              >
                <SparklesIcon className="h-5 w-5" />
                再做一批
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
