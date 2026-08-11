import { Link, Route, Routes } from 'react-router-dom';
import QuoteListPage from './pages/QuoteListPage';
import QuoteFormPage from './pages/QuoteFormPage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import QuoteEditPage from './pages/QuoteEditPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title">HealthCoverSim</Link>
        <p className="app-subtitle">Private Health Insurance Quote Simulator — learning demo, not financial advice.</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<QuoteListPage />} />
          <Route path="/quotes/new" element={<QuoteFormPage />} />
          <Route path="/quotes/:id" element={<QuoteDetailPage />} />
          <Route path="/quotes/:id/edit" element={<QuoteEditPage />} />
        </Routes>
      </main>
    </div>
  );
}
