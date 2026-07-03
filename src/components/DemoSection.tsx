"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FadeInWrapper from "./FadeInWrapper";
import { StyleIcon, EyeIcon, RefreshIcon } from "@/components/Icons";
import type { IconName } from "@/types/meme";

const demoText = "这个需求能不能别改了";
const typingSpeed = 80;

interface MemeCardData {
  icon: IconName;
  text: string;
  label: string;
  bgClass: string;
  textClass: string;
  labelBgClass: string;
  borderClass?: string;
  fontWeight: string;
  iconColor: string;
}

const memeCards: MemeCardData[] = [
  {
    icon: "heart",
    text: "求求了别改了",
    label: "可爱风",
    bgClass: "bg-cute-bg",
    textClass: "text-cute-accent",
    labelBgClass: "bg-cute-accent",
    fontWeight: "font-bold",
    iconColor: "#FB7185",
  },
  {
    icon: "fire",
    text: "改你个大头鬼",
    label: "毒舌风",
    bgClass: "bg-savage-bg",
    textClass: "text-white",
    labelBgClass: "bg-savage-accent",
    fontWeight: "font-black",
    iconColor: "#F43F5E",
  },
  {
    icon: "fish",
    text: "改不动了 先摸会儿",
    label: "摸鱼风",
    bgClass: "bg-chill-bg",
    textClass: "text-chill-accent",
    labelBgClass: "bg-chill-accent",
    fontWeight: "font-medium",
    iconColor: "#06B6D4",
  },
  {
    icon: "briefcase",
    text: "建议需求评审后再变更",
    label: "正经风",
    bgClass: "bg-formal-bg",
    textClass: "text-formal-accent",
    labelBgClass: "bg-formal-accent",
    fontWeight: "font-medium",
    borderClass: "border border-[#E2E8F0]",
    iconColor: "#475569",
  },
];

/* Card delay classes for staggered entrance */
const cardDelays = [
  "animate-slide-up [animation-delay:0s]",
  "animate-slide-up [animation-delay:0.15s]",
  "animate-slide-up [animation-delay:0.3s]",
  "animate-slide-up [animation-delay:0.45s]",
];

function MemeCard({ card, index }: { card: MemeCardData; index: number }) {
  return (
    <div
      className={`${card.bgClass} ${card.borderClass ?? ""} flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${cardDelays[index] ?? ""}`}
    >
      <StyleIcon name={card.icon} className="h-14 w-14" style={{ color: card.iconColor }} />
      <p className={`mt-3 ${card.textClass} ${card.fontWeight} text-center text-[1rem]`}>
        {card.text}
      </p>
      <span
        className={`${card.labelBgClass} mt-3 rounded-full px-3 py-1 text-[0.75rem] font-medium text-white`}
      >
        {card.label}
      </span>
    </div>
  );
}

export default function DemoSection() {
  const [displayText, setDisplayText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const hasStarted = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTyping = useCallback(() => {
    let charIndex = 0;
    intervalRef.current = setInterval(() => {
      charIndex++;
      setDisplayText(demoText.slice(0, charIndex));
      if (charIndex >= demoText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTypingDone(true);
        setBtnActive(true);
        setTimeout(() => setShowCards(true), 1000);
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

  /* Cleanup interval on unmount */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

            {/* Meme cards result */}
            {showCards && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {memeCards.map((card, i) => (
                  <MemeCard key={card.label} card={card} index={i} />
                ))}
              </div>
            )}

            {showCards && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => { setDisplayText(''); setTypingDone(false); setShowCards(false); setBtnActive(false); hasStarted.current = false; startTyping(); }}
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
