"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogoIcon, MenuIcon, CloseIcon } from "@/components/Icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* Scroll shadow detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Body scroll lock when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ESC to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // 滚动时增加背景不透明度和阴影
  const navbarBg = scrolled
    ? "bg-bg/95 shadow-md backdrop-blur-xl"
    : "bg-bg/80 backdrop-blur-md";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <LogoIcon className="h-7 w-7 text-primary-dark" />
          <span className="gradient-logo text-lg font-bold">AI表情包工厂</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/create"
            className={`text-sm font-medium no-underline transition-colors ${
              pathname === "/create"
                ? "text-primary-dark font-semibold"
                : "text-text-muted hover:text-text-dark"
            }`}
          >
            生成表情包
          </Link>
          <Link
            href="/gallery"
            className={`text-sm font-medium no-underline transition-colors ${
              pathname === "/gallery"
                ? "text-primary-dark font-semibold"
                : "text-text-muted hover:text-text-dark"
            }`}
          >
            我的画廊
          </Link>
          {/* Desktop CTA */}
          <Link
            href="/create"
            className="btn-primary rounded-lg px-5 py-2 text-sm font-bold no-underline"
          >
            开始制作
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center md:hidden"
          aria-label="切换菜单"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <CloseIcon className="h-6 w-6 text-text-dark" />
          ) : (
            <MenuIcon className="h-6 w-6 text-text-dark" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-56 border-t border-border-light" : "max-h-0"
        }`}
        style={{ backgroundColor: "rgba(255, 251, 235, 0.95)" }}
      >
        <div className="flex flex-col gap-4 px-6 py-5">
          <Link
            href="/create"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium no-underline transition-colors ${
              pathname === "/create"
                ? "text-primary-dark font-semibold"
                : "text-text-muted hover:text-text-dark"
            }`}
          >
            生成表情包
          </Link>
          <Link
            href="/gallery"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium no-underline transition-colors ${
              pathname === "/gallery"
                ? "text-primary-dark font-semibold"
                : "text-text-muted hover:text-text-dark"
            }`}
          >
            我的画廊
          </Link>
          {/* Mobile CTA */}
          <Link
            href="/create"
            onClick={() => setMenuOpen(false)}
            className="btn-primary mt-1 rounded-lg px-5 py-2.5 text-center text-sm font-bold no-underline"
          >
            开始制作
          </Link>
        </div>
      </div>
    </nav>
  );
}
