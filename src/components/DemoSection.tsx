"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FadeInWrapper from "./FadeInWrapper";
import { EyeIcon, RefreshIcon } from "@/components/Icons";
import { preRenderDemoExamples } from "@/lib/meme-renderer";
import type { MemeItem } from "@/types/meme";

const demoText = "这个需求能不能别改了";
const typingSpeed = 80;

export default function DemoSection() {
  const [displayText, setDisplayText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [examples, setExamples] = useState<MemeItem[]>([]);
  const hasStarted = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-render examples once
  useEffect(() => {
    preRenderDemoExamples().then(setExamples);
  }, []);

  const startTyping = useCallback(() => {
    // Skip typing animation for reduced motion users
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(demoText);
      setTypingDone(true);
      setBtnActive(true);
      setTimeout(() => setShowCards(true), 300);
      return;
    }
    let charIndex = 0;
    intervalRef.current = setInterval(() => {
      charIndex++;
      setDisplayText(demoText.slice(0, charIndex));
      if (charIndex >= demoText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTypingDone(true);
        setBtnActive(true);
        setTimeout(() => setShowCards(true), 800);
      }
    }, typingSpeed);
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById("demo-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [startTyping]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleReplay = () => {
    setDisplayText('');
    setTypingDone(false);
    setShowCards(false);
    setBtnActive(false);
    hasStarted.current = false;
    startTyping();
  };

  return (
    <section id="demo-section" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-10 text-center">
          <h2 className="flex items-center justify-center gap-2 font-display text-[1.75rem] font-bold sm:text-[2rem]">
            <EyeIcon className="h-6 w-6 text-primary-dark" />
            看看它怎么工作
          </h2>
        </FadeInWrapper>

        <FadeInWrapper>
          <div className="rounded-2xl bg-card p-6 shadow-sm sm:p-8">
            {/* Simulated input */}
            <div className="flex items-center gap-3 rounded-xl border-2 border-border-light px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex-1 overflow-hidden">
                <span className={`text-[0.95rem] sm:text-[1rem] ${displayText ? "text-text-dark" : "text-text-light"}`}>
                  {displayText || "在这里输入你想说的话..."}
                </span>
                {!typingDone && displayText && (
                  <span className="ml-0.5 inline-block h-[1.1em] w-0 animate-blink border-r-2 border-text-dark align-middle" />
                )}
              </div>
              <button
                className={`shrink-0 rounded-xl px-5 py-2 text-[0.9rem] font-bold transition-all duration-300 no-underline ${
                  btnActive
                    ? "bg-primary text-white shadow-sm cursor-pointer"
                    : "bg-border-light text-text-light cursor-default"
                }`}
              >
                生成
              </button>
            </div>

            {/* Skeleton placeholder while examples load (prevents CLS) */}
            {showCards && examples.length === 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="aspect-square animate-pulse rounded-2xl bg-card-hover" />
                ))}
              </div>
            )}

            {/* Real Canvas-rendered meme results */}
            {showCards && examples.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {examples.map((item, i) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      animation: `bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s both`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.dataUrl}
                      alt={item.caption}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {showCards && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.85rem] text-text-muted border border-border-light transition-colors hover:text-text-dark hover:border-border cursor-pointer bg-transparent"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                  重新播放
                </button>
              </div>
            )}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
