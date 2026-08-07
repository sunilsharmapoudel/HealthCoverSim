/**
 * Section 9 validation, shared shape used by both the create and update
 * routes. Works on the raw request body (snake_case, matching the DB
 * columns) and returns a list of human-readable error messages. Empty
 * array = valid.
 */

const COVER_TYPES = ['Single', 'Couple', 'Family'];
const HISTORY_VALUES = ['Yes', 'No', 'Not sure'];
const HOSPITAL_TIERS = ['None', 'Basic', 'Bronze', 'Silver', 'Gold'];
const EXTRAS_TIERS = ['None', 'Basic', 'Standard', 'Premium'];
const PAYMENT_FREQUENCIES = ['Monthly', 'Yearly'];

function isValidAge(age) {
  return Number.isInteger(age) && age >= 18 && age <= 100;
}

function validateQuoteInput(input) {
  const errors = [];

  if (!input.customer_name || typeof input.customer_name !== 'string' || !input.customer_name.trim()) {
    errors.push('Customer name is required.');
  }

  if (!COVER_TYPES.includes(input.cover_type)) {
    errors.push('Cover type is required and must be Single, Couple or Family.');
  }

  if (!isValidAge(input.applicant1_age)) {
    errors.push('Applicant 1 age is required and must be between 18 and 100.');
  }
  if (!HISTORY_VALUES.includes(input.applicant1_cover_history)) {
    errors.push('Applicant 1 hospital cover history is required (Yes, No or Not sure).');
  }

  if (input.cover_type === 'Couple' || input.cover_type === 'Family') {
    if (input.applicant2_age === null || input.applicant2_age === undefined || !isValidAge(input.applicant2_age)) {
      errors.push('Applicant 2 age is required for Couple/Family cover and must be between 18 and 100.');
    }
    if (!HISTORY_VALUES.includes(input.applicant2_cover_history)) {
      errors.push('Applicant 2 hospital cover history is required for Couple/Family cover (Yes, No or Not sure).');
    }
  }

  if (!HOSPITAL_TIERS.includes(input.hospital_cover)) {
    errors.push('Hospital cover level is required and must be one of None, Basic, Bronze, Silver, Gold.');
  }
  if (!EXTRAS_TIERS.includes(input.extras_cover)) {
    errors.push('Extras cover level is required and must be one of None, Basic, Standard, Premium.');
  }

  if (!PAYMENT_FREQUENCIES.includes(input.payment_frequency)) {
    errors.push('Payment frequency is required and must be Monthly or Yearly.');
  }

  const discount = input.annual_discount;
  if (discount === null || discount === undefined || typeof discount !== 'number' || Number.isNaN(discount)) {
    errors.push('Annual discount is required and must be a number between 0 and 10.');
  } else if (discount < 0 || discount > 10) {
    errors.push('Annual discount must be between 0% and 10%.');
  }

  return errors;
}

module.exports = { validateQuoteInput };
