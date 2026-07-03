"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ---- Shared single IntersectionObserver for all FadeInWrapper instances ---- */
const observerMap = new WeakMap<Element, true>();

let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(threshold: number): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerMap.delete(entry.target);
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );
  }
  return sharedObserver;
}

/* Clean up on module unload (Safeguards against HMR) */
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    sharedObserver?.disconnect();
    sharedObserver = null;
  });
}

export default function FadeInWrapper({
  children,
  className = "",
  threshold = 0.1,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Already visible ( SSR hydration or fast load ) */
    if (el.classList.contains("visible")) return;

    const observer = getSharedObserver(threshold);
    observerMap.set(el, true);
    observer.observe(el);

    return () => {
      if (observerMap.has(el)) {
        observerMap.delete(el);
        observer.unobserve(el);
      }
    };
  }, [threshold]);

  return <div ref={ref} className={`fade-in ${className}`}>{children}</div>;
}
