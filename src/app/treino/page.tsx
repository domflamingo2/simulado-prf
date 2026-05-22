"use client";

import { motion } from "framer-motion";
import { Brain, Settings2, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTreinoConfig } from "@/hooks/useTreinoConfig";
import { iniciarTreino } from "@/lib/treino";

import { BackgroundGlow } from "./components/BackgroundGlow";
import { ConfigPanel } from "./components/ConfigPanel";
import { DisciplinasGrid } from "./components/DisciplinasGrid";
import { HeaderTreino } from "./components/HeaderTreino";

export default function TreinoPage() {
  const router = useRouter();

  const {
    disciplinaSelecionada,
    quantidade,
    mostrarExplicacao,
    stats,
    setQuantidade,
    setMostrarExplicacao,
    selecionarDisciplina,
  } = useTreinoConfig();

  const handleIniciarTreino = () => {
    if (!disciplinaSelecionada) {
      const toast = (window as any).toast?.error;

      if (toast) {
        toast("Selecione uma disciplina para continuar.");
      }

      return;
    }

    iniciarTreino({
      disciplina: disciplinaSelecionada,
      quantidade,
      mostrarExplicacao,
    });

    router.push("/treino/simulado");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      <BackgroundGlow variant="treino" intensity="medium" animated />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HEADER */}
        <HeaderTreino
          stats={{
            totalQuestoes: stats?.totalQuestoes ?? 0,
            streak: stats?.streak ?? 0,
            taxaAcerto: stats?.taxaAcerto ?? 0,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ESQUERDA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="lg:col-span-7 space-y-6"
          >
            <DisciplinasGrid
              disciplinaSelecionada={disciplinaSelecionada}
              onSelect={selecionarDisciplina}
              performanceData={stats?.performance ?? {}}
            />
          </motion.div>

          {/* DIREITA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              delay: 0.1,
            }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="lg:sticky lg:top-8">
              {/* HEADER CONFIG */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Settings2 className="w-3.5 h-3.5 text-white" />
                  </div>

                  <h2 className="text-base font-bold text-white">
                    Configurações do Treino
                  </h2>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Brain className="w-3 h-3" />
                  <span>Personalizado</span>
                </div>
              </div>

              {/* DISCIPLINA SELECIONADA */}
              {disciplinaSelecionada && stats?.disciplinaStats && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />

                    <span className="text-xs font-medium text-emerald-400">
                      Disciplina selecionada
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white">
                    {stats.disciplinaStats.nome}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span>📊 {stats.disciplinaStats.total} questões</span>

                    <span>
                      📈 Taxa acerto: {stats.disciplinaStats.taxaAcerto}%
                    </span>
                  </div>
                </motion.div>
              )}

              {/* CONFIG PANEL */}
              <ConfigPanel
                disciplinaSelecionada={!!disciplinaSelecionada}
                quantidade={quantidade}
                maxQuantidade={stats?.max ?? 0}
                mostrarExplicacao={mostrarExplicacao}
                onQuantidadeChange={setQuantidade}
                onExplicacaoChange={setMostrarExplicacao}
                onIniciarTreino={handleIniciarTreino}
                disciplinaNome={stats?.disciplinaStats?.nome}
                totalDisponivel={stats?.max ?? 0}
              />
            </div>
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-6 border-t border-white/10 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-yellow-500" />

              <span>Treinos personalizados melhoram o desempenho</span>
            </div>

            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />

            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3 text-emerald-400" />

              <span>Foco nas disciplinas com menor taxa de acerto</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
