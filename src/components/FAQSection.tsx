"use client";

import { useState } from "react";
import FadeInWrapper from "./FadeInWrapper";

const faqs = [
  {
    q: "这个工具收费吗？",
    a: "完全免费，无需注册，打开即用。所有表情包在本地生成和存储，不收集任何用户数据。",
  },
  {
    q: "生成的表情包存在哪里？",
    a: "所有作品保存在你浏览器的本地存储中（最多30张），不会上传到服务器。你可以随时下载或删除。",
  },
  {
    q: "AI生成的图片质量怎么样？",
    a: "使用 DeepSeek AI 生成文案，HuggingFace SDXL 模型生成插图。如果AI服务暂时不可用，会自动降级为纯Canvas矢量风格。",
  },
  {
    q: "可以商用吗？",
    a: "生成的表情包可以自由使用。但请注意AI生成的内容可能存在版权不确定性，建议仅用于个人交流和娱乐。",
  },
];

function FAQItem({ q, a, id, isOpen, onToggle }: { q: string; a: string; id: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border-light">
      <button
        id={`faq-button-${id}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left cursor-pointer border-none bg-transparent"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
      >
        <span className="text-[1rem] font-medium text-text-dark">{q}</span>
        <span className={`text-[1.2rem] transition-transform duration-200 ${isOpen ? "rotate-45 text-primary" : "text-text-muted"}`}>
          +
        </span>
      </button>
      {isOpen && (
        <p id={`faq-panel-${id}`} role="region" aria-labelledby={`faq-button-${id}`} className="pb-4 text-[0.9rem] leading-relaxed text-text-muted" style={{ animation: "fade-in 0.2s ease-out" }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[800px]">
        <FadeInWrapper className="mb-8 text-center">
          <span className="ai-label">常见问题</span>
          <h2 className="font-display text-[1.75rem] font-normal text-text-dark sm:text-[2rem]">
            常见问题
          </h2>
        </FadeInWrapper>

        <FadeInWrapper>
          <div className="glass-card rounded-2xl bg-card p-2 shadow-sm">
            {faqs.map((faq, i) => (
              <div key={i} className="px-4">
                <FAQItem
                  q={faq.q}
                  a={faq.a}
                  id={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </div>
            ))}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
