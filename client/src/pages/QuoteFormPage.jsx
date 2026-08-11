import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteFormFields, { emptyQuoteForm } from '../components/QuoteFormFields';
import { createQuote } from '../api';

export default function QuoteFormPage() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState([]);

  async function handleSubmit(data) {
    try {
      const quote = await createQuote(data);
      navigate(`/quotes/${quote.id}`);
    } catch (err) {
      setServerErrors(err.errors || ['Something went wrong.']);
    }
  }

  return (
    <div>
      <h2>New quote</h2>
      <QuoteFormFields
        initialValues={emptyQuoteForm}
        onSubmit={handleSubmit}
        submitLabel="Create quote"
        serverErrors={serverErrors}
      />
    </div>
  );
}
