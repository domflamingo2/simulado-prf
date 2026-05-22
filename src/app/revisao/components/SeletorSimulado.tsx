"use client";

import { motion } from "framer-motion";
import { BarChart3, Calendar, ChevronDown, Clock, Trophy } from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { HistoricoSimulado } from "@/data/index";

interface SeletorSimuladoProps {
  simulados: HistoricoSimulado[];
  simuladoSelecionado: HistoricoSimulado;
  onChange: (simulado: HistoricoSimulado) => void;
}

export function SeletorSimulado({
  simulados,
  simuladoSelecionado,
  onChange,
}: SeletorSimuladoProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (simulados.length <= 1) return null;

  const dataFormatada = new Date(simuladoSelecionado.data).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const stats = {
    pontuacao: simuladoSelecionado.estatisticas.pontuacao,
    acertos: simuladoSelecionado.estatisticas.acertos,
    total: simuladoSelecionado.estatisticas.totalQuestoes,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-4 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Calendar className="w-3.5 h-3.5 text-white" />
          </div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Selecionar Simulado
          </label>
        </div>

        {/* Select customizado */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/80 border border-white/10 hover:border-blue-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Trophy className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  {dataFormatada}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-0.5">
                    <BarChart3 className="w-2.5 h-2.5" />
                    {stats.pontuacao} pts
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                    {stats.acertos}/{stats.total}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 z-20 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                {simulados.map((s, idx) => {
                  const isSelected = s.id === simuladoSelecionado.id;
                  const dataSim = new Date(s.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  });
                  const isFirst = idx === 0;
                  const isLast = idx === simulados.length - 1;

                  return (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        onChange(s);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200
                        ${isSelected ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20" : "hover:bg-slate-700/50"}
                        ${!isFirst ? "border-t border-white/5" : ""}
                        ${isLast ? "rounded-b-xl" : ""}
                      `}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-700/50 text-[10px] font-bold text-slate-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-200">
                            {dataSim}
                          </span>
                          <span
                            className={`text-xs font-bold ${s.estatisticas.pontuacao >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                          >
                            {s.estatisticas.pontuacao} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                          <span>✅ {s.estatisticas.acertos} acertos</span>
                          <span>❌ {s.estatisticas.erros} erros</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </>
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>
            Modo:{" "}
            {simuladoSelecionado.modo === "COMPLETO"
              ? "Completo"
              : simuladoSelecionado.modo === "TURBO"
                ? "Turbo"
                : "Adaptativo"}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>
            {new Date(simuladoSelecionado.data).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Ícone auxiliar
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
