"use client";

import { Minus, TrendingUp } from "lucide-react";

type Tendencia = "melhorou" | "piorou" | "estavel";

interface TendenciaBadgeProps {
  tendencia: Tendencia;
  valor: number;
  percentual?: number;
}

export function TendenciaBadge({
  tendencia,
  valor,
  percentual,
}: TendenciaBadgeProps) {
  const configs: Record<
    Tendencia,
    {
      icon: typeof TrendingUp | typeof Minus;
      cor: string;
      bg: string;
      prefixo: string;
      rotacao?: string;
    }
  > = {
    melhorou: {
      icon: TrendingUp,
      cor: "text-emerald-400",
      bg: "bg-emerald-500/20",
      prefixo: "+",
    },
    piorou: {
      icon: TrendingUp,
      cor: "text-rose-400",
      bg: "bg-rose-500/20",
      prefixo: "",
      rotacao: "rotate-180",
    },
    estavel: {
      icon: Minus,
      cor: "text-slate-400",
      bg: "bg-slate-500/20",
      prefixo: "",
    },
  };
  const config = configs[tendencia];

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.cor} text-xs font-medium`}
    >
      <config.icon className={`w-3.5 h-3.5 ${config.rotacao ?? ""}`} />
      <span>
        {config.prefixo}
        {Math.abs(valor).toFixed(1)} pts
        {percentual != null &&
          ` (${config.prefixo}${Math.abs(percentual).toFixed(1)}%)`}
      </span>
    </div>
  );
}
