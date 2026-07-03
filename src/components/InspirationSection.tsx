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

/* Stagger delay classes */
const pillDelays = [
  "animate-bounce-in [animation-delay:0s]",
  "animate-bounce-in [animation-delay:0.06s]",
  "animate-bounce-in [animation-delay:0.12s]",
  "animate-bounce-in [animation-delay:0.18s]",
  "animate-bounce-in [animation-delay:0.24s]",
  "animate-bounce-in [animation-delay:0.30s]",
  "animate-bounce-in [animation-delay:0.36s]",
  "animate-bounce-in [animation-delay:0.42s]",
];

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
                className={`inspiration-pill inline-block rounded-[20px] border border-border bg-card px-5 py-2.5 text-[0.9rem] font-medium text-text-dark no-underline shadow-sm transition-all duration-200 hover:border-primary hover:bg-card-hover hover:shadow-md ${pillDelays[i] ?? ""}`}
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
