import React from 'react';

function StatCard({ label, value, sublabel }) {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-1 shadow-md shadow-slate-900/60">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-xl font-semibold text-slate-50 break-all">
        {value ?? '—'}
      </div>
      {sublabel && (
        <div className="text-[11px] text-slate-500">{sublabel}</div>
      )}
    </div>
  );
}

export default StatCard;
