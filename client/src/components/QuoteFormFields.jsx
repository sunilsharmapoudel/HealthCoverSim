import { useState } from 'react';
import { validateQuoteForm } from '../validation';

export const emptyQuoteForm = {
  customer_name: '',
  cover_type: 'Single',
  applicant1_age: '',
  applicant1_cover_history: '',
  applicant2_age: '',
  applicant2_cover_history: '',
  hospital_cover: '',
  extras_cover: '',
  payment_frequency: 'Monthly',
  annual_discount: '0',
  notes: '',
};

// Shared by the Create and Edit pages — same fields, same validation, same
// conditional Applicant 2 rendering. Only what happens on submit differs
// (POST vs PUT), which the parent page supplies via onSubmit.
export default function QuoteFormFields({ initialValues, onSubmit, submitLabel, serverErrors }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState([]);

  const showApplicant2 = form.cover_type === 'Couple' || form.cover_type === 'Family';
  const showDiscount = form.payment_frequency === 'Yearly';

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateQuoteForm(form);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    onSubmit({
      ...form,
      applicant1_age: Number(form.applicant1_age),
      applicant2_age: showApplicant2 ? Number(form.applicant2_age) : null,
      applicant2_cover_history: showApplicant2 ? form.applicant2_cover_history : null,
      annual_discount: showDiscount ? Number(form.annual_discount) : 0,
    });
  }

  const allErrors = [...errors, ...(serverErrors || [])];

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      {allErrors.length > 0 && (
        <div className="error-box" role="alert">
          <strong>Please fix the following:</strong>
          <ul>
            {allErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="customer_name">Customer name</label>
        <input
          id="customer_name"
          type="text"
          value={form.customer_name}
          onChange={(e) => handleChange('customer_name', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="cover_type">Cover type</label>
        <select
          id="cover_type"
          value={form.cover_type}
          onChange={(e) => handleChange('cover_type', e.target.value)}
        >
          <option value="Single">Single</option>
          <option value="Couple">Couple</option>
          <option value="Family">Family</option>
        </select>
      </div>

      <fieldset>
        <legend>Applicant 1</legend>
        <div className="field">
          <label htmlFor="applicant1_age">Age (18-100)</label>
          <input
            id="applicant1_age"
            type="number"
            min="18"
            max="100"
            value={form.applicant1_age}
            onChange={(e) => handleChange('applicant1_age', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="applicant1_cover_history">Prior hospital cover history</label>
          <select
            id="applicant1_cover_history"
            value={form.applicant1_cover_history}
            onChange={(e) => handleChange('applicant1_cover_history', e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not sure">Not sure</option>
          </select>
        </div>
      </fieldset>

      {showApplicant2 && (
        <fieldset>
          <legend>Applicant 2</legend>
          <div className="field">
            <label htmlFor="applicant2_age">Age (18-100)</label>
            <input
              id="applicant2_age"
              type="number"
              min="18"
              max="100"
              value={form.applicant2_age}
              onChange={(e) => handleChange('applicant2_age', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="applicant2_cover_history">Prior hospital cover history</label>
            <select
              id="applicant2_cover_history"
              value={form.applicant2_cover_history}
              onChange={(e) => handleChange('applicant2_cover_history', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>
        </fieldset>
      )}

      <div className="field">
        <label htmlFor="hospital_cover">Hospital cover level</label>
        <select
          id="hospital_cover"
          value={form.hospital_cover}
          onChange={(e) => handleChange('hospital_cover', e.target.value)}
        >
          <option value="">Select...</option>
          <option value="None">None</option>
          <option value="Basic">Basic ($90/adult/mo)</option>
          <option value="Bronze">Bronze ($120/adult/mo)</option>
          <option value="Silver">Silver ($160/adult/mo)</option>
          <option value="Gold">Gold ($220/adult/mo)</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="extras_cover">Extras cover level</label>
        <select
          id="extras_cover"
          value={form.extras_cover}
          onChange={(e) => handleChange('extras_cover', e.target.value)}
        >
          <option value="">Select...</option>
          <option value="None">None</option>
          <option value="Basic">Basic ($25/adult/mo)</option>
          <option value="Standard">Standard ($45/adult/mo)</option>
          <option value="Premium">Premium ($70/adult/mo)</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="payment_frequency">Payment frequency</label>
        <select
          id="payment_frequency"
          value={form.payment_frequency}
          onChange={(e) => handleChange('payment_frequency', e.target.value)}
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {showDiscount && (
        <div className="field">
          <label htmlFor="annual_discount">Annual-payment discount % (0-10)</label>
          <input
            id="annual_discount"
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={form.annual_discount}
            onChange={(e) => handleChange('annual_discount', e.target.value)}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={form.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <button type="submit">{submitLabel}</button>
    </form>
  );
}
