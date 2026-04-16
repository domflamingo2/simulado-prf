"use client";

import { Clock } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> =
  {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      text: "text-rose-400",
    },
    slate: {
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      text: "text-slate-400",
    },
  };

export function RegraCEBRASPE() {
  const items = [
    {
      label: "Acerto",
      value: "+1",
      colorKey: "emerald",
      desc: "Ganha 1 ponto",
    },
    { label: "Erro", value: "−1", colorKey: "rose", desc: "Perde 1 ponto" },
    { label: "Em branco", value: "0", colorKey: "slate", desc: "Não altera" },
  ] as const;

  return (
    <GlassCard className="p-5" variant="info">
      <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
        <Clock className="w-5 h-5 text-blue-400" /> Pontuação CEBRASPE
      </h3>
      <div className="space-y-2">
        {items.map((item) => {
          const colors = COLOR_MAP[item.colorKey];
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between p-3 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <div>
                <span className={`text-sm font-medium block ${colors.text}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </div>
              <span className={`font-bold text-lg ${colors.text}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
