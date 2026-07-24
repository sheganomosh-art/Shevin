import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    reply:
      "Mwalimu AI is coming soon. In the meantime, re-read the lesson content above — the answer is usually there.",
  });
}
