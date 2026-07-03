"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { styleConfigs } from "@/lib/meme-styles";
import {
  getGalleryItems,
  deleteGalleryItem,
  clearGallery,
  downloadMeme,
} from "@/lib/meme-renderer";
import type { MemeItem, MemeStyle } from "@/types/meme";
import {
  ImageIcon,
  DownloadIcon,
  TrashIcon,
  ArrowRightIcon,
  SparklesIcon,
  SearchIcon,
} from "@/components/Icons";
import { ToastProvider, useToast } from "@/components/Toast";

const ALL_STYLE_KEYS = Object.keys(styleConfigs) as MemeStyle[];

function GalleryContent() {
  const [items, setItems] = useState<MemeItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filterStyle, setFilterStyle] = useState<MemeStyle | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    setItems(getGalleryItems());
    setLoaded(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteGalleryItem(id);
    setItems(getGalleryItems());
    showToast("已删除");
  }, [showToast]);

  const handleClear = useCallback(() => {
    clearGallery();
    setItems([]);
    setShowConfirmClear(false);
    showToast("已清空全部");
  }, [showToast]);

  const handleDownload = useCallback((item: MemeItem) => {
    downloadMeme(item);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchStyle = filterStyle === "all" || item.style === filterStyle;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchStyle && matchSearch;
    });
  }, [items, filterStyle, searchQuery]);

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
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                  onClick={() => setShowConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-card px-4 py-2.5 text-[0.9rem] font-medium text-savage-accent shadow-sm border border-border-light transition-all duration-200 hover:shadow-md cursor-pointer"
                >
                  <TrashIcon className="h-4 w-4" />
                  清空全部
                </button>
              </div>
            )}
          </div>

          {/* Filter bar */}
          {items.length > 0 && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Style filter pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStyle("all")}
                  className={`rounded-full px-4 py-1.5 text-[0.8rem] font-medium transition-colors duration-200 cursor-pointer border-none ${
                    filterStyle === "all"
                      ? "bg-primary text-white"
                      : "bg-card text-text-muted hover:text-text-dark"
                  }`}
                >
                  全部
                </button>
                {ALL_STYLE_KEYS.map((key) => {
                  const config = styleConfigs[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterStyle(key)}
                      className={`rounded-full px-4 py-1.5 text-[0.8rem] font-medium transition-colors duration-200 cursor-pointer border-none ${
                        filterStyle === key
                          ? "bg-primary text-white"
                          : "bg-card text-text-muted hover:text-text-dark"
                      }`}
                    >
                      {config.name}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文案..."
                  className="w-full rounded-xl border border-border-light bg-card py-2 pl-9 pr-4 text-[0.85rem] text-text-dark placeholder:text-text-light outline-none transition-shadow duration-200 focus:shadow-md sm:w-52"
                />
              </div>
            </div>
          )}

          {/* Empty state - no items at all */}
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

          {/* Empty state - filtered to nothing */}
          {loaded && items.length > 0 && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-light py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card-hover">
                <SearchIcon className="h-8 w-8 text-text-light" />
              </div>
              <p className="mt-4 text-[1rem] font-medium text-text-muted">
                没有匹配的作品
              </p>
            </div>
          )}

          {/* Gallery grid */}
          {filteredItems.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item, i) => {
                const config = styleConfigs[item.style];
                const shouldAnimate = i < 12;
                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={
                      shouldAnimate
                        ? { animation: `bounce-in 0.5s ease-out ${i * 0.08}s both` }
                        : undefined
                    }
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
          {filteredItems.length > 0 && (
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

      {/* Confirm clear dialog overlay */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-[1.05rem] font-bold text-text-dark">
              确认清空
            </h3>
            <p className="mt-2 text-[0.9rem] text-text-muted">
              将删除全部 {items.length} 张表情包，此操作不可恢复。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="rounded-xl bg-card-hover px-5 py-2.5 text-[0.9rem] font-medium text-text-muted transition-colors hover:text-text-dark cursor-pointer border-none"
              >
                取消
              </button>
              <button
                onClick={handleClear}
                className="rounded-xl bg-savage-accent px-5 py-2.5 text-[0.9rem] font-bold text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer border-none"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GalleryPage() {
  return (
    <ToastProvider>
      <GalleryContent />
    </ToastProvider>
  );
}
