"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: "emerald" | "rose" | "amber" | "blue" | "purple";
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
    emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-400",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400",
    amber: "from-amber-500/20 to-amber-600/10 text-amber-400",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors[color]} border border-white/10 p-4 sm:p-6`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative">
        <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
      </div>
    </motion.div>
  );
}
