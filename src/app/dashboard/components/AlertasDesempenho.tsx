"use client";

import AlertaDesempenho from "@/components/ui/AlertaDesempenho";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Brain, Target } from "lucide-react";

interface AlertasDesempenhoProps {
  classificacaoNivel?:
    | "excelente"
    | "bom"
    | "regular"
    | "insuficiente"
    | "critico"
    | "alerta";
  disciplinaFraca?: {
    nome: string;
    aproveitamento: number;
  };
  streakDias: number;
}

const alertVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function AlertasDesempenho({
  classificacaoNivel,
  disciplinaFraca,
  streakDias,
}: AlertasDesempenhoProps) {
  // Contar alertas ativos
  const alertasAtivos = [
    classificacaoNivel === "critico" || classificacaoNivel === "insuficiente",
    classificacaoNivel === "alerta",
    disciplinaFraca && disciplinaFraca.aproveitamento < 50,
    streakDias >= 3,
  ].filter(Boolean).length;

  return (
    <div
      className="space-y-3 mb-6"
      role="region"
      aria-label="Alertas de desempenho"
    >
      {/* Título da seção */}
      {alertasAtivos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="p-1 rounded-lg bg-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Alertas de Desempenho
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {(classificacaoNivel === "critico" ||
          classificacaoNivel === "insuficiente") && (
          <motion.div
            key="critico"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AlertaDesempenho
              tipo="critico"
              mensagem="⚠️ Seu último simulado ficou significativamente abaixo da média."
              acao={{ label: "Revisar Erros", href: "/erros" }}
            />
          </motion.div>
        )}

        {classificacaoNivel === "alerta" && (
          <motion.div
            key="alerta"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AlertaDesempenho
              tipo="alerta"
              mensagem="📊 Seu desempenho precisa de atenção. Continue praticando!"
              acao={{ label: "Ver estatísticas", href: "/estatisticas" }}
            />
          </motion.div>
        )}

        {disciplinaFraca && disciplinaFraca.aproveitamento < 50 && (
          <motion.div
            key="disciplina"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AlertaDesempenho
              tipo="alerta"
              mensagem={`📚 ${disciplinaFraca.nome} está com aproveitamento baixo (${disciplinaFraca.aproveitamento.toFixed(0)}%).`}
              acao={{ label: "Treinar agora", href: "/treino" }}
            />
          </motion.div>
        )}

        {streakDias >= 3 && (
          <motion.div
            key="streak"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <AlertaDesempenho
              tipo="info"
              mensagem={`🔥 Sequência de ${streakDias} dias! Continue assim.`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards de resumo rápido (quando não há alertas) */}
      {alertasAtivos === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 rounded-full bg-emerald-500/20">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-emerald-400">
              Tudo em ordem!
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Seu desempenho está bom. Continue acompanhando seus estudos
            diariamente.
          </p>
        </motion.div>
      )}

      {/* Dica de ação */}
      {alertasAtivos > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-3 rounded-lg bg-slate-800/30 border border-white/5 text-center"
        >
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Brain className="w-3 h-3" />
            Priorize os alertas acima para melhorar seu desempenho
          </p>
        </motion.div>
      )}
    </div>
  );
}
