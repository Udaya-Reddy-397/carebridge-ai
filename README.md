# CareBridge AI

**Closing the instruction-to-action gap in healthcare**  
VITB – JHU Health-Hack 2027 · Team CareBridge

## Features

- **Patient Dashboard** – tasks with Pending → Acknowledged → Completed / Help states
- **Doctor / Care Intelligence Dashboard** – overdue queue, assign tasks, audit log
- **Sahaayak AI** – rule-based + RAG-style answers in English/Hindi with citations & safety guardrails
- **Motion UI** – Framer Motion hover effects (cards lift, scale, slight 3D tilt)
- **Continue with Google** (demo flow that captures a real email, then role selection)
- Client-side persistence via `localStorage` (works offline for the session; ideal for demo)

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3
- Framer Motion
- Lucide icons
- Ready for one-click deploy on **Vercel**

## Quick start (local)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo (or import the directory).
2. Go to https://vercel.com/new → Import the repo.
3. Framework preset: **Next.js**. Leave build settings default.
4. Click **Deploy**.

No environment variables are required for the demo.  
(For production Google OAuth later, add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET and switch the login page to NextAuth.)

## Demo flow

After clicking **Continue with Google**:

| Role    | Example email              | What you see                          |
|---------|----------------------------|---------------------------------------|
| Patient | priya.sharma@gmail.com     | Pre-seeded diabetes care tasks        |
| Patient | any valid email            | Same demo tasks (Priya’s plan)        |
| Doctor  | dr.mehta@clinic.in         | Care Intelligence + overdue queue     |

## Notes

- This is a **prototype**. Synthetic data only. No clinical claims.
- AI never diagnoses, prescribes or changes treatment.
- Offline: tasks remain readable from localStorage after first load.

---

**Team CareBridge** · VIT Bhopal University
