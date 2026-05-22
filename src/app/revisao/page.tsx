"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import QuestaoCard from "@/components/QuestaoCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { useQuestoesFiltradas } from "@/hooks/useQuestoesFiltradas";
import { useRevisaoData } from "@/hooks/useRevisaoData";
import { AcoesRevisao } from "./components/AcoesRevisao";
import { ControlesQuestao } from "./components/ControlesQuestao";
import { EmptyState } from "./components/EmptyState";
import { FiltrosSidebar } from "./components/FiltrosSidebar";
import { HeaderRevisao } from "./components/HeaderRevisao";
import { LoadingState } from "./components/LoadingState";
import { NavegacaoQuestoes } from "./components/NavegacaoQuestoes";
import { SeletorSimulado } from "./components/SeletorSimulado";

export default function RevisaoPage() {
  const router = useRouter();
  const {
    simulados,
    simuladoSelecionado,
    setSimuladoSelecionado,
    marcadas,
    toggleMarcacao,
    filtros,
    setFiltros,
    estatisticas,
  } = useRevisaoData();

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [showFiltros, setShowFiltros] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const questoesFiltradas = useQuestoesFiltradas(
    simuladoSelecionado?.questoes || [],
    filtros,
    marcadas,
  );

  // Resetar questão atual quando os filtros mudam
  useEffect(() => {
    setQuestaoAtual(0);
  }, [filtros, questoesFiltradas.length]);

  const navegarAnterior = useCallback(() => {
    setQuestaoAtual((prev) => Math.max(0, prev - 1));
  }, []);

  const navegarProxima = useCallback(() => {
    setQuestaoAtual((prev) => Math.min(questoesFiltradas.length - 1, prev + 1));
  }, [questoesFiltradas.length]);

  const handleToggleMarcacao = useCallback(() => {
    if (!simuladoSelecionado) return;
    const questao = questoesFiltradas[questaoAtual];
    const questaoRealIndex = simuladoSelecionado.questoes.findIndex(
      (q) => q === questao,
    );
    if (questaoRealIndex !== -1) {
      toggleMarcacao(questaoRealIndex);
      toast.success(
        marcadas.includes(questaoRealIndex)
          ? "Questão desmarcada da revisão"
          : "Questão marcada para revisão",
      );
    }
  }, [
    questaoAtual,
    questoesFiltradas,
    simuladoSelecionado,
    toggleMarcacao,
    marcadas,
  ]);

  const compartilharQuestao = useCallback(async () => {
    const questao = questoesFiltradas[questaoAtual];
    const texto = `📚 Questão ${questaoAtual + 1} - ${DISCIPLINAS_NOME[questao.disciplina]}\n\n${questao.enunciado.slice(0, 150)}...\n\n✅ Resposta: ${questao.resposta}\n\n🔍 ${questao.explicacao?.slice(0, 100)}...`;

    try {
      await navigator.clipboard.writeText(texto);
      toast.success("Questão copiada para a área de transferência! 📋");
    } catch {
      toast.error("Erro ao copiar questão. Tente novamente.");
    }
  }, [questaoAtual, questoesFiltradas]);

  const refazerSimulado = useCallback(() => {
    if (!simuladoSelecionado) return;
    const modo = simuladoSelecionado.modo.toLowerCase();
    router.push(`/simulado?modo=${modo}`);
    toast.info("Iniciando novo simulado...");
  }, [simuladoSelecionado, router]);

  const handleQuestaoClick = useCallback(
    (questao: any, index: number) => {
      const filtradaIndex = questoesFiltradas.findIndex((q) => q === questao);
      if (filtradaIndex !== -1) {
        setQuestaoAtual(filtradaIndex);
      }
    },
    [questoesFiltradas],
  );

  const handleMudarSimulado = useCallback(
    (simulado: any) => {
      setSimuladoSelecionado(simulado);
      setQuestaoAtual(0);
      router.push(`/revisao?id=${simulado.id}`);
      toast.success("Simulado alterado com sucesso!");
    },
    [router, setSimuladoSelecionado],
  );

  // Loading states
  if (isLoading) return <LoadingState />;
  if (!simuladoSelecionado || !estatisticas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
          <p className="text-slate-400">Nenhum simulado disponível</p>
          <button
            onClick={() => router.push("/simulado")}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            Criar primeiro simulado
          </button>
        </div>
      </div>
    );
  }

  const questao = questoesFiltradas[questaoAtual];
  const questaoRealIndex = simuladoSelecionado.questoes.findIndex(
    (q) => q === questao,
  );
  const isMarcada = marcadas.includes(questaoRealIndex);
  const progresso = ((questaoAtual + 1) / questoesFiltradas.length) * 100;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
        <HeaderRevisao
          data={estatisticas.data}
          classificacaoMensagem={estatisticas.classificacao.mensagem}
          estatisticas={{
            acertos: estatisticas.acertos,
            erros: estatisticas.erros,
            pontuacao: estatisticas.pontuacao,
          }}
          progresso={{
            atual: questaoAtual + 1,
            total: questoesFiltradas.length,
          }}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Desktop */}
            <div className="lg:col-span-1 space-y-4">
              <SeletorSimulado
                simulados={simulados}
                simuladoSelecionado={simuladoSelecionado}
                onChange={handleMudarSimulado}
              />

              <FiltrosSidebar
                filtros={filtros}
                setFiltros={setFiltros}
                showFiltros={showFiltros}
                setShowFiltros={setShowFiltros}
                estatisticas={{
                  totalQuestoes: estatisticas.totalQuestoes,
                  erros: estatisticas.erros,
                  acertos: estatisticas.acertos,
                  brancos: estatisticas.brancos,
                }}
                marcadasCount={marcadas.length}
              />

              <NavegacaoQuestoes
                questoes={simuladoSelecionado.questoes}
                questaoRealIndex={questaoRealIndex}
                marcadas={marcadas}
                onQuestaoClick={handleQuestaoClick}
              />

              <AcoesRevisao
                onRefazer={refazerSimulado}
                totalQuestoes={questoesFiltradas.length}
              />
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-3 space-y-5">
              {/* Barra de progresso */}
              <div className="hidden lg:block">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progresso da revisão</span>
                  <span className="font-mono text-blue-400">
                    {Math.round(progresso)}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progresso}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>

              {/* Card da questão */}
              {questoesFiltradas.length === 0 ? (
                <EmptyState
                  tipo={filtros.tipo}
                  onResetFiltro={() => {
                    setFiltros((f) => ({
                      ...f,
                      tipo: "todas",
                      disciplina: "todas",
                      busca: "",
                    }));
                  }}
                />
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={questaoAtual}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <QuestaoCard
                        questao={questao}
                        numero={questaoRealIndex + 1}
                        total={simuladoSelecionado.questoes.length}
                        onResposta={() => {}}
                        mostrarCorrecao={true}
                        marcadasParaRevisao={marcadas}
                        onMarcarRevisao={handleToggleMarcacao}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <ControlesQuestao
                    questaoAtual={questaoAtual}
                    totalQuestoes={questoesFiltradas.length}
                    isMarcada={isMarcada}
                    onAnterior={navegarAnterior}
                    onProxima={navegarProxima}
                    onToggleMarcacao={handleToggleMarcacao}
                    onCompartilhar={compartilharQuestao}
                  />

                  {/* Indicador de posição */}
                  <div className="text-center">
                    <p className="text-xs text-slate-500">
                      Questão {questaoAtual + 1} de {questoesFiltradas.length}
                      {filtros.tipo !== "todas" &&
                        ` (filtrado por ${filtros.tipo})`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
