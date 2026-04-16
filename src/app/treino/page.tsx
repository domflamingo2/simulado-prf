"use client";

import { motion } from "framer-motion";
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
      alert("Selecione uma disciplina para continuar.");
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
      <BackgroundGlow />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <HeaderTreino />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Seleção de Disciplina */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <DisciplinasGrid
              disciplinaSelecionada={disciplinaSelecionada}
              onSelect={selecionarDisciplina}
            />
          </motion.div>

          {/* Coluna Direita: Configurações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-4 text-slate-300">
                <Settings2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold">Configurações</h2>
              </div>

              <ConfigPanel
                disciplinaSelecionada={!!disciplinaSelecionada}
                quantidade={quantidade}
                maxQuantidade={stats.max}
                mostrarExplicacao={mostrarExplicacao}
                onQuantidadeChange={setQuantidade}
                onExplicacaoChange={setMostrarExplicacao}
                onIniciarTreino={handleIniciarTreino}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Import necessário
import { Settings2 } from "lucide-react";
