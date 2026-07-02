"use client";

import FadeInWrapper from "./FadeInWrapper";

const steps = [
  {
    step: 1,
    icon: "✍️",
    title: "输入你想说的话",
    subtitle: "随便说，越真实越有趣",
    visual: (
      <div className="mt-4 rounded-xl border-2 border-border-light bg-card px-4 py-3 text-center text-[0.85rem] text-text-light">
        今天不想上班...
      </div>
    ),
  },
  {
    step: 2,
    icon: "🤖",
    title: "AI 秒速生成",
    subtitle: "4种风格，总有一款适合你",
    visual: (
      <div className="mt-4 flex justify-center gap-2">
        <span className="inline-block h-8 w-8 rounded-full bg-cute-accent" title="可爱风" />
        <span className="inline-block h-8 w-8 rounded-full bg-savage-accent" title="毒舌风" />
        <span className="inline-block h-8 w-8 rounded-full bg-chill-accent" title="摸鱼风" />
        <span className="inline-block h-8 w-8 rounded-full bg-formal-accent" title="正经风" />
      </div>
    ),
  },
  {
    step: 3,
    icon: "💾",
    title: "下载发送",
    subtitle: "一键保存，随心发送",
    visual: (
      <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2 shadow-sm border border-border-light text-[0.85rem] font-medium text-text-muted">
        <span>📥</span> 下载表情包
      </div>
    ),
  },
];

export default function StepsSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-12 text-center">
          <h2 className="text-[1.75rem] font-bold sm:text-[2rem]">三步搞定 🎯</h2>
        </FadeInWrapper>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {/* Desktop arrows */}
          <div className="pointer-events-none absolute top-1/2 left-1/3 hidden -translate-x-1/2 -translate-y-1/2 text-2xl text-text-light md:block">
            →
          </div>
          <div className="pointer-events-none absolute top-1/2 left-2/3 hidden -translate-x-1/2 -translate-y-1/2 text-2xl text-text-light md:block">
            →
          </div>

          {steps.map((step) => (
            <FadeInWrapper key={step.step} threshold={0.2}>
              <div className="flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-sm md:p-8">
                <span className="text-[2.5rem]">{step.icon}</span>
                <h3 className="mt-3 text-[1rem] font-bold text-text-dark sm:text-[1.1rem]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[0.85rem] text-text-muted">{step.subtitle}</p>
                {step.visual}
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
