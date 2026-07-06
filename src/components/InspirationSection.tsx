"use client";

import { useState } from "react";
import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";

interface Inspiration {
  text: string;
  color: string;
}

const inspirations: Inspiration[] = [
  { text: "不想上班", color: "hover:border-chill-accent hover:text-chill-accent" },
  { text: "今天好累", color: "hover:border-cute-accent hover:text-cute-accent" },
  { text: "又要开会", color: "hover:border-savage-accent hover:text-savage-accent" },
  { text: "干饭时间到", color: "hover:border-primary hover:text-primary-dark" },
  { text: "这个需求改不动了", color: "hover:border-savage-accent hover:text-savage-accent" },
  { text: "摸鱼摸到爽", color: "hover:border-chill-accent hover:text-chill-accent" },
  { text: "工资还没发", color: "hover:border-primary hover:text-primary-dark" },
  { text: "周末去哪玩", color: "hover:border-cute-accent hover:text-cute-accent" },
  { text: "又胖了三斤", color: "hover:border-cute-accent hover:text-cute-accent" },
  { text: "代码写不动了", color: "hover:border-savage-accent hover:text-savage-accent" },
  { text: "想躺平", color: "hover:border-chill-accent hover:text-chill-accent" },
  { text: "今天也要加油鸭", color: "hover:border-cute-accent hover:text-cute-accent" },
];

/* Stagger delay (ms) applied via inline transitionDelay so the fade-in
   is driven by the surrounding FadeInWrapper instead of a CSS animation
   that plays while the wrapper is still opacity:0. */
const pillDelays = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660];

export default function InspirationSection() {
  const [shuffled, setShuffled] = useState<Inspiration[]>(inspirations);

  const handleShuffle = () => {
    setShuffled((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper>
          <div className="mb-8 text-center">
            <span className="ai-label">灵感库</span>
            <h2 className="font-display text-[1.75rem] font-normal text-text-dark sm:text-[2rem]">
              灵感参考
            </h2>
            <p className="mt-2 text-[0.95rem] text-text-muted">
              看看大家都在生成什么
            </p>
            <button
              onClick={handleShuffle}
              className="glass-card mt-3 inline-flex items-center gap-1 rounded-lg bg-card-hover px-3 py-1.5 text-[0.8rem] text-text-muted transition-colors hover:text-text-dark cursor-pointer border-none"
            >
              换一批
            </button>
          </div>
        </FadeInWrapper>

        <FadeInWrapper>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffled.map((item, i) => (
              <Link
                key={item.text}
                href={`/create?text=${encodeURIComponent(item.text)}`}
                className={`inspiration-pill inline-block rounded-[20px] border border-border bg-card px-5 py-2.5 text-[0.9rem] font-medium text-text-dark no-underline shadow-sm transition-all duration-500 hover:scale-105 ${item.color} hover:bg-card-hover hover:shadow-md`}
                style={{ transitionDelay: `${pillDelays[i] ?? 0}ms` }}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
