const express = require('express');
const cors = require('cors');
const quotesRouter = require('./routes/quotes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/quotes', quotesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Catches malformed JSON bodies (express.json() throws) and anything else
// thrown/rejected in a route — so bad input always returns a JSON error
// instead of an unhandled exception crashing the process or leaking a stack
// trace as a raw HTML 500 page (spec Section 9: backend must not crash).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ errors: ['Invalid request.'] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HealthCoverSim API listening on http://localhost:${PORT}`);
});
