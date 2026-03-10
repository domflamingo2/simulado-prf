"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface CronometroProps {
  tempoInicial: number; // em segundos
  onTempoEsgotado?: () => void;
  pausado?: boolean;
  onPausar?: () => void;
  onRetomar?: () => void;
  modoDev?: boolean;
  posicao?: "fixed" | "static" | "sticky";
  tamanho?: "sm" | "md" | "lg";
  mostrarReset?: boolean;
  onReset?: () => void;
  idUnico?: string; // para múltiplos cronômetros na mesma página
}

type FaseTempo = "normal" | "atencao" | "critico" | "esgotado";

// Memoizado para evitar re-renders desnecessários
const Cronometro = memo(function Cronometro({
  tempoInicial,
  onTempoEsgotado,
  pausado = false,
  onPausar,
  onRetomar,
  modoDev = false,
  posicao = "fixed",
  tamanho = "md",
  mostrarReset = false,
  onReset,
  idUnico = "default",
}: CronometroProps) {
  const [tempoRestante, setTempoRestante] = useState(tempoInicial);
  const [mostrarControles, setMostrarControles] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs para controle preciso de tempo (evita stale closure)
  const tempoRestanteRef = useRef(tempoInicial);
  const ultimoTickRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const avisoEsgotadoRef = useRef(false);

  // Sincroniza ref com state
  useEffect(() => {
    tempoRestanteRef.current = tempoRestante;
  }, [tempoRestante]);

  // Hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Recuperação do LocalStorage com cálculo preciso de tempo decorrido
  useEffect(() => {
    if (!isClient) return;

    const storageKey = `prf_cronometro_${idUnico}`;
    const salvo = localStorage.getItem(`${storageKey}_tempo`);
    const timestampInicio = localStorage.getItem(`${storageKey}_inicio`);
    const estadoPausado = localStorage.getItem(`${storageKey}_pausado`);

    if (salvo && timestampInicio && estadoPausado !== "true") {
      const tempoSalvo = parseInt(salvo, 10);
      const inicio = parseInt(timestampInicio, 10);
      const agora = Date.now();
      const tempoDecorrido = Math.floor((agora - inicio) / 1000);

      const tempoCalculado = Math.max(0, tempoSalvo - tempoDecorrido);
      setTempoRestante(tempoCalculado);
      tempoRestanteRef.current = tempoCalculado;
    } else if (salvo && estadoPausado === "true") {
      // Se estava pausado, mantém o tempo salvo sem descontar
      const tempoSalvo = parseInt(salvo, 10);
      setTempoRestante(tempoSalvo);
      tempoRestanteRef.current = tempoSalvo;
    }
  }, [isClient, idUnico]);

  // Persistência otimizada (salva a cada 5 segundos ou em eventos importantes)
  useEffect(() => {
    if (!isClient) return;

    const storageKey = `prf_cronometro_${idUnico}`;

    const salvarEstado = () => {
      localStorage.setItem(
        `${storageKey}_tempo`,
        tempoRestanteRef.current.toString(),
      );
      localStorage.setItem(`${storageKey}_inicio`, Date.now().toString());
      localStorage.setItem(`${storageKey}_pausado`, pausado.toString());
    };

    // Salva imediatamente em mudanças importantes
    salvarEstado();

    // Salva periodicamente (a cada 5s) se não estiver pausado
    let intervaloSalvamento: NodeJS.Timeout | null = null;
    if (!pausado && tempoRestante > 0) {
      intervaloSalvamento = setInterval(salvarEstado, 5000);
    }

    // Cleanup: se tempo acabou, limpa storage
    if (tempoRestante === 0) {
      localStorage.removeItem(`${storageKey}_tempo`);
      localStorage.removeItem(`${storageKey}_inicio`);
      localStorage.removeItem(`${storageKey}_pausado`);
    }

    return () => {
      if (intervaloSalvamento) clearInterval(intervaloSalvamento);
    };
  }, [isClient, pausado, tempoRestante, idUnico]);

  // Lógica principal do cronômetro (usando ref para precisão)
  useEffect(() => {
    if (pausado || tempoRestanteRef.current <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Dispara callback apenas uma vez quando chega a 0
      if (tempoRestanteRef.current <= 0 && !avisoEsgotadoRef.current) {
        avisoEsgotadoRef.current = true;
        onTempoEsgotado?.();
      }
      return;
    }

    // Reseta flag quando retoma
    avisoEsgotadoRef.current = false;
    ultimoTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const agora = Date.now();
      const delta = Math.floor((agora - ultimoTickRef.current) / 1000);

      if (delta >= 1) {
        ultimoTickRef.current = agora;
        setTempoRestante((prev) => {
          const novo = Math.max(0, prev - delta);
          tempoRestanteRef.current = novo;
          return novo;
        });
      }
    }, 100); // Checa a cada 100ms para precisão, mas atualiza state só quando necessário

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pausado, onTempoEsgotado]); // Remove tempoRestante das dependências!

  // Handlers memoizados
  const handlePausar = useCallback(() => {
    onPausar?.();
  }, [onPausar]);

  const handleRetomar = useCallback(() => {
    ultimoTickRef.current = Date.now(); // Reseta o tick para não pular tempo
    onRetomar?.();
  }, [onRetomar]);

  const handleReset = useCallback(() => {
    setTempoRestante(tempoInicial);
    tempoRestanteRef.current = tempoInicial;
    avisoEsgotadoRef.current = false;

    const storageKey = `prf_cronometro_${idUnico}`;
    localStorage.removeItem(`${storageKey}_tempo`);
    localStorage.removeItem(`${storageKey}_inicio`);
    localStorage.removeItem(`${storageKey}_pausado`);

    onReset?.();
  }, [tempoInicial, idUnico, onReset]);

  const ajustarTempo = useCallback((segundos: number) => {
    setTempoRestante((prev) => {
      const novo = Math.max(0, prev + segundos);
      tempoRestanteRef.current = novo;
      return novo;
    });
    ultimoTickRef.current = Date.now(); // Evita pulo de tempo após ajuste
  }, []);

  // Cálculos derivados memoizados
  const percentual = Math.max(
    0,
    Math.min(100, (tempoRestante / tempoInicial) * 100),
  );

  const fase: FaseTempo = (() => {
    if (tempoRestante <= 0) return "esgotado";
    if (percentual <= 10) return "critico";
    if (percentual <= 25) return "atencao";
    return "normal";
  })();

  const configFase = {
    normal: {
      cor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-500/10",
      borda: "border-emerald-300 dark:border-emerald-500/30",
      barra: "bg-emerald-500",
      icone: Clock,
      animacao: "",
      sombra: "shadow-emerald-500/20",
    },
    atencao: {
      cor: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-500/10",
      borda: "border-amber-300 dark:border-amber-500/30",
      barra: "bg-amber-500",
      icone: Timer,
      animacao: "animate-pulse",
      sombra: "shadow-amber-500/20",
    },
    critico: {
      cor: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-500/10",
      borda: "border-rose-300 dark:border-rose-500/30",
      barra: "bg-rose-500",
      icone: AlertTriangle,
      animacao: "animate-pulse",
      sombra: "shadow-rose-500/20",
    },
    esgotado: {
      cor: "text-red-600 dark:text-red-500",
      bg: "bg-red-100 dark:bg-red-500/20",
      borda: "border-red-300 dark:border-red-500/50",
      barra: "bg-red-500",
      icone: AlertTriangle,
      animacao: "animate-bounce",
      sombra: "shadow-red-500/30",
    },
  } as const;

  const {
    cor,
    bg,
    borda,
    barra,
    icone: Icone,
    animacao,
    sombra,
  } = configFase[fase];

  // Formatação de tempo otimizada
  const formatarTempo = useCallback((seg: number): string => {
    if (seg <= 0) return "00:00";

    const hrs = Math.floor(seg / 3600);
    const mins = Math.floor((seg % 3600) / 60);
    const secs = seg % 60;

    const parts = [];
    if (hrs > 0) parts.push(hrs.toString());
    parts.push(mins.toString().padStart(2, "0"));
    parts.push(secs.toString().padStart(2, "0"));

    return parts.join(":");
  }, []);

  // Configurações de tamanho responsivo
  const tamanhos = {
    sm: {
      wrapper: "px-3 py-2 gap-2",
      texto: "text-base sm:text-lg",
      icone: "w-4 h-4",
      barra: "h-1",
      badge: "text-[8px]",
    },
    md: {
      wrapper: "px-4 py-3 gap-3",
      texto: "text-xl sm:text-2xl",
      icone: "w-5 h-5",
      barra: "h-1.5",
      badge: "text-[10px]",
    },
    lg: {
      wrapper: "px-5 sm:px-6 py-4 gap-4",
      texto: "text-2xl sm:text-3xl",
      icone: "w-6 h-6",
      barra: "h-2",
      badge: "text-xs",
    },
  } as const;

  const posicoes = {
    fixed: "fixed top-4 right-4 z-50",
    static: "relative",
    sticky: "sticky top-4 z-50",
  } as const;

  // Não renderiza no servidor (evita hydration mismatch)
  if (!isClient) {
    return (
      <div
        className={`${posicoes[posicao]} ${tamanhos[tamanho].wrapper} inline-flex rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse`}
      >
        <div className="w-24 h-8" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        ${posicoes[posicao]}
        ${tamanhos[tamanho].wrapper}
        inline-flex flex-col rounded-xl border-2 backdrop-blur-xl
        ${bg} ${borda} ${animacao}
        shadow-lg ${sombra}
        transition-colors duration-300
      `}
      onMouseEnter={() => modoDev && setMostrarControles(true)}
      onMouseLeave={() => setMostrarControles(false)}
      role="timer"
      aria-label={`Tempo restante: ${formatarTempo(tempoRestante)}`}
      aria-live={
        fase === "critico" || fase === "esgotado" ? "assertive" : "off"
      }
    >
      {/* Linha principal */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`p-1.5 sm:p-2 rounded-lg bg-white/50 dark:bg-slate-950/50 ${cor}`}
        >
          <Icone className={tamanhos[tamanho].icone} aria-hidden="true" />
        </div>

        <div className="flex flex-col min-w-[80px] sm:min-w-[100px]">
          <span
            className={`font-mono font-bold ${cor} ${tamanhos[tamanho].texto} tracking-wider tabular-nums`}
          >
            {formatarTempo(tempoRestante)}
          </span>

          {fase !== "normal" && (
            <span
              className={`${tamanhos[tamanho].badge} uppercase tracking-wider font-bold ${cor} opacity-90`}
            >
              {fase === "atencao" && "Atenção"}
              {fase === "critico" && "Tempo Crítico"}
              {fase === "esgotado" && "TEMPO ESGOTADO"}
            </span>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1">
          {(onPausar || onRetomar) && tempoRestante > 0 && (
            <button
              onClick={pausado ? handleRetomar : handlePausar}
              className={`
                p-1.5 sm:p-2 rounded-lg transition-all duration-200
                ${
                  pausado
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30"
                    : "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
              title={pausado ? "Retomar (Espaço)" : "Pausar (Espaço)"}
              aria-label={pausado ? "Retomar cronômetro" : "Pausar cronômetro"}
            >
              {pausado ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          )}

          {mostrarReset && (
            <button
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
              title="Reiniciar"
              aria-label="Reiniciar cronômetro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de progresso com gradiente */}
      <div
        className={`mt-2 w-full bg-slate-200 dark:bg-slate-950/50 rounded-full overflow-hidden ${tamanhos[tamanho].barra}`}
        role="progressbar"
        aria-valuenow={Math.round(percentual)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={`h-full rounded-full ${barra}`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentual}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Controles de desenvolvimento */}
      <AnimatePresence>
        {modoDev && mostrarControles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-300/50 dark:border-white/10 grid grid-cols-2 gap-2"
          >
            <button
              onClick={() => ajustarTempo(-60)}
              className="px-2 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="-1 minuto"
            >
              <Minus className="w-3 h-3 inline mr-1" /> 1m
            </button>
            <button
              onClick={() => ajustarTempo(60)}
              className="px-2 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="+1 minuto"
            >
              <Plus className="w-3 h-3 inline mr-1" /> 1m
            </button>
            <button
              onClick={() => ajustarTempo(-300)}
              className="px-2 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="-5 minutos"
            >
              <Minus className="w-3 h-3 inline mr-1" /> 5m
            </button>
            <button
              onClick={() => ajustarTempo(300)}
              className="px-2 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="+5 minutos"
            >
              <Plus className="w-3 h-3 inline mr-1" /> 5m
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de pausa */}
      <AnimatePresence>
        {pausado && tempoRestante > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default Cronometro;
