# nimmmeinauto-app

**Status:** Prototype / MVP  
**Demo:** https://nimmmeinauto-app.vercel.app

Next.js/Supabase-Prototyp für Auto-Anfragen mit Lead-Erfassung, Rollen/Auth-Struktur, Chat-/Session-Grundlagen und Foto-Workflows.

## Zweck

Das Projekt testet eine schlanke digitale Prozesskette rund um Auto-Anfragen:

- Anfrage / Lead erfassen
- Nutzer- und Rollenmodell
- Chat-/Session-Struktur
- Foto-/Dokumentations-Workflow
- E-Mail-/Benachrichtigungsgrundlage
- Supabase als Backend

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Supabase SSR / Supabase JS
- Tailwind CSS
- Nodemailer
- Zod

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Danach:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Hinweis

Dieses Repository ist als Prototyp markiert. Für produktive Nutzung müssen Datenmodell, Auth-Regeln, Datenschutz, E-Mail-Flows und Deployment-Konfiguration final geprüft werden.
