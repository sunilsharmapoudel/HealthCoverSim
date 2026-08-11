# Recording script — HealthCoverSim demo video

Target length: **3-5 minutes** (Section 12 / Section A requirement — 5 marks
just for submitting a playable video that covers the required steps).

## Why this script is structured this way

The video is graded against two things markers will have open side by side:

- **Section 7's worked example** (Family, Silver hospital, Standard extras,
  ages 40/35, Yearly + 5% discount → monthly $472, yearly before $5,664,
  yearly after discount $5,380.80). Section C explicitly calls this "the
  primary verification tool" for 25 of your marks. **Use these exact
  numbers in the video** — don't improvise different figures, since then
  the marker has to do the maths themselves instead of just checking yours.
- **Section 8's explanation sheet requirements** (20 marks): monthly premium,
  yearly before discount, hospital/extras as separate lines, each
  applicant's LHC loading %, the family fee, the exact LHC statement, and
  warnings. When you land on the detail page, don't just glance past it —
  pause and read each line out loud. That's what turns "the page rendered"
  into "the marker can see every required element."

One quote (the worked example) naturally demonstrates **both** required
examples from Section 12 at once — it has LHC loading (Applicant 1, 20%)
*and* a Yearly discount (5%) — so you don't need a second quote to prove
either. Use a second quote only for the edit/delete part.

## Before you hit record

- [ ] Backend running: `cd server && npm start` (port 4000)
- [ ] Frontend running: `cd client && npm run dev` (port 5173)
- [ ] Quote list is empty or only has quotes you're fine showing on camera
      (currently empty — good starting state)
- [ ] Browser zoomed so text is readable on a recording (110-125% is usually
      enough)
- [ ] Close other tabs/notifications — anything visible on screen is visible
      to the marker

## Script

### 0:00-0:20 — Intro

> "This is HealthCoverSim, a private health insurance quote simulator. It's
> a React frontend, an Express and SQLite backend, and it calculates a
> premium from cover type, hospital and extras tiers, applicant ages, and
> Lifetime Health Cover loading. Let's create a quote."

Show the empty quote list for a second first — this is your evidence the
React frontend starts cleanly with no errors (Section A, 5 marks).

### 0:20-1:30 — Create the worked-example quote

Click **+ New quote** and fill in, narrating as you type (don't type in
silence):

| Field | Value |
|---|---|
| Customer name | e.g. "Jane Doe" |
| Cover type | **Family** — mention: "Family cover needs a second applicant, and you'll see those fields appear now" (this line alone demonstrates the conditional-rendering mark, Section D) |
| Applicant 1 | Age **40**, history **No** |
| Applicant 2 | Age **35**, history **Yes** |
| Hospital cover | **Silver** |
| Extras cover | **Standard** |
| Payment frequency | **Yearly** |
| Annual discount | **5** |

Say out loud before submitting: *"Applicant 1 is 40 with no prior cover, so
they should get Lifetime Health Cover loading — 20 percent, since they're
10 years past 30. Applicant 2 has prior cover, so no loading for them."*
This is the moment that proves you understand *why* the number is what it
is, not just that the app produced a number.

Click **Create quote**.

### 1:30-2:30 — Read the explanation sheet out loud

On the detail page, point at (cursor or verbally) each line, in this order:

1. "Hospital premium — $352, that's Silver at $160 per adult, with
   Applicant 1's 20% loading applied and Applicant 2's 0%."
2. "Extras premium — $90, Standard at $45 times two adults. Notice extras
   never gets LHC loading."
3. "Family upgrade fee — $30, flat, because this is Family cover."
4. "Each applicant's loading shown individually — 20% and 0%."
5. "Monthly premium: $472."
6. "Yearly before discount: $5,664 — that's monthly times 12."
7. "Yearly after the 5% annual discount: $5,380.80 — this is the number
   that only appears because I chose Yearly payment."
8. Read the required LHC statement sentence out loud.

This single 60-second beat is worth doing slowly and clearly — it's most
of Section B's 20 marks in one shot.

### 2:30-3:00 — Edit the quote

Click **Edit**, change hospital cover from Silver to **Gold**, save.

> "I've upgraded the hospital cover to Gold, and the breakdown recalculates
> automatically — monthly premium is now higher, and the yearly figures
> update with it."

Point out the new numbers changed. This demonstrates update working
end-to-end (Section A, 10 marks) and that the calculation isn't cached.

### 3:00-3:30 — Delete the quote

Go back to the list, click **Delete**, confirm the dialog, show the quote
is gone from the list.

### 3:30-3:50 (optional, if you have time left) — One validation example

Click **+ New quote**, select **Couple**, leave Applicant 2 blank, try to
submit.

> "The form won't let me submit without Applicant 2's details for Couple
> cover — validation happens on the frontend before anything is sent, and
> the backend checks independently too if you call the API directly."

This is optional — not explicitly required by Section 12 — but it's a fast
way to visibly touch Section C's validation marks if you have 15-20 seconds
spare. Skip it if you're already near 5 minutes.

### 3:50-4:00 — Close

> "That's HealthCoverSim — create, view, edit and delete all working end to
> end, with hospital and extras priced separately, LHC loading applied only
> to hospital cover, and the annual discount applied only when paying
> yearly."

## Delivery tips

- **Narrate while you type/click, not after.** Dead air while you fill a
  form reads as "nothing is happening" on video even though you're working.
- **Don't rush the explanation-sheet read-through** (1:30-2:30) — it's the
  single highest-value 60 seconds in the whole video for marks.
- If you flub a line, don't restart the whole recording — pause, take a
  breath, redo the sentence, and trim it in editing. A 3:40 video with one
  clean cut beats a 5:00 one-take with a stumble.
- Keep the final file under whatever size/format limit your submission
  platform states (check the assignment portal — not specified in the
  project brief itself).
