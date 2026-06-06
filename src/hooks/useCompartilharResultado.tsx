// hooks/useCompartilharResultado.tsx
// ✅ Versão 3.0 — Corrigido (html2canvas types + onclone)

import html2canvas, { Options as Html2CanvasOptions } from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════
// CONSTANTES CONFIGURÁVEIS
// ═══════════════════════════════════════════════════════════

export const COMPARTILHAR_CONFIG = {
  SCALE_PADRAO: 2.5,
  SCALE_DOWNLOAD: 2,
  QUALIDADE_PNG: 1.0,
  BACKGROUND_COLOR: "#0f172a",
  DELAY_APOS_SCROLL: 150,
  TAMANHO_MINIMO_IMAGEM: 10_000,
  TAMANHO_MAXIMO_IMAGEM: 2 * 1024 * 1024,
  TIMEOUT_GERACAO_DESKTOP: 8_000,
  TIMEOUT_GERACAO_MOBILE: 15_000,
  LIMITE_METRICAS: 100,
  TEMPO_LIMPEZA_ERRO_MS: 5_000,
  NOME_ARQUIVO_BASE: "prf-resultado",
  AREA_MAXIMA_CANVAS: 4_000_000,
} as const;

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export type TipoCompartilhamento = "clipboard" | "download" | "webshare";

export interface OpcoesCompartilhamento {
  scale?: number;
  backgroundColor?: string;
  qualidade?: number;
  nomeArquivo?: string;
  onSuccess?: (tipo: TipoCompartilhamento) => void;
  onError?: (erro: Error) => void;
  onFeedback?: (mensagem: {
    tipo: "sucesso" | "erro" | "info";
    texto: string;
  }) => void;
}

export interface OpcoesValidacao {
  verificarTamanhoMinimo?: boolean;
  verificarConteudo?: boolean;
  elementoObrigatorio?: string;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
}

export type MetricaCompartilhamento =
  | {
      timestamp: Date;
      tipo: TipoCompartilhamento;
      sucesso: true;
      tempoExecucaoMs: number;
      tamanhoBytes: number;
    }
  | {
      timestamp: Date;
      tipo: TipoCompartilhamento;
      sucesso: false;
      tempoExecucaoMs: number;
      erro: string;
    };

export interface QualidadeAdaptativa {
  dispositivoMovel: boolean;
  escala: number;
  qualidade: number;
  tempoMaximoMS: number;
}

export interface EstadoCompartilhamento {
  gerandoImagem: boolean;
  progresso: number;
  erro: string | null;
  ultimoTipo: TipoCompartilhamento | null;
  ultimoSucesso: boolean | null;
}

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
  | "ABORTADO";

export class CompartilharError extends Error {
  constructor(
    message: string,
    public readonly code: CodigoErroCompartilhar,
    public readonly causa?: unknown,
  ) {
    super(message);
    this.name = "CompartilharError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CompartilharError);
    }
  }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES PURAS
// ═══════════════════════════════════════════════════════════

export function detectarQualidadeAdaptativa(): QualidadeAdaptativa {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return {
    dispositivoMovel: isMobile,
    escala: isMobile ? 1.5 : COMPARTILHAR_CONFIG.SCALE_PADRAO,
    qualidade: isMobile ? 0.85 : COMPARTILHAR_CONFIG.QUALIDADE_PNG,
    tempoMaximoMS: isMobile
      ? COMPARTILHAR_CONFIG.TIMEOUT_GERACAO_MOBILE
      : COMPARTILHAR_CONFIG.TIMEOUT_GERACAO_DESKTOP,
  };
}

export function validarElemento(
  elemento: HTMLElement | null,
  opcoes: OpcoesValidacao = {},
): ResultadoValidacao {
  if (!elemento) {
    return { valido: false, erros: ["Elemento não existe no DOM"] };
  }

  const erros: string[] = [];
  const estilo = window.getComputedStyle(elemento);
  if (estilo.display === "none")
    erros.push("Elemento está oculto (display: none)");
  if (estilo.visibility === "hidden")
    erros.push("Elemento está oculto (visibility: hidden)");
  if (estilo.opacity === "0")
    erros.push("Elemento está invisível (opacity: 0)");

  if (opcoes.verificarTamanhoMinimo) {
    const rect = elemento.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) {
      erros.push(
        `Elemento muito pequeno: ${rect.width.toFixed(0)}×${rect.height.toFixed(0)}px`,
      );
    }
  }

  if (
    opcoes.verificarConteudo &&
    (elemento.textContent ?? "").trim().length === 0
  ) {
    erros.push("Elemento está vazio");
  }

  if (
    opcoes.elementoObrigatorio &&
    !elemento.querySelector(opcoes.elementoObrigatorio)
  ) {
    erros.push(
      `Elemento obrigatório não encontrado: ${opcoes.elementoObrigatorio}`,
    );
  }

  return { valido: erros.length === 0, erros };
}

function otimizarParaCaptura(elemento: HTMLElement): () => void {
  const restoredProperties: Array<[string, string | null]> = [];
  const setProp = (prop: string, value: string) => {
    const original = elemento.style.getPropertyValue(prop);
    restoredProperties.push([prop, original || null]);
    elemento.style.setProperty(prop, value);
  };

  setProp("transform", "none");
  setProp("-webkit-transform", "none");
  setProp("will-change", "auto");
  setProp("transition", "none");
  setProp("animation", "none");

  return () => {
    for (const [prop, original] of restoredProperties) {
      if (original === null) {
        elemento.style.removeProperty(prop);
      } else {
        elemento.style.setProperty(prop, original);
      }
    }
  };
}

async function comprimirImagemSeNecessario(
  blob: Blob,
  qualidadeAlvo: number = 0.7,
  signal?: AbortSignal,
): Promise<Blob> {
  if (blob.size <= COMPARTILHAR_CONFIG.TAMANHO_MAXIMO_IMAGEM) return blob;
  if (signal?.aborted)
    throw new CompartilharError("Operação abortada", "ABORTADO");

  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<Blob>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new CompartilharError("Operação abortada", "ABORTADO"));
        return;
      }

      const img = new Image();
      const abortHandler = () => {
        img.removeEventListener("load", loadHandler);
        img.removeEventListener("error", errorHandler);
        reject(new CompartilharError("Operação abortada", "ABORTADO"));
      };
      const loadHandler = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(
            new CompartilharError(
              "Contexto 2D indisponível",
              "GERACAO_IMAGEM_FALHOU",
            ),
          );
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (resultado) => {
            if (resultado) resolve(resultado);
            else
              reject(
                new CompartilharError(
                  "Falha ao comprimir imagem",
                  "GERACAO_IMAGEM_FALHOU",
                ),
              );
          },
          "image/jpeg",
          qualidadeAlvo,
        );
      };
      const errorHandler = () =>
        reject(
          new CompartilharError(
            "Falha ao carregar imagem para compressão",
            "GERACAO_IMAGEM_FALHOU",
          ),
        );

      signal?.addEventListener("abort", abortHandler, { once: true });
      img.addEventListener("load", loadHandler, { once: true });
      img.addEventListener("error", errorHandler, { once: true });
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function gerarNomeArquivo(
  base: string = COMPARTILHAR_CONFIG.NOME_ARQUIVO_BASE,
): string {
  const data = new Date().toISOString().split("T")[0];
  return `${base}-${data}.png`;
}

function dispararDownload(blob: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function limitarEscalaPorArea(
  largura: number,
  altura: number,
  escalaDesejada: number,
): number {
  const areaAtual = largura * altura;
  const areaFinal = areaAtual * escalaDesejada * escalaDesejada;
  if (areaFinal > COMPARTILHAR_CONFIG.AREA_MAXIMA_CANVAS) {
    const escalaLimitada = Math.sqrt(
      COMPARTILHAR_CONFIG.AREA_MAXIMA_CANVAS / areaAtual,
    );
    console.warn(
      `[useCompartilharResultado] Escala reduzida de ${escalaDesejada} para ${escalaLimitada.toFixed(2)} para evitar canvas excessivo.`,
    );
    return parseFloat(escalaLimitada.toFixed(2));
  }
  return escalaDesejada;
}

// Wrapper cancelável para html2canvas
function abortableHtml2canvas(
  element: HTMLElement,
  options: Html2CanvasOptions,
  signal?: AbortSignal,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new CompartilharError("Operação abortada", "ABORTADO"));
      return;
    }
    const abortHandler = () =>
      reject(new CompartilharError("Operação abortada", "ABORTADO"));
    signal?.addEventListener("abort", abortHandler, { once: true });
    html2canvas(element, options)
      .then(resolve)
      .catch(reject)
      .finally(() => signal?.removeEventListener("abort", abortHandler));
  });
}

// ═══════════════════════════════════════════════════════════
// MÓDULO DE MÉTRICAS (singleton)
// ═══════════════════════════════════════════════════════════

const _metricas: MetricaCompartilhamento[] = [];

export function registrarMetrica(metrica: MetricaCompartilhamento): void {
  _metricas.push(metrica);
  if (_metricas.length > COMPARTILHAR_CONFIG.LIMITE_METRICAS) {
    _metricas.splice(0, _metricas.length - COMPARTILHAR_CONFIG.LIMITE_METRICAS);
  }
}

export function obterMetricas(): readonly MetricaCompartilhamento[] {
  return Object.freeze([..._metricas]);
}

export function calcularTaxaSucesso(): number {
  if (_metricas.length === 0) return 100;
  const sucessos = _metricas.filter((m) => m.sucesso).length;
  return (sucessos / _metricas.length) * 100;
}

export function limparMetricas(): void {
  _metricas.length = 0;
}

// ═══════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function useCompartilharResultado() {
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<EstadoCompartilhamento>({
    gerandoImagem: false,
    progresso: 0,
    erro: null,
    ultimoTipo: null,
    ultimoSucesso: null,
  });

  const timerErroRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const operacaoEmAndamentoRef = useRef<boolean>(false);

  const atualizarProgresso = useCallback((progresso: number) => {
    setEstado((prev) => ({ ...prev, progresso }));
  }, []);

  const definirErro = useCallback((mensagem: string | null) => {
    if (timerErroRef.current) clearTimeout(timerErroRef.current);
    setEstado((prev) => ({ ...prev, erro: mensagem }));
    if (mensagem) {
      timerErroRef.current = setTimeout(() => {
        setEstado((prev) => ({ ...prev, erro: null }));
      }, COMPARTILHAR_CONFIG.TEMPO_LIMPEZA_ERRO_MS);
    }
  }, []);

  const iniciarOperacao = useCallback(() => {
    if (operacaoEmAndamentoRef.current) {
      console.warn(
        "[useCompartilharResultado] Operação já em andamento, ignorando nova chamada.",
      );
      return false;
    }
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    operacaoEmAndamentoRef.current = true;
    setEstado((prev) => ({
      ...prev,
      gerandoImagem: true,
      progresso: 0,
      erro: null,
    }));
    return true;
  }, []);

  const finalizarOperacao = useCallback(
    (tipo: TipoCompartilhamento, sucesso: boolean, erroMsg?: string) => {
      operacaoEmAndamentoRef.current = false;
      abortControllerRef.current = null;
      setEstado((prev) => ({
        ...prev,
        gerandoImagem: false,
        progresso: 0,
        ultimoTipo: tipo,
        ultimoSucesso: sucesso,
        erro: erroMsg ?? prev.erro,
      }));
    },
    [],
  );

  const gerarImagem = useCallback(
    async (
      opcoes?: Pick<
        OpcoesCompartilhamento,
        "scale" | "backgroundColor" | "qualidade"
      >,
      signal?: AbortSignal,
    ): Promise<Blob> => {
      const qualidadeAdaptativa = detectarQualidadeAdaptativa();
      const elemento = resultadoRef.current;

      if (!elemento) {
        throw new CompartilharError(
          "Referência ao elemento de resultado está nula",
          "ELEMENTO_NAO_ENCONTRADO",
        );
      }

      const validacao = validarElemento(elemento, {
        verificarTamanhoMinimo: true,
        verificarConteudo: false,
      });
      if (!validacao.valido) {
        throw new CompartilharError(
          `Elemento inválido: ${validacao.erros.join("; ")}`,
          "ELEMENTO_INVALIDO",
        );
      }

      let scale = opcoes?.scale ?? qualidadeAdaptativa.escala;
      const backgroundColor =
        opcoes?.backgroundColor ?? COMPARTILHAR_CONFIG.BACKGROUND_COLOR;
      const qualidade = opcoes?.qualidade ?? qualidadeAdaptativa.qualidade;

      const rect = elemento.getBoundingClientRect();
      scale = limitarEscalaPorArea(rect.width, rect.height, scale);

      const restaurar = otimizarParaCaptura(elemento);

      try {
        if (signal?.aborted)
          throw new CompartilharError("Operação abortada", "ABORTADO");
        atualizarProgresso(10);

        const timeoutMs = qualidadeAdaptativa.tempoMaximoMS;
        const canvas = await Promise.race([
          abortableHtml2canvas(
            elemento,
            {
              backgroundColor,
              scale,
              useCORS: true,
              logging: false,
              allowTaint: false,
              width: elemento.offsetWidth,
              height: elemento.offsetHeight,
              onclone: (_clonedDoc: Document, clonedElement: HTMLElement) => {
                clonedElement.style.transform = "none";
                clonedElement.style.animation = "none";
              },
            } as Html2CanvasOptions,
            signal,
          ),
          new Promise<never>((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new CompartilharError(
                    `Timeout: geração excedeu ${timeoutMs}ms`,
                    "TIMEOUT",
                  ),
                ),
              timeoutMs,
            ),
          ),
        ]);

        if (signal?.aborted)
          throw new CompartilharError("Operação abortada", "ABORTADO");
        atualizarProgresso(60);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else
                reject(
                  new CompartilharError(
                    "canvas.toBlob retornou null",
                    "BLOB_VAZIO",
                  ),
                );
            },
            "image/png",
            qualidade,
          );
        });

        atualizarProgresso(80);
        if (blob.size < COMPARTILHAR_CONFIG.TAMANHO_MINIMO_IMAGEM) {
          console.warn(
            `[useCompartilharResultado] Imagem suspeita: ${blob.size} bytes`,
          );
        }

        const imagemFinal = await comprimirImagemSeNecessario(
          blob,
          0.7,
          signal,
        );
        atualizarProgresso(95);
        return imagemFinal;
      } catch (error) {
        if (error instanceof CompartilharError && error.code === "ABORTADO")
          throw error;
        throw error;
      } finally {
        restaurar();
      }
    },
    [atualizarProgresso],
  );

  const compartilharResultado = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      if (!iniciarOperacao()) return;

      const inicio = Date.now();
      const feedback = opcoes?.onFeedback;
      try {
        if (!navigator.clipboard?.write) {
          throw new CompartilharError(
            "Clipboard API (write) não suportada",
            "CLIPBOARD_NAO_SUPORTADO",
          );
        }

        if (resultadoRef.current) {
          const rect = resultadoRef.current.getBoundingClientRect();
          const estaVisivel =
            rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (!estaVisivel) {
            resultadoRef.current.scrollIntoView({
              behavior: "instant",
              block: "center",
            });
            await new Promise((r) =>
              setTimeout(r, COMPARTILHAR_CONFIG.DELAY_APOS_SCROLL),
            );
          }
        }

        const imagem = await gerarImagem(
          opcoes,
          abortControllerRef.current?.signal,
        );
        atualizarProgresso(95);

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [imagem.type]: imagem }),
          ]);
          opcoes?.onSuccess?.("clipboard");
          finalizarOperacao("clipboard", true);
          feedback?.({
            tipo: "sucesso",
            texto: "✅ Imagem copiada! Cole onde quiser (Ctrl+V / ⌘+V).",
          });
        } catch (clipboardError) {
          if (
            clipboardError instanceof DOMException &&
            clipboardError.name === "NotAllowedError"
          ) {
            const nome = opcoes?.nomeArquivo ?? gerarNomeArquivo();
            dispararDownload(imagem, nome);
            opcoes?.onSuccess?.("download");
            finalizarOperacao("download", true);
            feedback?.({
              tipo: "sucesso",
              texto:
                "📸 Permissão de clipboard negada. Imagem salva nos downloads.",
            });
          } else {
            throw new CompartilharError(
              "Falha ao escrever no clipboard",
              "CLIPBOARD_NAO_SUPORTADO",
              clipboardError,
            );
          }
        }

        registrarMetrica({
          timestamp: new Date(),
          tipo: "clipboard",
          sucesso: true,
          tempoExecucaoMs: Date.now() - inicio,
          tamanhoBytes: imagem.size,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const msg = err.message || "Erro ao gerar imagem.";
        definirErro(msg);
        finalizarOperacao("clipboard", false, msg);
        feedback?.({ tipo: "erro", texto: `❌ ${msg}` });
        opcoes?.onError?.(err);
        registrarMetrica({
          timestamp: new Date(),
          tipo: "clipboard",
          sucesso: false,
          tempoExecucaoMs: Date.now() - inicio,
          erro: msg,
        });
      }
    },
    [
      iniciarOperacao,
      finalizarOperacao,
      gerarImagem,
      atualizarProgresso,
      definirErro,
    ],
  );

  const salvarImagem = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      if (!iniciarOperacao()) return;

      const inicio = Date.now();
      const feedback = opcoes?.onFeedback;
      try {
        const qualidadeAdaptativa = detectarQualidadeAdaptativa();
        const scale = opcoes?.scale ?? COMPARTILHAR_CONFIG.SCALE_DOWNLOAD;
        const qualidade = opcoes?.qualidade ?? qualidadeAdaptativa.qualidade;

        const imagem = await gerarImagem(
          { scale, qualidade, backgroundColor: opcoes?.backgroundColor },
          abortControllerRef.current?.signal,
        );
        atualizarProgresso(98);

        const nome = opcoes?.nomeArquivo ?? gerarNomeArquivo();
        dispararDownload(imagem, nome);
        opcoes?.onSuccess?.("download");
        finalizarOperacao("download", true);
        feedback?.({
          tipo: "sucesso",
          texto: "✅ Imagem salva! Verifique sua pasta de downloads.",
        });

        registrarMetrica({
          timestamp: new Date(),
          tipo: "download",
          sucesso: true,
          tempoExecucaoMs: Date.now() - inicio,
          tamanhoBytes: imagem.size,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        definirErro(err.message);
        finalizarOperacao("download", false, err.message);
        feedback?.({ tipo: "erro", texto: `❌ ${err.message}` });
        opcoes?.onError?.(err);
        registrarMetrica({
          timestamp: new Date(),
          tipo: "download",
          sucesso: false,
          tempoExecucaoMs: Date.now() - inicio,
          erro: err.message,
        });
      }
    },
    [
      iniciarOperacao,
      finalizarOperacao,
      gerarImagem,
      definirErro,
      atualizarProgresso,
    ],
  );

  const compartilharViaWebShare = useCallback(
    async (opcoes?: OpcoesCompartilhamento): Promise<boolean> => {
      if (!navigator.share) {
        opcoes?.onFeedback?.({
          tipo: "erro",
          texto: "Web Share API não suportada neste navegador.",
        });
        return false;
      }
      if (!iniciarOperacao()) return false;

      const feedback = opcoes?.onFeedback;
      try {
        const imagem = await gerarImagem(
          { scale: 1.5, ...opcoes },
          abortControllerRef.current?.signal,
        );
        const nome = opcoes?.nomeArquivo ?? gerarNomeArquivo();
        const file = new File([imagem], nome, { type: "image/png" });

        if (!navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: "Resultado Simulado PRF",
            text: "Veja meu desempenho no simulado da PRF!",
          });
        } else {
          await navigator.share({
            title: "Resultado Simulado PRF",
            text: "Veja meu desempenho no simulado da PRF!",
            files: [file],
          });
        }

        opcoes?.onSuccess?.("webshare");
        finalizarOperacao("webshare", true);
        feedback?.({ tipo: "sucesso", texto: "✅ Compartilhado com sucesso!" });
        registrarMetrica({
          timestamp: new Date(),
          tipo: "webshare",
          sucesso: true,
          tempoExecucaoMs: 0,
          tamanhoBytes: imagem.size,
        });
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          finalizarOperacao("webshare", false);
          return false;
        }
        const err = error instanceof Error ? error : new Error(String(error));
        finalizarOperacao("webshare", false, err.message);
        feedback?.({
          tipo: "erro",
          texto: "❌ Não foi possível compartilhar. Tente salvar a imagem.",
        });
        registrarMetrica({
          timestamp: new Date(),
          tipo: "webshare",
          sucesso: false,
          tempoExecucaoMs: 0,
          erro: err.message,
        });
        return false;
      }
    },
    [iniciarOperacao, finalizarOperacao, gerarImagem],
  );

  const copiarTextoResultado = useCallback(
    async (
      texto: string,
      opcoes?: Pick<
        OpcoesCompartilhamento,
        "onFeedback" | "onError" | "onSuccess"
      >,
    ): Promise<boolean> => {
      if (!texto || texto.trim().length === 0) {
        opcoes?.onFeedback?.({
          tipo: "erro",
          texto: "❌ Não há texto para copiar.",
        });
        return false;
      }
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(texto);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = texto;
          textarea.style.cssText =
            "position:fixed;top:-9999px;left:-9999px;opacity:0";
          document.body.appendChild(textarea);
          textarea.select();
          const sucesso = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!sucesso) throw new Error("execCommand('copy') falhou");
        }
        opcoes?.onFeedback?.({
          tipo: "sucesso",
          texto: "✅ Texto copiado para a área de transferência!",
        });
        opcoes?.onSuccess?.("clipboard");
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        opcoes?.onFeedback?.({
          tipo: "erro",
          texto: "❌ Não foi possível copiar o texto.",
        });
        opcoes?.onError?.(err);
        return false;
      }
    },
    [],
  );

  const cancelar = useCallback(() => {
    abortControllerRef.current?.abort();
    operacaoEmAndamentoRef.current = false;
    setEstado((prev) => ({
      ...prev,
      gerandoImagem: false,
      progresso: 0,
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (timerErroRef.current) clearTimeout(timerErroRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    resultadoRef,
    gerandoImagem: estado.gerandoImagem,
    progresso: estado.progresso,
    erro: estado.erro,
    estado,
    compartilharResultado,
    salvarImagem,
    compartilharViaWebShare,
    copiarTextoResultado,
    cancelar,
    validarElementoAtual: () => validarElemento(resultadoRef.current),
    obterMetricas,
    calcularTaxaSucesso,
    limparMetricas,
  } as const;
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE FeedbackCompartilhar (acessível, sem alert)
// ═══════════════════════════════════════════════════════════

export interface FeedbackCompartilharProps {
  gerandoImagem: boolean;
  progresso: number;
  erro: string | null;
  onCompartilhar: () => void;
  onSalvar: () => void;
  onCompartilharWeb?: () => void;
  onCancelar?: () => void;
  className?: string;
}

export function FeedbackCompartilhar({
  gerandoImagem,
  progresso,
  erro,
  onCompartilhar,
  onSalvar,
  onCompartilharWeb,
  onCancelar,
  className = "",
}: FeedbackCompartilharProps) {
  const suporteWebShare = typeof navigator !== "undefined" && !!navigator.share;

  const labelProgresso =
    progresso < 30
      ? "📸 Preparando..."
      : progresso < 70
        ? "🎨 Renderizando..."
        : progresso < 95
          ? "💾 Processando..."
          : "✅ Finalizando...";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col gap-2 ${className}`}
    >
      {gerandoImagem && (
        <div
          className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 min-w-[220px]"
          role="status"
          aria-live="polite"
        >
          <div className="text-sm text-slate-300 mb-2">{labelProgresso}</div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progresso))}%` }}
              role="progressbar"
              aria-valuenow={progresso}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${labelProgresso} ${Math.round(progresso)}%`}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-500">
              {Math.round(progresso)}%
            </span>
            {onCancelar && (
              <button
                onClick={onCancelar}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                aria-label="Cancelar operação"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {erro && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-900/90 border border-red-700 rounded-lg p-3 text-sm text-red-200 max-w-[300px] break-words"
        >
          ⚠️ {erro}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onCompartilhar}
          disabled={gerandoImagem}
          aria-busy={gerandoImagem}
          aria-label="Copiar imagem para a área de transferência"
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg"
        >
          📋 Copiar Imagem
        </button>
        <button
          onClick={onSalvar}
          disabled={gerandoImagem}
          aria-busy={gerandoImagem}
          aria-label="Salvar imagem como arquivo"
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg"
        >
          💾 Salvar Imagem
        </button>
        {suporteWebShare && onCompartilharWeb && (
          <button
            onClick={onCompartilharWeb}
            disabled={gerandoImagem}
            aria-busy={gerandoImagem}
            aria-label="Compartilhar via apps do dispositivo"
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg"
          >
            📤 Compartilhar
          </button>
        )}
      </div>
    </div>
  );
}
