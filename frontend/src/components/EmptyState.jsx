import React from 'react';

function EmptyState() {
  return (
    <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/70 shadow-inner">
      <div className="text-sm font-medium text-slate-100 mb-1">
        No links yet
      </div>
      <div className="text-xs text-slate-400">
        Create your first short link using the form above.
      </div>
    </div>
  );
}

export default EmptyState;
