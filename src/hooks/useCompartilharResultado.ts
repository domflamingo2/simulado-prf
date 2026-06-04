// src/hooks/useCompartilharResultado.ts

"use client";

import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  CompartilharError,
  EstadoCompartilhamento,
  OpcoesCompartilhamento,
  QualidadeAdaptativa,
  TipoCompartilhamento,
} from "@/types/compartilhar.types";

import {
  calcularTaxaSucesso,
  limparMetricas,
  obterMetricas,
  registrarMetrica,
} from "@/lib/compartilhar-metricas";

export const COMPARTILHAR_CONFIG = {
  SCALE_PADRAO: 2.5,
  SCALE_DOWNLOAD: 2,
  QUALIDADE_PNG: 1,
  BACKGROUND_COLOR: "#0f172a",

  DELAY_APOS_SCROLL: 150,

  TIMEOUT_CLIPBOARD: 3000,

  TAMANHO_MINIMO_IMAGEM: 10_000,
  TAMANHO_MAXIMO_IMAGEM: 2 * 1024 * 1024,

  TIMEOUT_GERACAO_DESKTOP: 8000,
  TIMEOUT_GERACAO_MOBILE: 15000,

  TEMPO_LIMPEZA_ERRO_MS: 5000,

  NOME_ARQUIVO_BASE: "prf-resultado",
} as const;

function detectarQualidadeAdaptativa(): QualidadeAdaptativa {
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);

  return {
    dispositivoMovel: isMobile,
    escala: isMobile ? 1.5 : COMPARTILHAR_CONFIG.SCALE_PADRAO,
    qualidade: isMobile ? 0.85 : COMPARTILHAR_CONFIG.QUALIDADE_PNG,
    tempoMaximoMS: isMobile
      ? COMPARTILHAR_CONFIG.TIMEOUT_GERACAO_MOBILE
      : COMPARTILHAR_CONFIG.TIMEOUT_GERACAO_DESKTOP,
  };
}

function gerarNomeArquivo(
  base = COMPARTILHAR_CONFIG.NOME_ARQUIVO_BASE,
): string {
  const data = new Date().toISOString().split("T")[0];

  return `${base}-${data}.png`;
}

function dispararDownload(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;

  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}

async function comprimirImagemSeNecessario(
  blob: Blob,
  qualidade = 0.7,
): Promise<Blob> {
  if (blob.size <= COMPARTILHAR_CONFIG.TAMANHO_MAXIMO_IMAGEM) {
    return blob;
  }

  const url = URL.createObjectURL(blob);

  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
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
            if (resultado) {
              resolve(resultado);
            } else {
              reject(
                new CompartilharError(
                  "Falha ao comprimir imagem",
                  "GERACAO_IMAGEM_FALHOU",
                ),
              );
            }
          },
          "image/jpeg",
          qualidade,
        );
      };

      img.onerror = () => {
        reject(
          new CompartilharError(
            "Falha ao carregar imagem",
            "GERACAO_IMAGEM_FALHOU",
          ),
        );
      };

      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function otimizarParaCaptura(elemento: HTMLElement): () => void {
  const original = {
    transform: elemento.style.transform,
    animation: elemento.style.animation,
    transition: elemento.style.transition,
    willChange: elemento.style.willChange,
  };

  elemento.style.transform = "none";
  elemento.style.animation = "none";
  elemento.style.transition = "none";
  elemento.style.willChange = "auto";

  return () => {
    elemento.style.transform = original.transform;
    elemento.style.animation = original.animation;
    elemento.style.transition = original.transition;
    elemento.style.willChange = original.willChange;
  };
}

export function useCompartilharResultado() {
  const resultadoRef = useRef<HTMLDivElement>(null);

  const erroTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canceladoRef = useRef(false);

  const [estado, setEstado] = useState<EstadoCompartilhamento>({
    gerandoImagem: false,
    progresso: 0,
    erro: null,
    ultimoTipo: null,
    ultimoSucesso: null,
  });

  const atualizarProgresso = useCallback((progresso: number) => {
    setEstado((prev) => ({
      ...prev,
      progresso,
    }));
  }, []);

  const definirErro = useCallback((erro: string | null) => {
    if (erroTimerRef.current) {
      clearTimeout(erroTimerRef.current);
    }

    setEstado((prev) => ({
      ...prev,
      erro,
    }));

    if (erro) {
      erroTimerRef.current = setTimeout(() => {
        setEstado((prev) => ({
          ...prev,
          erro: null,
        }));
      }, COMPARTILHAR_CONFIG.TEMPO_LIMPEZA_ERRO_MS);
    }
  }, []);

  const iniciarOperacao = useCallback(() => {
    canceladoRef.current = false;

    setEstado((prev) => ({
      ...prev,
      gerandoImagem: true,
      progresso: 0,
      erro: null,
    }));
  }, []);

  const cancelarGeracao = useCallback(() => {
    canceladoRef.current = true;

    setEstado((prev) => ({
      ...prev,
      gerandoImagem: false,
      progresso: 0,
      erro: "Operação cancelada pelo usuário",
    }));
  }, []);

  const finalizarOperacao = useCallback(
    (tipo: TipoCompartilhamento, sucesso: boolean, erro?: string) => {
      setEstado((prev) => ({
        ...prev,
        gerandoImagem: false,
        progresso: 0,
        ultimoTipo: tipo,
        ultimoSucesso: sucesso,
        erro: erro ?? prev.erro,
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
    ): Promise<Blob> => {
      const elemento = resultadoRef.current;

      if (!elemento) {
        throw new CompartilharError(
          "Elemento não encontrado",
          "ELEMENTO_NAO_ENCONTRADO",
        );
      }

      const qualidade = detectarQualidadeAdaptativa();

      const restaurar = otimizarParaCaptura(elemento);

      try {
        atualizarProgresso(20);

        if (canceladoRef.current) {
          throw new Error("Operação cancelada");
        }

        const canvas = await html2canvas(elemento, {
          scale: opcoes?.scale ?? qualidade.escala,
          backgroundColor:
            opcoes?.backgroundColor ?? COMPARTILHAR_CONFIG.BACKGROUND_COLOR,
          useCORS: true,
          logging: false,
          allowTaint: false,
        });

        atualizarProgresso(60);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Blob vazio"));
            },
            "image/png",
            opcoes?.qualidade ?? qualidade.qualidade,
          );
        });

        atualizarProgresso(80);

        const imagemFinal = await comprimirImagemSeNecessario(blob);

        atualizarProgresso(100);

        return imagemFinal;
      } finally {
        restaurar();
      }
    },
    [atualizarProgresso],
  );

  const compartilharResultado = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      iniciarOperacao();

      try {
        const imagem = await gerarImagem(opcoes);

        await navigator.clipboard.write([
          new ClipboardItem({
            [imagem.type]: imagem,
          }),
        ]);

        registrarMetrica({
          timestamp: new Date(),
          tipo: "clipboard",
          sucesso: true,
          tempoExecucaoMs: 0,
          tamanhoBytes: imagem.size,
        });

        finalizarOperacao("clipboard", true);

        opcoes?.onSuccess?.("clipboard");
      } catch (error) {
        finalizarOperacao("clipboard", false);

        definirErro(
          error instanceof Error ? error.message : "Erro desconhecido",
        );
      }
    },
    [gerarImagem, iniciarOperacao, finalizarOperacao, definirErro],
  );

  const salvarImagem = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      iniciarOperacao();

      try {
        const imagem = await gerarImagem(opcoes);

        dispararDownload(imagem, opcoes?.nomeArquivo ?? gerarNomeArquivo());

        finalizarOperacao("download", true);

        opcoes?.onSuccess?.("download");
      } catch (error) {
        finalizarOperacao("download", false);

        definirErro(
          error instanceof Error ? error.message : "Erro desconhecido",
        );
      }
    },
    [gerarImagem, iniciarOperacao, finalizarOperacao, definirErro],
  );

  const compartilharViaWebShare = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      if (typeof navigator.share !== "function") {
        return false;
      }

      try {
        const imagem = await gerarImagem(opcoes);

        const arquivo = new File([imagem], gerarNomeArquivo(), {
          type: "image/png",
        });

        await navigator.share({
          title: "Resultado do Simulado",
          text: "Confira meu resultado!",
          files: [arquivo],
        });

        finalizarOperacao("webshare", true);

        return true;
      } catch {
        finalizarOperacao("webshare", false);
        return false;
      }
    },
    [gerarImagem, finalizarOperacao],
  );

  useEffect(() => {
    return () => {
      if (erroTimerRef.current) {
        clearTimeout(erroTimerRef.current);
      }
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

    cancelarGeracao,

    obterMetricas,
    calcularTaxaSucesso,
    limparMetricas,
  } as const;
}
