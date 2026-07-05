"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

let nextId = 0;

const typeStyles: Record<ToastType, string> = {
  success: "bg-primary-dark text-white",
  error: "bg-savage-accent text-white",
  info: "bg-primary text-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    const duration = type === "error" ? 4000 : 2500;

    // Max stack of 3: if there are already more than 2, drop the oldest
    setToasts((prev) => {
      const next = prev.length > 2 ? prev.slice(1) : prev;
      return [...next, { id, message, type }];
    });

    // Auto-dismiss (error: 4s, others: 2.5s)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container - fixed at bottom center, z-[10000] */}
      <div className="fixed bottom-6 left-1/2 z-[10000] flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const duration = toast.type === "error" ? 4000 : 2500;
          const outDelay = (duration - 300) / 1000;
          return (
            <div
              key={toast.id}
              onClick={() => dismiss(toast.id)}
              className={`pointer-events-auto cursor-pointer rounded-lg px-5 py-3 text-sm font-medium shadow-lg ${typeStyles[toast.type]}`}
              style={{
                animation: `toast-in 0.3s ease-out both, toast-out 0.3s ease-in ${outDelay}s both`,
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
