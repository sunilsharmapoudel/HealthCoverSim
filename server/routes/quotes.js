const express = require('express');
const db = require('../db');
const { calculateQuote } = require('../pricing');
const { validateQuoteInput } = require('../validation');

const router = express.Router();

// Coerce raw request body into consistent types before validation/storage.
// Frontend forms and direct API calls both land here, so this is the one
// place that normalizes "18" (string) vs 18 (number), trims whitespace, and
// nulls out applicant 2 fields for Single cover regardless of what was sent.
function normalizeInput(body) {
  const coverType = body.cover_type;
  const toNumberOrNull = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

  return {
    customer_name: typeof body.customer_name === 'string' ? body.customer_name.trim() : body.customer_name,
    cover_type: coverType,
    applicant1_age: toNumberOrNull(body.applicant1_age),
    applicant1_cover_history: body.applicant1_cover_history,
    applicant2_age: coverType === 'Single' ? null : toNumberOrNull(body.applicant2_age),
    applicant2_cover_history: coverType === 'Single' ? null : body.applicant2_cover_history,
    hospital_cover: body.hospital_cover,
    extras_cover: body.extras_cover,
    payment_frequency: body.payment_frequency,
    annual_discount: toNumberOrNull(body.annual_discount) ?? 0,
    notes: typeof body.notes === 'string' ? body.notes.trim() : body.notes || null,
  };
}

function rowToPricingInput(row) {
  return {
    coverType: row.cover_type,
    applicant1: { age: row.applicant1_age, coverHistory: row.applicant1_cover_history },
    applicant2:
      row.cover_type === 'Single'
        ? null
        : { age: row.applicant2_age, coverHistory: row.applicant2_cover_history },
    hospitalCover: row.hospital_cover,
    extrasCover: row.extras_cover,
    paymentFrequency: row.payment_frequency,
    annualDiscount: row.annual_discount,
  };
}

// GET /api/quotes — list, with a lightweight premium summary per row so the
// list page is actually useful without opening every quote.
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all();
  const summaries = rows.map((row) => {
    const breakdown = calculateQuote(rowToPricingInput(row));
    return {
      id: row.id,
      customer_name: row.customer_name,
      cover_type: row.cover_type,
      hospital_cover: row.hospital_cover,
      extras_cover: row.extras_cover,
      payment_frequency: row.payment_frequency,
      created_at: row.created_at,
      monthlyPremium: breakdown.monthlyPremium,
      yearlyAfterDiscount: breakdown.yearlyAfterDiscount,
    };
  });
  res.json(summaries);
});

// GET /api/quotes/:id — full row plus the calculated explanation sheet.
// The breakdown is never stored — it's recalculated from the stored inputs
// every time, so pricing.js stays the single source of truth (spec Section 10).
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ errors: ['Quote not found.'] });
  }
  res.json({ ...row, breakdown: calculateQuote(rowToPricingInput(row)) });
});

router.post('/', (req, res) => {
  const input = normalizeInput(req.body);
  const errors = validateQuoteInput(input);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const result = db
    .prepare(
      `INSERT INTO quotes (
        customer_name, cover_type,
        applicant1_age, applicant1_cover_history,
        applicant2_age, applicant2_cover_history,
        hospital_cover, extras_cover, payment_frequency,
        annual_discount, notes
      ) VALUES (@customer_name, @cover_type, @applicant1_age, @applicant1_cover_history,
        @applicant2_age, @applicant2_cover_history, @hospital_cover, @extras_cover,
        @payment_frequency, @annual_discount, @notes)`
    )
    .run(input);

  const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...row, breakdown: calculateQuote(rowToPricingInput(row)) });
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ errors: ['Quote not found.'] });
  }

  const input = normalizeInput(req.body);
  const errors = validateQuoteInput(input);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  db.prepare(
    `UPDATE quotes SET
      customer_name = @customer_name,
      cover_type = @cover_type,
      applicant1_age = @applicant1_age,
      applicant1_cover_history = @applicant1_cover_history,
      applicant2_age = @applicant2_age,
      applicant2_cover_history = @applicant2_cover_history,
      hospital_cover = @hospital_cover,
      extras_cover = @extras_cover,
      payment_frequency = @payment_frequency,
      annual_discount = @annual_discount,
      notes = @notes
    WHERE id = @id`
  ).run({ ...input, id: req.params.id });

  const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  res.json({ ...row, breakdown: calculateQuote(rowToPricingInput(row)) });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM quotes WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ errors: ['Quote not found.'] });
  }
  res.status(204).send();
});

module.exports = router;
