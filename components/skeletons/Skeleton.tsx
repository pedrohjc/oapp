import React from "react";

export function Pulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} style={style} />;
}

export function LiveFeedSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Pulse className="h-7 w-72 mb-2" />
        <Pulse className="h-4 w-48" />
      </div>
      <div className="overflow-hidden border border-slate-100 rounded-xl bg-white shadow-sm">
        <div className="bg-slate-50 px-6 py-4 flex gap-6">
          {[200, 160, 160, 80, 80, 60].map((w, i) => (
            <Pulse key={i} className="h-3" style={{ width: w }} />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-6 border-t border-slate-50">
            <div className="flex items-center gap-3 w-48">
              <Pulse className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Pulse className="h-3 w-28 mb-1.5" />
                <Pulse className="h-2.5 w-16" />
              </div>
            </div>
            <Pulse className="h-3 w-32" />
            <Pulse className="h-3 w-32" />
            <Pulse className="h-3 w-16" />
            <Pulse className="h-3 w-20" />
            <Pulse className="h-5 w-16 rounded-full" />
            <Pulse className="h-3 w-14 ml-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RankingTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 flex gap-6">
        {[40, 220, 100, 60, 140, 100].map((w, i) => (
          <Pulse key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-6 border-t border-slate-50">
          <Pulse className="w-7 h-7 rounded-full flex-shrink-0" />
          <div className="flex items-center gap-3 flex-1">
            <Pulse className="w-9 h-9 rounded-full flex-shrink-0" />
            <Pulse className="h-3.5 w-40" />
          </div>
          <Pulse className="h-5 w-20 rounded" />
          <Pulse className="h-3 w-8" />
          <Pulse className="h-4 w-28" />
          <div className="flex gap-2 ml-auto">
            <Pulse className="h-6 w-24 rounded-full" />
            <Pulse className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SenadorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-4">
        <Pulse className="size-16 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <Pulse className="h-4 w-36 mb-2" />
          <Pulse className="h-3 w-24 mb-2" />
          <Pulse className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function PerfilSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex gap-8 items-end mb-12">
        <Pulse className="w-36 h-36 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Pulse className="h-10 w-80" />
          <Pulse className="h-5 w-48" />
          <Pulse className="h-4 w-36" />
        </div>
        <div className="flex gap-3">
          <Pulse className="h-10 w-24 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100">
            <Pulse className="h-3 w-24 mb-3" />
            <Pulse className="h-8 w-28" />
          </div>
        ))}
      </div>
      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8 flex gap-8">
        {[80, 120, 80, 160].map((w, i) => (
          <Pulse key={i} className="h-4 mb-4" style={{ width: w }} />
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100">
            <Pulse className="h-6 w-48 mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1">
                  <Pulse className="h-3 w-48" />
                  <Pulse className="h-3 w-20" />
                </div>
                <Pulse className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
            <Pulse className="h-3 w-32 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <Pulse className="w-5 h-5 rounded flex-shrink-0" />
                <Pulse className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
