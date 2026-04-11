# CHRIS — Claude Code Operating Manual

CHRIS (Culture Health & Reinforcement Intelligent System) is an AI-powered operational intelligence platform for Australian aged care providers. It connects every source system a provider runs (rostering, HR, clinical, incident, finance) into a single canonical data layer, then drives leadership behaviour change, compliance monitoring, and governance intelligence.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Source Systems                               │
│  Deputy · Humanforce · ELMO · Employment Hero · AlayaCare       │
│  Chris21 · RiskMan · Leecare · ACQSC/GPMS                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ scheduled pulls (3am AEST)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              packages/connectors/                             │
│   BaseConnector → DeputyConnector, ELMOConnector, etc.       │
│   De-identification at boundary (PII never enters canonical) │
└──────────────────────────┬───────────────────────────────────┘
                           │ idempotent upserts
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              packages/db/ — Canonical Data Layer              │
│   8 tables: providers, facilities, facility_workforce,       │
│   facility_rostering, facility_incidents, facility_hazard_   │
│   scores, facility_interventions, don_review_items           │
│   RLS: provider isolation + role-based scoping               │
└───────┬──────────────────────────────┬───────────────────────┘
        │                              │
        ▼                              ▼
┌───────────────────┐   ┌──────────────────────────────────────┐
│  DON Queue (PWA)  │   │         CHRIS Engines                │
│  Approve/Modify/  │   │  Care Minutes · SIRS · Governance    │
│  Reject           │   │  Pulse · Monday Briefing · Coach     │
└───────────────────┘   └──────────────────────────────────────┘
        │                              │
        └──────────┬───────────────────┘
                   ▼
        ┌─────────────────┐
        │    apps/web/     │
        │  Next.js 15 UI   │
        └─────────────────┘
```

---

## Monorepo structure

```
chris/
├── apps/
│   └── web/                    # Next.js 15 dashboard + public pages
├── packages/
│   ├── db/                     # Drizzle ORM + canonical schema
│   ├── shared/                 # Common types, validation, utilities
│   ├── connectors/             # Source system connectors (Prompt 1.2+)
│   └── engines/                # Intelligence engines (Prompt 2.1+)
└── CLAUDE.md                   # This file
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm db:generate` | Generate Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio GUI |

---

## Hard rules

1. **De-identification at the connector boundary.** Individual names, employee IDs, emails, phone numbers NEVER enter the canonical store. All workforce data is aggregated to `role_category + employment_type + period + facility`. This is non-negotiable.

2. **Append-only for evidence tables.** `facility_incidents`, `facility_hazard_scores`, `facility_interventions`, and `don_review_items` are never updated after creation. Amendments create new records. This ensures regulatory audit trail.

3. **Human approves, CHRIS prepares.** Every SIRS submission, governance pack distribution, and regulatory correspondence requires a human leader's sign-off via the DON approval queue.

4. **Saga pattern for irreversible actions.** SIRS ACQSC submissions and governance pack distributions use the saga pattern with compensating transactions. An ACQSC submission cannot be undone — if later steps fail, the DON must be alerted immediately.

5. **Library-first practice retrieval.** CHRIS never invents practices or coaching content. All micro-practices are retrieved from the canonical practice library via `signals_addressed` matching. Generated content (framing, prompts) must not exceed the length of authoritative content.

6. **RLS is the primary security gate.** Row-Level Security enforces provider isolation and role-based scoping at the database level (Neon PostgreSQL). Every query is filtered by `provider_id`.

---

## Canonical docs

The full specification lives in `~/Desktop/test-project/CHRISFinal 2/`:
- `README.md` — project overview, architecture decisions, tech stack
- `02-OPERATIONS.md` through `16-CHRIS-COACH.md` — detailed specifications
- `ACOS_HANDOFF.md` — master thesis and handoff document

Build prompts are in `08-BUILD-PROMPTS.md` — we execute these in order.

---

## Build sequence

| Prompt | Component | Status |
|--------|-----------|--------|
| Phase 0 | Project setup | Complete |
| 1.1 | Canonical schema + RLS | Complete |
| 1.2 | Connector framework + Deputy | Complete |
| 1.3 | ELMO connector | Complete |
| 1.4 | Humanforce connector | Complete |
| 2.1 | Care minutes engine | Complete |
| 2.2 | SIRS classification + submission | Complete |
| 3.1 | DON approval queue + PWA | Complete |
| 4.1 | CHRIS Comply public launch | Complete |
| 4.2 | Governance pack engine | Pending |

---

## Design system

- **Primary:** Forest (#1B4332), Forest Light (#2D6A4F)
- **Accent:** Amber (#D4A017), Gold (#C9A84C)
- **Warm:** Terracotta (#C4704A), Cream (#FAF7F2)
- **Status:** Teal = healthy, Amber = watch, Terracotta = act
- **Typography:** DM Sans (body), Source Serif 4 (display/narrative)
- **CHRIS Avatar:** Forest-to-gold gradient circle

---

## Session resumption

At the start of every Claude Code session:
1. Read this file (`CLAUDE.md`)
2. Check the build sequence table above for current status
3. Continue from the next pending prompt
