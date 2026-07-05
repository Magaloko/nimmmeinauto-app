# nimmmeinauto-app

**Status:** Prototype / MVP  
**Demo:** https://nimmmeinauto-app.vercel.app  
**Repository:** https://github.com/Magaloko/nimmmeinauto-app

nimmmeinauto-app is a Next.js/Supabase prototype for car inquiries with lead capture, role-based access, chat/session foundations and photo documentation workflows.

It demonstrates how a vertical lead product can guide users from an initial vehicle inquiry into structured communication and internal processing.

## Purpose

The project tests a lean digital workflow for car-related inquiries:

- inquiry / lead capture
- user and role model
- authentication with Supabase
- chat and session structure
- photo and documentation workflow
- email / notification foundation
- internal status and processing logic

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 |
| Frontend | React 19 |
| Language | TypeScript |
| Backend / Auth | Supabase SSR / Supabase JS |
| Styling | Tailwind CSS |
| Email | Nodemailer |
| Validation | Zod |
| Deployment | Vercel |

## Local Development

```bash
npm install
npm run dev
```

Local URL:

```text
http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | start local Next.js development server |
| `npm run build` | create production build |
| `npm run start` | start production server |
| `npm run lint` | run lint command |

## Portfolio Note

This repository is marked as a prototype / MVP. It is suitable as a portfolio reference for vertical lead apps, photo-heavy intake flows and lightweight internal processing systems.

Before production use, data model, authentication rules, privacy requirements, email flows and deployment configuration must be reviewed for the final business context.
