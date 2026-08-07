/**
 * HealthCoverSim pricing engine.
 *
 * This is a PURE function: given a quote's inputs, return the full premium
 * breakdown. No Express, no SQLite, no React — just the business logic from
 * the spec (Sections 5-7). Keeping it pure means you can test it directly
 * with plain function calls before any framework is involved, and later the
 * Express route and the React detail page can both just call this function.
 *
 * ---- INPUT SHAPE (the "quote" object you receive) ----
 * {
 *   coverType: 'Single' | 'Couple' | 'Family',
 *   applicant1: { age: number, coverHistory: 'Yes' | 'No' | 'Not sure' },
 *   applicant2: { age: number, coverHistory: 'Yes' | 'No' | 'Not sure' } | null,
 *   hospitalCover: 'None' | 'Basic' | 'Bronze' | 'Silver' | 'Gold',
 *   extrasCover: 'None' | 'Basic' | 'Standard' | 'Premium',
 *   paymentFrequency: 'Monthly' | 'Yearly',
 *   annualDiscount: number, // 0-10, only meaningful when paymentFrequency === 'Yearly'
 * }
 *
 * ---- OUTPUT SHAPE (what the explanation sheet needs — see Section 8) ----
 * Suggested shape (feel free to adjust field names, but keep everything the
 * spec asks the explanation sheet to show):
 * {
 *   hospitalPremium: number,       // hospital total, monthly
 *   extrasPremium: number,         // extras total, monthly
 *   familyFee: number,             // 0 or 30
 *   monthlyPremium: number,        // hospital + extras + familyFee
 *   yearlyBeforeDiscount: number,  // monthlyPremium * 12
 *   yearlyAfterDiscount: number | null, // only set when paymentFrequency === 'Yearly'
 *   applicantLoadings: [           // one entry per applicant that has hospital cover
 *     { applicant: 1, loadingPercent: number },
 *     { applicant: 2, loadingPercent: number }, // omitted for Single
 *   ],
 *   warnings: string[],            // e.g. "Not sure" history warning per applicant
 *   lhcStatement: string,          // the exact required sentence, see below
 * }
 *
 * Required statement (must appear verbatim somewhere in your output):
 * "Lifetime Health Cover loading applies only to hospital cover. It does not
 * apply to extras cover."
 *
 * ---- YOUR TASK ----
 * Implement calculateQuote() below. Suggested sub-steps (write a small
 * helper for each — it'll make this easy to unit test and easy to read):
 *
 *   1. getHospitalTierPrice(tier)       -> per-adult monthly $ (Section 5 table)
 *   2. getExtrasTierPrice(tier)         -> per-adult monthly $ (Section 5 table)
 *   3. getAdultCount(coverType)         -> 1 for Single, 2 for Couple/Family
 *   4. calculateLhcLoading(age, coverHistory, hospitalCover)
 *        -> loading as a decimal (e.g. 0.20 for 20%), following Section 6:
 *           - hospitalCover === 'None'        -> 0
 *           - coverHistory === 'Yes'          -> 0
 *           - coverHistory === 'Not sure'     -> 0 (but caller must add a warning)
 *           - coverHistory === 'No'           -> age > 30 ? (age - 30) * 0.02 : 0
 *   5. calculateQuote(quote) that composes the above:
 *        - hospital premium per adult = tierPrice * (1 + loading)
 *        - hospital total = sum over adults
 *        - extras total = extrasTierPrice * adultCount (no loading — ever)
 *        - familyFee = coverType === 'Family' ? 30 : 0
 *        - monthlyPremium = hospitalTotal + extrasTotal + familyFee
 *        - yearlyBeforeDiscount = monthlyPremium * 12
 *        - yearlyAfterDiscount = paymentFrequency === 'Yearly'
 *              ? yearlyBeforeDiscount * (1 - annualDiscount / 100)
 *              : null
 *        - collect warnings for any 'Not sure' applicant
 *
 * Do NOT do input validation here (missing name, out-of-range age, etc.) —
 * that's a separate concern (Section 9) that belongs in front of this
 * function, not inside it. Assume the input is already well-formed.
 *
 * Round money to 2 decimal places only at the very end, in the fields you
 * return — don't round intermediate values (that's how the worked example
 * in Section 7 stays exact).
 */

// WORKED EXAMPLE — study this one, then write getHospitalTierPrice below it
// yourself, following the same shape. This is just "look up a value in a
// table by name" — a plain JS object used as a dictionary.
function getExtrasTierPrice(tier) {
  const prices = {
    None: 0,
    Basic: 25,
    Standard: 45,
    Premium: 70,
  };
  return prices[tier];
}

// YOUR TURN — same pattern as above, but for the hospital table in Section 5
// (None/Basic/Bronze/Silver/Gold -> 0/90/120/160/220).
function getHospitalTierPrice(tier) {
  // TODO: implement me, same shape as getExtrasTierPrice above
  const prices = {
    None: 0,
    Basic: 90,
    Bronze: 120,
    Silver: 160,
    Gold: 220,
  }
  return prices[tier];
};

function getAdultCount(coverType) {
  const adultCount = {
    Single: 1,
    Couple: 2,
    Family: 2,
  }
  return adultCount[coverType];
}

function calculateLhcLoading(age, coverHistory, hospitalCover) {
  if (hospitalCover === 'None') {
    return 0;
  }
  if (coverHistory === 'Yes') {
    return 0;
  }
  if (coverHistory === 'Not sure') {
    return 0;
  }
  // Only 'No' is left at this point. TODO: return the Section 6 formula
  // when age > 30, otherwise 0. (age - 30) times what, as a decimal?
  if (age > 30) {
   return (age - 30)*0.02; // TODO: replace with the real formula
  }
  return 0;
}

function calculateQuote(quote) {


  const adultCount = getAdultCount(coverType);
  const hospitalTierPrice = getHospitalTierPrice(hospitalCover);
  const extrasTierPrice = getExtrasTierPrice(extrasCover);

  // TODO 1: build the applicants array to loop over.
  // Single -> just [applicant1]. Couple/Family -> [applicant1, applicant2].
  // (applicant2 is null for Single — don't include it in that case.)
  const applicants = []; // TODO

  const applicantLoadings = [];
  const warnings = [];
  let hospitalTotal = 0;

  // TODO 2: loop over `applicants` (use .forEach or a for..of loop).
  // For each applicant, at index i (0-based, so applicant number is i+1):
  //   - loading = calculateLhcLoading(applicant.age, applicant.coverHistory, hospitalCover)
  //   - push { applicant: i + 1, loadingPercent: loading * 100 } onto applicantLoadings
  //   - hospitalTotal += hospitalTierPrice * (1 + loading)
  //   - if applicant.coverHistory === 'Not sure', push a warning string onto `warnings`
  //     (something like: `Applicant ${i + 1}: Cover history is unknown — LHC loading
  //     has not been applied. This quote may be inaccurate.`)

  // TODO 3: extrasTotal = extrasTierPrice * adultCount (never loaded — no LHC here)
  const extrasTotal = 0; // TODO

  // TODO 4: familyFee = 30 if coverType === 'Family', else 0
  const familyFee = 0; // TODO

  // TODO 5: monthlyPremium = hospitalTotal + extrasTotal + familyFee
  const monthlyPremium = 0; // TODO

  // TODO 6: yearlyBeforeDiscount = monthlyPremium * 12
  const yearlyBeforeDiscount = 0; // TODO

  // TODO 7: yearlyAfterDiscount — only when paymentFrequency === 'Yearly',
  // else null. Formula: yearlyBeforeDiscount * (1 - annualDiscount / 100)
  const yearlyAfterDiscount = null; // TODO

  return {
    // TODO 8: round each money value to 2dp here, e.g. Math.round(x * 100) / 100
    hospitalPremium: hospitalTotal,
    extrasPremium: extrasTotal,
    familyFee,
    monthlyPremium,
    yearlyBeforeDiscount,
    yearlyAfterDiscount,
    applicantLoadings,
    warnings,
    lhcStatement: 'Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.',
  };
}

module.exports = { calculateQuote, getExtrasTierPrice, getHospitalTierPrice, getAdultCount, calculateLhcLoading };

