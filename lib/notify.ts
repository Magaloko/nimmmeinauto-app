// Notification helpers: Telegram Bot + Gmail
// All env vars required in Vercel and .env.local:
//   TELEGRAM_BOT_TOKEN   — from @BotFather
//   TELEGRAM_CHAT_ID     — 544821565
//   GMAIL_APP_PASSWORD   — 16-char App Password from Google Account settings
//   NOTIFY_EMAIL         — nimmmeinauto@gmail.com

import nodemailer from "nodemailer";
import { newListingEmail, newOfferEmail, newMessageEmail } from "./email-templates";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "544821565";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "nimmmeinauto@gmail.com";

// ──────────────────────────────────────────────
// Telegram
// ──────────────────────────────────────────────
export async function sendTelegram(text: string): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
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
    auth: { user: NOTIFY_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

export async function sendEmail(subject: string, html: string): Promise<void> {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  try {
    await getMailer().sendMail({
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
  photo_urls?: string[];
}) {
  const value = `€ ${(data.estimated_value_cents / 100).toLocaleString("de-AT")}`;
  const km = data.mileage.toLocaleString("de-AT");
  const link = `https://nimmmeinauto.at/bewertung?id=${data.listingId}`;

  const tg = [
    `🚗 <b>Neues Inserat</b>`,
    ``,
    `<b>${data.make} ${data.model} (${data.year})</b>`,
    `${km} km · Schätzwert ${value}`,
    ``,
    `👤 ${data.first_name} ${data.last_name}`,
    `📞 ${data.phone}`,
    `📧 ${data.email}`,
    `📍 PLZ ${data.postal_code}`,
    ``,
    `🔗 <a href="${link}">Inserat ansehen</a>`,
  ].join("\n");

  await Promise.all([
    sendTelegram(tg),
    sendEmail(
      `🚗 Neues Inserat: ${data.make} ${data.model} (${data.year})`,
      newListingEmail(data)
    ),
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

  await Promise.all([
    sendTelegram(tg),
    sendEmail(
      `💰 Neues Angebot von ${data.dealer_name}: ${amount}`,
      newOfferEmail(data)
    ),
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

  await Promise.all([
    sendTelegram(tg),
    sendEmail(
      `💬 Neue Nachricht von ${data.sender_name}`,
      newMessageEmail(data)
    ),
  ]);
}
