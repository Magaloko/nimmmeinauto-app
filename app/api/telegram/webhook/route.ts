import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyNewListing } from "@/lib/notify";

// ── Supabase ─────────────────────────────────────────────────────────────────

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Admin detection ───────────────────────────────────────────────────────────

const ADMIN_CHAT_ID = parseInt(process.env.TELEGRAM_CHAT_ID ?? "544821565", 10);
const isAdmin = (chatId: number) => chatId === ADMIN_CHAT_ID;

// ── Telegram API helpers ──────────────────────────────────────────────────────

const TG = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

type ReplyMarkup =
  | { keyboard: { text: string }[][]; one_time_keyboard: true; resize_keyboard: true }
  | { remove_keyboard: true }
  | { inline_keyboard: { text: string; callback_data?: string; url?: string }[][] };

function replyKeyboard(rows: string[][]): ReplyMarkup {
  return { keyboard: rows.map((r) => r.map((text) => ({ text }))), one_time_keyboard: true, resize_keyboard: true };
}

function inlineKeyboard(rows: { text: string; callback_data?: string; url?: string }[][]): ReplyMarkup {
  return { inline_keyboard: rows };
}

const noKeyboard: ReplyMarkup = { remove_keyboard: true };

async function tgFetch(method: string, body: Record<string, unknown>) {
  return fetch(`${TG}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function send(chatId: number, text: string, markup?: ReplyMarkup) {
  await tgFetch("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", reply_markup: markup ?? noKeyboard });
}

async function editMsg(chatId: number, messageId: number, text: string, markup?: ReplyMarkup) {
  await tgFetch("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup: markup });
}

async function answerCb(callbackId: string, text?: string) {
  await tgFetch("answerCallbackQuery", { callback_query_id: callbackId, text });
}

// ── Admin inline panel ────────────────────────────────────────────────────────

const ADMIN_MENU_TEXT = `🛠 <b>Admin-Panel — NimmMeinAuto</b>\n\nWähle eine Aktion:`;

const adminMenu = () =>
  inlineKeyboard([
    [{ text: "📊 Statistiken", callback_data: "stats" }, { text: "📋 Letzte Inserate", callback_data: "liste" }],
    [{ text: "🔓 Offene Inserate", callback_data: "offen" }, { text: "💬 Offene Chats", callback_data: "chats" }],
  ]);

const backBtn = [{ text: "← Zurück", callback_data: "menu" }];

async function handleAdminCallback(
  callbackId: string,
  data: string,
  chatId: number,
  messageId: number
) {
  const supabase = db();

  if (data === "menu") {
    await answerCb(callbackId);
    await editMsg(chatId, messageId, ADMIN_MENU_TEXT, adminMenu());
    return;
  }

  if (data === "stats") {
    await answerCb(callbackId, "Lade Statistiken…");
    const [
      { count: listingCount },
      { count: offerCount },
      { count: openCount },
      { data: valueData },
    ] = await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("offers").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("listings").select("estimated_value_cents"),
    ]);

    const total = (valueData ?? []).reduce(
      (s: number, r: { estimated_value_cents: number | null }) => s + (r.estimated_value_cents ?? 0), 0
    );
    const totalEur = (total / 100).toLocaleString("de-AT");

    const text =
      `📊 <b>Statistiken</b>\n\n` +
      `🚗 Inserate gesamt: <b>${listingCount ?? 0}</b>\n` +
      `🔓 Offen: <b>${openCount ?? 0}</b>\n` +
      `💰 Angebote: <b>${offerCount ?? 0}</b>\n` +
      `📈 Gesamtwert: <b>€ ${totalEur}</b>`;

    await editMsg(chatId, messageId, text, inlineKeyboard([[...backBtn]]));
    return;
  }

  if (data === "liste") {
    await answerCb(callbackId, "Lade Inserate…");
    const { data: rows } = await supabase
      .from("listings")
      .select("id, make, model, year, mileage, estimated_value_cents, first_name, last_name, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!rows?.length) {
      await editMsg(chatId, messageId, "📋 Noch keine Inserate.", inlineKeyboard([[...backBtn]]));
      return;
    }

    const lines = rows.map((r, i) => {
      const eur = r.estimated_value_cents ? `€ ${(r.estimated_value_cents / 100).toLocaleString("de-AT")}` : "–";
      const age = timeSince(r.created_at);
      const status = r.status === "open" ? "🔓" : "🔒";
      return `${i + 1}. ${status} <b>${r.make} ${r.model} ${r.year}</b>\n   👤 ${r.first_name} ${r.last_name} · 💰 ${eur}\n   🕒 ${age}`;
    });

    const viewBtns = rows.map((r) => ({ text: `🔗 ${r.make} ${r.model}`, url: `https://nimmmeinauto.at/bewertung?id=${r.id}` }));

    await editMsg(
      chatId, messageId,
      `📋 <b>Letzte 5 Inserate</b>\n\n${lines.join("\n\n")}`,
      inlineKeyboard([viewBtns.slice(0, 2), viewBtns.slice(2, 4), viewBtns.slice(4), backBtn])
    );
    return;
  }

  if (data === "offen") {
    await answerCb(callbackId, "Lade offene Inserate…");
    const { data: rows } = await supabase
      .from("listings")
      .select("id, make, model, year, estimated_value_cents, first_name, phone, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(8);

    if (!rows?.length) {
      await editMsg(chatId, messageId, "✅ Keine offenen Inserate.", inlineKeyboard([[...backBtn]]));
      return;
    }

    const lines = rows.map((r, i) => {
      const eur = r.estimated_value_cents ? `€ ${(r.estimated_value_cents / 100).toLocaleString("de-AT")}` : "–";
      return `${i + 1}. <b>${r.make} ${r.model} ${r.year}</b>\n   👤 ${r.first_name} · 📞 ${r.phone}\n   💰 ${eur} · 🕒 ${timeSince(r.created_at)}`;
    });

    const linkBtns = rows.map((r) => ({ text: `${r.make} ${r.model}`, url: `https://nimmmeinauto.at/admin/listings` }));

    await editMsg(
      chatId, messageId,
      `🔓 <b>Offene Inserate (${rows.length})</b>\n\n${lines.join("\n\n")}`,
      inlineKeyboard([
        [{ text: "→ Admin-Konsole öffnen", url: "https://nimmmeinauto.at/admin/listings" }],
        backBtn,
      ])
    );
    return;
  }

  if (data === "chats") {
    await answerCb(callbackId, "Lade Chats…");
    const { data: rows } = await supabase
      .from("threads")
      .select("id, subject, status, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(6);

    if (!rows?.length) {
      await editMsg(chatId, messageId, "💬 Keine offenen Chats.", inlineKeyboard([[...backBtn]]));
      return;
    }

    const lines = rows.map((r, i) =>
      `${i + 1}. 💬 <b>${r.subject || "Kein Betreff"}</b>\n   🕒 ${timeSince(r.created_at)}`
    );

    await editMsg(
      chatId, messageId,
      `💬 <b>Offene Chats (${rows.length})</b>\n\n${lines.join("\n\n")}`,
      inlineKeyboard([
        [{ text: "→ Chat-Konsole öffnen", url: "https://nimmmeinauto.at/admin/chat" }],
        backBtn,
      ])
    );
    return;
  }

  await answerCb(callbackId);
}

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `vor ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h}h`;
  return `vor ${Math.floor(h / 24)}d`;
}

// ── User conversation steps ───────────────────────────────────────────────────

interface Step {
  prompt: string;
  markup?: ReplyMarkup;
  validate?: (v: string) => string | null;
  transform?: (v: string) => string;
}

const STEPS: Record<string, Step> = {
  make: { prompt: "🚗 <b>Schritt 1 / 13 — Marke</b>\n\nWelche Marke hat dein Auto?\n<i>z.B. VW, BMW, Audi, Mercedes …</i>" },
  model: { prompt: "📋 <b>Schritt 2 / 13 — Modell</b>\n\nWelches Modell ist es?\n<i>z.B. Golf, 3er, A4 …</i>" },
  year: {
    prompt: "📅 <b>Schritt 3 / 13 — Baujahr</b>\n\nIn welchem Jahr wurde es erstmals zugelassen?\n<i>z.B. 2019</i>",
    validate: (v) => {
      const y = parseInt(v), now = new Date().getFullYear();
      return isNaN(y) || y < 1990 || y > now ? `❌ Bitte ein gültiges Jahr (1990 – ${now}).` : null;
    },
  },
  mileage: {
    prompt: "🔢 <b>Schritt 4 / 13 — Kilometerstand</b>\n\nWie viele Kilometer hat dein Auto?\n<i>z.B. 85000</i>",
    transform: (v) => v.replace(/[.\s]/g, "").replace(",", ""),
    validate: (v) => {
      const km = parseInt(v.replace(/[.\s]/g, "").replace(",", ""));
      return isNaN(km) || km < 0 || km > 2_000_000 ? "❌ Bitte eine gültige Kilometeranzahl eingeben." : null;
    },
  },
  fuel: {
    prompt: "⛽ <b>Schritt 5 / 13 — Kraftstoff</b>",
    markup: replyKeyboard([["Benzin", "Diesel"], ["Elektro", "Hybrid"]]),
    validate: (v) => ["Benzin", "Diesel", "Elektro", "Hybrid"].includes(v) ? null : "❌ Bitte eine Option aus der Tastatur wählen.",
    transform: (v) => v.toLowerCase(),
  },
  transmission: {
    prompt: "⚙️ <b>Schritt 6 / 13 — Getriebe</b>",
    markup: replyKeyboard([["Automatik", "Manuell"]]),
    validate: (v) => ["Automatik", "Manuell"].includes(v) ? null : "❌ Bitte Automatik oder Manuell wählen.",
    transform: (v) => v.toLowerCase(),
  },
  condition: {
    prompt: "🔍 <b>Schritt 7 / 13 — Zustand</b>",
    markup: replyKeyboard([["Sehr gut", "Gut"], ["Gebraucht", "Defekt"]]),
    validate: (v) => ["Sehr gut", "Gut", "Gebraucht", "Defekt"].includes(v) ? null : "❌ Bitte einen Zustand aus der Tastatur wählen.",
    transform: (v) => v.toLowerCase().replace(" ", "_"),
  },
  accident: {
    prompt: "🚨 <b>Schritt 8 / 13 — Unfallschaden</b>\n\nHat das Fahrzeug einen Unfallschaden?",
    markup: replyKeyboard([["Nein", "Ja"]]),
    validate: (v) => ["Ja", "Nein"].includes(v) ? null : "❌ Bitte Ja oder Nein wählen.",
    transform: (v) => (v === "Ja" ? "true" : "false"),
  },
  first_name: { prompt: "👤 <b>Schritt 9 / 13 — Vorname</b>" },
  last_name: { prompt: "👤 <b>Schritt 10 / 13 — Nachname</b>" },
  phone: {
    prompt: "📞 <b>Schritt 11 / 13 — Telefon</b>\n\n<i>z.B. +43 650 1234567</i>",
    validate: (v) => v.replace(/\s/g, "").length >= 7 ? null : "❌ Bitte eine gültige Telefonnummer.",
  },
  email: {
    prompt: "📧 <b>Schritt 12 / 13 — E-Mail</b>",
    validate: (v) => v.includes("@") && v.includes(".") ? null : "❌ Bitte eine gültige E-Mail-Adresse.",
    transform: (v) => v.toLowerCase().trim(),
  },
  postal_code: {
    prompt: "📍 <b>Schritt 13 / 13 — Postleitzahl</b>\n\n<i>4-stellige österreichische PLZ</i>",
    validate: (v) => /^\d{4}$/.test(v.trim()) ? null : "❌ Österreichische PLZ hat 4 Ziffern (z.B. 1010).",
    transform: (v) => v.trim(),
  },
};

const STEP_ORDER = [
  "make", "model", "year", "mileage", "fuel", "transmission",
  "condition", "accident", "first_name", "last_name", "phone", "email", "postal_code",
];

// ── Value estimator ───────────────────────────────────────────────────────────

const BRAND_MULT: Record<string, number> = {
  bmw: 1.30, mercedes: 1.30, audi: 1.25, porsche: 1.60, tesla: 1.40,
  volkswagen: 1.00, vw: 1.00, volvo: 1.10, toyota: 1.10, honda: 1.05,
  mazda: 0.95, skoda: 0.92, seat: 0.88, hyundai: 0.90, kia: 0.90,
  ford: 0.88, opel: 0.85, renault: 0.85, peugeot: 0.83, fiat: 0.80,
  dacia: 0.72, mitsubishi: 0.85, nissan: 0.88, suzuki: 0.82,
};

function estimateCents(make: string, year: number, mileage: number, condition: string): number {
  const mult = BRAND_MULT[make.toLowerCase()] ?? 1.0;
  const base = 18_000 * mult;
  const age = new Date().getFullYear() - year;
  const cond = ({ sehr_gut: 1.0, gut: 0.88, gebraucht: 0.72, defekt: 0.45 } as Record<string, number>)[condition] ?? 0.8;
  const eur = Math.max(300, Math.round(((base - age * 1_400 - mileage * 0.055) * cond) / 100) * 100);
  return eur * 100;
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // ── Inline button press (callback_query) ──────────────────
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId: number = cb.message.chat.id;
      const messageId: number = cb.message.message_id;

      if (isAdmin(chatId)) {
        await handleAdminCallback(cb.id, cb.data ?? "", chatId, messageId);
      } else {
        await answerCb(cb.id, "Diese Aktion ist nicht verfügbar.");
      }
      return NextResponse.json({ ok: true });
    }

    // ── Text message ──────────────────────────────────────────
    const msg = update.message;
    if (!msg?.text) return NextResponse.json({ ok: true });

    const chatId: number = msg.chat.id;
    const text: string = msg.text.trim();

    // ── ADMIN flow ────────────────────────────────────────────
    if (isAdmin(chatId)) {
      await send(chatId, ADMIN_MENU_TEXT, adminMenu());
      return NextResponse.json({ ok: true });
    }

    // ── USER flow ─────────────────────────────────────────────
    const supabase = db();

    if (text === "/start" || text === "/neu") {
      await supabase.from("telegram_sessions").upsert({
        chat_id: chatId, step: "make", data: {}, updated_at: new Date().toISOString(),
      });
      await send(
        chatId,
        `👋 <b>Willkommen bei NimmMeinAuto!</b>\n\nIch führe dich kostenlos durch die Fahrzeugbewertung.\n\n✅ Unverbindlich\n✅ Kein Risiko\n✅ Direktes Angebot von uns\n\nTippe /abbrechen um zu stoppen.\n\n─────────────────\n${STEPS.make.prompt}`,
        STEPS.make.markup
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/abbrechen") {
      await supabase.from("telegram_sessions").delete().eq("chat_id", chatId);
      await send(chatId, "❌ Anfrage abgebrochen. Sende /start um neu zu beginnen.");
      return NextResponse.json({ ok: true });
    }

    const { data: session } = await supabase
      .from("telegram_sessions").select("step, data").eq("chat_id", chatId).single();

    if (!session) {
      await send(chatId, "👋 Sende /start um eine kostenlose Fahrzeugbewertung zu starten!");
      return NextResponse.json({ ok: true });
    }

    const currentStep = session.step as string;
    const data = session.data as Record<string, string>;
    const stepCfg = STEPS[currentStep];

    const err = stepCfg?.validate?.(text) ?? null;
    if (err) {
      await send(chatId, `${err}\n\n${stepCfg.prompt}`, stepCfg.markup);
      return NextResponse.json({ ok: true });
    }

    const stored = stepCfg?.transform ? stepCfg.transform(text) : text;
    const newData = { ...data, [currentStep]: stored };
    const nextStep = STEP_ORDER[STEP_ORDER.indexOf(currentStep) + 1];

    if (nextStep) {
      await supabase.from("telegram_sessions")
        .update({ step: nextStep, data: newData, updated_at: new Date().toISOString() })
        .eq("chat_id", chatId);
      const next = STEPS[nextStep];
      await send(chatId, next.prompt, next.markup);
      return NextResponse.json({ ok: true });
    }

    // ── Submit listing ─────────────────────────────────────────
    const d = newData;
    const year = parseInt(d.year);
    const mileage = parseInt(d.mileage);
    const estimated_value_cents = estimateCents(d.make, year, mileage, d.condition);

    const { data: listing, error: dbErr } = await supabase
      .from("listings")
      .insert({
        make: d.make, model: d.model, year, mileage,
        fuel: d.fuel, transmission: d.transmission, condition: d.condition,
        has_accident_history: d.accident === "true",
        first_name: d.first_name, last_name: d.last_name,
        phone: d.phone, email: d.email, postal_code: d.postal_code,
        estimated_value_cents,
      })
      .select("id").single();

    if (dbErr || !listing) {
      await send(chatId, "❌ Fehler beim Speichern. Bitte versuche es später erneut.");
      return NextResponse.json({ ok: true });
    }

    await supabase.from("telegram_sessions").delete().eq("chat_id", chatId);

    notifyNewListing({
      make: d.make, model: d.model, year, mileage,
      estimated_value_cents,
      first_name: d.first_name, last_name: d.last_name,
      phone: d.phone, email: d.email, postal_code: d.postal_code,
      listingId: listing.id,
    }).catch(console.error);

    const valueStr = `€ ${(estimated_value_cents / 100).toLocaleString("de-AT")}`;
    await send(
      chatId,
      `✅ <b>Erfolgreich eingereicht!</b>\n\n` +
      `🚗 ${d.make} ${d.model} (${year})\n` +
      `📊 Schätzwert: <b>${valueStr}</b>\n\n` +
      `Wir melden uns bald bei dir:\n📞 ${d.phone}\n📧 ${d.email}\n\n` +
      `🔗 <a href="https://nimmmeinauto.at/bewertung?id=${listing.id}">Inserat ansehen</a>\n\n` +
      `Weitere Anfrage? /neu`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[tg-bot]", e);
    return NextResponse.json({ ok: true });
  }
}
