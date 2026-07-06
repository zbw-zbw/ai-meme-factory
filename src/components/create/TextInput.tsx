"use client";

import { useRef, useEffect, useState, type ChangeEvent } from "react";
import { PenIcon } from "@/components/Icons";
import { getRecentPrompts } from "@/lib/meme-renderer";

const quickExamples = [
  "这个需求能不能别改了",
  "今天不想上班",
  "这个bug不是我写的",
  "老板又在画饼",
  "下班！",
];

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  refreshTrigger?: number;
}

export default function TextInput({ value, onChange, refreshTrigger }: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  // Load recent prompts on mount and refresh when trigger changes
  useEffect(() => {
    setRecentPrompts(getRecentPrompts());
  }, [refreshTrigger]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (v.length <= 100) {
      onChange(v);
    }
  };

  return (
    <div>
      <h2 className="flex items-center gap-2 text-[1.5rem] font-bold text-text-dark">
        <PenIcon className="h-6 w-6 text-primary-dark" />
        说点什么吧
        <span className="ai-label">AI 生成</span>
      </h2>

      <div className="mt-3 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="输入你想表达的话，比如：这个需求能不能别改了..."
          className="w-full resize-none rounded-xl border-2 border-border-light glass-card px-4 py-3 text-[1rem] leading-relaxed text-text-dark outline-none transition-all duration-200 placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px]"
          maxLength={100}
        />
        <span className="absolute bottom-3 right-4 text-[0.8rem] text-text-light">
          {value.length}/100
        </span>
      </div>

      <p className="mt-1.5 text-[0.75rem] text-text-light">
        按 Ctrl+Enter 快速生成
      </p>

      <div className="mt-3">
        <p className="mb-2 text-[0.85rem] text-text-muted">试试这些</p>
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((example) => (
            <button
              key={example}
              onClick={() => onChange(example)}
              className="inline-block rounded-full border-2 border-border bg-card px-3 py-1.5 text-[0.85rem] font-medium text-text-dark transition-all duration-200 hover:border-primary hover:bg-card-hover cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {recentPrompts.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-[0.85rem] text-text-muted">最近使用</p>
          <div className="flex flex-wrap gap-2">
            {recentPrompts.map((prompt) => (
              <button key={prompt} onClick={() => onChange(prompt)}
                className="inline-block rounded-full border border-dashed border-border px-3 py-1.5 text-[0.85rem] text-text-muted transition-all duration-200 hover:border-primary hover:text-text-dark cursor-pointer bg-transparent">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
