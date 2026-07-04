import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const hasHF = !!process.env.HF_TOKEN;

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      deepseek: hasDeepSeek ? "configured" : "not_configured",
      huggingface: hasHF ? "configured" : "not_configured",
    },
  });
}
