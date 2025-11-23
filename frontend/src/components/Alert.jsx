import React from 'react';
import clsx from 'clsx';

function Alert({ type = 'info', children }) {
  const base =
    'rounded-lg px-3 py-2 text-sm border flex items-start gap-2 shadow-sm';
  const styles = {
    info: 'bg-slate-900 border-slate-700 text-slate-100',
    success: 'bg-emerald-900/30 border-emerald-600 text-emerald-200',
    error: 'bg-rose-900/30 border-rose-600 text-rose-200',
    warning: 'bg-amber-900/30 border-amber-600 text-amber-200'
  };
  return <div className={clsx(base, styles[type])}>{children}</div>;
}

export default Alert;
