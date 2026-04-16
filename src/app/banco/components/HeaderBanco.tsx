"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Database } from "lucide-react";
import Link from "next/link";

interface HeaderBancoProps {
  total: number;
}

export function HeaderBanco({ total }: HeaderBancoProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Voltar ao início"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-400" />
                Banco de Questões
              </h1>
              <p className="text-sm text-slate-400">
                {total} questões disponíveis para estudo
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
