import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "Mwalimu is not configured yet. Add your ANTHROPIC_API_KEY to get started." }, { status: 200 });
  }

  try {
    const { messages, lessonId } = await req.json();

    // Lesson context map — key terms and excerpt per lesson
    const LESSON_CONTEXT: Record<string, { title: string; keyTerms: string }> = {
      "what-is-nse":       { title: "What is the NSE?",                  keyTerms: "NSE, CMA, listed company, shares, stockbroker" },
      "cds-accounts":      { title: "CDS Accounts & Licensed Brokers",   keyTerms: "CDS account, CDSC, licensed broker, KYC, scams" },
      "reading-listings":  { title: "Reading a Stock Listing",           keyTerms: "share price, volume, market cap, 52-week range, P/E ratio" },
      "price-movements":   { title: "Understanding Price Movements",     keyTerms: "supply and demand, volatility, long-term investing, noise" },
      "first-order":       { title: "Your First Buy Order",              keyTerms: "buy order, settlement, T+3, broker commission, M-Pesa" },
      "after-investing":   { title: "After You Invest",                  keyTerms: "CDS statement, dividend, portfolio, panic selling" },
    };

    const ctx = LESSON_CONTEXT[lessonId] ?? { title: "NSE Investing", keyTerms: "NSE, shares, investing" };

    const systemPrompt = `You are Mwalimu, a patient NSE investing tutor for Kenyan beginners.

The user is studying: "${ctx.title}"
Key concepts in this lesson: ${ctx.keyTerms}

Your character:
- Calm, clear, and warm — like a trusted teacher
- Deeply familiar with Kenyan investing: NSE, CDS accounts, CDSC, licensed brokers, M-Pesa, KES
- You use Swahili naturally when it fits: "hisa" (shares), "soko" (market), "pesa" (money)
- You acknowledge Kenya's history with investment scams matter-of-factly
- You never recommend specific stocks or act as a financial advisor

Rules:
- Keep responses under 150 words
- Use KES, not USD
- Never start with "Great question!" or sycophantic openers
- Never recommend buying or selling specific securities
- If asked about forex, crypto, or WhatsApp investment groups: acknowledge and redirect honestly
- For investment decisions: refer to a licensed NSE broker (verify at nse.co.ke)
- If asked anything unrelated to investing or the NSE: politely redirect`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.slice(-6),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", err);
      return NextResponse.json({ reply: "Mwalimu is unavailable right now. Try again in a moment." });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "No response received.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Mwalimu route error:", err);
    return NextResponse.json({ reply: "No connection. Check your internet and try again." });
  }
}
