"use client";

import { motion } from "framer-motion";
import { Brain, Home, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import FeedbackCompartilhar from "@/components/FeedbackCompartilhar";
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
  const {
    resultadoRef,
    gerandoImagem,
    progresso,
    erro,
    cancelarGeracao,
    compartilharResultado,
    salvarImagem,
    compartilharViaWebShare,
  } = useCompartilharResultado();

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
  const isExcelente = classificacao?.nivel === "excelente";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ConfettiEffect isActive={isExcelente} intensity="medium" />

      <div
        ref={resultadoRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderResultado
            data={simulado.data}
            modo={simulado.modo || "COMPLETO"}
            pontuacao={estatisticas.pontuacao}
            classificacao={classificacao?.mensagem}
          />
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ScoreCard
            pontuacao={estatisticas.pontuacao}
            classificacao={classificacao!}
            comparacao={comparacao || undefined}
          />
        </motion.div>

        {/* Stats Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <StatsResumo
            acertos={estatisticas.acertos}
            erros={estatisticas.erros}
            brancos={estatisticas.brancos}
            tempoTotal={estatisticas.tempoTotal}
            totalQuestoes={estatisticas.totalQuestoes}
          />
        </motion.div>

        {/* Insights Personalizados */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Insights Personalizados
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Análise inteligente do seu desempenho
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500">
                <Sparkles className="w-3 h-3" />
                Baseado em IA
              </div>
            </div>

            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  <InsightCard
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
                          disciplinasSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Desempenho por Disciplina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          id="disciplinas-section"
        >
          <DisciplinasDesempenho
            desempenhoPorDisciplina={estatisticas.desempenhoPorDisciplina}
          />
        </motion.div>

        {/* Ações do Resultado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <AcoesResultado
            gerandoImagem={gerandoImagem}
            onRefazer={refazerSimulado}
            onCompartilhar={compartilharResultado}
            onSalvarImagem={salvarImagem}
            simuladoId={simulado.id}
          />
        </motion.div>

        {/* Cards de estatísticas rápidas adicionais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Desempenho</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              {estatisticas.acertos > estatisticas.erros
                ? "Você acertou mais do que errou! 🎉"
                : estatisticas.acertos === estatisticas.erros
                  ? "Empate entre acertos e erros. Continue praticando! 💪"
                  : "Continue praticando para reverter os erros! 📚"}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Próximo objetivo</span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              {estatisticas.percentual < 60
                ? "Foco nas disciplinas com menor desempenho!"
                : estatisticas.percentual < 80
                  ? "Continue assim! Você está no caminho certo!"
                  : "Excelente! Mantenha o ritmo de estudos!"}
            </p>
          </div>
        </motion.div>

        {/* Dica adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
        >
          <p className="text-sm text-slate-300">
            💡 <span className="font-medium text-blue-400">Dica:</span> Quer
            acompanhar sua evolução? Acesse a página de{" "}
            <Link
              href="/estatisticas"
              className="text-blue-400 hover:underline font-medium"
            >
              Estatísticas
            </Link>{" "}
            para ver gráficos detalhados do seu desempenho.
          </p>
        </motion.div>

        {/* Footer com navegação */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10"
        >
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-slate-300 transition-all duration-300 inline-flex items-center gap-2 text-sm group"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Voltar ao Dashboard
          </Link>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-all duration-300 inline-flex items-center gap-2 text-sm group"
          >
            <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Página Inicial
          </Link>
        </motion.div>
        <FeedbackCompartilhar
          gerandoImagem={gerandoImagem}
          progresso={progresso}
          erro={erro}
          onCompartilhar={compartilharResultado}
          onSalvar={salvarImagem}
          onCompartilharWeb={compartilharViaWebShare}
          onCancelar={cancelarGeracao}
        />
      </div>
      <Footer />
    </div>
  );
}
