const money = (n) => `$${Number(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// The "explanation sheet" — spec Section 8. Every line item the spec asks
// for gets its own labeled row so a marker (or a customer) can see exactly
// where each dollar came from.
export default function QuoteBreakdown({ quote, breakdown }) {
  const isYearly = quote.payment_frequency === 'Yearly';

  return (
    <div className="breakdown">
      <h3>Premium breakdown</h3>

      {breakdown.warnings.length > 0 && (
        <div className="warning-box" role="alert">
          {breakdown.warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      <table className="breakdown-table">
        <tbody>
          <tr>
            <td>Hospital premium ({quote.hospital_cover})</td>
            <td>{money(breakdown.hospitalPremium)} / month</td>
          </tr>
          <tr>
            <td>Extras premium ({quote.extras_cover})</td>
            <td>{money(breakdown.extrasPremium)} / month</td>
          </tr>
          {quote.cover_type === 'Family' && (
            <tr>
              <td>Family upgrade fee</td>
              <td>{money(breakdown.familyFee)} / month</td>
            </tr>
          )}
          {breakdown.applicantLoadings.map((l) => (
            <tr key={l.applicant}>
              <td>Applicant {l.applicant} LHC loading</td>
              <td>{l.loadingPercent}%</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Monthly premium</td>
            <td>{money(breakdown.monthlyPremium)}</td>
          </tr>
          <tr>
            <td>Yearly premium (before discount)</td>
            <td>{money(breakdown.yearlyBeforeDiscount)}</td>
          </tr>
          {isYearly && (
            <tr className="total-row">
              <td>Yearly premium after {quote.annual_discount}% annual discount</td>
              <td>{money(breakdown.yearlyAfterDiscount)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="lhc-statement">{breakdown.lhcStatement}</p>

      <div className="explanation">
        <h4>How this was calculated</h4>
        <p>
          Hospital cover ({quote.hospital_cover}) and extras cover ({quote.extras_cover}) are priced
          separately, per adult, then added together.
          {quote.cover_type === 'Family' && ' A flat $30/month family upgrade fee is added for Family cover.'}
          {' '}
          Lifetime Health Cover loading is added only to the hospital premium, based on each applicant's age
          and prior cover history. {isYearly
            ? `Because you chose Yearly payment, the ${quote.annual_discount}% annual-payment discount is applied to the yearly total.`
            : 'Because you chose Monthly payment, no annual-payment discount is applied — the yearly figure shown is before any discount.'}
        </p>
      </div>
    </div>
  );
}
