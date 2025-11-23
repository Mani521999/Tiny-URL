import React, { useState } from 'react';
import { createLink } from '../api/links';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const APP_BASE_URL =
  process.env.REACT_APP_APP_BASE_URL || window.location.origin;

function LinkForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const validate = () => {
    const nextErrors = {};
    if (!url.trim()) {
      nextErrors.url = 'URL is required';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          nextErrors.url = 'URL must start with http:// or https://';
        }
      } catch (e) {
        nextErrors.url = 'Please enter a valid URL';
      }
    }
    if (code.trim()) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(code.trim())) {
        nextErrors.code = 'Custom code must be 6–8 letters or digits';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { url: url.trim() };
      if (code.trim()) payload.code = code.trim();

      const link = await createLink(payload);
      setUrl('');
      setCode('');
      setErrors({});
      setSuccessMessage(
        `Short link created: ${APP_BASE_URL}/${link.code}`
      );
      if (onCreated) onCreated(link);
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.error?.message ||
        'Something went wrong while creating the link.';
      if (status === 409) {
        setErrors({
          ...errors,
          code: 'That code is already in use, please choose another.'
        });
      } else if (status === 400) {
        setErrors({
          ...errors,
          url: message
        });
      } else {
        setErrors({ form: message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-lg shadow-slate-900/80 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <Alert type="error">
            <span className="font-medium mr-1">Error:</span>
            {errors.form}
          </Alert>
        )}
        {successMessage && (
          <Alert type="success">{successMessage}</Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex-1">
            <label
              htmlFor="url"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Long URL<span className="text-rose-400">*</span>
            </label>
            <input
              id="url"
              type="url"
              className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={validate}
            />
            {errors.url && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.url}
              </p>
            )}
          </div>

          <div className="w-full sm:w-56">
            <label
              htmlFor="code"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Custom code (optional)
            </label>
            <input
              id="code"
              type="text"
              className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500"
              placeholder="e.g. MyLink1"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={validate}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              6–8 letters or digits. Leave blank to auto-generate.
            </p>
            {errors.code && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.code}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/40 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
          >
            {submitting ? (
              <LoadingSpinner label="Creating..." />
            ) : (
              'Create short link'
            )}
          </button>
          <p className="text-[11px] text-slate-500">
            Your short links will appear in the table below.
          </p>
        </div>
      </form>
    </div>
  );
}

export default LinkForm;
