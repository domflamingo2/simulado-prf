"use client";

import AlertaDesempenho from "@/components/ui/AlertaDesempenho";

interface AlertasDesempenhoProps {
  classificacaoNivel?:
    | "excelente"
    | "bom"
    | "regular"
    | "insuficiente"
    | "critico"
    | "alerta";
  disciplinaFraca?: {
    nome: string;
    aproveitamento: number;
  };
  streakDias: number;
}

export function AlertasDesempenho({
  classificacaoNivel,
  disciplinaFraca,
  streakDias,
}: AlertasDesempenhoProps) {
  return (
    <div className="space-y-3" role="region" aria-label="Alertas de desempenho">
      {(classificacaoNivel === "critico" ||
        classificacaoNivel === "insuficiente") && (
        <AlertaDesempenho
          tipo="critico"
          mensagem="Seu último simulado ficou significativamente abaixo da média."
          acao={{ label: "Revisar Erros", href: "/erros" }}
        />
      )}
      {classificacaoNivel === "alerta" && (
        <AlertaDesempenho
          tipo="alerta"
          mensagem="Seu desempenho precisa de atenção. Continue praticando!"
          acao={{ label: "Ver estatísticas", href: "/estatisticas" }}
        />
      )}
      {disciplinaFraca && disciplinaFraca.aproveitamento < 50 && (
        <AlertaDesempenho
          tipo="alerta"
          mensagem={`${disciplinaFraca.nome} está com aproveitamento baixo (${disciplinaFraca.aproveitamento.toFixed(0)}%).`}
          acao={{ label: "Treinar agora", href: "/treino" }}
        />
      )}
      {streakDias >= 3 && (
        <AlertaDesempenho
          tipo="info"
          mensagem={`Sequência de ${streakDias} dias! Continue assim.`}
        />
      )}
    </div>
  );
}
