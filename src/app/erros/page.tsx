"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
      versao: "1.0",
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

  // Estados de carregamento e vazio
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-xl border-2 border-rose-500 border-t-transparent"
          />
          <p className="text-slate-400">Analisando seus erros...</p>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-12">
        <HeaderErros
          totalErros={errosAtivos.length}
          onExportar={exportarErros}
          onLimparHistorico={limparHistoricoCompleto}
        />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <PainelEstatisticas
            erros={errosAtivos}
            totalQuestoesRespondidas={totalQuestoesRespondidas}
            revisados={revisados}
          />

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {errosFiltrados.length === 0 ? (
                <motion.div
                  key="empty-filtered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-slate-500"
                >
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum erro encontrado com os filtros atuais.</p>
                  <button
                    onClick={limparFiltros}
                    className="mt-2 text-blue-400 hover:underline text-sm"
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
