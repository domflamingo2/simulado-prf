"use client";

import { Save } from "lucide-react";

export function AutoSaveIndicator() {
  return (
    <div className="fixed bottom-24 right-4 z-20">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
        <Save className="w-3 h-3" />
        <span>Auto-salvando a cada 30s</span>
      </div>
    </div>
  );
}
