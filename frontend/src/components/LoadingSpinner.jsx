import React from 'react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span className="inline-block h-4 w-4 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
