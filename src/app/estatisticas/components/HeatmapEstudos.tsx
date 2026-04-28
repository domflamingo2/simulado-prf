"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { HistoricoSimulado } from "@/data/index";

function getDiaLocal(dataISO: string): string {
  const d = new Date(dataISO);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .split("T")[0];
}

interface HeatmapEstudosProps {
  historico: HistoricoSimulado[];
}

export function HeatmapEstudos({ historico }: HeatmapEstudosProps) {
  const hoje = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const dias = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const d = new Date(hoje);
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split("T")[0];
      }),
    [hoje],
  );

  const atividadesPorDia = useMemo(() => {
    const map = new Map<string, number>();
    for (const h of historico) {
      const dia = getDiaLocal(h.data);
      map.set(dia, (map.get(dia) ?? 0) + 1);
    }
    return map;
  }, [historico]);

  const getCor = (count: number) => {
    if (count === 0) return "bg-slate-800 hover:bg-slate-700";
    if (count === 1) return "bg-emerald-500/30 hover:bg-emerald-500/40";
    if (count === 2) return "bg-emerald-500/50 hover:bg-emerald-500/60";
    return "bg-emerald-500 hover:bg-emerald-400";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {dias.map((dia, i) => {
          const count = atividadesPorDia.get(dia) ?? 0;
          const label = new Date(dia + "T12:00:00").toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "short",
            },
          );
          return (
            <motion.div
              key={dia}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01, duration: 0.2 }}
              title={`${label}: ${count} simulado${count !== 1 ? "s" : ""}`}
              className={`w-8 h-8 rounded ${getCor(count)} transition-all cursor-default ring-2 ring-transparent hover:ring-emerald-500/50`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>Menos</span>
        <div className="flex gap-1">
          {[
            "bg-slate-800",
            "bg-emerald-500/30",
            "bg-emerald-500/50",
            "bg-emerald-500",
          ].map((c) => (
            <div key={c} className={`w-4 h-4 rounded ${c}`} />
          ))}
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}
