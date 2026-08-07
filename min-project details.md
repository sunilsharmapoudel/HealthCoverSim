# Assignment1

HealthCoverSim
Private Health Insurance Quote Simulator

1. Overview
You will build a small full-stack web app that simulates a private health insurance quote system. A user can create, view, edit and delete quote records, and for each quote the app calculates an estimated monthly and yearly premium from the cover type, hospital and extras cover, applicant ages, Lifetime Health Cover loading, the family upgrade fee, and the annual-payment discount.
This is a learning simulator only. It is not financial advice and does not need to match any real
insurer’s pricing.

2. Background — How Health Insurance Pricing Works (read this first)

A premium is what a customer pays for cover. In this simulator it is built from a few separate parts that are added together — and each part exists for a real-world reason. Understanding the why makes every rule below obvious:
| Pricing lever | What it does | Why (real-world reason) |
| ————– | ————————– | ——————————– |
| Hospital cover tier (Basic→Gold) | Higher tier → higher base price | Higher tiers cover more medical  procedures, so they cost more.|

| Extras cover tier (Basic→Premium) | Higher tier → higher base price | Covers more everyday services: dental, price | optical, physio, etc. |

| Per adult (×2 for Couple / Family) | Each adult pays their own base price | Two adults use roughly twice as much cover. |

| Family upgrade fee (+$30/mo) | Flat add-on for Family cover | Covers dependent children under one policy (not priced individually here).|

| LHC loading (hospital only) | Adds a % to the hospital premium | Government policy that nudges people to take hospital cover young and keep it. |

| Annual-payment discount (yearly only) | Reduces the yearly total | Paying a year up front saves the insurer admin, so they pass back a discount. |

Hospital vs Extras. These are two separate covers, priced separately and then added. Hospital cover pays toward treatment as an admitted hospital patient (e.g. surgery) and comes in tiers Basic → Gold. Extras cover (“ancillary”) pays toward everyday services like dental and optical, in tiers Basic → Premium.

Lifetime Health Cover (LHC) loading. This is a surcharge added to the hospital premium when
someone first takes hospital cover later in life without prior cover — it encourages taking cover young and keeping it. The longer they waited, the higher the loading. Our simplified rule: loading = (age − 30) × 2%, applied only to hospital cover (never extras). (The real scheme caps the loading and removes it after years of continuous cover — we simplify.)

Monthly vs yearly. The monthly premium × 12 is the yearly premium before discount. If the customer chooses to pay yearly, the annual-payment discount is applied to that yearly total. Monthly payers do not receive the discount.

3. Technology (required)
Component | Requirement
Frontend - React
Backend - Node.js + Express
Database - SQLite
Styling - Basic CSS or simple UI styling

4. Quote Inputs (the data model)
Each quote record captures the following user inputs:
Input  | Options / notes
Customer name - Required
Cover type -  Single / Couple / Family
Applicant 1 - age 18–100
Applicant 1 - hospital cover history Yes / No / Not sure
Applicant 2 -  age Required only for Couple or Family
Applicant 2 -  hospital cover history Required only for Couple or Family
Hospital cover level - None / Basic / Bronze / Silver / Gold
Extras cover level - None / Basic / Standard / Premium
Payment frequency - Monthly / Yearly
Annual-payment discount % -  0–10% (only used when paying Yearly)
Notes - Optional

Family cover does not require children’s ages — children are not counted individually. The $30/month family upgrade fee is automatic; the user does not enter it.

5. Pricing Rules
All base prices are per adult, per month.
Hospital cover | Per adult / month
None  - $0
Basic - $90
Bronze - $120
Silver - $160
Gold - $220

Extras cover - Per adult / month
None $0
Basic $25
Standard $45
Premium $70

Cover type Adults counted
Single - 1 adult
Couple - 2 adults
Family - 2 adults + $30/month upgrade fee

There is no Couple or Family discount — the only discount is the annual-payment discount (0% min, 3–8% typical, 10% max), applied only when paying Yearly. The full premium is built like this:
hospital (per adult) = tier price × (1 + that adult’s LHC loading)
hospital total = sum over adults (1 for Single, 2 for Couple / Family)
extras total = extras tier price × adult count
family fee = $30 if Family, else $0
monthly premium = hospital total + extras total + family fee
yearly before discount = monthly premium × 12
yearly after discount = yearly before × (1 − annual discount) [Yearly only]

6. Lifetime Health Cover (LHC) Loading
Calculate hospital and extras separately. LHC loading applies only to hospital cover, per applicant. Your quote explanation must show this exact statement:

“Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.”
Loading depends on the applicant’s hospital cover history:

Cover history | LHC loading | Note
Yes (had cover before) | 0% | No loading.

No | (age − 30) × 2% | Only if age > 30 AND hospital cover is
selected , If age ≤ 30, loading = 0%

Not sure | 0% (do not apply) | Show a warning that the quote may be
inaccurate, e.g. “Applicant [1/2]: Cover history is unknown — LHC loading has not
been applied. This quote may be inaccurate.”

If hospital cover is None, no LHC loading is applied (there is nothing to load). For Couple and Family cover, compute each applicant’s loading separately. Example: a 40-year-old with no prior cover → loading = (40 − 30) × 2% = 20%.

7. Worked Example

Your logic should behave consistently with this example.

Table
Input | Value
Cover type -  Family
Applicant 1 - Age 40, hospital cover history = No
Applicant 2 - Age 35, hospital cover history = Yes
Hospital cover - Silver ($160 / adult / month)
Extras cover - Standard ($45 / adult / month)
Payment - Yearly, with a 5% annual discount

Table
Step | Result
Applicant 1 loading - Age 40, no history → (40−30)×2% = 20% → $160 × 1.20 = $192
Applicant 2 loading -  History = Yes → 0% → $160
Hospital total - $192 + $160 = $352
Extras total - $45 × 2 adults = $90
Family upgrade fee - $30
Monthly premium - $352 + $90 + $30 = $472
Yearly before discount - $472 × 12 = $5,664
Yearly after 5% discount - $5,664 × 0.95 = $5,380.80

The explanation sheet should show the hospital premium, extras premium, family upgrade fee, each applicant’s LHC loading, the yearly discount, and the final estimate.

8. Output — The Explanation Sheet
For each quote, display a plain-English breakdown including: estimated monthly premium; yearly
premium before discount; hospital premium; extras premium; each applicant’s LHC loading %; the family upgrade fee (if Family); the final total; any warnings; the required LHC statement; and a short explanation of how the quote was calculated.

Monthly vs Yearly — the one difference (state it once, clearly):
• Monthly payment: show the monthly premium and the yearly premium before discount. The annual discount is not applied.
• Yearly payment: show the monthly premium, the yearly premium before discount, and the yearly
premium after the annual discount.

9. Validation
The app must not crash or silently produce a misleading quote. Validate (and refuse to calculate a final quote when invalid):
• Missing customer name or cover selections.
• For Couple / Family: Applicant 2 age and history are required — if missing, show a clear message and do not calculate.
• Invalid ages (suggested valid range 18–100); annual discount below 0% or above 10%.
• “Not sure” history → do not auto-apply loading, but warn the quote may be inaccurate.

Frontend validation is required; backend validation is strongly recommended and rewarded under
robustness, because users can send invalid data directly to the API.

10. CRUD & Database
The app must create, view (list + detail), edit/update, and delete quotes, stored in SQLite.
Recommended approach: store the input fields and calculate the quote when displaying the detail page (so the logic lives in one place).

id, customer_name, cover_type,
applicant1_age, applicant1_cover_history,
applicant2_age, applicant2_cover_history,
hospital_cover, extras_cover, payment_frequency,
annual_discount, notes, created_at

Provide an init.sql file or a db.js script so the marker can create the database and run the project locally.

The applicant2_age and applicant2_cover_history are NULL for Single cover. The backend must perform null checks before accessing these fields.

11. Minimum UI
Include a quote-creation form, a quote list page, a quote detail page, and an edit page, with a clear, readable breakdown of the premium and both monthly and yearly estimates. Applicant 2 fields must appear only when Couple or Family is selected (React conditional rendering). The UI can be simple — correctness and clarity matter most; responsive design is encouraged but not required.

12. Submission

The video must show: creating a quote and viewing its explanation; the monthly and yearly estimates; editing, updating and deleting a quote; one example where LHC loading applies; and one example where the annual discount changes the yearly premium.

14. Marking — 100 Marks
A working CRUD app earns a solid base, but high marks need clear quote logic, a readable explanation, robustness and usability. A basic CRUD system alone cannot reach a high distinction.

A — Running Full-Stack CRUD System & Submission Completeness (35)

Criterion | Marks
React frontend starts and pages display without errors 5
Express backend starts and API endpoints respond 5
SQLite database set up via init.sql or db.js; data persists correctly 5
Create, view, edit/update and delete all work end-to-end 10
GitHub repo accessible, README explains how to install and run 5
Video submitted (3–5 min), playable, covers required demonstration steps 5
Section Total 35

B — Explanation Sheet, Breakdown & Warnings (20)
Criterion | Marks
Monthly and yearly premium estimates both displayed clearly 4
Hospital and extras costs shown as separate line items 4
Each applicant’s LHC loading % shown individually 4
Required LHC statement included (“loading applies only to hospital cover…”) 3
“Not sure” warning displayed per applicant; plain-English explanation of how the quote was calculated 5

Section Total 20

C — Robust Calculation Logic & Input Handling (25)

Criterion | Marks

Hospital and extras calculated separately; LHC loading applied to hospital only — verified against Section 7 worked example 6

Single / Couple / Family handled correctly; Family upgrade fee ($30/mo) applied automatically 5
Annual discount applied only when payment frequency is Yearly 4
Frontend validation: required fields, age range 18–100, discount 0–10%, 5
Applicant 2 fields required for Couple/Family
Backend validation: invalid or missing data returns a meaningful error, not a 500 crash 5

Section Total 25

Note: The Section 7 worked example is the primary verification tool for Section C. Expected output — monthly: $472, yearly before discount: $5,664, yearly after 5% discount: $5,380.80.

D — UI Quality, Usability & Presentation (20)

Criterion | Marks
Form layout is clear; every field has a label and an appropriate input type 5
Applicant 2 fields appear only when Couple or Family is selected (conditional rendering) 4
Quote list, detail and edit pages are easy to navigate 4
Quote breakdown on the detail page is readable and well-structured  4
Overall visual completeness and video demonstration clarity 3
Section Total 20

Edge cases markers will probe: Couple/Family with Applicant 2 missing; negative, zero or unrealistic age; discount outside 0–10%; hospital = None but loading still applied; extras-only cover wrongly loaded; “Not sure” history; and invalid data sent straight to the backend API.

The guiding principle

HealthCoverSim is about turning a few honest inputs into a clear, correct premium breakdown a
customer can understand: hospital and extras kept separate, LHC loading only on hospital, the family fee added once, and the discount applied only when paying yearly — every number explained in plain English.