"use client";

import FadeInWrapper from "./FadeInWrapper";

const testimonials = [
  {
    text: "终于不用满世界找表情包了，输入一句话就生成4种风格，太方便了！",
    author: "微信重度用户",
    role: "设计师",
    avatar: "🎨",
  },
  {
    text: "毒舌风简直是我的嘴替，发到群里直接炸锅哈哈哈",
    author: "摸鱼达人",
    role: "产品经理",
    avatar: "🐟",
  },
  {
    text: "正经风太搞了，拿来做工作汇报的封面图同事都笑了",
    author: "打工魂",
    role: "程序员",
    avatar: "💻",
  },
];

export default function TestimonialSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-10 text-center">
          <h2 className="font-display text-[1.75rem] font-normal text-text-dark sm:text-[2rem]">
            用户怎么说
          </h2>
          <p className="mt-2 text-[0.95rem] text-text-muted">
            超过 1000+ 用户正在使用
          </p>
        </FadeInWrapper>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeInWrapper key={i}>
              <div
                className="glass-card gradient-border flex h-full flex-col rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="mb-3 text-[2rem]">{t.avatar}</div>
                <p className="flex-1 text-[0.95rem] leading-relaxed text-text-dark">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 border-t border-border-light pt-4">
                  <p className="text-[0.9rem] font-semibold text-text-dark">{t.author}</p>
                  <p className="text-[0.8rem] text-text-muted">{t.role}</p>
                </div>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
