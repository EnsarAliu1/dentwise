# DentWise — Project Guide for Claude Code

DentWise is an online dental platform. Patients book appointments with dentists and, on a paid plan,
talk to an AI dental assistant by voice (for people who can't visit the clinic). There is an admin
area for managing doctors and appointments. The project is being redesigned and extended (see Roadmap).

The owner works alone, on Windows, in VS Code with the **Git Bash** terminal. Reply in **English**.

---

## How to work with me (MOST IMPORTANT)

You run in **auto mode** and may edit files freely. These rules keep me informed and in control:

1. **Plan first for anything non-trivial.** If a task touches more than ~2 files, changes the database
   schema, adds a dependency, changes auth/roles/billing, or changes UI design, first post a short plan
   (what, which files, risks) and **wait for my OK**. Small fixes (typos, one-file bugfix, styling tweak) → just do them.
2. **Always end with a summary** in this format:
   ```
   ## Summary
   **What I did:** one or two sentences
   **Files changed:** - path — what changed and why
   **Checks run:** lint / typecheck / build results
   **Your turn:** anything I must do (push, set env var, run migration on prod, test in browser…)
   **Next step (suggestion):** one line
   ```
3. **Ask before** anything important or hard to undo: deleting files, new npm packages, schema
   changes, touching `.env*`, Clerk/billing config, or a change that breaks existing behaviour.
4. **Never guess secrets.** If an env var is needed, tell me its name and what it is for. Do not read `.env`.
5. If you are unsure what I want, ask one clear question instead of assuming.

## Git rules

- **You may:** `git status`, `diff`, `log`, `branch`, `switch`/`checkout -b`, `add`, `commit`, `stash`, `restore`, `show`.
- **Never** run `git push`, `pull`, `fetch`+merge, `merge`, `rebase`, `reset --hard`, `clean`, or force anything.
  These are mine — when one is needed, put it under **Your turn** with the exact command.
- Work on a **feature branch** (`feature/<short-name>`, `fix/<short-name>`), never commit to `main`.
- Commit messages: Conventional Commits, e.g. `feat: add doctor calendar view`, `fix: email logo not loading`.
- Commit in small logical steps; don't commit unrelated changes together.

---

## Tech stack

| Area | Tool |
|---|---|
| Framework | Next.js 15.5 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling / UI | Tailwind CSS v4 (`src/app/globals.css`), shadcn/ui (`src/components/ui`), Radix / Base UI, lucide-react icons, sonner toasts |
| Auth + billing | Clerk (`@clerk/nextjs`) — sign-in, user sync, **Clerk Billing** plans `ai_basic`, `ai_pro` |
| Database | PostgreSQL on **Neon**, Prisma 6 (`prisma/schema.prisma`, `prisma.config.ts`) |
| Data fetching | Server Actions (`src/lib/actions/*`) + TanStack Query hooks (`src/hooks/*`) |
| Voice AI | Vapi (`@vapi-ai/web`, `src/lib/vapi.ts`, prompts in `src/lib/vapi-promts.ts`) |
| Email | Resend + React Email (`src/components/emails`, `src/app/api/send-appointment-email`) |
| Lint / format | **Biome** (not ESLint/Prettier) — `biome.json` |

## Commands (Git Bash)

```bash
npm run dev            # dev server, http://localhost:3000
npm run build          # production build (also type-checks)
npm run lint           # biome check
npm run format         # biome format --write
npx tsc --noEmit       # type-check only
npx prisma generate    # regenerate client after schema change
npx prisma migrate dev --name <name>   # create + apply migration (DEV Neon branch only!)
npx prisma studio      # browse data
```
There is no test suite yet. Before saying a task is done, run `npm run lint` and `npx tsc --noEmit`
(and `npm run build` for larger changes) and report the result.

## Project structure

```
src/
  app/                  routes (App Router)
    page.tsx            landing page
    dashboard/          patient dashboard
    appointments/       booking flow (doctor → time → confirm)
    voice/              AI voice assistant (Pro plan only)
    pro/                pricing (Clerk <PricingTable/>)
    admin/              admin dashboard (doctors, stats, recent appointments)
    api/send-appointment-email/   POST route that sends confirmation email
  components/
    ui/                 shadcn components — prefer these, don't hand-roll
    landing/ dashboard/ appointments/ admin/ voice/ emails/   feature components
    providers/          TanStack provider
    UserSync.tsx        syncs Clerk user → DB
  hooks/                TanStack Query hooks (use-appointment, use-doctors)
  lib/
    actions/            "use server" actions: appointments, doctors, users
    prisma.ts           Prisma singleton — always import { prisma } from here
    resend.ts vapi.ts utils.ts (cn helper)
  middleware.ts         clerkMiddleware
prisma/schema.prisma    models: User, Doctor, Appointment; enums Gender, AppointmentStatus
public/                 static images
```

## Conventions

- **TypeScript:** no new `any`; define types for action inputs/outputs. Use `@/` path alias.
- **Components:** function components, PascalCase file names, Server Components by default; add
  `"use client"` only when needed (state, effects, browser APIs, Clerk client hooks, Vapi).
- **Data flow:** DB access only inside server actions (`src/lib/actions`) or server components —
  never from client components. Client components use the TanStack hooks in `src/hooks`.
  After a mutation, invalidate the related query keys.
- **Auth:** every server action that reads/writes user data must check `auth()` from
  `@clerk/nextjs/server` and verify the user is allowed (owner / doctor / admin).
- **UI:** use shadcn components + Tailwind tokens from `globals.css` (no hard-coded hex colors in
  components). Mobile-first, accessible (labels, focus states, alt text). Icons from lucide-react.
- **Dates:** use `date-fns`. Appointment `time` is stored as a `"HH:mm"` string, `date` as DateTime.
- **Images:** remote hosts must be added to `next.config.ts` `images.remotePatterns`.
- **Formatting:** Biome, 2 spaces. A hook formats files automatically after you edit them.

## Database rules (Neon + Prisma)

- We are moving from `prisma db push` to **migrations**. Never use `db push`.
- Schema changes: edit `schema.prisma` → `npx prisma migrate dev --name <name>` against a **Neon dev
  branch** → `npx prisma generate`. Never run migrations against the production branch;
  `prisma migrate deploy` on prod is my job (list it under **Your turn**).
- Never run `migrate reset`, drop tables, or delete data without asking.
- Use the `/db-migrate` command for the full safe flow (including the one-time baseline).

## Environment variables (names only — never read `.env`)

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_VAPI_KEY`,
`NEXT_PUBLIC_VAPI_ASSISTANT_ID`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`.
If you add a new one, tell me and document it here.

## Known issues

- **Email images not displaying:** logo in `AppointmentConfirmationEmail.tsx` is hosted on
  `i.ibb.co.com` (a mirror domain, often blocked). Emails are sent from the test sender
  `no-reply@resend.dev`. Fix plan: serve images from `NEXT_PUBLIC_APP_URL` (absolute https URLs,
  PNG/JPG, explicit width/height), verify a sending domain in Resend.
- Admin access is a single `ADMIN_EMAIL` check — to be replaced by roles.
- `src/components/dashboard/NextAppointmene.tsx` filename typo; `vapi-promts.ts` typo (rename carefully, update imports).
- README is still the create-next-app default.

## Roadmap (agreed direction — confirm details with me before each item)

1. **Roles:** `Role` enum (PATIENT / DOCTOR / ADMIN) on `User`; link `Doctor` ↔ Clerk user;
   role-based route protection replacing the `ADMIN_EMAIL` check.
2. **Doctor portal:** day/week/month calendar, working hours & time off, patient list and visit
   history/notes, mark visits COMPLETED / NO_SHOW.
3. **Booking:** real availability (no double booking), cancel & reschedule, statuses
   PENDING / CONFIRMED / CANCELLED / COMPLETED / NO_SHOW.
4. **Emails:** fix images, verified domain, 24h reminders, cancel/reschedule emails, `.ics` attachment.
5. **Redesign:** Figma → design tokens in `globals.css` → shared components → page by page.
   Use `/figma-to-code`. Figma is on the **free plan (very few MCP calls per month)** — see that command.

## Tools available

- **Slash commands:** `/new-feature`, `/db-migrate`, `/figma-to-code`, `/review`, `/commit`
- **Subagents:** `code-reviewer`, `db-architect`, `ui-designer`
- **MCP:** `figma` (read designs), `neon` (inspect DB, create dev branches — ask before anything destructive)
