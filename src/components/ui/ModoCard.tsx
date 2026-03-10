import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type ModoVariant =
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "purple"
  | "slate"
  | "cyan";

interface ModoCardProps {
  href: string;
  icon: LucideIcon;
  variant: ModoVariant;
  title: string;
  description: string;
  xp: string;
  tag: string;
  badge?: string;
  shortcut?: string;
  index: number;
}

const baseColors: Record<ModoVariant, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40",
  amber:
    "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40",
  emerald:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40",
  purple:
    "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40",
  slate:
    "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20 hover:border-slate-500/40",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40",
};

export default function ModoCard({
  href,
  icon: Icon,
  variant,
  title,
  description,
  xp,
  tag,
  badge,
  shortcut,
  index,
}: ModoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        prefetch={false}
      >
        <div
          className={`
            relative overflow-hidden rounded-xl border p-4 sm:p-5 h-full
            bg-slate-800/40 backdrop-blur-sm
            transition-all duration-300
            ${baseColors[variant]}
            group-focus-visible:ring-2 group-focus-visible:ring-blue-500
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-current/10 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-current transition-colors">
                  {title}
                </h3>
                {badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                {description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-current/10 text-[10px] font-semibold border border-current/20">
                    {xp}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                    {tag}
                  </span>
                </div>
                {shortcut && (
                  <span className="text-[9px] text-slate-600 font-mono hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
                    {shortcut}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
