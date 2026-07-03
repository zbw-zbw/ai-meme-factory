"use client";

import FadeInWrapper from "./FadeInWrapper";

const steps = [
  {
    number: "01",
    title: "输入你想说的话",
    subtitle: "随便说，越真实越有趣",
  },
  {
    number: "02",
    title: "AI 秒速生成",
    subtitle: "4种风格，总有一款适合你",
  },
  {
    number: "03",
    title: "下载发送",
    subtitle: "一键保存，随心发送",
  },
];

export default function StepsSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-12 text-center">
          <h2 className="font-display text-[1.75rem] font-bold sm:text-[2rem]">
            三步搞定
          </h2>
        </FadeInWrapper>

        <div className="relative flex flex-col gap-8">
          {/* Vertical connecting line */}
          <div className="absolute left-[26px] md:left-[30px] top-14 bottom-0 w-px border-l-2 border-dashed border-border-light" />

          {steps.map((step) => (
            <FadeInWrapper key={step.number} threshold={0.2}>
              {/* Full-width row on mobile, centered on desktop */}
              <div className="flex items-center gap-6 md:gap-8">
                {/* Numbered circle */}
                <span className="font-display shrink-0 flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-card text-[1.2rem] text-primary-dark sm:h-16 sm:w-16 sm:text-[1.4rem]">
                  {step.number}
                </span>

                {/* Text content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-[1.05rem] font-bold text-text-dark sm:text-[1.15rem]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[0.9rem] text-text-muted">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
