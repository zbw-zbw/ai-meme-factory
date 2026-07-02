"use client";

import { useState, useEffect, useRef } from "react";
import FadeInWrapper from "./FadeInWrapper";
import {
  StyleIcon,
  EyeIcon,
} from "@/components/Icons";
import type { IconName } from "@/types/meme";

const demoText = "这个需求能不能别改了";
const typingSpeed = 80;

interface MemeCardData {
  icon: IconName;
  text: string;
  label: string;
  bgClass: string;
  accentClass: string;
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
    accentClass: "text-cute-accent",
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
    accentClass: "text-white",
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
    accentClass: "text-chill-accent",
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
    accentClass: "text-formal-accent",
    textClass: "text-formal-accent",
    labelBgClass: "bg-formal-accent",
    fontWeight: "font-medium",
    borderClass: "border border-[#E2E8F0]",
    iconColor: "#475569",
  },
];

function MemeCard({ card, index }: { card: MemeCardData; index: number }) {
  return (
    <div
      className={`${card.bgClass} ${card.borderClass ?? ""} flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
      style={{
        animation: `slide-up 0.6s ease-out ${index * 0.2}s both`,
      }}
    >
      <StyleIcon name={card.icon} className="h-16 w-16" style={{ color: card.iconColor }} />
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
  }, []);

  function startTyping() {
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayText(demoText.slice(0, charIndex));
      if (charIndex >= demoText.length) {
        clearInterval(interval);
        setTypingDone(true);
        setBtnActive(true);
        setTimeout(() => setShowCards(true), 1000);
      }
    }, typingSpeed);
  }

  return (
    <section id="demo-section" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-10 text-center">
          <h2 className="flex items-center justify-center gap-2 text-[1.75rem] font-bold sm:text-[2rem]">
            <EyeIcon className="h-6 w-6 text-primary-dark" />
            看看它怎么工作
          </h2>
        </FadeInWrapper>

        <FadeInWrapper>
          <div className="rounded-2xl bg-card p-6 shadow-sm sm:p-8">
            {/* Simulated input */}
            <div
              className="flex items-center gap-3 rounded-xl border-2 border-border-light px-4 py-3 sm:px-5 sm:py-4"
            >
              <div className="flex-1 overflow-hidden">
                <span className={`text-[0.95rem] sm:text-[1rem] ${displayText ? "text-text-dark" : "text-text-light"}`}>
                  {displayText || "在这里输入你想说的话..."}
                </span>
                {!typingDone && displayText && (
                  <span
                    className="ml-0.5 inline-block h-[1.1em] w-0 border-r-2 border-text-dark align-middle animate-blink"
                  />
                )}
              </div>
              <button
                className={`shrink-0 rounded-xl px-5 py-2 text-[0.9rem] font-bold transition-all duration-300 no-underline ${
                  btnActive
                    ? "text-white shadow-sm cursor-pointer"
                    : "bg-border-light text-text-light cursor-default"
                }`}
                style={
                  btnActive
                    ? { background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }
                    : {}
                }
              >
                生成
              </button>
            </div>

            {/* Meme cards result */}
            {showCards && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {memeCards.map((card, i) => (
                  <MemeCard key={card.label} card={card} index={i} />
                ))}
              </div>
            )}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
