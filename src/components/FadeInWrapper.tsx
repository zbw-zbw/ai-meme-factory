"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ---- Shared IntersectionObservers keyed by threshold ---- */
const observerMap = new WeakMap<Element, true>();
const observerCache = new Map<number, IntersectionObserver>();

function getSharedObserver(threshold: number): IntersectionObserver {
  let observer = observerCache.get(threshold);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observerMap.delete(entry.target);
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );
    observerCache.set(threshold, observer);
  }
  return observer;
}

/* Clean up on module unload (Safeguards against HMR) */
function cleanupFadeInObservers() {
  for (const obs of observerCache.values()) {
    obs.disconnect();
  }
  observerCache.clear();
}

if (
  typeof window !== "undefined" &&
  !(window as Window & { __fadeInCleanupRegistered?: boolean }).__fadeInCleanupRegistered
) {
  (window as Window & { __fadeInCleanupRegistered?: boolean }).__fadeInCleanupRegistered = true;
  window.addEventListener("beforeunload", cleanupFadeInObservers);
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
