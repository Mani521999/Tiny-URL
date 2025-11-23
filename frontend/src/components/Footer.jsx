import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] text-slate-500 flex flex-col sm:flex-row gap-1 sm:items-center justify-between">
        <span>TinyLink &copy; {new Date().getFullYear()}</span>
        <span className="text-slate-500">
          Built with <span className="text-indigo-400">React</span> &amp;{' '}
          <span className="text-indigo-400">Express</span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
