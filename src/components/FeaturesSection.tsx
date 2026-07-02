"use client";

import FadeInWrapper from "./FadeInWrapper";
import { BoltIcon, PaletteIcon, ShareIcon } from "@/components/Icons";

const features = [
  {
    Icon: BoltIcon,
    title: "即时生成",
    description: "输入文字，3秒出图，告别表情包荒",
  },
  {
    Icon: PaletteIcon,
    title: "风格多变",
    description: "可爱/毒舌/摸鱼/正经，一句话四种表达",
  },
  {
    Icon: ShareIcon,
    title: "一键保存",
    description: "下载保存，直发微信/钉钉/飞书",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <FadeInWrapper className="mb-10 text-center">
          <h2 className="text-[1.75rem] font-bold sm:text-[2rem]">三大超能力</h2>
        </FadeInWrapper>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature, i) => {
            const { Icon } = feature;
            return (
              <FadeInWrapper key={feature.title} threshold={0.2}>
                <div
                  className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card-hover">
                    <Icon className="h-7 w-7 text-primary-dark" />
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-text-dark">{feature.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-text-muted">{feature.description}</p>
                </div>
              </FadeInWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
