"use client";

import { questoes } from "@/data/questoes";
import { Disciplina } from "@/data/types";
import { embaralhar } from "@/lib/simulado-logic";
import { ArrowRight, BookOpen, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const disciplinas: { value: Disciplina; label: string }[] = [
  { value: "PORTUGUES", label: "Língua Portuguesa" },
  { value: "ETICA", label: "Ética e Conduta Pública" },
  { value: "RACIOCINIO_LOGICO", label: "Raciocínio Lógico" },
  { value: "DIREITO_CONSTITUCIONAL", label: "Direito Constitucional" },
  { value: "DIREITO_ADMINISTRATIVO", label: "Direito Administrativo" },
  { value: "ADMINISTRACAO", label: "Administração" },
  { value: "ARQUIVOLOGIA", label: "Arquivologia" },
  { value: "INFORMATICA", label: "Informática" },
  { value: "LEGISLACAO_PRF", label: "Legislação PRF" },
];

export default function TreinoPage() {
  const router = useRouter();
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    Disciplina | ""
  >("");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  const iniciarTreino = () => {
    if (!disciplinaSelecionada) {
      alert("Selecione uma disciplina");
      return;
    }

    // Filtra e embaralha questões da disciplina
    const questoesDisciplina = questoes.filter(
      (q) => q.disciplina === disciplinaSelecionada,
    );
    const selecionadas = embaralhar(questoesDisciplina).slice(0, quantidade);

    // Salva no localStorage temporário
    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: disciplinaSelecionada,
        questoes: selecionadas.map((q) => ({
          ...q,
          respostaUsuario: undefined,
        })),
        mostrarExplicacao,
        modo: "TREINO",
      }),
    );

    router.push("/treino/simulado");
  };

  const maxQuestoes = disciplinaSelecionada
    ? questoes.filter((q) => q.disciplina === disciplinaSelecionada).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-green-100 rounded-xl">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Treino por Disciplina
            </h1>
            <p className="text-gray-600">Foque nos seus pontos fracos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Seleção de Disciplina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Disciplina
            </label>
            <select
              value={disciplinaSelecionada}
              onChange={(e) =>
                setDisciplinaSelecionada(e.target.value as Disciplina)
              }
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione uma disciplina...</option>
              {disciplinas.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de questões
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max={Math.min(maxQuestoes || 20, 30)}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-12 text-center font-bold text-blue-600 text-xl">
                {quantidade}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {maxQuestoes > 0
                ? `${maxQuestoes} questões disponíveis`
                : "Selecione uma disciplina"}
            </p>
          </div>

          {/* Opção Mostrar Explicação */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <input
              type="checkbox"
              id="mostrarExplicacao"
              checked={mostrarExplicacao}
              onChange={(e) => setMostrarExplicacao(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="mostrarExplicacao"
              className="text-blue-900 font-medium cursor-pointer"
            >
              Mostrar explicação imediatamente após responder
              <p className="text-sm text-blue-600 font-normal">
                Ideal para modo estudo (não simula prova real)
              </p>
            </label>
          </div>

          {/* Botão Iniciar */}
          <button
            onClick={iniciarTreino}
            disabled={!disciplinaSelecionada}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Iniciar Treino <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dica */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Dica:</strong> Use o modo "Mostrar explicação" para aprender
            com os erros imediatamente. Desative para simular a pressão da prova
            real.
          </p>
        </div>
      </div>
    </div>
  );
}
