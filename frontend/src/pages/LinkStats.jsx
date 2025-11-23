import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLink } from '../api/links';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';

const APP_BASE_URL =
  process.env.REACT_APP_APP_BASE_URL || window.location.origin;

function formatDate(value) {
  if (!value) return 'Never';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function LinkStats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLink(code);
        setLink(data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setError('This short link does not exist or was deleted.');
        } else {
          setError(
            err?.response?.data?.error?.message ||
              'Failed to load link stats.'
          );
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  if (loading) {
    return (
      <div className="mt-6">
        <LoadingSpinner label="Loading link stats..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-slate-900/80 border border-rose-700 rounded-xl p-4 text-sm text-rose-100 shadow shadow-slate-900/80">
        <div className="font-medium mb-1">Unable to load stats</div>
        <div>{error}</div>
      </div>
    );
  }

  if (!link) {
    return null;
  }

  const shortUrl = `${APP_BASE_URL}/${link.code}`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Link stats
        </h1>
        <p className="text-sm text-slate-400">
          Detailed statistics for your short link.
        </p>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg shadow-slate-900/80 space-y-3">
        <div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            Short URL
          </div>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-mono text-indigo-300 hover:text-indigo-200 hover:underline break-all"
          >
            {shortUrl}
          </a>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            Original URL
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-100 hover:text-slate-50 hover:underline break-all"
          >
            {link.url}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total clicks"
          value={link.clickCount}
          sublabel="Incremented on each redirect"
        />
        <StatCard
          label="Created at"
          value={formatDate(link.createdAt)}
        />
        <StatCard
          label="Last clicked"
          value={formatDate(link.lastClickedAt)}
        />
      </div>
    </div>
  );
}

export default LinkStats;
