"use client";

import { useRef, useEffect } from "react";
import type { MemeItem } from "@/types/meme";

interface MemeCanvasProps {
  item: MemeItem;
}

export default function MemeCanvas({ item }: MemeCanvasProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && item.dataUrl) {
      imgRef.current.src = item.dataUrl;
    }
  }, [item.dataUrl]);

  return (
    <img
      ref={imgRef}
      alt={`表情包 - ${item.caption}`}
      className="block w-full"
      style={{ aspectRatio: "1/1", objectFit: "cover" }}
    />
  );
}
