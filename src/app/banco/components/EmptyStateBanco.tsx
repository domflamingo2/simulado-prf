"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Home,
  Lightbulb,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";

// Ripple Button Component (Item 6)
const RippleButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: any) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; show: boolean }>(
    {
      x: 0,
      y: 0,
      show: false,
    },
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
    onClick?.(e);

    setTimeout(() => setRipple((prev) => ({ ...prev, show: false })), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripple.show && (
          <motion.span
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-8 h-8 bg-white/30 rounded-full pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
          />
        )}
      </AnimatePresence>
    </button>
  );
};

// Loading Skeleton Component (Item 1)
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] p-6">
    <GlassCard className="p-12 text-center max-w-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <p className="text-slate-400">Carregando questões...</p>
      </motion.div>
    </GlassCard>
  </div>
);

// Variants do Estado Vazio (Item 5)
type EmptyStateVariant =
  | "no-results"
  | "no-questions"
  | "error"
  | "no-discipline";

interface EmptyStateBancoProps {
  onLimparFiltros: () => void;
  variant?: EmptyStateVariant;
  filtrosAtivos?: string[];
  disciplinaAtual?: string;
  isLoading?: boolean;
  onVerTodasDisciplinas?: () => void;
}

// Sugestões Contextuais (Item 2)
const getContextualSuggestions = (
  variant: EmptyStateVariant,
  filtrosAtivos?: string[],
  disciplinaAtual?: string,
) => {
  const suggestions = {
    "no-results": {
      title: "Nenhum resultado encontrado",
      message: `Tente ajustar seus filtros de busca${filtrosAtivos && filtrosAtivos.length > 0 ? ` (${filtrosAtivos.join(", ")})` : ""} para encontrar mais questões.`,
      tips: [
        "Use termos mais genéricos na busca",
        "Remova filtros muito específicos",
        "Tente buscar por palavras-chave relacionadas",
      ],
      actionText: "Limpar todos os filtros",
    },
    "no-questions": {
      title: "Nenhuma questão disponível",
      message: "Ainda não há questões cadastradas nesta seção.",
      tips: [
        "Volte mais tarde, novas questões serão adicionadas",
        "Entre em contato com o administrador",
        "Sugira novas questões para a plataforma",
      ],
      actionText: "Voltar ao início",
    },
    error: {
      title: "Erro ao carregar questões",
      message: "Ocorreu um problema ao tentar carregar as questões.",
      tips: [
        "Verifique sua conexão com a internet",
        "Tente recarregar a página",
        "Entre em contato com o suporte se o problema persistir",
      ],
      actionText: "Tentar novamente",
    },
    "no-discipline": {
      title: `Nenhuma questão em ${disciplinaAtual || "esta disciplina"}`,
      message: "Não encontramos questões para a disciplina selecionada.",
      tips: [
        "Explore outras disciplinas disponíveis",
        "Sugira a adição de questões para esta disciplina",
        "Volte para ver todas as disciplinas",
      ],
      actionText: "Ver todas as disciplinas",
    },
  };

  return suggestions[variant] || suggestions["no-results"];
};

// Dicas Rápidas (Item 3)
const QuickTips = () => {
  const tips = [
    {
      icon: Clock,
      text: "86% dos usuários encontram mais questões removendo filtros",
    },
    { icon: ThumbsUp, text: "Questões recentes têm maior taxa de acerto" },
    {
      icon: BookOpen,
      text: "Tente filtrar por diferentes níveis de dificuldade",
    },
    { icon: Sparkles, text: "Use palavras-chave relacionadas ao tema" },
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">💡 DICA RÁPIDA</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-slate-300"
            >
              {tips[currentTip].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Analytics Tracking (Item 8)
const trackAnalytics = (event: string, properties?: any) => {
  // Implemente seu analytics aqui (Google Analytics, Mixpanel, etc)
  console.log("[Analytics]", event, properties);

  // Exemplo com Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, {
      ...properties,
      timestamp: new Date().toISOString(),
      component: "EmptyStateBanco",
    });
  }
};

export function EmptyStateBanco({
  onLimparFiltros,
  variant = "no-results",
  filtrosAtivos = [],
  disciplinaAtual,
  isLoading = false,
  onVerTodasDisciplinas,
}: EmptyStateBancoProps) {
  const [isCleaning, setIsCleaning] = useState(false);

  const suggestions = getContextualSuggestions(
    variant,
    filtrosAtivos,
    disciplinaAtual,
  );

  // Keyboard Shortcut (Item 7)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleLimparFiltros();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Handle Limpar Filtros com Loading
  const handleLimparFiltros = async () => {
    if (isCleaning) return;

    setIsCleaning(true);
    trackAnalytics("clear_filters_clicked", { variant, filtrosAtivos });

    try {
      // Simula operação assíncrona (caso onLimparFiltros seja async)
      await Promise.resolve(onLimparFiltros());

      toast.success("Filtros limpos com sucesso!", {
        icon: <XCircle className="w-4 h-4" />,
        duration: 3000,
      });

      trackAnalytics("filters_cleared", { variant, success: true });
    } catch (error) {
      toast.error("Erro ao limpar filtros", {
        icon: <AlertCircle className="w-4 h-4" />,
        description: "Tente novamente mais tarde",
      });

      trackAnalytics("filters_cleared", {
        variant,
        success: false,
        error: String(error),
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSecondaryAction = () => {
    if (variant === "no-discipline" && onVerTodasDisciplinas) {
      trackAnalytics("view_all_disciplines_clicked");
      onVerTodasDisciplinas();
    } else if (variant === "error") {
      trackAnalytics("retry_load_clicked");
      window.location.reload();
    } else if (variant === "no-questions") {
      trackAnalytics("go_home_clicked");
      window.location.href = "/";
    }
  };
  // Loading State (Item 1)
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[40vh] p-4 md:p-6"
        role="status"
        aria-live="polite"
      >
        <GlassCard className="p-6 md:p-12 text-center max-w-md w-full">
          {/* Ícone Animado */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {variant === "error" ? (
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            ) : (
              <Search className="w-20 h-20 text-slate-500 mx-auto mb-6" />
            )}
          </motion.div>

          {/* Título e Mensagem Contextual (Item 2 e 5) */}
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            {suggestions.title}
          </h2>

          <p className="text-slate-400 mb-6 leading-relaxed text-sm md:text-base">
            {suggestions.message}
          </p>

          {/* Filtros Ativos (Item 2) */}
          {filtrosAtivos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-6"
            >
              {filtrosAtivos.map((filtro) => (
                <span
                  key={filtro}
                  className="px-2 py-1 text-xs bg-slate-700 rounded-full text-slate-300"
                >
                  {filtro}
                </span>
              ))}
            </motion.div>
          )}

          {/* Botões de Ação (Item 6) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <RippleButton
              onClick={handleLimparFiltros}
              disabled={isCleaning}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105 ${
                isCleaning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Limpar filtros"
              aria-busy={isCleaning}
            >
              {isCleaning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {suggestions.actionText}
            </RippleButton>

            {/* Botão Secundário (Item 2) */}
            {(variant === "no-discipline" ||
              variant === "error" ||
              variant === "no-questions") && (
              <RippleButton
                onClick={handleSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
                aria-label={variant === "error" ? "Tentar novamente" : "Voltar"}
              >
                {variant === "error" ? (
                  <RefreshCw className="w-5 h-5" />
                ) : (
                  <Home className="w-5 h-5" />
                )}
                {variant === "error" ? "Tentar novamente" : "Voltar ao início"}
              </RippleButton>
            )}
          </div>

          {/* Dicas Rápidas (Item 3) */}
          {variant !== "error" && <QuickTips />}

          {/* Dicas Contextuais (Item 2) */}
          {suggestions.tips.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-left"
            >
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                SUGESTÕES:
              </p>
              <ul className="space-y-1">
                {suggestions.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-xs text-slate-400 flex items-start gap-2"
                  >
                    <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Keyboard Shortcut Hint (Item 7) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-4 border-t border-slate-700/50"
          >
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <span>💡 Dica:</span>
              <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs">
                ESC
              </kbd>
              <span>para limpar filtros rapidamente</span>
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </>
  );
}
