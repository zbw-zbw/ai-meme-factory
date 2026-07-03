"use client";

import FadeInWrapper from "./FadeInWrapper";
import { BoltIcon, PaletteIcon, ShareIcon } from "@/components/Icons";

const features = [
  {
    Icon: BoltIcon,
    number: "01",
    title: "即时生成",
    description: "输入文字，3秒出图，告别表情包荒",
  },
  {
    Icon: PaletteIcon,
    number: "02",
    title: "风格多变",
    description: "可爱/毒舌/摸鱼/正经，一句话四种表达",
  },
  {
    Icon: ShareIcon,
    number: "03",
    title: "一键保存",
    description: "下载保存，直发微信/钉钉/飞书",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-12 text-center">
          <h2 className="font-display text-[1.75rem] font-bold sm:text-[2rem]">
            三大超能力
          </h2>
        </FadeInWrapper>

        {/* Horizontal strip - 3 columns with dividers */}
        <FadeInWrapper>
          <div className="grid grid-cols-1 divide-y divide-border-light md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature) => {
              const { Icon } = feature;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center px-6 py-10 text-center transition-all duration-200 hover:-translate-y-1 hover:bg-card-hover/50 md:py-12"
                >
                  <Icon className="mb-4 h-8 w-8 text-primary" />
                  <span className="font-display text-[0.85rem] text-text-light">
                    {feature.number}
                  </span>
                  <h3 className="mt-1 text-[1.1rem] font-bold text-text-dark">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
}
