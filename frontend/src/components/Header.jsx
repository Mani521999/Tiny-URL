import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const onDashboard = location.pathname === '/';

  return (
    <header className="bg-slate-950/95 border-b border-slate-800 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            T
          </div>
          <div>
            <div className="text-base sm:text-lg font-semibold text-slate-50">
              TinyLink
            </div>
            <div className="text-[11px] text-slate-400">
              Minimal, fast URL shortener
            </div>
          </div>
        </Link>
        {!onDashboard && (
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition"
          >
            ← Back to dashboard
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
