"use client";

import { useState, useEffect, useRef } from "react";
import FadeInWrapper from "./FadeInWrapper";

const stats = [
  { value: 4, label: "风格随心选", suffix: "种" },
  { value: 3, label: "秒速生成", suffix: "秒" },
  { value: 100, label: "本地存储", suffix: "%" },
  { value: 0, label: "注册费用", suffix: "元" },
];

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          // Skip count-up for reduced motion
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setCount(target);
            return;
          }
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
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
                  <span className="font-display text-[3rem] font-normal gradient-title sm:text-[3.5rem]">
                    <CountUp target={stat.value} duration={stat.value <= 10 ? 600 : 1500} />
                  </span>
                  <span className="text-[1.1rem] font-bold text-text-muted">
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
