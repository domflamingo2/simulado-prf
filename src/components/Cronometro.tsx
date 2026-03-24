// src/components/exam/Cronometro.tsx
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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface CronometroProps {
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
  mostrarBarraProgresso?: boolean;
  mostrarBadgeFase?: boolean;
  corPersonalizada?: {
    normal: string;
    atencao: string;
    critico: string;
    esgotado: string;
  };
}

export type FaseTempo = "normal" | "atencao" | "critico" | "esgotado";

interface FaseConfig {
  cor: string;
  bg: string;
  borda: string;
  barra: string;
  icone: React.ComponentType<{ className?: string }>;
  animacao: string;
  sombra: string;
  label: string;
}

// ============================================================================
// CONFIGURAÇÕES DAS FASES
// ============================================================================

const FASES: Record<FaseTempo, FaseConfig> = {
  normal: {
    cor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100/80 dark:bg-emerald-500/10",
    borda: "border-emerald-300/60 dark:border-emerald-500/30",
    barra: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    icone: Clock,
    animacao: "",
    sombra: "shadow-emerald-500/15",
    label: "Tempo Normal",
  },
  atencao: {
    cor: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100/80 dark:bg-amber-500/10",
    borda: "border-amber-300/60 dark:border-amber-500/30",
    barra: "bg-gradient-to-r from-amber-500 to-amber-400",
    icone: Timer,
    animacao: "animate-pulse",
    sombra: "shadow-amber-500/15",
    label: "Atenção",
  },
  critico: {
    cor: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100/80 dark:bg-rose-500/10",
    borda: "border-rose-300/60 dark:border-rose-500/30",
    barra: "bg-gradient-to-r from-rose-500 to-rose-400",
    icone: AlertTriangle,
    animacao: "animate-pulse",
    sombra: "shadow-rose-500/15",
    label: "Tempo Crítico",
  },
  esgotado: {
    cor: "text-red-600 dark:text-red-500",
    bg: "bg-red-100/80 dark:bg-red-500/20",
    borda: "border-red-300/60 dark:border-red-500/50",
    barra: "bg-gradient-to-r from-red-500 to-red-400",
    icone: AlertTriangle,
    animacao: "animate-bounce",
    sombra: "shadow-red-500/20",
    label: "TEMPO ESGOTADO",
  },
};

// ============================================================================
// HELPERS
// ============================================================================

const formatarTempo = (seg: number): string => {
  if (seg <= 0) return "00:00:00";

  const hrs = Math.floor(seg / 3600);
  const mins = Math.floor((seg % 3600) / 60);
  const secs = seg % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default memo(function Cronometro({
  tempoInicial,
  onTempoEsgotado,
  pausado: pausadoProp = false,
  onPausar,
  onRetomar,
  modoDev = false,
  posicao = "fixed",
  tamanho = "md",
  mostrarReset = false,
  onReset,
  idUnico = "default",
  mostrarBarraProgresso = true,
  mostrarBadgeFase = true,
  corPersonalizada,
}: CronometroProps) {
  // Estados locais
  const [tempoRestante, setTempoRestante] = useState(tempoInicial);
  const [mostrarControles, setMostrarControles] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pausadoLocal, setPausadoLocal] = useState(pausadoProp);

  // Refs para controle preciso (evita stale closure e re-renders)
  const tempoRestanteRef = useRef(tempoInicial);
  const ultimoTickRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const avisoEsgotadoRef = useRef(false);
  const pausadoRef = useRef(pausadoProp);

  // Sincroniza prop externa com estado local
  useEffect(() => {
    setPausadoLocal(pausadoProp);
    pausadoRef.current = pausadoProp;
  }, [pausadoProp]);

  // Sincroniza refs com states
  useEffect(() => {
    tempoRestanteRef.current = tempoRestante;
  }, [tempoRestante]);

  useEffect(() => {
    pausadoRef.current = pausadoLocal;
  }, [pausadoLocal]);

  // Hydration safety - evita mismatch SSR/CSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ============================================================================
  // PERSISTÊNCIA EM LOCALSTORAGE
  // ============================================================================

  useEffect(() => {
    if (!isClient) return;

    const storageKey = `prf_cronometro_${idUnico}`;
    const salvo = localStorage.getItem(`${storageKey}_tempo`);
    const timestampInicio = localStorage.getItem(`${storageKey}_inicio`);
    const estadoPausado = localStorage.getItem(`${storageKey}_pausado`);

    // Recupera estado salvo apenas na primeira montagem
    if (salvo && timestampInicio && estadoPausado !== "true") {
      const tempoSalvo = parseInt(salvo, 10);
      const inicio = parseInt(timestampInicio, 10);
      const agora = Date.now();
      const tempoDecorrido = Math.floor((agora - inicio) / 1000);
      const tempoCalculado = Math.max(0, tempoSalvo - tempoDecorrido);

      setTempoRestante(tempoCalculado);
      tempoRestanteRef.current = tempoCalculado;
    } else if (salvo && estadoPausado === "true") {
      const tempoSalvo = parseInt(salvo, 10);
      setTempoRestante(tempoSalvo);
      tempoRestanteRef.current = tempoSalvo;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, idUnico]);

  // Salva estado periodicamente (otimizado)
  useEffect(() => {
    if (!isClient) return;

    const storageKey = `prf_cronometro_${idUnico}`;
    let saveTimeout: NodeJS.Timeout | null = null;

    const salvarEstado = () => {
      if (saveTimeout) clearTimeout(saveTimeout);

      // Debounce de 500ms para evitar writes excessivos
      saveTimeout = setTimeout(() => {
        localStorage.setItem(
          `${storageKey}_tempo`,
          tempoRestanteRef.current.toString(),
        );
        localStorage.setItem(`${storageKey}_inicio`, Date.now().toString());
        localStorage.setItem(
          `${storageKey}_pausado`,
          pausadoRef.current.toString(),
        );
      }, 500);
    };

    salvarEstado();

    // Cleanup ao zerar
    if (tempoRestante === 0) {
      localStorage.removeItem(`${storageKey}_tempo`);
      localStorage.removeItem(`${storageKey}_inicio`);
      localStorage.removeItem(`${storageKey}_pausado`);
    }

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [isClient, tempoRestante, idUnico]);

  // ============================================================================
  // LÓGICA DO CRONÔMETRO (PRECISA COM REFS)
  // ============================================================================

  useEffect(() => {
    // Para o intervalo se pausado ou zerado
    if (pausadoRef.current || tempoRestanteRef.current <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Dispara callback apenas UMA vez ao chegar em 0
      if (tempoRestanteRef.current <= 0 && !avisoEsgotadoRef.current) {
        avisoEsgotadoRef.current = true;
        onTempoEsgotado?.();

        // Vibração em dispositivos móveis (se suportado)
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate?.([200, 100, 200]);
        }
      }
      return;
    }

    // Reseta flag ao retomar
    avisoEsgotadoRef.current = false;
    ultimoTickRef.current = Date.now();

    // Intervalo de alta precisão (100ms) mas com update condicional
    intervalRef.current = setInterval(() => {
      if (pausadoRef.current) return;

      const agora = Date.now();
      const delta = Math.floor((agora - ultimoTickRef.current) / 1000);

      if (delta >= 1) {
        ultimoTickRef.current = agora;

        // Atualiza via functional update para evitar stale state
        setTempoRestante((prev) => {
          const novo = Math.max(0, prev - delta);
          tempoRestanteRef.current = novo;
          return novo;
        });
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // Importante: NÃO incluir tempoRestante nas dependências!
  }, [pausadoLocal, onTempoEsgotado]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const togglePausa = useCallback(() => {
    const novoEstado = !pausadoRef.current;
    setPausadoLocal(novoEstado);

    if (novoEstado) {
      onPausar?.();
    } else {
      ultimoTickRef.current = Date.now(); // Evita "pulo" de tempo ao retomar
      onRetomar?.();
    }
  }, [onPausar, onRetomar]);

  const handleReset = useCallback(() => {
    setTempoRestante(tempoInicial);
    tempoRestanteRef.current = tempoInicial;
    setPausadoLocal(false);
    pausadoRef.current = false;
    avisoEsgotadoRef.current = false;
    ultimoTickRef.current = Date.now();

    const storageKey = `prf_cronometro_${idUnico}`;
    localStorage.removeItem(`${storageKey}_tempo`);
    localStorage.removeItem(`${storageKey}_inicio`);
    localStorage.removeItem(`${storageKey}_pausado`);

    onReset?.();
  }, [tempoInicial, idUnico, onReset]);

  const ajustarTempo = useCallback((segundos: number) => {
    setTempoRestante((prev) => {
      const novo = clamp(prev + segundos, 0, 24 * 60 * 60); // Máx 24h
      tempoRestanteRef.current = novo;
      return novo;
    });
    ultimoTickRef.current = Date.now();
  }, []);

  // ============================================================================
  // CÁLCULOS DERIVADOS (MEMOIZED)
  // ============================================================================

  const percentual = useMemo(() => {
    if (tempoInicial <= 0) return 0;
    return clamp((tempoRestante / tempoInicial) * 100, 0, 100);
  }, [tempoRestante, tempoInicial]);

  const fase: FaseTempo = useMemo(() => {
    if (tempoRestante <= 0) return "esgotado";
    if (percentual <= 10) return "critico";
    if (percentual <= 25) return "atencao";
    return "normal";
  }, [tempoRestante, percentual]);

  const config = useMemo(() => {
    const base = FASES[fase];
    if (!corPersonalizada) return base;

    return {
      ...base,
      cor: corPersonalizada[fase] ?? base.cor,
      barra: base.barra, // Mantém gradiente original
    };
  }, [fase, corPersonalizada]);

  const {
    cor,
    bg,
    borda,
    barra,
    icone: Icone,
    animacao,
    sombra,
    label,
  } = config;

  // ============================================================================
  // CONFIGURAÇÕES RESPONSIVAS
  // ============================================================================

  const tamanhos = useMemo(
    () => ({
      sm: {
        wrapper: "px-3 py-2 gap-2 min-w-[140px]",
        texto: "text-sm sm:text-base font-mono",
        icone: "w-4 h-4",
        barra: "h-1",
        badge: "text-[9px] px-1.5 py-0.5",
        controles: "p-1",
      },
      md: {
        wrapper: "px-4 py-3 gap-3 min-w-[180px]",
        texto: "text-lg sm:text-xl font-mono",
        icone: "w-5 h-5",
        barra: "h-1.5",
        badge: "text-[10px] px-2 py-0.5",
        controles: "p-1.5",
      },
      lg: {
        wrapper: "px-5 py-4 gap-4 min-w-[220px]",
        texto: "text-xl sm:text-2xl font-mono",
        icone: "w-6 h-6",
        barra: "h-2",
        badge: "text-xs px-2.5 py-1",
        controles: "p-2",
      },
    }),
    [],
  );

  const posicoes = useMemo(
    () => ({
      fixed: "fixed top-3 sm:top-4 right-3 sm:right-4 z-50",
      static: "relative w-full max-w-xs mx-auto",
      sticky: "sticky top-3 sm:top-4 z-50 w-full max-w-xs mx-auto",
    }),
    [],
  );

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Espaço para pausar/retomar (se não estiver em input)
      if (
        e.code === "Space" &&
        !(e.target as HTMLElement)?.matches("input, textarea")
      ) {
        e.preventDefault();
        if (tempoRestante > 0) togglePausa();
      }
      // R para reset (apenas em modo dev ou se mostrarReset)
      if (e.key.toLowerCase() === "r" && (modoDev || mostrarReset)) {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isClient,
    togglePausa,
    handleReset,
    modoDev,
    mostrarReset,
    tempoRestante,
  ]);

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  // Skeleton para SSR/hydration
  if (!isClient) {
    return (
      <div
        className={`${posicoes[posicao]} ${tamanhos.md.wrapper} inline-flex rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-transparent`}
        aria-hidden="true"
      >
        <div className="w-20 h-8" />
      </div>
    );
  }

  return (
    <motion.div
      // Animação de entrada
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      // Classes base
      className={`
        ${posicoes[posicao]}
        ${tamanhos[tamanho].wrapper}
        inline-flex flex-col rounded-xl border-2 backdrop-blur-xl
        ${bg} ${borda} ${animacao}
        shadow-lg ${sombra}
        transition-all duration-300
        hover:shadow-xl
      `}
      // Interações para modo dev
      onMouseEnter={() => modoDev && setMostrarControles(true)}
      onMouseLeave={() => modoDev && setMostrarControles(false)}
      // Acessibilidade
      role="timer"
      aria-label={`Tempo restante: ${formatarTempo(tempoRestante)}. Fase: ${label}`}
      aria-live={
        fase === "critico" || fase === "esgotado" ? "assertive" : "polite"
      }
      aria-atomic="true"
    >
      {/* Linha principal: Ícone + Tempo + Controles */}
      <div className="flex items-center justify-between gap-2">
        {/* Ícone da fase */}
        <motion.div
          className={`p-1.5 sm:p-2 rounded-lg bg-white/60 dark:bg-slate-950/60 ${cor} flex-shrink-0`}
          animate={
            fase === "critico" || fase === "esgotado"
              ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 1, repeat: Infinity },
                }
              : {}
          }
        >
          <Icone className={tamanhos[tamanho].icone} aria-hidden="true" />
        </motion.div>

        {/* Tempo formatado */}
        <div className="flex flex-col items-start min-w-0 flex-1">
          <motion.span
            key={tempoRestante} // Força re-render visual a cada segundo
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className={`font-bold ${cor} ${tamanhos[tamanho].texto} tracking-tight tabular-nums truncate`}
          >
            {formatarTempo(tempoRestante)}
          </motion.span>

          {/* Badge de fase (opcional) */}
          {mostrarBadgeFase && fase !== "normal" && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${tamanhos[tamanho].badge} uppercase tracking-wide font-semibold ${cor} opacity-90 truncate`}
            >
              {label}
            </motion.span>
          )}
        </div>

        {/* Controles de ação */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Pausar/Retomar */}
          {(onPausar || onRetomar) && tempoRestante > 0 && (
            <motion.button
              onClick={togglePausa}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${tamanhos[tamanho].controles} rounded-lg transition-all duration-200
                ${
                  pausadoLocal
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-slate-200/60 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-transparent
              `}
              title={pausadoLocal ? "Retomar (Espaço)" : "Pausar (Espaço)"}
              aria-label={
                pausadoLocal ? "Retomar cronômetro" : "Pausar cronômetro"
              }
              aria-pressed={pausadoLocal}
            >
              {pausadoLocal ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {/* Reset */}
          {mostrarReset && (
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${tamanhos[tamanho].controles} rounded-lg transition-all duration-200
                bg-slate-200/60 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 
                hover:bg-slate-300/60 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-transparent
              `}
              title="Reiniciar (R)"
              aria-label="Reiniciar cronômetro"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Barra de progresso (opcional) */}
      {mostrarBarraProgresso && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`mt-2.5 w-full bg-slate-200/60 dark:bg-slate-950/60 rounded-full overflow-hidden ${tamanhos[tamanho].barra}`}
          role="progressbar"
          aria-valuenow={Math.round(percentual)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso: ${Math.round(percentual)}% do tempo restante`}
        >
          <motion.div
            className={`h-full rounded-full ${barra} shadow-sm`}
            initial={{ width: "100%" }}
            animate={{ width: `${percentual}%` }}
            transition={{
              duration: fase === "critico" ? 0.3 : 0.5,
              ease: fase === "critico" ? "linear" : "easeOut",
            }}
          />
        </motion.div>
      )}

      {/* ============================================================================
          MODO DESENVOLVIMENTO - Controles de ajuste rápido
          ============================================================================ */}
      <AnimatePresence>
        {modoDev && mostrarControles && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="pt-3 border-t border-slate-300/50 dark:border-white/10"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "-1m", value: -60, icon: Minus },
                { label: "+1m", value: 60, icon: Plus },
                { label: "-5m", value: -300, icon: Minus },
                { label: "+5m", value: 300, icon: Plus },
              ].map(({ label, value, icon: Icon }) => (
                <motion.button
                  key={label}
                  onClick={() => ajustarTempo(value)}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(148, 163, 184, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-2 py-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 
                           text-xs font-medium text-slate-700 dark:text-slate-300 
                           hover:bg-slate-300/60 dark:hover:bg-slate-700 
                           transition-colors flex items-center justify-center gap-1"
                  title={label}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 text-center">
              Modo Dev • Use Espaço para pausar, R para reset
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador visual de pausa (ponto piscante) */}
      <AnimatePresence>
        {pausadoLocal && tempoRestante > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full 
                      border-2 border-white dark:border-slate-900 shadow-sm shadow-amber-500/50"
            aria-hidden="true"
            title="Cronômetro pausado"
          />
        )}
      </AnimatePresence>

      {/* Overlay de tempo esgotado (efeito especial) */}
      <AnimatePresence>
        {fase === "esgotado" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl bg-red-500/10 backdrop-blur-[2px] 
                      flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-red-600 dark:text-red-400 font-bold text-sm tracking-wider"
            >
              TEMPO ESGOTADO
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
