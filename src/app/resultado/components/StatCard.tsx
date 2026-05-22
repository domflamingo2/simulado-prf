"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: "emerald" | "rose" | "amber" | "blue" | "purple" | "cyan" | "indigo";
  delay?: number;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: StatCardProps) {
  const colors = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30",
    amber:
      "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
    purple:
      "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30",
    indigo:
      "from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors[color]} border p-4 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="absolute -top-4 -right-4 opacity-10">
        <Icon className="w-16 h-16" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-white/10">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-bold mb-0.5">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
