"use client";

import type { MemeStyle } from "@/types/meme";
import { ALL_STYLES, styleConfigs } from "@/lib/meme-styles";

interface StyleSelectorProps {
  selected: MemeStyle[];
  onChange: (styles: MemeStyle[]) => void;
}

const bgMap: Record<MemeStyle, string> = {
  cute: "bg-cute-bg",
  savage: "bg-savage-bg",
  chill: "bg-chill-bg",
  formal: "bg-formal-bg",
};

const accentMap: Record<MemeStyle, string> = {
  cute: "border-cute-accent",
  savage: "border-savage-accent",
  chill: "border-chill-accent",
  formal: "border-formal-accent",
};

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  const toggleStyle = (style: MemeStyle) => {
    if (selected.includes(style)) {
      // Don't allow deselecting the last one
      if (selected.length > 1) {
        onChange(selected.filter((s) => s !== style));
      }
    } else {
      onChange([...selected, style]);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-[1.3rem] font-bold text-text-dark">选择风格 🎨</h2>
      <p className="mt-1 text-[0.85rem] text-text-muted">默认全选，也可以单独挑</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {ALL_STYLES.map((style) => {
          const config = styleConfigs[style];
          const isSelected = selected.includes(style);

          return (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`relative flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                isSelected
                  ? `${bgMap[style]} ${accentMap[style]} shadow-sm -translate-y-0.5`
                  : "border-border-light bg-card hover:shadow-sm"
              } cursor-pointer`}
            >
              {/* Check mark */}
              {isSelected && (
                <span className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.7rem] text-white">
                  ✓
                </span>
              )}

              <span className="text-[1.5rem]">{config.emoji}</span>
              <div className="ml-1">
                <p className={`text-[0.9rem] font-bold ${isSelected ? "text-text-dark" : "text-text-muted"}`}>
                  {config.name}
                </p>
                <p className={`text-[0.7rem] ${isSelected ? "text-text-muted" : "text-text-light"}`}>
                  {config.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
