"use client";

import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "amber" | "blue";
}

export function StatBadge({ icon: Icon, label, value, color }: StatBadgeProps) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors[color]}`}
    >
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-[10px] uppercase tracking-wider opacity-70">
          {label}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
