"use client";

import type { MemeItem } from "@/types/meme";

interface MemeCanvasProps {
  item: MemeItem;
}

export default function MemeCanvas({ item }: MemeCanvasProps) {
  return (
    <img
      src={item.dataUrl}
      alt={`表情包 - ${item.caption}`}
      className="block w-full"
      style={{ aspectRatio: "1/1", objectFit: "cover" }}
    />
  );
}
