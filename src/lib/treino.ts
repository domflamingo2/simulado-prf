import { questoes } from "@/data";
import { Disciplina } from "@/data/types";
import { embaralhar } from "./simulado-logic";

export interface TreinoConfig {
  disciplina: Disciplina;
  quantidade: number;
  mostrarExplicacao: boolean;
}

export function iniciarTreino(config: TreinoConfig) {
  const { disciplina, quantidade, mostrarExplicacao } = config;

  const questoesDisciplina = questoes.filter(
    (q) => q.disciplina === disciplina,
  );
  const selecionadas = embaralhar(questoesDisciplina).slice(0, quantidade);

  localStorage.setItem(
    "prf_treino_atual",
    JSON.stringify({
      disciplina,
      questoes: selecionadas.map((q) => ({
        ...q,
        respostaUsuario: undefined,
      })),
      mostrarExplicacao,
      modo: "TREINO",
    }),
  );
}
