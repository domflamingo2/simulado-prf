"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

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

    return {
      totalErrosContabilizados,
      taxaAcertoMedia: Math.max(0, Math.min(100, taxaAcertoMedia)),
      mediaErrosPorQuestao,
      disciplinaMaisDificil,
      disciplinaMaisDificilCount,
      diaComMaisErros,
      progressoRevisao,
    };
  }, [erros, totalQuestoesRespondidas, revisados]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {[
        {
          valor: stats.totalErrosContabilizados,
          label: "Total de erros",
          cor: "from-rose-500/10 to-rose-600/5 border-rose-500/20",
          textCor: "text-rose-400",
          sufixo: "",
        },
        {
          valor: stats.taxaAcertoMedia.toFixed(1),
          label: "Taxa de acerto",
          cor: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
          textCor: "text-emerald-400",
          sufixo: "%",
        },
        {
          valor: stats.mediaErrosPorQuestao.toFixed(1),
          label: "Média por questão",
          cor: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
          textCor: "text-amber-400",
          sufixo: "x",
        },
        {
          valor: stats.progressoRevisao.toFixed(0),
          label: "Progresso revisão",
          cor: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
          textCor: "text-blue-400",
          sufixo: "%",
        },
      ].map((card) => (
        <div
          key={card.label}
          className={`p-4 rounded-xl bg-gradient-to-br ${card.cor} border`}
        >
          <div className={`text-2xl font-bold ${card.textCor}`}>
            {card.valor}
            {card.sufixo}
          </div>
          <div className="text-xs text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
