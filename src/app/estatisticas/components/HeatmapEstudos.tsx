"use client";

import { Calendar, Flame, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { HistoricoSimulado } from "@/data/index";

// Corrigido: usa T12:00:00 para evitar deslocamento de fuso horário UTC
function getDiaLocal(dataISO: string): string {
  const d = new Date(dataISO);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

interface HeatmapEstudosProps {
  historico: HistoricoSimulado[];
}

export function HeatmapEstudos({ historico }: HeatmapEstudosProps) {
  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
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

  const totalAtividades = useMemo(
    () => Array.from(atividadesPorDia.values()).reduce((a, b) => a + b, 0),
    [atividadesPorDia],
  );

  const diasComEstudo = useMemo(
    () => dias.filter((d) => (atividadesPorDia.get(d) ?? 0) > 0).length,
    [dias, atividadesPorDia],
  );

  const streakAtual = useMemo(() => {
    let streak = 0;
    for (let i = dias.length - 1; i >= 0; i--) {
      if ((atividadesPorDia.get(dias[i]) ?? 0) > 0) streak++;
      else break;
    }
    return streak;
  }, [dias, atividadesPorDia]);

  // Corrigido: Math.max com fallback 0 para evitar -Infinity com array vazio
  const maxCount = useMemo(
    () => Math.max(...Array.from(atividadesPorDia.values()), 0),
    [atividadesPorDia],
  );

  const getCor = (count: number) => {
    if (count === 0) return "bg-slate-800/50 hover:bg-slate-700/60";
    if (count === 1) return "bg-emerald-500/30 hover:bg-emerald-500/40";
    if (count === 2) return "bg-emerald-500/50 hover:bg-emerald-500/60";
    if (count === 3) return "bg-emerald-500/70 hover:bg-emerald-500/80";
    return "bg-emerald-500 hover:bg-emerald-400";
  };

  // Corrigido: tooltip via estado com posição relativa ao container,
  // sem position:fixed que causava bugs em iframes/portais
  const [tooltip, setTooltip] = useState<{
    diaIndex: number;
    label: string;
    count: number;
  } | null>(null);

  const formatLabel = (dia: string) =>
    // Corrigido: T12:00:00 para evitar que o fuso UTC desloque o dia exibido
    new Date(dia + "T12:00:00").toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const formatMes = (dia: string) =>
    new Date(dia + "T12:00:00")
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
            <Calendar className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Heatmap de Estudos
            </h3>
            <p className="text-[10px] text-slate-500">Últimos 30 dias</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {streakAtual > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] font-medium text-orange-400">
                {streakAtual} dia{streakAtual !== 1 ? "s" : ""} seguido
                {streakAtual !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-medium text-blue-400">
              {totalAtividades} atividade{totalAtividades !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative overflow-x-auto pb-6">
        <div className="flex gap-1.5 min-w-max items-end">
          {dias.map((dia, i) => {
            const count = atividadesPorDia.get(dia) ?? 0;
            const label = formatLabel(dia);
            const mes = formatMes(dia);
            // Mostra o mês quando muda em relação ao dia anterior
            const diaAnterior = i > 0 ? dias[i - 1] : null;
            const mesAnterior = diaAnterior ? formatMes(diaAnterior) : null;
            const showMes = mes !== mesAnterior;

            return (
              <div
                key={dia}
                className="relative flex flex-col items-center gap-0"
              >
                {/* Célula */}
                <div
                  className={`
                    w-5 h-5 rounded cursor-default
                    transition-all duration-150
                    ring-2 ring-transparent hover:ring-emerald-500/30
                    ${getCor(count)}
                  `}
                  // Corrigido: tooltip via estado local, sem position:fixed
                  onMouseEnter={() => setTooltip({ diaIndex: i, label, count })}
                  onMouseLeave={() => setTooltip(null)}
                  aria-label={`${label}: ${count} simulado${count !== 1 ? "s" : ""}`}
                />

                {/* Tooltip — position:absolute relativo à célula, sem fixed */}
                {tooltip?.diaIndex === i && (
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                      z-50 pointer-events-none px-2.5 py-1.5 rounded-lg
                      bg-slate-900 border border-white/10 shadow-xl
                      whitespace-nowrap"
                  >
                    <p className="text-xs font-medium text-white">
                      {tooltip.label}
                    </p>
                    <p className="text-[10px] text-emerald-400">
                      {tooltip.count} simulado{tooltip.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Rótulo de mês abaixo — só quando muda */}
                <span className="text-[9px] text-slate-600 mt-1 h-3 leading-none">
                  {showMes ? mes : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>Menos</span>
          {[
            "bg-slate-800/50",
            "bg-emerald-500/30",
            "bg-emerald-500/50",
            "bg-emerald-500/70",
            "bg-emerald-500",
          ].map((c, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-sm ${c}`}
              title={`Nível ${idx + 1}`}
            />
          ))}
          <span>Mais</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span>
            {diasComEstudo} dia{diasComEstudo !== 1 ? "s" : ""} com estudo
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700 inline-block" />
          <span>
            Máximo: {maxCount} simulado{maxCount !== 1 ? "s" : ""}/dia
          </span>
        </div>
      </div>

      {/* Mensagem: nenhum estudo */}
      {diasComEstudo === 0 && (
        <div className="p-3 rounded-lg bg-slate-800/30 border border-white/5 text-center">
          <p className="text-xs text-slate-400">
            Nenhum estudo registrado nos últimos 30 dias. Comece hoje sua
            jornada!
          </p>
        </div>
      )}

      {/* Mensagem: streak longo */}
      {streakAtual >= 5 && (
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-[10px] text-amber-400 flex items-center justify-center gap-1.5">
            <Flame className="w-3 h-3" />
            Incrível! Você está há {streakAtual} dias seguidos estudando!
          </p>
        </div>
      )}
    </div>
  );
}
