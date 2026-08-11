const API_BASE = 'http://localhost:4000/api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const body = await res.json();
  if (!res.ok) {
    const error = new Error('Request failed');
    error.errors = body.errors || ['Something went wrong.'];
    throw error;
  }
  return body;
}

export const listQuotes = () => request('/quotes');
export const getQuote = (id) => request(`/quotes/${id}`);
export const createQuote = (data) => request('/quotes', { method: 'POST', body: JSON.stringify(data) });
export const updateQuote = (id, data) =>
  request(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteQuote = (id) => request(`/quotes/${id}`, { method: 'DELETE' });
