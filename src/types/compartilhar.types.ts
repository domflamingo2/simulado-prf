// types/compartilhar.types.ts

// ═══════════════════════════════════════════════════════════
// TIPOS DE COMPARTILHAMENTO
// ═══════════════════════════════════════════════════════════

export type TipoCompartilhamento = "clipboard" | "download" | "webshare";

// ═══════════════════════════════════════════════════════════
// OPÇÕES DE FEEDBACK
// ═══════════════════════════════════════════════════════════

export interface FeedbackPersonalizado {
  sucessoClipboard?: string;
  sucessoDownload?: string;
  sucessoWebShare?: string;
  erro?: string;
  processando?: string;
}

// ═══════════════════════════════════════════════════════════
// OPÇÕES DE COMPARTILHAMENTO
// ═══════════════════════════════════════════════════════════

export interface OpcoesCompartilhamento {
  scale?: number;
  backgroundColor?: string;
  qualidade?: number;

  /**
   * Nome do arquivo ao baixar a imagem.
   * Exemplo: resultado-prf.png
   */
  nomeArquivo?: string;

  onSuccess?: (tipo: TipoCompartilhamento) => void;

  onError?: (erro: Error) => void;

  feedbackPersonalizado?: FeedbackPersonalizado;
}

// ═══════════════════════════════════════════════════════════
// VALIDAÇÃO DE ELEMENTO
// ═══════════════════════════════════════════════════════════

export interface OpcoesValidacao {
  verificarTamanhoMinimo?: boolean;
  verificarConteudo?: boolean;

  /**
   * Selector obrigatório.
   * Exemplo:
   * ".resultado-final"
   */
  elementoObrigatorio?: string;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
}

// ═══════════════════════════════════════════════════════════
// MÉTRICAS
// ═══════════════════════════════════════════════════════════

export interface MetricaCompartilhamento {
  timestamp: Date;

  tipo: TipoCompartilhamento;

  sucesso: boolean;

  tempoExecucaoMs: number;

  tamanhoBytes?: number;

  erro?: string;
}

// ═══════════════════════════════════════════════════════════
// QUALIDADE ADAPTATIVA
// ═══════════════════════════════════════════════════════════

export interface QualidadeAdaptativa {
  dispositivoMovel: boolean;

  escala: number;

  qualidade: number;

  tempoMaximoMS: number;
}

// ═══════════════════════════════════════════════════════════
// ESTADO DO HOOK
// ═══════════════════════════════════════════════════════════

export interface EstadoCompartilhamento {
  gerandoImagem: boolean;

  progresso: number;

  erro: string | null;

  ultimoTipo: TipoCompartilhamento | null;

  ultimoSucesso: boolean | null;
}

// ═══════════════════════════════════════════════════════════
// CÓDIGOS DE ERRO
// ═══════════════════════════════════════════════════════════

export type CodigoErroCompartilhar =
  | "ELEMENTO_NAO_ENCONTRADO"
  | "ELEMENTO_INVALIDO"
  | "GERACAO_IMAGEM_FALHOU"
  | "BLOB_VAZIO"
  | "CLIPBOARD_NAO_SUPORTADO"
  | "PERMISSAO_NEGADA"
  | "TIMEOUT"
  | "IMAGEM_MUITO_PEQUENA"
  | "WEBSHARE_NAO_SUPORTADO"
  | "WEBSHARE_CANCELADO"
  | "TEXTO_VAZIO"
  | "OPERACAO_CANCELADA";

// ═══════════════════════════════════════════════════════════
// ERRO CUSTOMIZADO
// ═══════════════════════════════════════════════════════════

export class CompartilharError extends Error {
  constructor(
    message: string,
    public readonly code: CodigoErroCompartilhar,
    public readonly causa?: unknown,
  ) {
    super(message);

    this.name = "CompartilharError";

    Object.setPrototypeOf(this, CompartilharError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CompartilharError);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// RESULTADO DE OPERAÇÃO
// ═══════════════════════════════════════════════════════════

export interface ResultadoOperacao {
  sucesso: boolean;

  tipo?: TipoCompartilhamento;

  erro?: string;

  tamanhoBytes?: number;

  tempoExecucaoMs?: number;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO GLOBAL
// ═══════════════════════════════════════════════════════════

export interface CompartilharConfig {
  SCALE_PADRAO: number;
  SCALE_DOWNLOAD: number;
  QUALIDADE_PNG: number;
  BACKGROUND_COLOR: string;
  DELAY_APOS_SCROLL: number;
  TIMEOUT_CLIPBOARD: number;
  TAMANHO_MINIMO_IMAGEM: number;
  TAMANHO_MAXIMO_IMAGEM: number;
  TIMEOUT_GERACAO_DESKTOP: number;
  TIMEOUT_GERACAO_MOBILE: number;
  LIMITE_METRICAS: number;
  TEMPO_LIMPEZA_ERRO_MS: number;
  NOME_ARQUIVO_BASE: string;
}
