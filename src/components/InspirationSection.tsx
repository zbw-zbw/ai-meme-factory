"use client";

import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";

const inspirations = [
  { text: "老板又在画饼" },
  { text: "今天不想上班" },
  { text: "这个bug不是我写的" },
  { text: "下班！" },
  { text: "周五了！" },
  { text: "加班到怀疑人生" },
  { text: "需求又变了" },
  { text: "摸鱼被抓了" },
];

/* Stagger delay (ms) applied via inline transitionDelay so the fade-in
   is driven by the surrounding FadeInWrapper instead of a CSS animation
   that plays while the wrapper is still opacity:0. */
const pillDelays = [0, 60, 120, 180, 240, 300, 360, 420];

export default function InspirationSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-3 text-center">
          <h2 className="font-display text-[1.75rem] font-bold sm:text-[2rem]">
            更多灵感
          </h2>
        </FadeInWrapper>
        <FadeInWrapper className="mb-10 text-center">
          <p className="text-[0.95rem] text-text-muted">
            看看大家都在生成什么
          </p>
        </FadeInWrapper>

        <FadeInWrapper>
          <div className="flex flex-wrap justify-center gap-3">
            {inspirations.map((item, i) => (
              <Link
                key={item.text}
                href={`/create?text=${encodeURIComponent(item.text)}`}
                className="inspiration-pill inline-block rounded-[20px] border border-border bg-card px-5 py-2.5 text-[0.9rem] font-medium text-text-dark no-underline shadow-sm transition-all duration-500 hover:border-primary hover:bg-card-hover hover:shadow-md"
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
