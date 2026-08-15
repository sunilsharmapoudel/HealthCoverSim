import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuoteFormFields from '../components/QuoteFormFields';
import { getQuote, updateQuote } from '../api';

function quoteToFormValues(quote) {
  return {
    customer_name: quote.customer_name,
    cover_type: quote.cover_type,
    applicant1_age: String(quote.applicant1_age),
    applicant1_cover_history: quote.applicant1_cover_history,
    applicant2_age: quote.applicant2_age !== null ? String(quote.applicant2_age) : '',
    applicant2_cover_history: quote.applicant2_cover_history || '',
    hospital_cover: quote.hospital_cover,
    extras_cover: quote.extras_cover,
    payment_frequency: quote.payment_frequency,
    annual_discount: String(quote.annual_discount),
    notes: quote.notes || '',
  };
}

export default function QuoteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuote(id)
      .then((quote) => setInitialValues(quoteToFormValues(quote)))
      .catch(() => setError('Quote not found.'));
  }, [id]);

  async function handleSubmit(data) {
    try {
      await updateQuote(id, data);
      navigate(`/quotes/${id}`);
    } catch (err) {
      setServerErrors(err.errors || ['Something went wrong.']);
    }
  }

  if (error) return <p className="error-box">{error}</p>;
  if (!initialValues) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit quote</h2>
      <QuoteFormFields
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        serverErrors={serverErrors}
      />
    </div>
  );
}
