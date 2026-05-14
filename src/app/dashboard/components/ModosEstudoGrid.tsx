"use client";

import type { ModoVariant } from "@/components/ui/ModoCard";
import type { LucideIcon } from "lucide-react";
import { Star } from "lucide-react";

import ModoCard from "@/components/ui/ModoCard";

interface ModoEstudoItem {
  href: string;
  icon: LucideIcon;
  variant: ModoVariant;
  title: string;
  description: string;
  xp: string;
  tag: string;
  shortcut?: string;
}

interface ModosEstudoGridProps {
  modos: ModoEstudoItem[];
  searchTerm: string;
  onClearSearch: () => void;
}

export function ModosEstudoGrid({
  modos,
  searchTerm,
  onClearSearch,
}: ModosEstudoGridProps) {
  return (
    <section aria-label="Modos de estudo">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
        <Star className="w-5 h-5 text-amber-400" /> Escolha seu Modo
      </h2>

      {modos.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Nenhum modo encontrado para "{searchTerm}"</p>
          <button
            onClick={onClearSearch}
            className="text-blue-400 text-xs mt-2 hover:underline"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modos.map((modo, index) => (
            <ModoCard key={modo.href} {...modo} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
