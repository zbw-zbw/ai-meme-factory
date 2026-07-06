"use client";

import type { MemeStyle } from "@/types/meme";
import { ALL_STYLES, styleConfigs } from "@/lib/meme-styles";
import { StyleIcon, CheckIcon, PaletteIcon } from "@/components/Icons";

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
      <h2 className="flex items-center gap-2 text-[1.3rem] font-bold text-text-dark">
        <PaletteIcon className="h-5 w-5 text-primary-dark" />
        选择风格
        <span className="ml-2 text-[0.8rem] font-normal text-text-light">
          ({selected.length}/4)
        </span>
      </h2>
      <p className="mt-1 text-[0.85rem] text-text-muted">默认全选，也可以单独挑</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {ALL_STYLES.map((style) => {
          const config = styleConfigs[style];
          const isSelected = selected.includes(style);

          // When selected, use the style's own text color for readability
          const nameColor = isSelected ? config.textColor : undefined;
          const descColor = isSelected ? config.accentColor : undefined;

          return (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`relative flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                isSelected
                  ? `${bgMap[style]} ${accentMap[style]} shadow-sm -translate-y-0.5`
                  : "border-border-light glass-card hover:shadow-sm"
              } cursor-pointer`}
            >
              {/* Check mark */}
              {isSelected && (
                <span className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
              )}

              <StyleIcon
                name={config.icon}
                className="h-7 w-7 shrink-0"
                style={{ color: config.accentColor }}
              />
              <div className="ml-1 min-w-0">
                <p
                  className="truncate text-[0.9rem] font-bold"
                  style={nameColor ? { color: nameColor } : undefined}
                >
                  {config.name}
                </p>
                <p
                  className="truncate text-[0.7rem]"
                  style={descColor ? { color: descColor, opacity: 0.7 } : undefined}
                >
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
