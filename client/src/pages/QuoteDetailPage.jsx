import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getQuote, deleteQuote } from '../api';
import QuoteBreakdown from '../components/QuoteBreakdown';

export default function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQuote(id)
      .then(setQuote)
      .catch(() => setError('Quote not found.'));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this quote? This cannot be undone.')) return;
    await deleteQuote(id);
    navigate('/');
  }

  if (error) return <p className="error-box">{error}</p>;
  if (!quote) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h2>{quote.customer_name}</h2>
        <div className="row-actions">
          <Link className="button" to={`/quotes/${id}/edit`}>Edit</Link>
          <button className="button danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="quote-summary">
        <p><strong>Cover type:</strong> {quote.cover_type}</p>
        <p><strong>Applicant 1:</strong> Age {quote.applicant1_age}, cover history: {quote.applicant1_cover_history}</p>
        {quote.cover_type !== 'Single' && (
          <p><strong>Applicant 2:</strong> Age {quote.applicant2_age}, cover history: {quote.applicant2_cover_history}</p>
        )}
        <p><strong>Payment frequency:</strong> {quote.payment_frequency}</p>
        {quote.notes && <p><strong>Notes:</strong> {quote.notes}</p>}
      </div>

      <QuoteBreakdown quote={quote} breakdown={quote.breakdown} />

      <p><Link to="/">← Back to all quotes</Link></p>
    </div>
  );
}
