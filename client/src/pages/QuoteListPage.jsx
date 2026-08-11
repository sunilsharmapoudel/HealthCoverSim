import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuotes, deleteQuote } from '../api';

const money = (n) => `$${Number(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    listQuotes()
      .then(setQuotes)
      .catch(() => setError('Could not load quotes.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this quote? This cannot be undone.')) return;
    await deleteQuote(id);
    load();
  }

  if (loading) return <p>Loading quotes...</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Quotes</h2>
        <Link className="button" to="/quotes/new">+ New quote</Link>
      </div>

      {quotes.length === 0 ? (
        <p>No quotes yet. Create one to get started.</p>
      ) : (
        <table className="quote-list-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Cover type</th>
              <th>Hospital</th>
              <th>Extras</th>
              <th>Frequency</th>
              <th>Monthly</th>
              <th>Yearly (after discount)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <td><Link to={`/quotes/${q.id}`}>{q.customer_name}</Link></td>
                <td>{q.cover_type}</td>
                <td>{q.hospital_cover}</td>
                <td>{q.extras_cover}</td>
                <td>{q.payment_frequency}</td>
                <td>{money(q.monthlyPremium)}</td>
                <td>{q.yearlyAfterDiscount !== null ? money(q.yearlyAfterDiscount) : '—'}</td>
                <td className="row-actions">
                  <Link to={`/quotes/${q.id}`}>View</Link>
                  <Link to={`/quotes/${q.id}/edit`}>Edit</Link>
                  <button className="link-button" onClick={() => handleDelete(q.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
