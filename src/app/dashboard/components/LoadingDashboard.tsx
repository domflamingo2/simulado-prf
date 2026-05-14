"use client";

export function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
        <div className="w-48 h-4 rounded bg-slate-800" />
        <div className="w-32 h-3 rounded bg-slate-800" />
      </div>
    </div>
  );
}
