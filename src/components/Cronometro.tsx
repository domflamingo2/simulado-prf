"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Minus,
  Pause,
  Play,
  Plus,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface CronometroProps {
  tempoInicial: number; // em segundos
  onTempoEsgotado?: () => void;
  pausado?: boolean;
  onPausar?: () => void;
  onRetomar?: () => void;
  modoDev?: boolean; // permite ajustar tempo manualmente
  posicao?: "fixed" | "static" | "sticky";
  tamanho?: "sm" | "md" | "lg";
}

type FaseTempo = "normal" | "atencao" | "critico" | "esgotado";

export default function Cronometro({
  tempoInicial,
  onTempoEsgotado,
  pausado = false,
  onPausar,
  onRetomar,
  modoDev = false,
  posicao = "fixed",
  tamanho = "md",
}: CronometroProps) {
  const [tempoRestante, setTempoRestante] = useState(tempoInicial);
  const [tempoPausado, setTempoPausado] = useState<number | null>(null);
  const [mostrarControles, setMostrarControles] = useState(false);

  // Recupera tempo salvo no localStorage (para persistência entre reloads)
  useEffect(() => {
    const salvo = localStorage.getItem("prf_cronometro_tempo");
    const inicio = localStorage.getItem("prf_cronometro_inicio");

    if (salvo && inicio) {
      const tempoDecorrido = Math.floor((Date.now() - parseInt(inicio)) / 1000);
      const tempoCalculado = Math.max(0, parseInt(salvo) - tempoDecorrido);
      setTempoRestante(tempoCalculado);
    }
  }, []);

  // Salva tempo periodicamente
  useEffect(() => {
    if (tempoRestante > 0 && !pausado) {
      localStorage.setItem("prf_cronometro_tempo", tempoRestante.toString());
      localStorage.setItem("prf_cronometro_inicio", Date.now().toString());
    }

    if (tempoRestante === 0) {
      localStorage.removeItem("prf_cronometro_tempo");
      localStorage.removeItem("prf_cronometro_inicio");
    }
  }, [tempoRestante, pausado]);

  // Lógica do cronômetro
  useEffect(() => {
    if (pausado || tempoRestante <= 0) {
      if (tempoRestante <= 0 && tempoPausado === null) {
        onTempoEsgotado?.();
      }
      return;
    }

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [pausado, tempoRestante, onTempoEsgotado, tempoPausado]);

  const handlePausar = useCallback(() => {
    setTempoPausado(tempoRestante);
    onPausar?.();
  }, [tempoRestante, onPausar]);

  const handleRetomar = useCallback(() => {
    setTempoPausado(null);
    onRetomar?.();
  }, [onRetomar]);

  const ajustarTempo = (segundos: number) => {
    setTempoRestante((prev) => Math.max(0, prev + segundos));
  };

  // Cálculos de fase e progresso
  const percentual = (tempoRestante / tempoInicial) * 100;
  const tempoDecorrido = tempoInicial - tempoRestante;

  const getFase = (): FaseTempo => {
    if (tempoRestante <= 0) return "esgotado";
    if (percentual <= 10) return "critico";
    if (percentual <= 25) return "atencao";
    return "normal";
  };

  const fase = getFase();

  const configFase = {
    normal: {
      cor: "text-emerald-400",
      bg: "bg-emerald-500/10",
      borda: "border-emerald-500/30",
      icone: Clock,
      animacao: "",
    },
    atencao: {
      cor: "text-amber-400",
      bg: "bg-amber-500/10",
      borda: "border-amber-500/30",
      icone: Timer,
      animacao: "animate-pulse",
    },
    critico: {
      cor: "text-rose-400",
      bg: "bg-rose-500/10",
      borda: "border-rose-500/30",
      icone: AlertTriangle,
      animacao: "animate-bounce",
    },
    esgotado: {
      cor: "text-red-500",
      bg: "bg-red-500/20",
      borda: "border-red-500/50",
      icone: AlertTriangle,
      animacao: "animate-pulse",
    },
  };

  const { cor, bg, borda, icone: Icone, animacao } = configFase[fase];

  // Formatação de tempo
  const formatarTempo = (seg: number): string => {
    const hrs = Math.floor(seg / 3600);
    const mins = Math.floor((seg % 3600) / 60);
    const secs = seg % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Configurações de tamanho
  const tamanhos = {
    sm: {
      wrapper: "px-3 py-2 gap-2",
      texto: "text-lg",
      icone: "w-4 h-4",
      barra: "h-1",
    },
    md: {
      wrapper: "px-4 py-3 gap-3",
      texto: "text-2xl",
      icone: "w-5 h-5",
      barra: "h-1.5",
    },
    lg: {
      wrapper: "px-6 py-4 gap-4",
      texto: "text-3xl",
      icone: "w-6 h-6",
      barra: "h-2",
    },
  };

  const posicoes = {
    fixed: "fixed top-4 right-4 z-[100]",
    static: "relative",
    sticky: "sticky top-4 z-[100]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`
        ${posicoes[posicao]}
        ${tamanhos[tamanho].wrapper}
        inline-flex flex-col rounded-xl border backdrop-blur-xl
        ${bg} ${borda} ${animacao}
        shadow-lg shadow-black/20
      `}
      onMouseEnter={() => modoDev && setMostrarControles(true)}
      onMouseLeave={() => setMostrarControles(false)}
    >
      {/* Linha principal */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-950/50 ${cor}`}>
          <Icone className={tamanhos[tamanho].icone} />
        </div>

        <div className="flex flex-col">
          <span
            className={`font-mono font-bold ${cor} ${tamanhos[tamanho].texto} tracking-wider`}
          >
            {formatarTempo(tempoRestante)}
          </span>

          {fase !== "normal" && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              {fase === "atencao" && "Atenção"}
              {fase === "critico" && "Tempo Crítico"}
              {fase === "esgotado" && "TEMPO ESGOTADO"}
            </span>
          )}
        </div>

        {/* Botão de pausa (se callbacks fornecidos) */}
        {(onPausar || onRetomar) && (
          <button
            onClick={pausado ? handleRetomar : handlePausar}
            className={`
              p-2 rounded-lg transition-colors
              ${
                pausado
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
              }
            `}
            title={pausado ? "Retomar" : "Pausar"}
          >
            {pausado ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Barra de progresso */}
      <div
        className={`mt-2 w-full bg-slate-950/50 rounded-full overflow-hidden ${tamanhos[tamanho].barra}`}
      >
        <motion.div
          className={`h-full rounded-full ${
            fase === "normal"
              ? "bg-emerald-500"
              : fase === "atencao"
                ? "bg-amber-500"
                : "bg-rose-500"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentual}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      {/* Controles de desenvolvimento */}
      <AnimatePresence>
        {modoDev && mostrarControles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/10 flex gap-2"
          >
            <button
              onClick={() => ajustarTempo(-300)}
              className="flex-1 px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
              title="-5 min"
            >
              <Minus className="w-3 h-3 inline" /> 5m
            </button>
            <button
              onClick={() => ajustarTempo(300)}
              className="flex-1 px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
              title="+5 min"
            >
              <Plus className="w-3 h-3 inline" /> 5m
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de pausa */}
      <AnimatePresence>
        {pausado && tempoRestante > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-2 -right-2 w-3 h-3 bg-amber-500 rounded-full animate-pulse"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
