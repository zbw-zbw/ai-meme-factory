"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
      style={{ backgroundColor: "rgba(255, 251, 235, 0.85)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 no-underline">
          <span className="text-2xl">😂</span>
          <span className="gradient-logo text-lg font-bold">AI表情包工厂</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/create"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-dark no-underline"
          >
            生成表情包
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-dark no-underline"
          >
            我的画廊
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1 md:hidden"
          aria-label="切换菜单"
        >
          <span className={`block h-0.5 w-5 bg-text-dark transition-transform duration-300 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-text-dark transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-text-dark transition-transform duration-300 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-40 border-t border-border-light" : "max-h-0"
        }`}
        style={{ backgroundColor: "rgba(255, 251, 235, 0.95)" }}
      >
        <div className="flex flex-col gap-3 px-6 py-4">
          <Link
            href="/create"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-text-muted no-underline transition-colors hover:text-text-dark"
          >
            生成表情包
          </Link>
          <Link
            href="/gallery"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-text-muted no-underline transition-colors hover:text-text-dark"
          >
            我的画廊
          </Link>
        </div>
      </div>
    </nav>
  );
}
