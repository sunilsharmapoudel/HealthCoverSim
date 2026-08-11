// Mirrors server/validation.js (Section 9). Kept as a separate copy on
// purpose — frontend validation exists to give the user instant feedback
// before a request is even sent, but the backend re-checks everything
// independently since a client can always call the API directly.

const HISTORY_VALUES = ['Yes', 'No', 'Not sure'];

function isValidAge(age) {
  const n = Number(age);
  return age !== '' && Number.isInteger(n) && n >= 18 && n <= 100;
}

export function validateQuoteForm(form) {
  const errors = [];

  if (!form.customer_name.trim()) {
    errors.push('Customer name is required.');
  }

  if (!['Single', 'Couple', 'Family'].includes(form.cover_type)) {
    errors.push('Cover type is required.');
  }

  if (!isValidAge(form.applicant1_age)) {
    errors.push('Applicant 1 age is required and must be between 18 and 100.');
  }
  if (!HISTORY_VALUES.includes(form.applicant1_cover_history)) {
    errors.push('Applicant 1 hospital cover history is required.');
  }

  if (form.cover_type === 'Couple' || form.cover_type === 'Family') {
    if (!isValidAge(form.applicant2_age)) {
      errors.push('Applicant 2 age is required for Couple/Family cover and must be between 18 and 100.');
    }
    if (!HISTORY_VALUES.includes(form.applicant2_cover_history)) {
      errors.push('Applicant 2 hospital cover history is required for Couple/Family cover.');
    }
  }

  if (!form.hospital_cover) {
    errors.push('Hospital cover level is required.');
  }
  if (!form.extras_cover) {
    errors.push('Extras cover level is required.');
  }
  if (!['Monthly', 'Yearly'].includes(form.payment_frequency)) {
    errors.push('Payment frequency is required.');
  }

  if (form.payment_frequency === 'Yearly') {
    const discount = Number(form.annual_discount);
    if (form.annual_discount === '' || Number.isNaN(discount) || discount < 0 || discount > 10) {
      errors.push('Annual discount must be between 0% and 10%.');
    }
  }

  return errors;
}
