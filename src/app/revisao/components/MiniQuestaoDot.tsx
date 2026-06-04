"use client";

import { QuestaoRespondida } from "@/data/questoes/index";
import { motion } from "framer-motion";
import { CheckCircle2, Flag, Minus, XCircle } from "lucide-react";

interface MiniQuestaoDotProps {
  questao: QuestaoRespondida;
  index: number;
  atual: boolean;
  onClick: () => void;
  marcada: boolean;
}

export function MiniQuestaoDot({
  questao,
  index,
  atual,
  onClick,
  marcada,
}: MiniQuestaoDotProps) {
  const getStatus = () => {
    if (
      questao.respostaUsuario === undefined ||
      questao.respostaUsuario === null
    )
      return "branco";
    return questao.respostaUsuario === questao.resposta ? "acerto" : "erro";
  };

  const status = getStatus();

  const configs = {
    acerto: {
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      hover: "hover:from-emerald-500 hover:to-emerald-400",
      text: "text-white",
      icon: CheckCircle2,
      label: "Acertou",
    },
    erro: {
      bg: "bg-gradient-to-br from-rose-500 to-rose-600",
      hover: "hover:from-rose-500 hover:to-rose-400",
      text: "text-white",
      icon: XCircle,
      label: "Errou",
    },
    branco: {
      bg: "bg-gradient-to-br from-slate-600 to-slate-700",
      hover: "hover:from-slate-600 hover:to-slate-500",
      text: "text-slate-300",
      icon: Minus,
      label: "Não respondida",
    },
  };

  const config = configs[status];
  const StatusIcon = config.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200
        ${config.bg} ${config.hover} ${config.text}
        ${atual ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-blue-500/25" : "opacity-75 hover:opacity-100"}
      `}
      title={`Questão ${index + 1} - ${config.label}${marcada ? " (Marcada para revisão)" : ""}`}
    >
      {/* Número da questão */}
      <span className="relative z-10">{index + 1}</span>

      {/* Indicador de status (ícone pequeno) */}
      <div className="absolute -bottom-1 -right-1">
        <StatusIcon className="w-3 h-3 text-white/80 drop-shadow-sm" />
      </div>

      {/* Indicador de questão marcada */}
      {marcada && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-400 blur-sm" />
            <Flag className="w-3 h-3 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
        </motion.div>
      )}

      {/* Efeito de brilho na questão atual */}
      {atual && (
        <motion.div
          layoutId="activeDot"
          className="absolute inset-0 rounded-xl bg-white/10"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
