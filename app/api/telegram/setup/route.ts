import { NextRequest, NextResponse } from "next/server";

/**
 * One-time webhook registration.
 * Call this ONCE after deploying:
 *   GET https://nimmmeinauto.at/api/telegram/setup?secret=<TELEGRAM_SETUP_SECRET>
 *
 * Set TELEGRAM_SETUP_SECRET in Vercel env vars (any random string you choose).
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.TELEGRAM_SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = `${req.nextUrl.origin}/api/telegram/webhook`;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl }),
  });

  const result = await res.json();
  return NextResponse.json({ webhookUrl, telegram: result });
}
