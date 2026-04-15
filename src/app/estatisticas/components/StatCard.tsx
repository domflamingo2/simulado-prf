"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  cor: "emerald" | "rose" | "amber" | "blue" | "purple" | "cyan";
  delay?: number;
  subtitulo?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  cor,
  delay = 0,
  subtitulo,
}: StatCardProps) {
  const cores: Record<typeof cor, string> = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
    amber:
      "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
    purple:
      "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cores[cor]} border p-4 sm:p-6`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative">
        <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
        {subtitulo && (
          <div className="text-xs opacity-60 mt-1">{subtitulo}</div>
        )}
      </div>
    </motion.div>
  );
}
