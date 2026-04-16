// types/simulado.ts

export type NavegacaoDirecao = "anterior" | "proxima" | "finalizar";

export type SimuladoAction =
  | { type: "RESPONDER"; resposta: "CERTO" | "ERRADO" }
  | { type: "PROXIMA" }
  | { type: "ANTERIOR" }
  | { type: "IR_PARA"; index: number }
  | { type: "MARCAR_REVISAO"; numero: number }
  | { type: "FINALIZAR" };

export interface SimuladoState {
  questaoAtual: number;
  respostas: Record<number, "CERTO" | "ERRADO">;
  marcadasParaRevisao: number[];
  finalizado: boolean;
}
