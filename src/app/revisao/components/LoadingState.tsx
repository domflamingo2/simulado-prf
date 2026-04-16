"use client";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
        <div className="w-48 h-4 rounded bg-slate-800" />
      </div>
    </div>
  );
}
