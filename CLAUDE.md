@AGENTS.md

# SunoVyapar — Code Map

## What this app is
CRM dashboard for a small Indian wholesale distributor (Shree Ram Distributors).
An AI phone agent (Ishita) takes inbound orders; calls are transcribed and stored
as leads in Supabase. This UI reads those leads and lets the owner review/action them.
No auth. No write-back to Supabase (reads + realtime inserts only).

## Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 — **static export** (`output: "export"` in next.config.ts) |
| Styling | Tailwind CSS v4 (no config file — configured via CSS `@theme` in globals.css) |
| Database | Supabase (anon client, realtime channel for new leads) |
| Deployment | Vercel (push to `main` → auto-deploy) |
| Language | TypeScript throughout |

## File map

```
app/
  page.tsx            ← Leads screen (main screen): filter bar, LeadCard list, LeadDetail pane
  customers/page.tsx  ← Customers screen: groups leads by caller_number into customer profiles
  catalogue/page.tsx  ← Catalogue screen: static product list from lib/seed.ts (no DB table yet)
  stock/page.tsx      ← Stock screen: static stock states from lib/seed.ts (no DB table yet)
  agent/page.tsx      ← Agent screen: call stats and AGENT_CONFIG from lib/seed.ts
  layout.tsx          ← Root layout: fonts, AppShell wrapper
  globals.css         ← Design tokens (CSS custom properties), .card, .quote-box, .dot, etc.

components/
  AppShell.tsx        ← Bottom-nav (mobile) + sidebar (desktop), shared across all screens
  LeadCard.tsx        ← Compact lead card for the list view
  LeadDetail.tsx      ← Expanded lead detail pane / mobile overlay (transcript, recording, WA link)
  PageHeader.tsx      ← Reusable title + subtitle header used by non-Leads screens

lib/
  types.ts            ← Lead type, LeadStatus union
  supabase.ts         ← getSupabase() singleton (returns null if env vars missing), supabaseConfigured()
  useLeads.ts         ← useLeads() hook: fetches 200 rows desc, subscribes to INSERT via realtime
  lead-utils.ts       ← Pure helpers: parseProducts, displayName, relativeTimeHi, statusLabel,
                         statusClasses, waLink, parseTranscript, avatarColor, avatarInitial, formatDuration
  seed.ts             ← Static CATALOGUE, STOCK arrays + AGENT_CONFIG (placeholder until DB tables exist)
```

## Data shape — `leads` table

```ts
type Lead = {
  id: string;
  created_at: string;          // ISO timestamp
  caller_name: string | null;  // often null — fall back to caller_number
  caller_number: string | null;
  order_summary: string | null; // human-readable sentence from AI
  products: string | Record<string, unknown> | unknown[] | null;
                               // GOTCHA: stored as JSON string {"raw":"5 carton Parle-G, 2 carton Bingo"}
                               // parseProducts() in lead-utils.ts unwraps all variants → plain string
  location: string | null;     // may be garbled ("kiryana store", vague areas) or empty
  amount: string | null;       // rupee amount as string, no ₹ symbol stored
  status: "serious" | "pending" | "not_serious" | null;
  call_duration: number | null; // seconds
  transcript: string | null;   // "assistant: ...\nuser: ..." format, parseTranscript() → ChatLine[]
  recording_url: string | null;
  agent_id: string | null;
};
```

**Gotchas:**
- `products` field is almost always a JSON string with a `.raw` key — use `parseProducts()`, never access `.raw` directly in components
- `caller_name` is null on many leads; always use `displayName(lead)` which falls back to number
- `location` may be empty or nonsensical; always guard with `lead.location ?`
- `status` can be null for very old rows; `statusLabel()` / `statusClasses()` handle null safely

## Design system

```
--cream:           #fbf9f4   ← page background
--terracotta:      #cf6a33   ← primary accent (product text, borders, badges)
--terracotta-dark: #b25324   ← darker accent
--ink:             #1f1a14   ← primary text
--ink-soft:        #4a3f33
--muted:           #7a6a55   ← secondary text
--line:            #ece6db   ← borders
--wa-green:        #16a34a   ← WhatsApp button
--serious:         #16a34a   ← green badge
--pending:         #b88a2d   ← amber badge
--not-serious:     #8a8275   ← grey badge
```

Key CSS classes: `.card` (white rounded card with shadow), `.quote-box` (cream bg + terracotta left border, italic), `.dot` (8px status indicator), `.devnagri` (Devanagari font stack).

**UI language:** Hindi-English mix. Labels, toasts, and status text use transliterated Hindi (e.g. "abhi abhi", "Serious Buyer", "Serious Nahi"). Devanagari only for the "नया" new-lead badge.

**Mobile-first:** Bottom nav on mobile, sidebar on desktop (`lg:` breakpoint). Cards stack vertically on mobile; two-pane layout on desktop.

## DO NOT

- No auth — there is no login, session, or user concept; do not add one
- No write-back — the app never writes to Supabase (no UPDATE/INSERT from the UI)
- No inventory management — Catalogue and Stock are read-only seed data, not a live inventory system
- No localStorage / sessionStorage — state lives in React only
- No analytics or third-party scripts
- Catalogue and Stock have no DB tables yet — keep them reading from `lib/seed.ts` until told otherwise
