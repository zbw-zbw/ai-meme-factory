"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body style={{ backgroundColor: "#FDF4F8", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1F0A1A", marginBottom: "0.5rem" }}>
            应用出了点问题
          </h1>
          <p style={{ color: "#6B4758", marginBottom: "2rem" }}>
            请刷新页面或重试
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#EC4899",
              color: "white",
              fontWeight: "bold",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
