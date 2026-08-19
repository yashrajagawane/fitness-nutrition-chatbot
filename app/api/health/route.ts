import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "ai-fitness-coach", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
