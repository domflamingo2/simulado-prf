"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type Tendencia = "melhorou" | "piorou" | "estavel";

interface TendenciaBadgeProps {
  tendencia: Tendencia;
  valor: number;
}

export function TendenciaBadge({ tendencia, valor }: TendenciaBadgeProps) {
  const configs = {
    melhorou: {
      icon: ArrowUpRight,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      prefixo: "+",
    },
    piorou: {
      icon: ArrowDownRight,
      color: "text-rose-400",
      bg: "bg-rose-500/20",
      prefixo: "",
    },
    estavel: {
      icon: Minus,
      color: "text-slate-400",
      bg: "bg-slate-500/20",
      prefixo: "",
    },
  };

  const config = configs[tendencia];

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${config.color} text-xs font-medium`}
    >
      <config.icon className="w-3 h-3" />
      {config.prefixo}
      {Math.abs(valor).toFixed(1)} pts
    </div>
  );
}
