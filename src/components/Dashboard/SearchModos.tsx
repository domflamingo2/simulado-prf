"use client";

import { Keyboard, Search } from "lucide-react";

interface SearchModosProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchModos({ value, onChange }: SearchModosProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        id="search-modos"
        type="text"
        placeholder="Buscar modos de estudo… (Ctrl+S)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 absolute right-12 top-1/2 -translate-y-1/2 font-mono">
        <Keyboard className="w-3 h-3" /> Ctrl+S
      </span>
    </div>
  );
}
