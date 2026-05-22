"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Target,
  TrendingDown,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { ErroComMetadados, StatsData } from "@/types/erros";

interface PainelEstatisticasProps {
  erros: ErroComMetadados[];
  totalQuestoesRespondidas: number;
  revisados: Set<string>;
}

export function PainelEstatisticas({
  erros,
  totalQuestoesRespondidas,
  revisados,
}: PainelEstatisticasProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const stats = useMemo((): StatsData => {
    const totalErrosContabilizados = erros.reduce(
      (acc, e) => acc + e.vezesErrada,
      0,
    );
    const taxaAcertoMedia =
      totalQuestoesRespondidas > 0
        ? ((totalQuestoesRespondidas - totalErrosContabilizados) /
            totalQuestoesRespondidas) *
          100
        : 0;
    const mediaErrosPorQuestao =
      erros.length > 0 ? totalErrosContabilizados / erros.length : 0;

    const disciplinaCount = new Map<string, number>();
    for (const e of erros) {
      disciplinaCount.set(
        e.disciplina,
        (disciplinaCount.get(e.disciplina) ?? 0) + 1,
      );
    }
    let disciplinaMaisDificil = "";
    let disciplinaMaisDificilCount = 0;
    disciplinaCount.forEach((count, disc) => {
      if (count > disciplinaMaisDificilCount) {
        disciplinaMaisDificilCount = count;
        disciplinaMaisDificil = DISCIPLINAS_NOME[disc] ?? disc;
      }
    });

    const diaCount = new Map<string, number>();
    for (const e of erros) {
      const dia = new Date(e.ultimaData).toLocaleDateString("pt-BR");
      diaCount.set(dia, (diaCount.get(dia) ?? 0) + 1);
    }
    let diaComMaisErros = "";
    let maxErrosDia = 0;
    diaCount.forEach((count, dia) => {
      if (count > maxErrosDia) {
        maxErrosDia = count;
        diaComMaisErros = dia;
      }
    });

    const progressoRevisao =
      erros.length > 0 ? (revisados.size / erros.length) * 100 : 0;

    // Calcular tendência de melhora (simulada)
    const melhoraPercentual = taxaAcertoMedia > 50 ? 12 : -5;

    return {
      totalErrosContabilizados,
      taxaAcertoMedia: Math.max(0, Math.min(100, taxaAcertoMedia)),
      mediaErrosPorQuestao,
      disciplinaMaisDificil,
      disciplinaMaisDificilCount,
      diaComMaisErros,
      progressoRevisao,
      melhoraPercentual,
    };
  }, [erros, totalQuestoesRespondidas, revisados]);

  const cards = [
    {
      id: "total-erros",
      valor: stats.totalErrosContabilizados,
      label: "Total de erros",
      cor: "from-rose-500/15 to-rose-600/10",
      border: "border-rose-500/30",
      textCor: "text-rose-400",
      icon: AlertCircle,
      sufixo: "",
      description: "Quantidade total de questões erradas",
      trend: stats.totalErrosContabilizados > 10 ? "down" : "up",
    },
    {
      id: "taxa-acerto",
      valor: stats.taxaAcertoMedia.toFixed(1),
      label: "Taxa de acerto",
      cor: "from-emerald-500/15 to-emerald-600/10",
      border: "border-emerald-500/30",
      textCor: "text-emerald-400",
      icon: Target,
      sufixo: "%",
      description: "Percentual de acertos geral",
      trend: stats.taxaAcertoMedia >= 60 ? "up" : "down",
    },
    {
      id: "media-erros",
      valor: stats.mediaErrosPorQuestao.toFixed(1),
      label: "Média por questão",
      cor: "from-amber-500/15 to-amber-600/10",
      border: "border-amber-500/30",
      textCor: "text-amber-400",
      icon: TrendingDown,
      sufixo: "x",
      description: "Média de erros por questão",
      trend: stats.mediaErrosPorQuestao > 1 ? "down" : "up",
    },
    {
      id: "progresso",
      valor: stats.progressoRevisao.toFixed(0),
      label: "Revisão",
      cor: "from-blue-500/15 to-blue-600/10",
      border: "border-blue-500/30",
      textCor: "text-blue-400",
      icon: Brain,
      sufixo: "%",
      description: "Progresso de revisão",
      trend: stats.progressoRevisao >= 50 ? "up" : "stable",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-6">
      {/* Grid de cards principais */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.cor} border ${card.border} p-4 transition-all duration-300 hover:shadow-lg`}
          >
            {/* Ícone decorativo de fundo */}
            <div className="absolute bottom-2 right-2 opacity-10">
              <card.icon className="w-12 h-12" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg bg-white/5`}>
                  <card.icon className={`w-3.5 h-3.5 ${card.textCor}`} />
                </div>
                {card.trend && (
                  <div
                    className={`text-[10px] font-medium ${
                      card.trend === "up"
                        ? "text-emerald-400"
                        : card.trend === "down"
                          ? "text-rose-400"
                          : "text-slate-400"
                    }`}
                  >
                    {card.trend === "up"
                      ? "↑"
                      : card.trend === "down"
                        ? "↓"
                        : "→"}
                  </div>
                )}
              </div>
              <div
                className={`text-2xl font-bold ${card.textCor} tabular-nums`}
              >
                {card.valor}
                {card.sufixo}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                {card.label}
                {hoveredCard === card.id && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9px] text-slate-500"
                  >
                    • {card.description}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Barra de progresso sutil */}
            <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    card.id === "taxa-acerto"
                      ? stats.taxaAcertoMedia
                      : card.id === "progresso"
                        ? stats.progressoRevisao
                        : card.id === "total-erros"
                          ? Math.min(
                              100,
                              (stats.totalErrosContabilizados / 50) * 100,
                            )
                          : (stats.mediaErrosPorQuestao / 3) * 100
                  }%`,
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full rounded-full bg-gradient-to-r ${card.cor.split(" ")[1]}`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Cards de insights adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {/* Disciplina mais difícil */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Disciplina mais difícil</p>
              <p className="text-base font-bold text-white mt-0.5">
                {stats.disciplinaMaisDificil || "—"}
              </p>
              {stats.disciplinaMaisDificilCount > 0 && (
                <p className="text-[10px] text-purple-400 mt-1">
                  {stats.disciplinaMaisDificilCount} erro
                  {stats.disciplinaMaisDificilCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <AlertCircle className="w-4 h-4 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Dia com mais erros */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 group hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Dia com mais erros</p>
              <p className="text-base font-bold text-white mt-0.5">
                {stats.diaComMaisErros || "—"}
              </p>
              <p className="text-[10px] text-cyan-400 mt-1">
                Foco redobrado neste dia
              </p>
            </div>
            <Calendar className="w-4 h-4 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.div>

      {/* Barra de resumo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 rounded-xl bg-slate-800/30 border border-white/5 text-center"
      >
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{totalQuestoesRespondidas} questões respondidas</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>{erros.length} questões com erro</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-blue-400" />
            <span>{revisados.size} revisadas</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
