import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FDF4F8",
          backgroundImage:
            "linear-gradient(135deg, #FDF4F8 0%, #FCE7F3 50%, #FBCFE8 100%)",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#DB2777",
            display: "flex",
            gap: 8,
          }}
        >
          AI表情包工厂
        </h1>
        <p style={{ fontSize: 32, color: "#6B4758", marginTop: 16 }}>
          你说话，AI画表情包
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["可爱", "毒舌", "摸鱼", "正经"].map((style) => (
            <div
              key={style}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                padding: "12px 32px",
                fontSize: 24,
                fontWeight: 600,
                color: "white",
                backgroundColor: "#EC4899",
              }}
            >
              {style}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
