/**
 * Plain-Node test runner for pricing.js — no framework needed yet.
 * Run with:  node pricing.test.js
 *
 * Once all of these pass, you've verified your pricing engine against the
 * Section 7 worked example and the main edge cases markers will probe
 * (Section 14 notes). This is the same example the assignment uses to grade
 * Section C, so it doubles as your own grading check.
 */

const { calculateQuote } = require('./pricing');

let passed = 0;
let failed = 0;

function approxEqual(a, b, epsilon = 0.001) {
  return Math.abs(a - b) < epsilon;
}

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log('\n--- Worked example (spec Section 7) ---');
test('Family, Silver hospital, Standard extras, Yearly 5% discount', () => {
  const result = calculateQuote({
    coverType: 'Family',
    applicant1: { age: 40, coverHistory: 'No' },
    applicant2: { age: 35, coverHistory: 'Yes' },
    hospitalCover: 'Silver',
    extrasCover: 'Standard',
    paymentFrequency: 'Yearly',
    annualDiscount: 5,
  });

  assert(approxEqual(result.hospitalPremium, 352), `hospitalPremium should be 352, got ${result.hospitalPremium}`);
  assert(approxEqual(result.extrasPremium, 90), `extrasPremium should be 90, got ${result.extrasPremium}`);
  assert(approxEqual(result.familyFee, 30), `familyFee should be 30, got ${result.familyFee}`);
  assert(approxEqual(result.monthlyPremium, 472), `monthlyPremium should be 472, got ${result.monthlyPremium}`);
  assert(approxEqual(result.yearlyBeforeDiscount, 5664), `yearlyBeforeDiscount should be 5664, got ${result.yearlyBeforeDiscount}`);
  assert(approxEqual(result.yearlyAfterDiscount, 5380.80), `yearlyAfterDiscount should be 5380.80, got ${result.yearlyAfterDiscount}`);

  const a1 = result.applicantLoadings.find((l) => l.applicant === 1);
  const a2 = result.applicantLoadings.find((l) => l.applicant === 2);
  assert(approxEqual(a1.loadingPercent, 20), `applicant 1 loading should be 20, got ${a1.loadingPercent}`);
  assert(approxEqual(a2.loadingPercent, 0), `applicant 2 loading should be 0, got ${a2.loadingPercent}`);
});

console.log('\n--- Monthly payment: no discount applied ---');
test('Single, Basic hospital, no extras, Monthly', () => {
  const result = calculateQuote({
    coverType: 'Single',
    applicant1: { age: 25, coverHistory: 'Yes' },
    applicant2: null,
    hospitalCover: 'Basic',
    extrasCover: 'None',
    paymentFrequency: 'Monthly',
    annualDiscount: 0,
  });
  assert(approxEqual(result.monthlyPremium, 90), `monthlyPremium should be 90, got ${result.monthlyPremium}`);
  assert(approxEqual(result.yearlyBeforeDiscount, 1080), `yearlyBeforeDiscount should be 1080, got ${result.yearlyBeforeDiscount}`);
  assert(result.yearlyAfterDiscount === null, `yearlyAfterDiscount should be null for Monthly, got ${result.yearlyAfterDiscount}`);
});

console.log('\n--- LHC loading edge cases ---');
test('Age <= 30 with no history -> 0% loading, even though history is No', () => {
  const result = calculateQuote({
    coverType: 'Single',
    applicant1: { age: 28, coverHistory: 'No' },
    applicant2: null,
    hospitalCover: 'Gold',
    extrasCover: 'None',
    paymentFrequency: 'Monthly',
    annualDiscount: 0,
  });
  assert(approxEqual(result.applicantLoadings[0].loadingPercent, 0), `loading should be 0, got ${result.applicantLoadings[0].loadingPercent}`);
  assert(approxEqual(result.hospitalPremium, 220), `hospitalPremium should be 220 (no loading), got ${result.hospitalPremium}`);
});

test('Hospital cover = None -> no loading applied even if history is No and age > 30', () => {
  const result = calculateQuote({
    coverType: 'Single',
    applicant1: { age: 50, coverHistory: 'No' },
    applicant2: null,
    hospitalCover: 'None',
    extrasCover: 'Premium',
    paymentFrequency: 'Monthly',
    annualDiscount: 0,
  });
  assert(approxEqual(result.hospitalPremium, 0), `hospitalPremium should be 0, got ${result.hospitalPremium}`);
  assert(approxEqual(result.extrasPremium, 70), `extrasPremium should be 70 and never loaded, got ${result.extrasPremium}`);
});

test('"Not sure" history -> 0% loading AND a warning is produced', () => {
  const result = calculateQuote({
    coverType: 'Single',
    applicant1: { age: 45, coverHistory: 'Not sure' },
    applicant2: null,
    hospitalCover: 'Silver',
    extrasCover: 'None',
    paymentFrequency: 'Monthly',
    annualDiscount: 0,
  });
  assert(approxEqual(result.applicantLoadings[0].loadingPercent, 0), `loading should be 0, got ${result.applicantLoadings[0].loadingPercent}`);
  assert(result.warnings.length > 0, 'expected at least one warning for "Not sure" history');
});

console.log('\n--- Required LHC statement ---');
test('Output includes the exact required statement (Section 6)', () => {
  const result = calculateQuote({
    coverType: 'Single',
    applicant1: { age: 40, coverHistory: 'Yes' },
    applicant2: null,
    hospitalCover: 'Basic',
    extrasCover: 'None',
    paymentFrequency: 'Monthly',
    annualDiscount: 0,
  });
  const expected = 'Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.';
  assert(result.lhcStatement === expected, `lhcStatement did not match exactly.\n  expected: "${expected}"\n  got:      "${result.lhcStatement}"`);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
