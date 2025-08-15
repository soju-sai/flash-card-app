## Flash Card App

A Next.js flashcards application featuring AI-generated cards (AI Deck), Clerk authentication and billing-based authorization, and Drizzle ORM on Neon (serverless PostgreSQL).

### Features

- **Deck management**: create, update, delete. Free plan limited to 2 decks; Premium unlocks unlimited decks
- **Card management**: add, edit, delete cards within a deck
- **AI Deck generation**: structured cards generated via Vercel AI SDK + OpenAI `gpt-4o-mini`
- **Authorization (Clerk Billing)**:
  - Plans: `free_user`, `premium_user`
  - Features: `2_deck_limited` (free), `unlimited_decks`, `ai_deck` (premium)
- **Data isolation**: all DB reads/writes are scoped by Clerk `userId`
- **i18n**: all user-visible strings use the project's i18n system
- **UI**: shadcn/ui + Radix + Tailwind CSS

### Tech Stack

- Next.js 15, React 19, TypeScript 5
- Clerk (auth + billing)
- Drizzle ORM (PostgreSQL on Neon)
- Vercel AI SDK (`ai`) + `@ai-sdk/openai` + Zod
- shadcn/ui, Radix UI, Tailwind CSS v4

---

## Getting Started

### Prerequisites

- Node.js 18+ (20 LTS recommended)
- Neon PostgreSQL connection (`DATABASE_URL`)
- OpenAI API Key (`OPENAI_API_KEY`)
- Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)

### Install dependencies

```bash
npm install
```

### Environment variables

Create `.env.local` with:

```bash
# .env.local
DATABASE_URL=postgres://<user>:<password>@<host>/<db>?sslmode=require
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Database (Drizzle + Neon)

`drizzle.config.ts` is configured with `schema` and `DATABASE_URL`. Generate and apply migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Schema lives in `src/db/schema.ts`.

### Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`. Protected routes (`/dashboard`, `/deck/*`, `/decks/*`) require sign-in and are guarded by middleware.

---

## Project Structure (highlights)

```text
src/
  app/
    dashboard/
    deck/[id]/
    decks/[id]/study/
    pricing/
  components/
    ui/               # shadcn/ui components
  db/
    schema.ts         # Drizzle tables (decks, cards, relations)
  lib/
    actions/          # Server Actions (deck, card, ai)
    db.ts             # Drizzle + Neon initialization
    i18n/             # i18n provider, dictionaries and utils
    validations/      # Zod schemas
  middleware.ts       # Clerk route protection & redirects
```

---

## Data Flow & Server Actions

- This project follows the "Next.js Data Flow and Validation" pattern:
  - Fetch in Server Components
  - Mutate in Server Actions
  - Validate with Zod
  - Derive TypeScript types from Zod/DB schema

### Deck actions (`src/lib/actions/deck.ts`)

- Create: checks `userId` and enforces plan limits. Without `unlimited_decks`, users can create up to 2 decks and are redirected to `/pricing` if the limit is reached.
- Update/Delete: filtered by `userId` to ensure ownership.

### Card actions (`src/lib/actions/card.ts`)

- Create/Update/Delete: validates `userId` and deck ownership, then revalidates relevant paths on success.

### AI Deck generation (`src/lib/actions/ai.ts`)

- Uses Vercel AI SDK `generateObject` with a Zod schema (`src/lib/validations/ai.ts`) to produce structured cards:
  - Schema fields:
    - `frontSide`: 1–280 chars
    - `backSide`: 1–2000 chars
  - `count` must be between 1–200; results are validated before DB writes.
  - Requires `ai_deck` feature; otherwise returns an error.
  - Inserts cards in batch and revalidates paths.

---

## Authentication & Authorization (Clerk + Billing)

- All user data access requires `auth()` and a valid `userId`.
- Use `has()` to check plans/features:
  - `free_user`: `2_deck_limited`
  - `premium_user`: `unlimited_decks`, `ai_deck`
- Route protection is handled by `src/middleware.ts`:
  - Signed-in users visiting `/` are redirected to `/dashboard`
  - Unauthenticated users hitting protected routes are redirected to `/`

---

## i18n

- Provider & hooks: `src/lib/i18n/*`
- Dictionaries: `src/lib/i18n/dictionaries/en.ts`, `src/lib/i18n/dictionaries/zh-TW.ts`
- Helper component: `src/components/Trans.tsx`
- Rule: All user-visible text must come from i18n (no hardcoded strings in JSX).

---

## UI (shadcn/ui + Tailwind)

- shadcn/ui components are located in `src/components/ui/`
- Add more components as needed (e.g., `button`, `card`, `dialog`, ...)

---

## NPM Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start (production)
npm run start

# Lint
npm run lint
```

---

## Deployment (Vercel suggested)

1. Set environment variables: `DATABASE_URL`, `OPENAI_API_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
2. Run Drizzle migration before/after first deploy: `npx drizzle-kit migrate`
3. Ensure Clerk Billing plans/features are configured in Clerk dashboard

---

## Troubleshooting

- DB connection issues:
  - Verify `DATABASE_URL` is correct; Neon typically requires `sslmode=require`
- AI generation fails:
  - Ensure `OPENAI_API_KEY` is set and not rate-limited
  - Ensure the deck has both `title` and `description`
  - Ensure the user has the `ai_deck` feature
- Free plan cannot create more decks:
  - Expected behavior; upgrade to `premium_user`

---

## License

Not specified (add a LICENSE file if needed).

