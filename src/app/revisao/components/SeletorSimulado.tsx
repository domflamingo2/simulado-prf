"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { HistoricoSimulado } from "@/data/types";

interface SeletorSimuladoProps {
  simulados: HistoricoSimulado[];
  simuladoSelecionado: HistoricoSimulado;
  onChange: (simulado: HistoricoSimulado) => void;
}

export function SeletorSimulado({
  simulados,
  simuladoSelecionado,
  onChange,
}: SeletorSimuladoProps) {
  if (simulados.length <= 1) return null;

  return (
    <GlassCard className="p-4">
      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
        Simulado
      </label>
      <select
        value={simuladoSelecionado.id}
        onChange={(e) => {
          const selected = simulados.find((s) => s.id === e.target.value);
          if (selected) onChange(selected);
        }}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
      >
        {simulados.map((s) => (
          <option key={s.id} value={s.id}>
            {new Date(s.data).toLocaleDateString("pt-BR")} -{" "}
            {s.estatisticas.pontuacao} pts
          </option>
        ))}
      </select>
    </GlassCard>
  );
}
