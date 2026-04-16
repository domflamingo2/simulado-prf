"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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

  const questoesFiltradas = useQuestoesFiltradas(
    simuladoSelecionado?.questoes || [],
    filtros,
    marcadas,
  );

  const navegarAnterior = useCallback(() => {
    setQuestaoAtual((prev) => Math.max(0, prev - 1));
  }, []);

  const navegarProxima = useCallback(() => {
    setQuestaoAtual((prev) => Math.min(questoesFiltradas.length - 1, prev + 1));
  }, [questoesFiltradas.length]);

  const handleToggleMarcacao = useCallback(() => {
    if (!simuladoSelecionado) return;
    const questao = questoesFiltradas[questaoAtual];
    const questaoRealIndex = simuladoSelecionado.questoes.indexOf(questao);
    if (questaoRealIndex !== -1) {
      toggleMarcacao(questaoRealIndex);
    }
  }, [questaoAtual, questoesFiltradas, simuladoSelecionado, toggleMarcacao]);

  const compartilharQuestao = useCallback(async () => {
    const questao = questoesFiltradas[questaoAtual];
    const texto = `Questão ${questaoAtual + 1} - ${DISCIPLINAS_NOME[questao.disciplina]}\n\n${questao.enunciado.slice(0, 100)}...\n\nResposta: ${questao.resposta}`;

    try {
      await navigator.clipboard.writeText(texto);
      alert("Questão copiada para a área de transferência!");
    } catch {
      // Fallback silencioso
    }
  }, [questaoAtual, questoesFiltradas]);

  const refazerSimulado = useCallback(() => {
    if (!simuladoSelecionado) return;
    const modo = simuladoSelecionado.modo.toLowerCase();
    router.push(`/simulado?modo=${modo}`);
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
    },
    [router, setSimuladoSelecionado],
  );

  // Loading
  if (!simuladoSelecionado || !estatisticas) {
    return <LoadingState />;
  }

  const questao = questoesFiltradas[questaoAtual];
  const questaoRealIndex = simuladoSelecionado.questoes.indexOf(questao);
  const isMarcada = marcadas.includes(questaoRealIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
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

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
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

            <AcoesRevisao onRefazer={refazerSimulado} />
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-4">
            {questoesFiltradas.length === 0 ? (
              <EmptyState tipo={filtros.tipo} />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={questaoAtual}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
