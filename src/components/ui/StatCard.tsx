import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";

// Utilitário simples de classes (se você não tiver um 'clsx' ou 'cn' global)
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

type StatVariant = "emerald" | "purple" | "amber" | "cyan" | "rose" | "blue";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subvalue?: string;
  variant: StatVariant;
  glow?: boolean;
  trend?: { value: number; positive: boolean };
  onClick?: () => void;
}

const variants = {
  emerald:
    "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
  purple:
    "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
  amber: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
  cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
  rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
  blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
};

const glowMap: Record<StatVariant, string> = {
  emerald: "green",
  purple: "purple",
  amber: "yellow",
  cyan: "cyan",
  rose: "red",
  blue: "blue",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subvalue,
  variant,
  glow = false,
  trend,
  onClick,
}: StatCardProps) {
  const currentVariant = variants[variant];
  const textColor = currentVariant.split(" ")[2];
  const glowColor = glowMap[variant];

  return (
    <GlassCard
      className={`p-3 sm:p-4 h-full transition-all duration-300 ${
        onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""
      }`}
      glow={glow ? (glowColor as any) : undefined}
      intensity={glow ? "medium" : "subtle"}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${textColor}`} />
          <span className="text-xs font-medium">{label}</span>
        </div>
        {trend && (
          <span
            className={`text-[10px] font-bold flex items-center gap-0.5 ${
              trend.positive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <span className={`text-2xl sm:text-3xl font-bold ${textColor}`}>
          {value}
        </span>
        {subvalue && (
          <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5 truncate">
            {subvalue}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
