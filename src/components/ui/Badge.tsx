"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Check,
  Crown,
  Flame,
  Lock,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export type BadgeType =
  | "primeiro"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "cebraspe-master"
  | "cebraspe-god"
  | "polivalente"
  | "especialista"
  | "velocista"
  | "velocista-extreme"
  | "nivel-5"
  | "nivel-10"
  | "nivel-max"
  | "perfeccionista"
  | "persistente";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

interface BadgeConfig {
  icon: typeof Award;
  title: string;
  description: string;
  color: string;
  gradient: string;
  glow: string;
  rarity: BadgeRarity;
  xpBonus?: number;
}

interface BadgeProps {
  type: BadgeType;
  unlocked?: boolean;
  date?: string;
  isNew?: boolean; // Acabou de desbloquear
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTooltip?: boolean;
  showProgress?: boolean;
  progress?: number; // 0-100 para badges bloqueados
  onClick?: () => void;
  className?: string;
}

const RARITY_CONFIG: Record<
  BadgeRarity,
  {
    border: string;
    shadow: string;
    label: string;
    particles: number;
  }
> = {
  common: {
    border: "border-slate-600",
    shadow: "shadow-slate-500/20",
    label: "Comum",
    particles: 0,
  },
  rare: {
    border: "border-blue-500/50",
    shadow: "shadow-blue-500/30",
    label: "Raro",
    particles: 4,
  },
  epic: {
    border: "border-purple-500/50",
    shadow: "shadow-purple-500/40",
    label: "Épico",
    particles: 8,
  },
  legendary: {
    border: "border-amber-500/50",
    shadow: "shadow-amber-500/50",
    label: "Lendário",
    particles: 12,
  },
};

const BADGE_DATABASE: Record<BadgeType, BadgeConfig> = {
  primeiro: {
    icon: Award,
    title: "Primeiro de Muitos",
    description: "Completou o primeiro simulado",
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/50",
    rarity: "common",
    xpBonus: 50,
  },
  "streak-3": {
    icon: Flame,
    title: "Fogo Iniciante",
    description: "3 dias de estudo consecutivos",
    color: "text-orange-400",
    gradient: "from-orange-400 to-red-400",
    glow: "shadow-orange-500/50",
    rarity: "common",
    xpBonus: 30,
  },
  "streak-7": {
    icon: Flame,
    title: "Fogo no Papel",
    description: "7 dias de estudo consecutivos",
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/50",
    rarity: "rare",
    xpBonus: 100,
  },
  "streak-30": {
    icon: Flame,
    title: "Chama Eterna",
    description: "30 dias de estudo consecutivos",
    color: "text-red-400",
    gradient: "from-red-500 to-rose-600",
    glow: "shadow-red-500/50",
    rarity: "epic",
    xpBonus: 500,
  },
  "cebraspe-master": {
    icon: Crown,
    title: "Cebraspe Master",
    description: "60+ pontos em 3 simulados consecutivos",
    color: "text-amber-400",
    gradient: "from-yellow-400 to-amber-500",
    glow: "shadow-amber-500/50",
    rarity: "rare",
    xpBonus: 200,
  },
  "cebraspe-god": {
    icon: Crown,
    title: "Deus do CEBRASPE",
    description: "60+ pontos em 10 simulados consecutivos",
    color: "text-amber-400",
    gradient: "from-amber-400 to-yellow-600",
    glow: "shadow-amber-500/50",
    rarity: "legendary",
    xpBonus: 1000,
  },
  polivalente: {
    icon: BookOpen,
    title: "Polivalente",
    description: "70%+ em todas as disciplinas",
    color: "text-emerald-400",
    gradient: "from-emerald-400 to-green-500",
    glow: "shadow-emerald-500/50",
    rarity: "rare",
    xpBonus: 150,
  },
  especialista: {
    icon: Target,
    title: "Especialista",
    description: "90%+ em uma disciplina específica",
    color: "text-cyan-400",
    gradient: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-500/50",
    rarity: "epic",
    xpBonus: 300,
  },
  velocista: {
    icon: Zap,
    title: "Velocista",
    description: "Modo Turbo em menos de 30min",
    color: "text-purple-400",
    gradient: "from-purple-400 to-violet-500",
    glow: "shadow-purple-500/50",
    rarity: "rare",
    xpBonus: 100,
  },
  "velocista-extreme": {
    icon: Zap,
    title: "Velocista Extremo",
    description: "Modo Turbo em menos de 20min com 80%+",
    color: "text-fuchsia-400",
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/50",
    rarity: "epic",
    xpBonus: 400,
  },
  "nivel-5": {
    icon: Star,
    title: "Agente Federal",
    description: "Alcançou o nível 5",
    color: "text-indigo-400",
    gradient: "from-indigo-400 to-purple-500",
    glow: "shadow-indigo-500/50",
    rarity: "common",
    xpBonus: 0,
  },
  "nivel-10": {
    icon: Trophy,
    title: "Superintendente",
    description: "Alcançou o nível 10",
    color: "text-rose-400",
    gradient: "from-rose-400 to-pink-500",
    glow: "shadow-rose-500/50",
    rarity: "rare",
    xpBonus: 0,
  },
  "nivel-max": {
    icon: Crown,
    title: "Diretor Geral",
    description: "Alcançou o nível máximo (20)",
    color: "text-amber-400",
    gradient: "from-amber-300 via-yellow-500 to-amber-600",
    glow: "shadow-amber-500/50",
    rarity: "legendary",
    xpBonus: 5000,
  },
  perfeccionista: {
    icon: Target,
    title: "Perfeccionista",
    description: "Acertou todas as questões de uma disciplina",
    color: "text-emerald-400",
    gradient: "from-emerald-300 to-teal-500",
    glow: "shadow-emerald-500/50",
    rarity: "epic",
    xpBonus: 250,
  },
  persistente: {
    icon: Award,
    title: "Persistente",
    description: "Completou 50 simulados",
    color: "text-blue-400",
    gradient: "from-blue-400 to-indigo-500",
    glow: "shadow-blue-500/50",
    rarity: "rare",
    xpBonus: 300,
  },
};

// Componente de partículas para badges lendários
function BadgeParticles({ count, color }: { count: number; color: string }) {
  return (
    <AnimatePresence>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: (Math.random() - 0.5) * 60,
            y: (Math.random() - 0.5) * 60,
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </AnimatePresence>
  );
}

// Tooltip customizado
function BadgeTooltip({
  config,
  unlocked,
  date,
  progress,
}: {
  config: BadgeConfig;
  unlocked: boolean;
  date?: string;
  progress?: number;
}) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            config.rarity === "legendary"
              ? "bg-amber-500/20 text-amber-400"
              : config.rarity === "epic"
                ? "bg-purple-500/20 text-purple-400"
                : config.rarity === "rare"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-700 text-slate-400"
          }`}
        >
          {RARITY_CONFIG[config.rarity].label}
        </span>
        {config.xpBonus ? (
          <span className="text-xs text-emerald-400">+{config.xpBonus} XP</span>
        ) : null}
      </div>
      <p className="font-bold text-white text-sm">{config.title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>

      {!unlocked && progress !== undefined && (
        <div className="mt-2">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-600 to-slate-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 text-right">
            {progress}% completo
          </p>
        </div>
      )}

      {unlocked && date && (
        <p className="text-[10px] text-slate-500 mt-2">
          Desbloqueado em {new Date(date).toLocaleDateString("pt-BR")}
        </p>
      )}

      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

export default function Badge({
  type,
  unlocked = false,
  date,
  isNew = false,
  size = "md",
  showTooltip = true,
  showProgress = false,
  progress = 0,
  onClick,
  className = "",
}: BadgeProps) {
  const [showNewAnimation, setShowNewAnimation] = useState(isNew);
  const config = BADGE_DATABASE[type];
  const Icon = config.icon;
  const rarity = RARITY_CONFIG[config.rarity];

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowNewAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const sizes = {
    xs: { container: "w-8 h-8", icon: "w-4 h-4", check: "w-2.5 h-2.5" },
    sm: { container: "w-12 h-12", icon: "w-6 h-6", check: "w-3.5 h-3.5" },
    md: { container: "w-16 h-16", icon: "w-8 h-8", check: "w-4 h-4" },
    lg: { container: "w-20 h-20", icon: "w-10 h-10", check: "w-5 h-5" },
    xl: { container: "w-28 h-28", icon: "w-14 h-14", check: "w-6 h-6" },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      initial={showNewAnimation ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={
        unlocked
          ? {
              scale: 1.15,
              rotate: [0, -5, 5, 0],
              transition: { rotate: { duration: 0.4 } },
            }
          : { scale: 1.05 }
      }
      whileTap={unlocked ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        relative group ${currentSize.container} rounded-2xl flex items-center justify-center
        ${
          unlocked
            ? `bg-gradient-to-br ${config.gradient} bg-opacity-20`
            : "bg-slate-800/80"
        }
        border-2 ${unlocked ? rarity.border : "border-slate-700"}
        ${unlocked ? rarity.shadow : ""}
        ${unlocked ? "" : "opacity-60"}
        ${onClick ? "cursor-pointer" : "cursor-help"}
        transition-colors duration-300
        ${className}
      `}
    >
      {/* Glow effect for unlocked */}
      {unlocked && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-30 blur-md transition-opacity`}
        />
      )}

      {/* Particles for legendary/epic */}
      {unlocked && rarity.particles > 0 && (
        <BadgeParticles
          count={rarity.particles}
          color={config.color.replace("text-", "").replace("400", "500")}
        />
      )}

      {/* New badge animation */}
      <AnimatePresence>
        {showNewAnimation && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient}`}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute -top-1 -right-1 z-10"
            >
              <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div className="relative z-10">
        <Icon
          className={`${currentSize.icon} ${
            unlocked ? config.color : "text-slate-600"
          } ${unlocked ? "drop-shadow-lg" : ""}`}
          strokeWidth={unlocked ? 2.5 : 2}
        />
      </div>

      {/* Lock icon for locked badges */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-2xl backdrop-blur-[1px]">
          <Lock className={`${currentSize.icon} text-slate-500`} />
        </div>
      )}

      {/* Check mark for unlocked (except small) */}
      {unlocked && size !== "xs" && size !== "sm" && !showNewAnimation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900"
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Progress ring for locked badges */}
      {!unlocked && showProgress && progress > 0 && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.9} 290`}
            className="text-slate-500"
          />
        </svg>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <BadgeTooltip
          config={config}
          unlocked={unlocked}
          date={date}
          progress={progress}
        />
      )}

      {/* Rarity glow pulse for legendary */}
      {unlocked && config.rarity === "legendary" && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-amber-500/50"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Componente de showcase para múltiplos badges
interface BadgeShowcaseProps {
  badges: Array<{
    type: BadgeType;
    unlocked: boolean;
    date?: string;
    isNew?: boolean;
  }>;
  size?: "sm" | "md" | "lg";
  columns?: 3 | 4 | 5;
}

export function BadgeShowcase({
  badges,
  size = "md",
  columns = 4,
}: BadgeShowcaseProps) {
  const gridCols = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 justify-items-center`}>
      {badges.map((badge, idx) => (
        <motion.div
          key={badge.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Badge {...badge} size={size} />
        </motion.div>
      ))}
    </div>
  );
}

// Componente de notificação de novo badge
interface NewBadgeNotificationProps {
  badgeType: BadgeType;
  onClose?: () => void;
}

export function NewBadgeNotification({
  badgeType,
  onClose,
}: NewBadgeNotificationProps) {
  const config = BADGE_DATABASE[badgeType];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-center gap-4 max-w-sm"
    >
      <Badge type={badgeType} unlocked size="lg" isNew />
      <div className="flex-1">
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          Nova Conquista!
        </p>
        <p
          className={`font-bold text-lg bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
        >
          {config.title}
        </p>
        <p className="text-sm text-slate-400">{config.description}</p>
        {config.xpBonus && (
          <p className="text-sm text-emerald-400 mt-1">+{config.xpBonus} XP</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}
