"use client";

import FadeInWrapper from "./FadeInWrapper";

const stats = [
  { value: "4", label: "风格随心选", suffix: "种" },
  { value: "3", label: "秒速生成", suffix: "秒" },
  { value: "100", label: "本地存储", suffix: "%" },
  { value: "0", label: "注册费用", suffix: "元" },
];

export default function StatsSection() {
  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
                style={{
                  animation: `bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`,
                }}
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display text-[2.5rem] font-black gradient-title sm:text-[3rem]">
                    {stat.value}
                  </span>
                  <span className="text-[1rem] font-bold text-text-muted">
                    {stat.suffix}
                  </span>
                </div>
                <p className="mt-1 text-[0.85rem] text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
