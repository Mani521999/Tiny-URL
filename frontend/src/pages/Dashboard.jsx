import React, { useEffect, useState, useCallback } from 'react';
import { fetchLinks, deleteLink } from '../api/links';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      const message =
        err?.response?.data?.error?.message ||
        'Failed to load links. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const handleCreated = () => {
    loadLinks();
  };

  const handleDelete = async (code) => {
    try {
      await deleteLink(code);
      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch (err) {
      const message =
        err?.response?.data?.error?.message ||
        'Failed to delete link. Please try again.';
      window.alert(message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          URL dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Create, manage, and inspect your short links in one place.
        </p>
      </div>

      <LinkForm onCreated={handleCreated} />

      <LinksTable
        links={links}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Dashboard;
