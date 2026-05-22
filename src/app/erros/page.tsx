"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { useErrosData } from "@/hooks/useErrosData";
import { OrdenacaoType } from "@/types/erros";
import { AcaoPrincipal } from "./components/AcaoPrincipal";
import { CardErro } from "./components/CardErro";
import { EmptyState } from "./components/EmptyState";
import { FiltrosErros } from "./components/FiltrosErros";
import { FooterErros } from "./components/FooterErros";
import { HeaderErros } from "./components/HeaderErros";
import { PainelEstatisticas } from "./components/PainelEstatisticas";

export default function ErrosPage() {
  const router = useRouter();
  const {
    carregando,
    errosAtivos,
    totalSimulados,
    totalQuestoesRespondidas,
    revisados,
    removerErroIndividual,
    marcarComoRevisado,
    limparHistoricoCompleto,
    resetarRevisados,
  } = useErrosData();

  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<OrdenacaoType>("vezes");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Estatísticas por disciplina
  const statsPorDisciplina = useMemo(() => {
    const stats = new Map<string, number>();
    for (const e of errosAtivos) {
      stats.set(e.disciplina, (stats.get(e.disciplina) ?? 0) + 1);
    }
    return Array.from(stats.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([disc, count]) => ({
        disciplina: disc,
        count,
        nome: DISCIPLINAS_NOME[disc] ?? disc,
      }));
  }, [errosAtivos]);

  // Filtragem e ordenação
  const errosFiltrados = useMemo(() => {
    const term = busca.trim().toLowerCase();

    const filtrados = errosAtivos.filter((e) => {
      const matchBusca =
        !term ||
        e.enunciado.toLowerCase().includes(term) ||
        e.disciplinaFormatada.toLowerCase().includes(term);
      const matchDisc =
        filtroDisciplina === "todas" || e.disciplina === filtroDisciplina;
      return matchBusca && matchDisc;
    });

    return [...filtrados].sort((a, b) => {
      switch (ordenacao) {
        case "vezes":
          return b.vezesErrada - a.vezesErrada;
        case "data":
          return (
            new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime()
          );
        case "recentes":
          return (
            new Date(a.ultimaData).getTime() - new Date(b.ultimaData).getTime()
          );
        case "disciplina":
          return a.disciplina.localeCompare(b.disciplina);
        default:
          return 0;
      }
    });
  }, [errosAtivos, busca, filtroDisciplina, ordenacao]);

  const limparFiltros = useCallback(() => {
    setBusca("");
    setFiltroDisciplina("todas");
    setOrdenacao("vezes");
    toast.success("Filtros limpos");
  }, []);

  const iniciarTreinoErros = useCallback(() => {
    if (errosFiltrados.length === 0) {
      toast.error("Nenhum erro para treinar com os filtros atuais");
      return;
    }

    const selecionadas = errosFiltrados.slice(0, 30).map((e) => ({
      id: e.id,
      disciplina: e.disciplina,
      enunciado: e.enunciado,
      resposta: e.resposta,
      explicacao: e.explicacao,
      respostaUsuario: undefined,
    }));

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: "REVISÃO DE ERROS",
        questoes: selecionadas,
        mostrarExplicacao: true,
        modo: "ERROS",
        totalErrosDisponiveis: errosAtivos.length,
        meta: { tipo: "revisao_erros", prioridade: "mais_errados" },
      }),
    );

    toast.success(`Iniciando treino com ${selecionadas.length} questões!`);
    router.push("/treino/simulado");
  }, [errosFiltrados, errosAtivos.length, router]);

  const exportarErros = useCallback(() => {
    const data = {
      exportadoEm: new Date().toISOString(),
      versao: "2.0",
      totalSimulados,
      totalErrosUnicos: errosAtivos.length,
      totalErrosContabilizados: errosAtivos.reduce(
        (acc, e) => acc + e.vezesErrada,
        0,
      ),
      erros: errosAtivos.map(
        ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }) => ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }),
      ),
      revisados: [...revisados],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prf_banco_erros_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success("Banco de erros exportado com sucesso!");
  }, [errosAtivos, revisados, totalSimulados]);

  const naoRevisados = errosAtivos.filter((e) => !revisados.has(e.id)).length;

  const mostrarNaoRevisados = useCallback(() => {
    if (naoRevisados === 0) {
      toast.info("Todos os erros já foram revisados! 🎉");
      return;
    }
    setBusca("");
    setFiltroDisciplina("todas");
    toast.info(`${naoRevisados} erros não revisados`);
  }, [naoRevisados]);

  // Loading state
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border-3 border-rose-500/20 border-t-rose-500 border-r-purple-500/50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 font-medium">Analisando seus erros...</p>
          <p className="text-[10px] text-slate-500">
            Isso pode levar alguns segundos
          </p>
        </motion.div>
      </div>
    );
  }

  if (totalSimulados === 0) return <EmptyState tipo="sem-simulados" />;
  if (errosAtivos.length === 0) return <EmptyState tipo="sem-erros" />;

  // Render principal
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
          duration: 3000,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <HeaderErros
          totalErros={errosAtivos.length}
          onExportar={exportarErros}
          onLimparHistorico={limparHistoricoCompleto}
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Painel de estatísticas */}
          <PainelEstatisticas
            erros={errosAtivos}
            totalQuestoesRespondidas={totalQuestoesRespondidas}
            revisados={revisados}
          />

          {/* Ação principal */}
          <AcaoPrincipal
            totalSimulados={totalSimulados}
            totalErros={errosAtivos.length}
            ultimoErroData={
              errosAtivos[0]
                ? new Date(errosAtivos[0].ultimaData).toLocaleDateString(
                    "pt-BR",
                  )
                : "—"
            }
            revisadosCount={revisados.size}
            errosFiltradosCount={errosFiltrados.length}
            onIniciarTreino={iniciarTreinoErros}
          />

          {/* Filtros */}
          <FiltrosErros
            busca={busca}
            setBusca={setBusca}
            filtroDisciplina={filtroDisciplina}
            setFiltroDisciplina={setFiltroDisciplina}
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
            statsPorDisciplina={statsPorDisciplina}
            limparFiltros={limparFiltros}
          />

          {/* Lista de erros */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-rose-500/20">
                  <Filter className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <span className="text-xs text-slate-400">
                  {errosFiltrados.length} erro
                  {errosFiltrados.length !== 1 ? "s" : ""} encontrado
                  {errosFiltrados.length !== errosAtivos.length &&
                    ` (filtrado de ${errosAtivos.length})`}
                </span>
              </div>
              {busca && (
                <span className="text-xs text-blue-400">
                  🔍 Resultados para "{busca}"
                </span>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {errosFiltrados.length === 0 ? (
                <motion.div
                  key="empty-filtered"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16 rounded-xl bg-slate-800/30 border border-white/10"
                >
                  <Search className="w-14 h-14 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">
                    Nenhum erro encontrado com os filtros atuais
                  </p>
                  <button
                    onClick={limparFiltros}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors inline-flex items-center gap-1"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              ) : (
                errosFiltrados.map((erro, idx) => (
                  <CardErro
                    key={erro.id}
                    erro={erro}
                    index={idx}
                    onRemover={removerErroIndividual}
                    isRevisado={revisados.has(erro.id)}
                    onToggleRevisado={marcarComoRevisado}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          {errosFiltrados.length > 0 && (
            <FooterErros
              exibindo={errosFiltrados.length}
              total={errosAtivos.length}
              naoRevisados={naoRevisados}
              onMostrarNaoRevisados={mostrarNaoRevisados}
              onResetarRevisados={resetarRevisados}
            />
          )}
        </main>
      </div>
    </>
  );
}
