// Notification helpers: Telegram Bot + Gmail
// All env vars required in Vercel and .env.local:
//   TELEGRAM_BOT_TOKEN   — from @BotFather (new token after revoke!)
//   TELEGRAM_CHAT_ID     — 544821565
//   GMAIL_APP_PASSWORD   — 16-char App Password from Google Account settings
//   NOTIFY_EMAIL         — nimmmeinauto@gmail.com

import nodemailer from "nodemailer";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "544821565";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "nimmmeinauto@gmail.com";

// ──────────────────────────────────────────────
// Telegram
// ──────────────────────────────────────────────
export async function sendTelegram(text: string): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN) return; // skip if not configured
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("[notify] Telegram error:", err);
  }
}

// ──────────────────────────────────────────────
// Gmail via SMTP App Password
// ──────────────────────────────────────────────
function getMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: NOTIFY_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendEmail(subject: string, html: string): Promise<void> {
  if (!process.env.GMAIL_APP_PASSWORD) return; // skip if not configured
  try {
    const mailer = getMailer();
    await mailer.sendMail({
      from: `"NimmMeinAuto" <${NOTIFY_EMAIL}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("[notify] Gmail error:", err);
  }
}

// ──────────────────────────────────────────────
// Pre-built notification payloads
// ──────────────────────────────────────────────

export async function notifyNewListing(data: {
  make: string;
  model: string;
  year: number;
  mileage: number;
  estimated_value_cents: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  postal_code: string;
  listingId: string;
}) {
  const value = `€ ${(data.estimated_value_cents / 100).toLocaleString("de-AT")}`;
  const link = `https://nimmmeinauto.at/bewertung?id=${data.listingId}`;

  const tg = [
    `🚗 <b>Neues Inserat</b>`,
    ``,
    `<b>${data.make} ${data.model} (${data.year})</b>`,
    `${data.mileage.toLocaleString("de-AT")} km · Schätzwert ${value}`,
    ``,
    `👤 ${data.first_name} ${data.last_name}`,
    `📞 ${data.phone}`,
    `📧 ${data.email}`,
    `📍 PLZ ${data.postal_code}`,
    ``,
    `🔗 <a href="${link}">Inserat ansehen</a>`,
  ].join("\n");

  const html = `
    <h2>🚗 Neues Inserat</h2>
    <p><strong>${data.make} ${data.model} (${data.year})</strong><br>
    ${data.mileage.toLocaleString("de-AT")} km · Schätzwert ${value}</p>
    <p>
      <strong>Einreicher:</strong> ${data.first_name} ${data.last_name}<br>
      <strong>Telefon:</strong> ${data.phone}<br>
      <strong>E-Mail:</strong> ${data.email}<br>
      <strong>PLZ:</strong> ${data.postal_code}
    </p>
    <p><a href="${link}">→ Inserat in der Admin-Konsole öffnen</a></p>
  `;

  await Promise.all([
    sendTelegram(tg),
    sendEmail(`🚗 Neues Inserat: ${data.make} ${data.model} (${data.year})`, html),
  ]);
}

export async function notifyNewOffer(data: {
  dealer_name: string;
  dealer_email?: string;
  amount_cents: number;
  listing_id: string;
  message?: string;
}) {
  const amount = `€ ${(data.amount_cents / 100).toLocaleString("de-AT")}`;
  const link = `https://nimmmeinauto.at/bewertung?id=${data.listing_id}`;

  const tg = [
    `💰 <b>Neues Händlerangebot</b>`,
    ``,
    `Händler: <b>${data.dealer_name}</b>`,
    `Betrag: <b>${amount}</b>`,
    data.dealer_email ? `E-Mail: ${data.dealer_email}` : "",
    data.message ? `Nachricht: „${data.message}"` : "",
    ``,
    `🔗 <a href="${link}">Inserat ansehen</a>`,
  ].filter(Boolean).join("\n");

  const html = `
    <h2>💰 Neues Händlerangebot</h2>
    <p><strong>Händler:</strong> ${data.dealer_name}<br>
    ${data.dealer_email ? `<strong>E-Mail:</strong> ${data.dealer_email}<br>` : ""}
    <strong>Betrag:</strong> ${amount}</p>
    ${data.message ? `<p><em>„${data.message}"</em></p>` : ""}
    <p><a href="${link}">→ Inserat ansehen</a></p>
  `;

  await Promise.all([
    sendTelegram(tg),
    sendEmail(`💰 Neues Angebot von ${data.dealer_name}: ${amount}`, html),
  ]);
}

export async function notifyNewMessage(data: {
  sender_name: string;
  body: string;
  thread_id: string;
}) {
  const link = `https://nimmmeinauto.at/admin/chat/${data.thread_id}`;

  const tg = [
    `💬 <b>Neue Nachricht</b>`,
    ``,
    `Von: ${data.sender_name}`,
    `„${data.body.slice(0, 200)}${data.body.length > 200 ? "…" : ""}"`,
    ``,
    `🔗 <a href="${link}">Im Admin öffnen</a>`,
  ].join("\n");

  const html = `
    <h2>💬 Neue Kundennachricht</h2>
    <p><strong>Von:</strong> ${data.sender_name}</p>
    <blockquote>${data.body}</blockquote>
    <p><a href="${link}">→ Thread in Admin-Konsole öffnen</a></p>
  `;

  await Promise.all([
    sendTelegram(tg),
    sendEmail(`💬 Neue Nachricht von ${data.sender_name}`, html),
  ]);
}
