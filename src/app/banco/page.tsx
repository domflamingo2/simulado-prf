"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import {
  buscarQuestoes,
  getEstatisticasBanco,
  getQuestoesPorDificuldade,
  getQuestoesPorDisciplina,
  questoes,
} from "@/data";
import { AcoesBanco } from "./components/AcoesBanco";
import { EmptyStateBanco } from "./components/EmptyStateBanco";
import { EstatisticasBanco } from "./components/EstatisticasBanco";
import { FiltrosBanco } from "./components/FiltrosBanco";
import { HeaderBanco } from "./components/HeaderBanco";
import { LoadingBanco } from "./components/LoadingBanco";
import { QuestaoCardBanco } from "./components/QuestaoCardBanco";

export default function BancoQuestoesPage() {
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [disciplinaFiltro, setDisciplinaFiltro] = useState("todas");
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState("todas");
  const [favoritas, setFavoritas] = useState<Set<string>>(new Set());

  // Carrega favoritos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prf_questoes_favoritas");
      if (saved) {
        setFavoritas(new Set(JSON.parse(saved)));
      }
    } catch (err) {
      console.error("Erro ao carregar favoritas:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Salva favoritos no localStorage
  const toggleFavorita = useCallback((id: string) => {
    setFavoritas((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
        toast.info("Questão removida dos favoritos");
      } else {
        novo.add(id);
        toast.success("Questão adicionada aos favoritos! ⭐");
      }
      localStorage.setItem("prf_questoes_favoritas", JSON.stringify([...novo]));
      return novo;
    });
  }, []);

  // Estatísticas do banco
  const estatisticasBanco = useMemo(() => getEstatisticasBanco(), []);

  // Estatísticas por disciplina
  const statsPorDisciplina = useMemo(() => {
    const disciplinas = Object.keys(DISCIPLINAS_NOME);
    return disciplinas
      .map((disc) => ({
        disciplina: disc,
        nome: DISCIPLINAS_NOME[disc],
        count: questoes.filter((q) => q.disciplina === disc).length,
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, []);

  // Filtragem das questões
  const questoesFiltradas = useMemo(() => {
    let resultado = [...questoes];

    // Filtro por disciplina
    if (disciplinaFiltro !== "todas") {
      resultado = getQuestoesPorDisciplina(disciplinaFiltro as any);
    }

    // Filtro por dificuldade
    if (dificuldadeFiltro !== "todas") {
      const dificuldadeNum = parseInt(dificuldadeFiltro) as 1 | 2 | 3;
      resultado = getQuestoesPorDificuldade(dificuldadeNum);
      // Se já havia filtro por disciplina, precisamos combinar
      if (disciplinaFiltro !== "todas") {
        resultado = resultado.filter((q) => q.disciplina === disciplinaFiltro);
      }
    }

    // Busca textual
    if (busca.trim()) {
      resultado = buscarQuestoes(busca);
      // Aplicar filtros adicionais após busca
      if (disciplinaFiltro !== "todas") {
        resultado = resultado.filter((q) => q.disciplina === disciplinaFiltro);
      }
      if (dificuldadeFiltro !== "todas") {
        resultado = resultado.filter(
          (q) => q.dificuldade === parseInt(dificuldadeFiltro),
        );
      }
    }

    return resultado;
  }, [busca, disciplinaFiltro, dificuldadeFiltro]);

  const limparFiltros = useCallback(() => {
    setBusca("");
    setDisciplinaFiltro("todas");
    setDificuldadeFiltro("todas");
    toast.info("Filtros limpos");
  }, []);

  const exportarQuestoes = useCallback(() => {
    const data = {
      exportadoEm: new Date().toISOString(),
      totalQuestoes: questoesFiltradas.length,
      questoes: questoesFiltradas.map((q) => ({
        id: q.id,
        disciplina: q.disciplina,
        enunciado: q.enunciado,
        resposta: q.resposta,
        explicacao: q.explicacao,
        dificuldade: q.dificuldade,
        ano: q.ano,
        banca: q.banca_referencia,
        assunto: q.assunto,
        tags: q.tags,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prf_banco_questoes_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success(`${questoesFiltradas.length} questões exportadas!`);
  }, [questoesFiltradas]);

  const iniciarTreino = useCallback(() => {
    if (questoesFiltradas.length === 0) {
      toast.error("Nenhuma questão selecionada para treino");
      return;
    }

    const selecionadas = questoesFiltradas.slice(0, 30).map((q) => ({
      ...q,
      respostaUsuario: undefined,
    }));

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: "BANCO_DE_QUESTOES",
        questoes: selecionadas,
        mostrarExplicacao: true,
        modo: "TREINO",
        totalDisponiveis: questoesFiltradas.length,
      }),
    );

    toast.success(`Iniciando treino com ${selecionadas.length} questões!`);
    window.location.href = "/treino/simulado";
  }, [questoesFiltradas]);

  if (carregando) {
    return <LoadingBanco />;
  }

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
        <HeaderBanco total={estatisticasBanco.total} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Estatísticas do banco */}
          <EstatisticasBanco stats={estatisticasBanco} />

          {/* Filtros */}
          <FiltrosBanco
            busca={busca}
            setBusca={setBusca}
            disciplinaFiltro={disciplinaFiltro}
            setDisciplinaFiltro={setDisciplinaFiltro}
            dificuldadeFiltro={dificuldadeFiltro}
            setDificuldadeFiltro={setDificuldadeFiltro}
            statsPorDisciplina={statsPorDisciplina}
            onLimparFiltros={limparFiltros}
          />

          {/* Ações */}
          <AcoesBanco
            totalQuestoes={questoesFiltradas.length}
            questoesSelecionadas={estatisticasBanco.total}
            onExportar={exportarQuestoes}
            onTreinar={iniciarTreino}
            onResetarFiltros={limparFiltros}
          />

          {/* Lista de questões */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {questoesFiltradas.length === 0 ? (
                <EmptyStateBanco onLimparFiltros={limparFiltros} />
              ) : (
                questoesFiltradas.map((questao, idx) => (
                  <QuestaoCardBanco
                    key={questao.id}
                    questao={questao}
                    index={idx}
                    onFavoritar={toggleFavorita}
                    isFavorita={favoritas.has(questao.id)}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer com contagem */}
          {questoesFiltradas.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-slate-500 pt-4"
            >
              Mostrando {questoesFiltradas.length} de {estatisticasBanco.total}{" "}
              questões
              {favoritas.size > 0 && (
                <span className="ml-2 text-amber-400">
                  • {favoritas.size} favoritas
                </span>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
