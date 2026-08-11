# HealthCoverSim

Private Health Insurance Quote Simulator — a learning project. Estimates a
monthly/yearly premium from cover type, hospital/extras tiers, applicant
ages and cover history, Lifetime Health Cover (LHC) loading, the family
upgrade fee, and the annual-payment discount. Not financial advice.

## Stack

- **Frontend:** React (Vite) — `client/`
- **Backend:** Node.js + Express — `server/`
- **Database:** SQLite (via `better-sqlite3`) — `server/healthcoversim.db`, schema in `server/init.sql`

## Prerequisites

- Node.js 18+

## Install & run

Two servers run side by side: the API on port 4000, the frontend on port 5173.

**1. Backend**

```bash
cd server
npm install
npm start
```

This creates `server/healthcoversim.db` automatically on first run (using
`init.sql`) if it doesn't already exist. API listens on
`http://localhost:4000`.

**2. Frontend** (in a second terminal)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## Project structure

```
server/
  pricing.js       # pure premium-calculation logic (no Express/DB)
  pricing.test.js  # tests for pricing.js, incl. the Section 7 worked example
  validation.js    # backend input validation (Section 9)
  db.js            # SQLite connection, runs init.sql on startup
  init.sql         # database schema
  routes/quotes.js # CRUD API routes
  server.js        # Express app entry point

client/
  src/
    api.js                       # fetch wrapper for the API
    validation.js                # frontend input validation (mirrors backend)
    components/QuoteFormFields.jsx  # shared create/edit form
    components/QuoteBreakdown.jsx   # the explanation sheet
    pages/QuoteListPage.jsx
    pages/QuoteFormPage.jsx      # create
    pages/QuoteEditPage.jsx
    pages/QuoteDetailPage.jsx
```

## How pricing works

Hospital and extras cover are priced separately, per adult, then added
together. LHC loading — `(age − 30) × 2%` for an applicant with no prior
hospital cover and age > 30 — is added only to the hospital premium, never
extras. A flat $30/month family upgrade fee applies to Family cover. The
annual-payment discount (0–10%) is applied only when paying Yearly. Quote
inputs are stored as-is in SQLite; the premium breakdown is recalculated
from those inputs every time a quote is viewed, so `pricing.js` is the one
place the calculation logic lives.
