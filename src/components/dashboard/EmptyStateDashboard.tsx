"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface EmptyStateProps {
  onIniciar: () => Promise<void> | void;
  idUnico?: string;
  titulo?: string;
  descricao?: string;
  textoBotao?: string;
}

type StatusType = "idle" | "loading" | "success" | "error";

interface EstadoUI {
  status: StatusType;
  mensagemErro?: string;
}

// ============================================================================
// ANIMAÇÕES
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const iconVariants: Record<StatusType, Variants[keyof Variants]> = {
  idle: { rotate: 0, scale: 1 },
  loading: {
    rotate: 360,
    scale: 1.1,
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
  success: { scale: [1, 1.2, 1], transition: { duration: 0.5 } },
  error: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function EmptyStateDashboard({
  onIniciar,
  idUnico = "default",
  titulo = "PRF Simulado",
  descricao = "Simulados realistas no formato CEBRASPE. Estude com questões comentadas e acompanhe sua evolução.",
  textoBotao = "Iniciar Simulado",
}: EmptyStateProps) {
  const [estado, setEstado] = useState<EstadoUI>({ status: "idle" });
  const abortControllerRef = useRef<AbortController | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const handleIniciar = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // ✅ OTIMIZAÇÃO: Usa forma funcional para não depender de 'estado.status' nas dependências
      setEstado((prev) => {
        if (prev.status === "loading") {
          abortControllerRef.current?.abort();
          return { status: "idle" as StatusType };
        }
        return { status: "loading" as StatusType };
      });

      // Aborta anterior se existir (redundância de segurança, mas boa prática)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const timeoutId = setTimeout(() => {
          throw new Error("Tempo limite excedido. Tente novamente.");
        }, 30000);

        await onIniciar();

        clearTimeout(timeoutId);

        if (!abortControllerRef.current.signal.aborted) {
          setEstado({ status: "success" });
          setTimeout(() => {
            // window.location.href = "/simulado";
          }, 1500);
        }
      } catch (erro) {
        if (!abortControllerRef.current?.signal.aborted) {
          setEstado({
            status: "error",
            mensagemErro:
              erro instanceof Error ? erro.message : "Erro ao iniciar simulado",
          });
          buttonRef.current?.focus();
        }
      }
    },
    [onIniciar], // Dependência limpa
  );

  const handleRetry = useCallback(() => {
    setEstado({ status: "idle" });
    buttonRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // ✅ OTIMIZAÇÃO: Usa forma funcional aqui também
      setEstado((prev) => {
        if (e.key === "Enter" && prev.status === "idle") {
          buttonRef.current?.click();
        }
        return prev; // Importante retornar o estado se não houver mudança
      });
    },
    [], // Dependências vazias
  );

  const renderIcon = () => {
    const iconProps = { className: "w-10 h-10" };

    switch (estado.status) {
      case "success":
        return (
          <Sparkles
            {...iconProps}
            className={`${iconProps.className} text-emerald-400`}
          />
        );
      case "error":
        return (
          <AlertCircle
            {...iconProps}
            className={`${iconProps.className} text-rose-400`}
          />
        );
      case "loading":
      default:
        return (
          <Target
            {...iconProps}
            className={`${iconProps.className} text-blue-400`}
          />
        );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[60vh] p-4 sm:p-6"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Bem-vindo ao PRF Simulado"
      tabIndex={-1}
    >
      <GlassCard
        className="p-6 sm:p-10 text-center max-w-xl w-full relative overflow-hidden"
        glow="blue"
        intensity="strong"
      >
        {/* Background decorativo animado */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/10"
          />
        </div>

        {/* Ícone principal com animação */}
        <motion.div
          variants={iconVariants}
          animate={estado.status}
          initial="idle"
          className="flex items-center justify-center"
        >
          {renderIcon()}
        </motion.div>

        {/* Conteúdo de texto */}
        <motion.div variants={itemVariants} className="relative z-10">
          <AnimatePresence mode="wait">
            {estado.status === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">
                  Ops! Algo deu errado
                </h2>
                <p className="text-rose-400/90 text-sm sm:text-base">
                  {estado.mensagemErro}
                </p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 hover:border-rose-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentar novamente</span>
                </button>
              </motion.div>
            ) : estado.status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">
                  Preparando ambiente...
                </h2>
                <p className="text-emerald-400/90">
                  Você será redirecionado em instantes
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-1 bg-emerald-500/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-400"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {titulo}
                </h1>
                <p className="text-slate-400 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
                  {descricao}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botões de ação */}
        {estado.status !== "error" && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center relative z-10 mt-6"
          >
            {/* Botão principal */}
            <motion.button
              ref={buttonRef}
              onClick={handleIniciar}
              disabled={
                estado.status === "loading" || estado.status === "success"
              }
              whileHover={
                estado.status === "idle" ? { scale: 1.03, y: -2 } : undefined
              }
              whileTap={estado.status === "idle" ? { scale: 0.97 } : undefined}
              className={`
                relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg overflow-hidden min-w-[180px]
                ${
                  estado.status === "loading"
                    ? "bg-slate-700/80 text-slate-300 cursor-not-allowed border border-slate-600"
                    : estado.status === "success"
                      ? "bg-emerald-600 text-white border border-emerald-500 shadow-emerald-600/25"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-600/30 hover:shadow-blue-500/50 border border-blue-400/30"
                }
                focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-95
              `}
              aria-busy={estado.status === "loading"}
              aria-label={
                estado.status === "loading" ? "Iniciando simulado" : textoBotao
              }
            >
              {estado.status === "loading" && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 30, ease: "linear" }}
                />
              )}

              <AnimatePresence mode="wait">
                {estado.status === "loading" ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Iniciando...</span>
                  </motion.span>
                ) : estado.status === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4.5 h-4.5" />
                    <span>Pronto!</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2.5"
                  >
                    <Play className="w-4.5 h-4.5 fill-current" />
                    <span>{textoBotao}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Link secundário */}
            {estado.status === "idle" && (
              <motion.a
                href="/como-funciona"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all duration-200 group min-w-[180px] focus:outline-none focus:ring-2 focus:ring-slate-500/50"
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>Como Funciona</span>
                <ArrowRight className="w-4.5 h-4.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
              </motion.a>
            )}
          </motion.div>
        )}

        {/* Dica inferior */}
        {estado.status === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mt-8 pt-6 border-t border-slate-700/50"
          >
            <p className="text-xs text-slate-500">
              💡 <span className="text-slate-400">Dica:</span> Pressione{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-300 text-xs font-mono">
                Enter
              </kbd>{" "}
              para iniciar rapidamente
            </p>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}
