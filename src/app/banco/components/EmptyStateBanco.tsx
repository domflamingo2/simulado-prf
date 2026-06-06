"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Database,
  Filter,
  Home,
  Lightbulb,
  Loader2,
  Search,
  Sparkles,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";

// ============================================================
// Ripple Button Component
// ============================================================

type RippleButtonVariant = "primary" | "secondary" | "outline";

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: RippleButtonVariant;
}

const RippleButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}: RippleButtonProps) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; show: boolean }>(
    {
      x: 0,
      y: 0,
      show: false,
    },
  );

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-white/10",
    outline:
      "bg-transparent hover:bg-white/10 text-slate-300 border border-white/20",
  };

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
      className={`relative overflow-hidden transition-all duration-200 ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripple.show && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
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

// ============================================================
// Loading Skeleton Component
// ============================================================
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] p-6">
    <GlassCard className="p-12 text-center max-w-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-3 border-blue-500/20 border-t-blue-500 border-r-purple-500/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-medium">Carregando questões...</p>
        <p className="text-[10px] text-slate-500">Aguarde um momento</p>
      </motion.div>
    </GlassCard>
  </div>
);

// ============================================================
// Variants do Estado Vazio
// ============================================================
type EmptyStateVariant =
  | "no-results"
  | "no-questions"
  | "error"
  | "no-discipline"
  | "maintenance";

interface EmptyStateBancoProps {
  onLimparFiltros: () => void;
  variant?: EmptyStateVariant;
  filtrosAtivos?: string[];
  disciplinaAtual?: string;
  isLoading?: boolean;
  onVerTodasDisciplinas?: () => void;
}

// ============================================================
// Sugestões Contextuais
// ============================================================
const getContextualSuggestions = (
  variant: EmptyStateVariant,
  filtrosAtivos?: string[],
  disciplinaAtual?: string,
) => {
  const suggestions = {
    "no-results": {
      title: "Nenhum resultado encontrado",
      message: `Tente ajustar seus filtros de busca${filtrosAtivos && filtrosAtivos.length > 0 ? ` (${filtrosAtivos.join(", ")})` : ""} para encontrar mais questões.`,
      icon: Search,
      tips: [
        "Use termos mais genéricos na busca",
        "Remova filtros muito específicos",
        "Tente buscar por palavras-chave relacionadas",
      ],
      actionText: "Limpar todos os filtros",
      secondaryAction: null,
    },
    "no-questions": {
      title: "Nenhuma questão disponível",
      message: "Ainda não há questões cadastradas nesta seção.",
      icon: Database,
      tips: [
        "Volte mais tarde, novas questões serão adicionadas",
        "Entre em contato com o administrador",
        "Sugira novas questões para a plataforma",
      ],
      actionText: "Limpar filtros",
      secondaryAction: { text: "Voltar ao início", href: "/" },
    },
    error: {
      title: "Erro ao carregar questões",
      message: "Ocorreu um problema ao tentar carregar as questões.",
      icon: AlertCircle,
      tips: [
        "Verifique sua conexão com a internet",
        "Tente recarregar a página",
        "Entre em contato com o suporte se o problema persistir",
      ],
      actionText: "Tentar novamente",
      secondaryAction: { text: "Ir para o dashboard", href: "/dashboard" },
    },
    "no-discipline": {
      title: `Nenhuma questão em ${disciplinaAtual || "esta disciplina"}`,
      message: "Não encontramos questões para a disciplina selecionada.",
      icon: Compass,
      tips: [
        "Explore outras disciplinas disponíveis",
        "Sugira a adição de questões para esta disciplina",
        "Volte para ver todas as disciplinas",
      ],
      actionText: "Limpar filtros",
      secondaryAction: { text: "Ver todas as disciplinas", action: "view_all" },
    },
    maintenance: {
      title: "Em manutenção",
      message: "Estamos realizando melhorias no banco de questões.",
      icon: Sparkles,
      tips: [
        "Volte em alguns minutos",
        "Enquanto isso, pratique com simulados",
        "Acompanhe nossas novidades",
      ],
      actionText: "Ir para simulados",
      secondaryAction: { text: "Voltar ao início", href: "/" },
    },
  };

  return suggestions[variant] || suggestions["no-results"];
};

// ============================================================
// Dicas Rápidas Rotativas
// ============================================================
const QUICK_TIPS = [
  {
    icon: Clock,
    text: "86% dos usuários encontram mais questões removendo filtros",
    color: "text-blue-400",
  },
  {
    icon: ThumbsUp,
    text: "Questões recentes têm maior taxa de acerto",
    color: "text-emerald-400",
  },
  {
    icon: BookOpen,
    text: "Tente filtrar por diferentes níveis de dificuldade",
    color: "text-purple-400",
  },
  {
    icon: Sparkles,
    text: "Use palavras-chave relacionadas ao tema",
    color: "text-amber-400",
  },
];

const QuickTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % QUICK_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const TipIcon = QUICK_TIPS[currentTip].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-yellow-500/20">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
            💡 DICA RÁPIDA
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-slate-300 flex items-center gap-2"
            >
              <TipIcon
                className={`w-3.5 h-3.5 ${QUICK_TIPS[currentTip].color}`}
              />
              {QUICK_TIPS[currentTip].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Analytics Tracking
// ============================================================
interface GtagEvent {
  (command: "event", action: string, params: Record<string, unknown>): void;
}

declare global {
  interface Window {
    gtag?: GtagEvent;
  }
}

const trackAnalytics = (
  event: string,
  properties?: Record<string, unknown>,
) => {
  console.log("[Analytics]", event, properties);
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, {
      ...properties,
      timestamp: new Date().toISOString(),
      component: "EmptyStateBanco",
    });
  }
};

// ============================================================
// Componente Principal
// ============================================================
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
  const Icon = suggestions.icon;

  const handleLimparFiltros = useCallback(async () => {
    if (isCleaning) return;
    setIsCleaning(true);
    trackAnalytics("clear_filters_clicked", { variant, filtrosAtivos });

    try {
      await Promise.resolve(onLimparFiltros());
      toast.success("Filtros limpos com sucesso!", { duration: 3000 });
      trackAnalytics("filters_cleared", { variant, success: true });
    } catch (error) {
      toast.error("Erro ao limpar filtros");
      trackAnalytics("filters_cleared", { variant, success: false });
    } finally {
      setIsCleaning(false);
    }
  }, [isCleaning, onLimparFiltros, variant, filtrosAtivos]);

  // Keyboard Shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleLimparFiltros();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleLimparFiltros]);

  const handleSecondaryAction = () => {
    if (variant === "no-discipline" && onVerTodasDisciplinas) {
      trackAnalytics("view_all_disciplines_clicked");
      onVerTodasDisciplinas();
    } else if (variant === "error") {
      trackAnalytics("retry_load_clicked");
      window.location.reload();
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center justify-center min-h-[40vh] p-4 md:p-6"
        role="status"
        aria-live="polite"
      >
        <div className="relative">
          {/* Efeito de glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl opacity-50" />

          <GlassCard className="relative p-6 md:p-10 text-center max-w-md w-full overflow-hidden">
            {/* Gradiente decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl" />

            {/* Ícone Animado */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
              className="relative mb-6 flex justify-center"
            >
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${
                  variant === "error" ? "bg-rose-500" : "bg-blue-500"
                }`}
              />
              <div
                className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl ${
                  variant === "error"
                    ? "from-rose-500 to-red-600"
                    : "from-blue-500 to-purple-600"
                }`}
              >
                <Icon className="w-12 h-12 text-white" />
              </div>
              {variant === "no-results" && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  🔍
                </motion.div>
              )}
            </motion.div>

            {/* Título */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              {suggestions.title}
            </h2>

            {/* Mensagem */}
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              {suggestions.message}
            </p>

            {/* Filtros Ativos */}
            {filtrosAtivos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 justify-center mb-6"
              >
                {filtrosAtivos.map((filtro) => (
                  <span
                    key={filtro}
                    className="px-2.5 py-1 text-xs bg-slate-800 rounded-full text-slate-300 border border-white/10"
                  >
                    <Filter className="w-2.5 h-2.5 inline mr-1" />
                    {filtro}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <RippleButton
                onClick={handleLimparFiltros}
                disabled={isCleaning}
                variant="primary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
              >
                {isCleaning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {suggestions.actionText}
              </RippleButton>

              {suggestions.secondaryAction && (
                <RippleButton
                  onClick={handleSecondaryAction}
                  variant="secondary"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
                >
                  <Home className="w-4 h-4" />
                  {suggestions.secondaryAction.text}
                </RippleButton>
              )}
            </div>

            {/* Dicas Rápidas */}
            {variant !== "error" && variant !== "maintenance" && <QuickTips />}

            {/* Dicas Contextuais */}
            {suggestions.tips.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-left"
              >
                <p className="text-[10px] text-slate-500 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  SUGESTÕES
                </p>
                <ul className="space-y-1.5">
                  {suggestions.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-xs text-slate-400 flex items-start gap-2"
                    >
                      <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-400" />
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Keyboard Shortcut Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-4 border-t border-white/10"
            >
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                <span>💡 Dica:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
                  ESC
                </kbd>
                <span>para limpar filtros rapidamente</span>
              </p>
            </motion.div>
          </GlassCard>
        </div>
      </motion.div>
    </>
  );
}
