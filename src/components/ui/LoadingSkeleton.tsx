import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
      <div className="p-4 bg-slate-50 flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 flex-1 bg-slate-100 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
          <div className="pt-2 flex justify-between items-center">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-7 w-20 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
