// src/lib/compartilhar-metricas.ts

import type {
  MetricaCompartilhamento,
  TipoCompartilhamento,
} from "@/types/compartilhar.types";

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════

const LIMITE_METRICAS_PADRAO = 100;

// ═══════════════════════════════════════════════════════════
// STORE INTERNA
// ═══════════════════════════════════════════════════════════

class CompartilharMetricasStore {
  private metricas: MetricaCompartilhamento[] = [];

  private limite: number;

  constructor(limite = LIMITE_METRICAS_PADRAO) {
    this.limite = limite;
  }

  // ─────────────────────────────────────────────────────────
  // REGISTRO
  // ─────────────────────────────────────────────────────────

  registrar(metrica: MetricaCompartilhamento): void {
    this.metricas.push(metrica);

    if (this.metricas.length > this.limite) {
      this.metricas.splice(0, this.metricas.length - this.limite);
    }
  }

  registrarSucesso(
    tipo: TipoCompartilhamento,
    tempoExecucaoMs: number,
    tamanhoBytes?: number,
  ): void {
    this.registrar({
      timestamp: new Date(),
      tipo,
      sucesso: true,
      tempoExecucaoMs,
      tamanhoBytes,
    });
  }

  registrarErro(
    tipo: TipoCompartilhamento,
    tempoExecucaoMs: number,
    erro: string,
  ): void {
    this.registrar({
      timestamp: new Date(),
      tipo,
      sucesso: false,
      tempoExecucaoMs,
      erro,
    });
  }

  // ─────────────────────────────────────────────────────────
  // CONSULTAS
  // ─────────────────────────────────────────────────────────

  obter(): readonly MetricaCompartilhamento[] {
    return Object.freeze([...this.metricas]);
  }

  quantidade(): number {
    return this.metricas.length;
  }

  possuiDados(): boolean {
    return this.metricas.length > 0;
  }

  // ─────────────────────────────────────────────────────────
  // TAXA DE SUCESSO
  // ─────────────────────────────────────────────────────────

  taxaSucesso(): number {
    if (this.metricas.length === 0) {
      return 100;
    }

    const sucessos = this.metricas.filter((m) => m.sucesso).length;

    return Number(((sucessos / this.metricas.length) * 100).toFixed(2));
  }

  // ─────────────────────────────────────────────────────────
  // MÉDIA DE TEMPO
  // ─────────────────────────────────────────────────────────

  tempoMedioExecucao(): number {
    if (this.metricas.length === 0) {
      return 0;
    }

    const total = this.metricas.reduce(
      (acc, atual) => acc + atual.tempoExecucaoMs,
      0,
    );

    return Math.round(total / this.metricas.length);
  }

  // ─────────────────────────────────────────────────────────
  // TAMANHO MÉDIO
  // ─────────────────────────────────────────────────────────

  tamanhoMedioArquivo(): number {
    const metricasComTamanho = this.metricas.filter(
      (m) => typeof m.tamanhoBytes === "number",
    );

    if (metricasComTamanho.length === 0) {
      return 0;
    }

    const total = metricasComTamanho.reduce(
      (acc, atual) => acc + (atual.tamanhoBytes ?? 0),
      0,
    );

    return Math.round(total / metricasComTamanho.length);
  }

  // ─────────────────────────────────────────────────────────
  // FILTROS
  // ─────────────────────────────────────────────────────────

  porTipo(tipo: TipoCompartilhamento): readonly MetricaCompartilhamento[] {
    return Object.freeze(this.metricas.filter((m) => m.tipo === tipo));
  }

  ultimas(quantidade = 10): readonly MetricaCompartilhamento[] {
    return Object.freeze([...this.metricas].slice(-quantidade));
  }

  // ─────────────────────────────────────────────────────────
  // LIMPEZA
  // ─────────────────────────────────────────────────────────

  limpar(): void {
    this.metricas.length = 0;
  }

  definirLimite(limite: number): void {
    if (limite < 1) {
      throw new Error("O limite deve ser maior que zero.");
    }

    this.limite = limite;

    if (this.metricas.length > limite) {
      this.metricas.splice(0, this.metricas.length - limite);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════

export const compartilharMetricas = new CompartilharMetricasStore();

// ═══════════════════════════════════════════════════════════
// EXPORTS DE CONVENIÊNCIA
// ═══════════════════════════════════════════════════════════

export const registrarMetrica =
  compartilharMetricas.registrar.bind(compartilharMetricas);

export const registrarSucesso =
  compartilharMetricas.registrarSucesso.bind(compartilharMetricas);

export const registrarErro =
  compartilharMetricas.registrarErro.bind(compartilharMetricas);

export const obterMetricas =
  compartilharMetricas.obter.bind(compartilharMetricas);

export const calcularTaxaSucesso =
  compartilharMetricas.taxaSucesso.bind(compartilharMetricas);

export const limparMetricas =
  compartilharMetricas.limpar.bind(compartilharMetricas);

export const obterTempoMedioExecucao =
  compartilharMetricas.tempoMedioExecucao.bind(compartilharMetricas);

export const obterTamanhoMedioArquivo =
  compartilharMetricas.tamanhoMedioArquivo.bind(compartilharMetricas);
