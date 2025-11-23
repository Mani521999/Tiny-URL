import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const APP_BASE_URL =
  process.env.REACT_APP_APP_BASE_URL || window.location.origin;

function formatDate(value) {
  if (!value) return 'Never';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function LinksTable({
  links,
  loading,
  error,
  onDelete,
  search,
  setSearch
}) {
  const filtered = useMemo(() => {
    if (!search) return links;
    const term = search.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(term) ||
        l.url.toLowerCase().includes(term)
    );
  }, [links, search]);

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      window.alert('Short URL copied to clipboard');
    } catch (err) {
      window.alert('Failed to copy URL');
    }
  };

  if (loading) {
    return (
      <div className="mt-4">
        <LoadingSpinner label="Loading links..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-sm text-rose-300">
        {error || 'Failed to load links.'}
      </div>
    );
  }

  if (!links.length) {
    return <EmptyState />;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-xs text-slate-500">
          Showing {filtered.length} of {links.length} links
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-900/80">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/90">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Code
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Target URL
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Clicks
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Last clicked
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filtered.map((link) => {
              const shortUrl = `${APP_BASE_URL}/${link.code}`;
              return (
                <tr
                  key={link.code}
                  className="hover:bg-slate-900/80 transition"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-indigo-300">
                    {link.code}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-100">
                    <div className="table-cell-truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 hover:underline"
                        title={link.url}
                      >
                        {link.url}
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-slate-100">
                    {link.clickCount}
                  </td>
                  <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                    {formatDate(link.lastClickedAt)}
                  </td>
                  <td className="px-3 py-2 text-right text-xs whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(shortUrl)}
                        className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-800 transition"
                      >
                        Copy
                      </button>
                      <Link
                        to={`/code/${link.code}`}
                        className="inline-flex items-center rounded-full border border-indigo-500/60 bg-indigo-600/20 px-2.5 py-1 text-[11px] font-medium text-indigo-200 hover:bg-indigo-500/30 transition"
                      >
                        Stats
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete short link ${shortUrl}?`
                            )
                          ) {
                            onDelete(link.code);
                          }
                        }}
                        className="inline-flex items-center rounded-full border border-rose-500/70 bg-rose-600/20 px-2.5 py-1 text-[11px] font-medium text-rose-200 hover:bg-rose-500/30 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LinksTable;
