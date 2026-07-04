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
          backgroundColor: "#FFFBEB",
          backgroundImage:
            "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#D97706",
            display: "flex",
            gap: 8,
          }}
        >
          AI表情包工厂
        </h1>
        <p style={{ fontSize: 32, color: "#78716C", marginTop: 16 }}>
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
                backgroundColor: "#F59E0B",
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
