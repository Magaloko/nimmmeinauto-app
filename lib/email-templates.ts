// HTML email templates — table-based layout for maximum email client compatibility
// Compatible with Gmail, Outlook, Apple Mail, Yahoo

const BASE_URL = "https://nimmmeinauto.at";

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NimmMeinAuto</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1c1917;border-radius:12px 12px 0 0;padding:0;">
              <!-- Amber top bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,transparent 0%,#f59e0b 30%,#f59e0b 70%,transparent 100%);border-radius:12px 12px 0 0;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 36px 24px 36px;">
                    <!-- Logo -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:28px;font-weight:900;letter-spacing:-1px;line-height:1;">
                          <span style="color:#f5f5f4;">nimm</span><span style="color:#f59e0b;">mein</span><span style="color:#f5f5f4;">auto</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:4px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="height:2px;width:200px;background-color:#f59e0b;opacity:0.3;font-size:0;line-height:0;">&nbsp;</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:6px;font-size:11px;color:#78716c;letter-spacing:4px;">ÖSTERREICH</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 36px 28px 36px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1c1917;border-radius:0 0 12px 12px;padding:24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#57534e;line-height:1.6;">
                    Diese E-Mail wurde automatisch von <strong style="color:#78716c;">NimmMeinAuto</strong> generiert.<br/>
                    <a href="${BASE_URL}" style="color:#f59e0b;text-decoration:none;">nimmmeinauto.at</a>
                    &nbsp;·&nbsp;
                    <a href="${BASE_URL}/datenschutz" style="color:#78716c;text-decoration:none;">Datenschutz</a>
                    &nbsp;·&nbsp;
                    <a href="${BASE_URL}/impressum" style="color:#78716c;text-decoration:none;">Impressum</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function badge(color: string, text: string): string {
  return `<span style="display:inline-block;background-color:${color};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 10px;border-radius:20px;text-transform:uppercase;">${text}</span>`;
}

function dataRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f5f5f4;font-size:13px;color:#78716c;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #f5f5f4;font-size:13px;color:#1c1917;font-weight:600;vertical-align:top;">${value}</td>
  </tr>`;
}

function ctaButton(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
    <tr>
      <td style="background-color:#f59e0b;border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#1c1917;text-decoration:none;letter-spacing:0.3px;">${label} →</a>
      </td>
    </tr>
  </table>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 1: Neues Inserat
// ─────────────────────────────────────────────────────────────────────────────
export function newListingEmail(data: {
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
}): string {
  const value = `€ ${(data.estimated_value_cents / 100).toLocaleString("de-AT")}`;
  const km = data.mileage.toLocaleString("de-AT");
  const link = `${BASE_URL}/bewertung?id=${data.listingId}`;

  const content = `
    <!-- Badge + Title -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td>
          ${badge("#16a34a", "🚗 Neues Inserat")}
          <h1 style="margin:14px 0 4px 0;font-size:22px;font-weight:900;color:#1c1917;line-height:1.2;">
            ${data.make} ${data.model}
          </h1>
          <p style="margin:0;font-size:15px;color:#78716c;">${data.year} &nbsp;·&nbsp; ${km} km &nbsp;·&nbsp; Schätzwert <strong style="color:#f59e0b;">${value}</strong></p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="height:1px;background-color:#f5f5f4;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <!-- Fahrzeugdaten -->
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;">Fahrzeugdaten</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      ${dataRow("Marke / Modell", `${data.make} ${data.model}`)}
      ${dataRow("Baujahr", String(data.year))}
      ${dataRow("Kilometerstand", `${km} km`)}
      ${dataRow("Schätzwert", `<span style="color:#f59e0b;">${value}</span>`)}
    </table>

    <!-- Kontaktdaten -->
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;">Kontaktdaten</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
      ${dataRow("Name", `${data.first_name} ${data.last_name}`)}
      ${dataRow("Telefon", `<a href="tel:${data.phone}" style="color:#1c1917;text-decoration:none;">${data.phone}</a>`)}
      ${dataRow("E-Mail", `<a href="mailto:${data.email}" style="color:#1c1917;text-decoration:none;">${data.email}</a>`)}
      ${dataRow("PLZ", data.postal_code)}
    </table>

    ${ctaButton(link, "Inserat öffnen")}
  `;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 2: Neues Händlerangebot
// ─────────────────────────────────────────────────────────────────────────────
export function newOfferEmail(data: {
  dealer_name: string;
  dealer_email?: string;
  amount_cents: number;
  listing_id: string;
  message?: string;
}): string {
  const amount = `€ ${(data.amount_cents / 100).toLocaleString("de-AT")}`;
  const link = `${BASE_URL}/bewertung?id=${data.listing_id}`;

  const content = `
    <!-- Badge + Title -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td>
          ${badge("#d97706", "💰 Neues Angebot")}
          <h1 style="margin:14px 0 4px 0;font-size:22px;font-weight:900;color:#1c1917;line-height:1.2;">
            ${amount}
          </h1>
          <p style="margin:0;font-size:15px;color:#78716c;">Angebot von <strong>${data.dealer_name}</strong></p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="height:1px;background-color:#f5f5f4;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <!-- Angebotsdaten -->
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;">Angebotsdetails</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      ${dataRow("Händler", data.dealer_name)}
      ${data.dealer_email ? dataRow("E-Mail", `<a href="mailto:${data.dealer_email}" style="color:#1c1917;text-decoration:none;">${data.dealer_email}</a>`) : ""}
      ${dataRow("Betrag", `<span style="color:#f59e0b;font-size:18px;">${amount}</span>`)}
    </table>

    ${data.message ? `
    <!-- Nachricht -->
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;">Nachricht des Händlers</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f5f5f4;border-left:3px solid #f59e0b;padding:14px 16px;border-radius:0 6px 6px 0;font-size:14px;color:#44403c;line-height:1.6;font-style:italic;">
          „${data.message}"
        </td>
      </tr>
    </table>
    ` : ""}

    ${ctaButton(link, "Inserat ansehen")}
  `;

  return emailWrapper(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Template 3: Neue Kundennachricht
// ─────────────────────────────────────────────────────────────────────────────
export function newMessageEmail(data: {
  sender_name: string;
  body: string;
  thread_id: string;
}): string {
  const link = `${BASE_URL}/admin/chat/${data.thread_id}`;

  const content = `
    <!-- Badge + Title -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td>
          ${badge("#2563eb", "💬 Neue Nachricht")}
          <h1 style="margin:14px 0 4px 0;font-size:22px;font-weight:900;color:#1c1917;line-height:1.2;">
            Nachricht von ${data.sender_name}
          </h1>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="height:1px;background-color:#f5f5f4;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <!-- Nachricht -->
    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#a8a29e;letter-spacing:2px;text-transform:uppercase;">Nachricht</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f5f5f4;border-left:3px solid #2563eb;padding:16px 18px;border-radius:0 6px 6px 0;font-size:14px;color:#44403c;line-height:1.7;">
          ${data.body.replace(/\n/g, "<br/>")}
        </td>
      </tr>
    </table>

    ${ctaButton(link, "Im Chat antworten")}
  `;

  return emailWrapper(content);
}
