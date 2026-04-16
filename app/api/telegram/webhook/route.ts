import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyNewListing } from "@/lib/notify";

// ── Supabase service client ──────────────────────────────────────────────────

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Telegram helpers ─────────────────────────────────────────────────────────

const TG = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

type ReplyMarkup =
  | { keyboard: { text: string }[][]; one_time_keyboard: true; resize_keyboard: true }
  | { remove_keyboard: true };

function keyboard(rows: string[][]): ReplyMarkup {
  return {
    keyboard: rows.map((r) => r.map((text) => ({ text }))),
    one_time_keyboard: true,
    resize_keyboard: true,
  };
}

const noKeyboard: ReplyMarkup = { remove_keyboard: true };

async function send(chatId: number, text: string, markup?: ReplyMarkup) {
  await fetch(`${TG}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: markup ?? noKeyboard,
    }),
  });
}

// ── Conversation steps ───────────────────────────────────────────────────────

interface Step {
  prompt: string;
  markup?: ReplyMarkup;
  validate?: (v: string) => string | null; // returns error message or null
  transform?: (v: string) => string;       // normalise before storing
}

const STEPS: Record<string, Step> = {
  make: {
    prompt: "🚗 <b>Schritt 1 / 13 — Marke</b>\n\nWelche Marke hat dein Auto?\n<i>z.B. VW, BMW, Audi, Mercedes, Toyota …</i>",
  },
  model: {
    prompt: "📋 <b>Schritt 2 / 13 — Modell</b>\n\nWelches Modell ist es?\n<i>z.B. Golf, 3er, A4, C-Klasse …</i>",
  },
  year: {
    prompt: "📅 <b>Schritt 3 / 13 — Baujahr</b>\n\nIn welchem Jahr wurde es erstmals zugelassen?\n<i>z.B. 2019</i>",
    validate(v) {
      const y = parseInt(v);
      const now = new Date().getFullYear();
      if (isNaN(y) || y < 1990 || y > now)
        return `❌ Bitte ein gültiges Jahr eingeben (1990 – ${now}).`;
      return null;
    },
  },
  mileage: {
    prompt: "🔢 <b>Schritt 4 / 13 — Kilometerstand</b>\n\nWie viele Kilometer hat dein Auto?\n<i>z.B. 85000</i>",
    transform: (v) => v.replace(/[.\s]/g, "").replace(",", ""),
    validate(v) {
      const km = parseInt(v.replace(/[.\s]/g, "").replace(",", ""));
      if (isNaN(km) || km < 0 || km > 2_000_000)
        return "❌ Bitte eine gültige Kilometeranzahl eingeben (z.B. 85000).";
      return null;
    },
  },
  fuel: {
    prompt: "⛽ <b>Schritt 5 / 13 — Kraftstoff</b>\n\nWelchen Kraftstoff verwendet dein Auto?",
    markup: keyboard([["Benzin", "Diesel"], ["Elektro", "Hybrid"]]),
    validate: (v) =>
      ["Benzin", "Diesel", "Elektro", "Hybrid"].includes(v)
        ? null
        : "❌ Bitte eine der Optionen aus der Tastatur wählen.",
    transform: (v) => v.toLowerCase(),
  },
  transmission: {
    prompt: "⚙️ <b>Schritt 6 / 13 — Getriebe</b>\n\nWelches Getriebe hat dein Auto?",
    markup: keyboard([["Automatik", "Manuell"]]),
    validate: (v) =>
      ["Automatik", "Manuell"].includes(v)
        ? null
        : "❌ Bitte Automatik oder Manuell wählen.",
    transform: (v) => v.toLowerCase(),
  },
  condition: {
    prompt: "🔍 <b>Schritt 7 / 13 — Zustand</b>\n\nIn welchem Zustand befindet sich dein Auto?",
    markup: keyboard([["Sehr gut", "Gut"], ["Gebraucht", "Defekt"]]),
    validate: (v) =>
      ["Sehr gut", "Gut", "Gebraucht", "Defekt"].includes(v)
        ? null
        : "❌ Bitte einen der Zustände aus der Tastatur wählen.",
    transform: (v) => v.toLowerCase().replace(" ", "_"),
  },
  accident: {
    prompt: "🚨 <b>Schritt 8 / 13 — Unfallschaden</b>\n\nHat das Fahrzeug einen Unfallschaden?",
    markup: keyboard([["Nein", "Ja"]]),
    validate: (v) =>
      ["Ja", "Nein"].includes(v) ? null : "❌ Bitte Ja oder Nein wählen.",
    transform: (v) => (v === "Ja" ? "true" : "false"),
  },
  first_name: {
    prompt: "👤 <b>Schritt 9 / 13 — Vorname</b>\n\nWie lautet dein Vorname?",
  },
  last_name: {
    prompt: "👤 <b>Schritt 10 / 13 — Nachname</b>\n\nWie lautet dein Nachname?",
  },
  phone: {
    prompt: "📞 <b>Schritt 11 / 13 — Telefon</b>\n\nDeine Telefonnummer für Rückfragen?\n<i>z.B. +43 650 1234567</i>",
    validate: (v) =>
      v.replace(/\s/g, "").length >= 7
        ? null
        : "❌ Bitte eine gültige Telefonnummer eingeben.",
  },
  email: {
    prompt: "📧 <b>Schritt 12 / 13 — E-Mail</b>\n\nDeine E-Mail-Adresse?",
    validate: (v) =>
      v.includes("@") && v.includes(".")
        ? null
        : "❌ Bitte eine gültige E-Mail-Adresse eingeben.",
    transform: (v) => v.toLowerCase().trim(),
  },
  postal_code: {
    prompt: "📍 <b>Schritt 13 / 13 — Postleitzahl</b>\n\nDeine österreichische Postleitzahl?",
    validate: (v) =>
      /^\d{4}$/.test(v.trim())
        ? null
        : "❌ Österreichische PLZ hat 4 Ziffern (z.B. 1010).",
    transform: (v) => v.trim(),
  },
};

const STEP_ORDER = [
  "make", "model", "year", "mileage", "fuel", "transmission",
  "condition", "accident", "first_name", "last_name", "phone", "email", "postal_code",
];

// ── Value estimator (mirrors QuickEstimator logic) ───────────────────────────

const BRAND_MULT: Record<string, number> = {
  bmw: 1.30, mercedes: 1.30, audi: 1.25, porsche: 1.60, tesla: 1.40,
  volkswagen: 1.00, vw: 1.00, volvo: 1.10, toyota: 1.10, honda: 1.05,
  mazda: 0.95, skoda: 0.92, seat: 0.88, hyundai: 0.90, kia: 0.90,
  ford: 0.88, opel: 0.85, renault: 0.85, peugeot: 0.83, fiat: 0.80,
  dacia: 0.72, mitsubishi: 0.85, nissan: 0.88, suzuki: 0.82,
};

function estimateCents(
  make: string, year: number, mileage: number, condition: string
): number {
  const mult = BRAND_MULT[make.toLowerCase()] ?? 1.0;
  const base = 18_000 * mult;
  const age = new Date().getFullYear() - year;
  const depr = age * 1_400 + mileage * 0.055;
  const cond = { sehr_gut: 1.0, gut: 0.88, gebraucht: 0.72, defekt: 0.45 }[condition] ?? 0.8;
  const eur = Math.max(300, Math.round(((base - depr) * cond) / 100) * 100);
  return eur * 100;
}

// ── Webhook handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const msg = update.message;

    // Ignore non-text updates (photos, stickers, …)
    if (!msg?.text) return NextResponse.json({ ok: true });

    const chatId: number = msg.chat.id;
    const text: string = msg.text.trim();
    const supabase = db();

    // ── /start  or  /neu ──────────────────────────────────────
    if (text === "/start" || text === "/neu") {
      await supabase.from("telegram_sessions").upsert({
        chat_id: chatId,
        step: "make",
        data: {},
        updated_at: new Date().toISOString(),
      });

      await send(
        chatId,
        `👋 <b>Willkommen bei NimmMeinAuto!</b>\n\nIch führe dich Schritt für Schritt durch die Fahrzeugbewertung.\n\n✅ Kostenlos & unverbindlich\n✅ Kein Risiko — kein Verkaufszwang\n✅ Direktes Angebot von uns\n\nTippe /abbrechen um jederzeit abzubrechen.\n\n─────────────────\n${STEPS.make.prompt}`,
        STEPS.make.markup
      );
      return NextResponse.json({ ok: true });
    }

    // ── /abbrechen ────────────────────────────────────────────
    if (text === "/abbrechen") {
      await supabase.from("telegram_sessions").delete().eq("chat_id", chatId);
      await send(
        chatId,
        "❌ Anfrage abgebrochen.\n\nSende /start um neu zu beginnen.",
        noKeyboard
      );
      return NextResponse.json({ ok: true });
    }

    // ── No active session → prompt start ─────────────────────
    const { data: session } = await supabase
      .from("telegram_sessions")
      .select("step, data")
      .eq("chat_id", chatId)
      .single();

    if (!session) {
      await send(
        chatId,
        "👋 Sende /start um eine kostenlose Fahrzeugbewertung zu starten!",
        noKeyboard
      );
      return NextResponse.json({ ok: true });
    }

    const currentStep = session.step as string;
    const data = session.data as Record<string, string>;
    const stepConfig = STEPS[currentStep];

    // ── Validate ──────────────────────────────────────────────
    const err = stepConfig?.validate?.(text) ?? null;
    if (err) {
      await send(chatId, `${err}\n\n${stepConfig.prompt}`, stepConfig.markup);
      return NextResponse.json({ ok: true });
    }

    // ── Store & advance ───────────────────────────────────────
    const storedValue = stepConfig?.transform ? stepConfig.transform(text) : text;
    const newData = { ...data, [currentStep]: storedValue };
    const nextIdx = STEP_ORDER.indexOf(currentStep) + 1;
    const nextStep = STEP_ORDER[nextIdx];

    if (nextStep) {
      await supabase
        .from("telegram_sessions")
        .update({ step: nextStep, data: newData, updated_at: new Date().toISOString() })
        .eq("chat_id", chatId);

      const next = STEPS[nextStep];
      await send(chatId, next.prompt, next.markup);
      return NextResponse.json({ ok: true });
    }

    // ── All steps done — create listing ──────────────────────
    const d = newData;
    const year = parseInt(d.year);
    const mileage = parseInt(d.mileage);
    const estimated_value_cents = estimateCents(d.make, year, mileage, d.condition);

    const { data: listing, error: dbErr } = await supabase
      .from("listings")
      .insert({
        make: d.make,
        model: d.model,
        year,
        mileage,
        fuel: d.fuel,
        transmission: d.transmission,
        condition: d.condition,
        has_accident_history: d.accident === "true",
        first_name: d.first_name,
        last_name: d.last_name,
        phone: d.phone,
        email: d.email,
        postal_code: d.postal_code,
        estimated_value_cents,
      })
      .select("id")
      .single();

    if (dbErr || !listing) {
      console.error("[tg-bot] listing insert error:", dbErr);
      await send(
        chatId,
        "❌ Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es später erneut oder besuche <a href=\"https://nimmmeinauto.at\">nimmmeinauto.at</a>.",
        noKeyboard
      );
      return NextResponse.json({ ok: true });
    }

    // Clean up session
    await supabase.from("telegram_sessions").delete().eq("chat_id", chatId);

    // Notify admin (email + Telegram)
    notifyNewListing({
      make: d.make,
      model: d.model,
      year,
      mileage,
      estimated_value_cents,
      first_name: d.first_name,
      last_name: d.last_name,
      phone: d.phone,
      email: d.email,
      postal_code: d.postal_code,
      listingId: listing.id,
    }).catch(console.error);

    const valueStr = `€ ${(estimated_value_cents / 100).toLocaleString("de-AT")}`;
    const link = `https://nimmmeinauto.at/bewertung?id=${listing.id}`;

    await send(
      chatId,
      `✅ <b>Deine Anfrage wurde erfolgreich eingereicht!</b>\n\n` +
      `🚗 ${d.make} ${d.model} (${year})\n` +
      `📊 Geschätzter Wert: <b>${valueStr}</b>\n\n` +
      `Unser Team meldet sich in Kürze:\n` +
      `📞 ${d.phone}\n` +
      `📧 ${d.email}\n\n` +
      `🔗 <a href="${link}">Inserat online ansehen</a>\n\n` +
      `─────────────────\n` +
      `Weitere Anfrage? /neu`,
      noKeyboard
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[tg-bot] unexpected error:", e);
    return NextResponse.json({ ok: true }); // always 200 to Telegram
  }
}
