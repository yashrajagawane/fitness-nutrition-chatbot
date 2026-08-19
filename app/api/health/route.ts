import { NextResponse } from "next/server";
import { logApiEvent } from "@/app/lib/logger";

export const dynamic = "force-dynamic";

export function GET() {
  const requestId = crypto.randomUUID();
  logApiEvent("health_check", { requestId });
  return NextResponse.json(
    {
      status: "ok",
      service: "ai-fitness-coach",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } }
  );
}
