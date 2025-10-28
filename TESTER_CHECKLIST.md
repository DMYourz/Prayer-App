# PrayerCircle Preview — Tester Checklist

## Before you begin
- Install dependencies (`pnpm install`) and start the preview server (`pnpm dev`).
- If you want to exercise the sign-in experience, populate `.env.local` with your Manus OAuth values (see `DEVELOPMENT.md`). Otherwise the **Sign In** button stays disabled in preview mode.
- The server seeds curated sample data automatically whenever you restart `pnpm dev`; no database setup is required for local testing.

## Core user flows to try
1. **Explore Home** – review the hero messaging, testimonials, and donation CTA. Try the contact form and confirm your email client opens with a pre-filled draft.
2. **Browse active prayers** – use category filters and AI search, open a detail page, and note whether urgency badges and metadata feel helpful.
3. **Submit a prayer** – post a new request (anonymous and non-anonymous), observe the moderation guidance, and verify it appears in the list after refresh.
4. **Check churches** – browse the churches directory, inspect insights/groups/members tabs, and confirm messaging makes sense without signing in.

## Admin-only flow (requires OAuth configured)
1. Sign in with a Manus account whose OpenID matches `OWNER_OPEN_ID`.
2. Visit `/admin` and review the church approval experience; approve/reject a pending church and note any confusing copy.
3. Confirm answered-prayer updates propagate back to the main list.

## Capturing feedback
- Record findings in your shared tracking doc or drop them in `todo.md` with a `QA:` prefix for easy triage.
- Include screenshots and the exact URL when reporting UX issues.
- For copy or tone adjustments, quote the original text so it is easy to locate.

## Resetting sample data
- Stop the dev server (`Ctrl+C`) and restart `pnpm dev` to restore the in-memory dataset to its seeded state.
- If you later connect a real database (`DATABASE_URL`), run `pnpm db:push` to apply schema changes and manage data directly in MySQL.
