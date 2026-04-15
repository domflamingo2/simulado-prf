"use client";

import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import Footer from "@/components/layout/Footer";
import { useCompartilharResultado } from "@/hooks/useCompartilharResultado";
import { useInsights } from "@/hooks/useInsights";
import { useResultadoData } from "@/hooks/useResultadoData";
import { AcoesResultado } from "./components/AcoesResultado";
import { ConfettiEffect } from "./components/ConfettiEffect";
import { DisciplinasDesempenho } from "./components/DisciplinasDesempenho";
import { ErrorState } from "./components/ErrorState";
import { HeaderResultado } from "./components/HeaderResultado";
import { InsightCard } from "./components/InsightCard";
import { LoadingState } from "./components/LoadingState";
import { ScoreCard } from "./components/ScoreCard";
import { StatsResumo } from "./components/StatsResumo";

export default function ResultadoPage() {
  const router = useRouter();
  const { simulado, historico, comparacao, classificacao, erroCarregamento } =
    useResultadoData();
  const insights = useInsights(simulado, historico);
  const { resultadoRef, gerandoImagem, compartilharResultado, salvarImagem } =
    useCompartilharResultado();

  const refazerSimulado = useCallback(() => {
    if (!simulado) return;

    const modo = simulado.modo?.toLowerCase() || "completo";
    const queryParams = new URLSearchParams();
    queryParams.set("modo", modo);

    router.push(`/simulado?${queryParams.toString()}`);
  }, [simulado, router]);

  // Estados de carregamento e erro
  if (erroCarregamento) {
    return <ErrorState mensagem={erroCarregamento} />;
  }

  if (!simulado) {
    return <LoadingState />;
  }

  const { estatisticas } = simulado;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-12">
      <ConfettiEffect isActive={classificacao?.nivel === "excelente"} />

      <div
        ref={resultadoRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        <HeaderResultado
          data={simulado.data}
          modo={simulado.modo || "COMPLETO"}
        />

        <ScoreCard
          pontuacao={estatisticas.pontuacao}
          classificacao={classificacao!}
          comparacao={comparacao || undefined}
        />

        <StatsResumo
          acertos={estatisticas.acertos}
          erros={estatisticas.erros}
          brancos={estatisticas.brancos}
          tempoTotal={estatisticas.tempoTotal}
          totalQuestoes={estatisticas.totalQuestoes}
        />

        {/* Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Insights Personalizados
            </h2>
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                {...insight}
                onAcao={() => {
                  if (insight.acao?.includes("Treinar")) {
                    router.push("/treino");
                  } else if (
                    insight.acao?.includes("análise") ||
                    insight.acao?.includes("estatísticas")
                  ) {
                    router.push("/estatisticas");
                  } else if (insight.acao?.includes("pontos fracos")) {
                    const disciplinasSection = document.getElementById(
                      "disciplinas-section",
                    );
                    if (disciplinasSection) {
                      disciplinasSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              />
            ))}
          </motion.div>
        )}

        <DisciplinasDesempenho
          desempenhoPorDisciplina={estatisticas.desempenhoPorDisciplina}
        />

        <AcoesResultado
          gerandoImagem={gerandoImagem}
          onRefazer={refazerSimulado}
          onCompartilhar={compartilharResultado}
          onSalvarImagem={salvarImagem}
        />

        {/* Dica adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-500">
            💡 Dica: Quer acompanhar sua evolução? Acesse a página de{" "}
            <Link
              href="/estatisticas"
              className="text-blue-400 hover:underline"
            >
              Estatísticas
            </Link>{" "}
            para ver gráficos detalhados do seu desempenho.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
