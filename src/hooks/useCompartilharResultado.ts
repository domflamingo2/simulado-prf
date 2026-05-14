// hooks/useCompartilharResultado.ts
import html2canvas from "html2canvas";
import React, { useCallback, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════
// CONSTANTES CONFIGURÁVEIS
// ═══════════════════════════════════════════════════════════

export const COMPARTILHAR_CONFIG = {
  // Configurações do canvas
  SCALE_PADRAO: 2.5,
  SCALE_DOWNLOAD: 2,
  QUALIDADE_PNG: 1.0,
  BACKGROUND_COLOR: "#0f172a",
  
  // Timeouts e delays
  DELAY_APOS_SCROLL: 100,
  TIMEOUT_CLIPBOARD: 3000,
  
  // Validações
  TAMANHO_MINIMO_IMAGEM: 10000, // 10KB
} as const;

// ═══════════════════════════════════════════════════════════
// TIPOS EXPANDIDOS
// ═══════════════════════════════════════════════════════════

export interface OpcoesCompartilhamento {
  scale?: number;
  backgroundColor?: string;
  qualidade?: number; // 0-1
  onSuccess?: (tipo: "clipboard" | "download") => void;
  onError?: (erro: Error) => void;
  feedbackPersonalizado?: {
    sucessoClipboard?: string;
    sucessoDownload?: string;
    erro?: string;
    processando?: string;
  };
}

export interface OpcoesValidacao {
  verificarTamanhoMinimo?: boolean;
  verificarConteudo?: boolean;
  elementoObrigatorio?: string; // selector
}

export interface MetricaCompartilhamento {
  timestamp: Date;
  tipo: "clipboard" | "download";
  sucesso: boolean;
  tempoExecucaoMs: number;
  tamanhoBytes?: number;
  erro?: string;
}

// ✅ MELHORIA: Configuração de qualidade adaptativa
export interface QualidadeAdaptativa {
  dispositivoMovel: boolean;
  escala: number;
  qualidade: number;
  tempoMaximoMS: number;
}

// ═══════════════════════════════════════════════════════════
// ERROS CUSTOMIZADOS
// ═══════════════════════════════════════════════════════════

export class CompartilharError extends Error {
  constructor(
    message: string,
    public code:
      | "ELEMENTO_NAO_ENCONTRADO"
      | "GERACAO_IMAGEM_FALHOU"
      | "BLOB_VAZIO"
      | "CLIPBOARD_NAO_SUPORTADO"
      | "PERMISSAO_NEGADA"
      | "TIMEOUT"
      | "IMAGEM_MUITO_PEQUENA",
  ) {
    super(message);
    this.name = "CompartilharError";
  }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

// ✅ MELHORIA: Detectar qualidade adaptativa
export function detectarQualidadeAdaptativa(): QualidadeAdaptativa {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // Telas pequenas precisam de menos escala
  const escala = isMobile ? 1.5 : 2.5;
  const qualidade = isMobile ? 0.85 : 1.0;
  const tempoMaximoMS = isMobile ? 10000 : 5000; // Mobile precisa mais tempo
  
  return {
    dispositivoMovel: isMobile,
    escala,
    qualidade,
    tempoMaximoMS,
  };
}

// ✅ MELHORIA: Validar elemento antes de renderizar
export function validarElemento(
  elemento: HTMLElement,
  opcoes: OpcoesValidacao = {}
): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  
  if (!elemento) {
    erros.push("Elemento não existe no DOM");
    return { valido: false, erros };
  }
  
  // Verificar se elemento está visível
  const estilo = window.getComputedStyle(elemento);
  if (estilo.display === "none" || estilo.visibility === "hidden") {
    erros.push("Elemento está oculto (display: none ou visibility: hidden)");
  }
  
  // Verificar tamanho mínimo
  if (opcoes.verificarTamanhoMinimo) {
    const rect = elemento.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) {
      erros.push(`Elemento muito pequeno (${rect.width}x${rect.height})`);
    }
  }
  
  // Verificar conteúdo
  if (opcoes.verificarConteudo && elemento.innerText.trim().length === 0) {
    erros.push("Elemento está vazio");
  }
  
  // Verificar elemento obrigatório
  if (opcoes.elementoObrigatorio) {
    const obrigatorio = elemento.querySelector(opcoes.elementoObrigatorio);
    if (!obrigatorio) {
      erros.push(`Elemento obrigatório não encontrado: ${opcoes.elementoObrigatorio}`);
    }
  }
  
  return { valido: erros.length === 0, erros };
}

// ✅ MELHORIA: Otimizar elemento para captura
function otimizarParaCaptura(elemento: HTMLElement): () => void {
  const originalStyles: Array<{ prop: string; value: string }> = [];
  
  // Salvar estilos originais e aplicar correções
  const propriedadesParaCorrigir: Array<{ prop: string; valor: string }> = [
    { prop: "transform", valor: "none" },
    { prop: "webkitTransform", valor: "none" },
    { prop: "willChange", valor: "auto" },
  ];
  
  for (const { prop, valor } of propriedadesParaCorrigir) {
    const original = elemento.style[prop as any];
    originalStyles.push({ prop, value: original });
    elemento.style[prop as any] = valor;
  }
  
  // Retornar função de restauração
  return () => {
    for (const { prop, value } of originalStyles) {
      elemento.style[prop as any] = value;
    }
  };
}

// ✅ MELHORIA: Compressão de imagem (opcional)
async function comprimirImagem(blob: Blob, qualidade: number = 0.8): Promise<Blob> {
  if (qualidade >= 1) return blob;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível criar contexto 2D"));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (comprimido) => {
          URL.revokeObjectURL(url);
          if (comprimido) {
            resolve(comprimido);
          } else {
            reject(new Error("Falha ao comprimir imagem"));
          }
        },
        "image/jpeg",
        qualidade
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem para compressão"));
    };
    
    img.src = url;
  });
}

// ✅ MELHORIA: Logging de métricas
let metricasCompartilhamento: MetricaCompartilhamento[] = [];

export function registrarMetrica(metrica: MetricaCompartilhamento): void {
  metricasCompartilhamento.push(metrica);
  // Manter apenas últimas 100 métricas
  if (metricasCompartilhamento.length > 100) {
    metricasCompartilhamento = metricasCompartilhamento.slice(-100);
  }
}

export function obterMetricas(): MetricaCompartilhamento[] {
  return [...metricasCompartilhamento];
}

export function calcularTaxaSucesso(): number {
  if (metricasCompartilhamento.length === 0) return 100;
  const sucessos = metricasCompartilhamento.filter((m) => m.sucesso).length;
  return (sucessos / metricasCompartilhamento.length) * 100;
}

// ═══════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function useCompartilharResultado() {
  const resultadoRef = useRef<HTMLDivElement>(null);
  const [gerandoImagem, setGerandoImagem] = useState(false);
  const [progresso, setProgresso] = useState<number>(0);
  const [erro, setErro] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ MELHORIA: Função de limpeza
  const limparEstado = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setErro(null);
    setProgresso(0);
  }, []);

  // ✅ MELHORIA: Gerar imagem com opções avançadas
  const gerarImagem = useCallback(
    async (opcoes?: OpcoesCompartilhamento): Promise<Blob> => {
      const inicio = Date.now();
      
      if (!resultadoRef.current) {
        throw new CompartilharError(
          "Elemento de resultado não encontrado",
          "ELEMENTO_NAO_ENCONTRADO"
        );
      }

      // Validar elemento antes de prosseguir
      const validacao = validarElemento(resultadoRef.current, {
        verificarTamanhoMinimo: true,
        verificarConteudo: true,
      });
      
      if (!validacao.valido) {
        throw new CompartilharError(
          `Elemento inválido: ${validacao.erros.join(", ")}`,
          "ELEMENTO_NAO_ENCONTRADO"
        );
      }

      const qualidadeAdaptativa = detectarQualidadeAdaptativa();
      const scale = opcoes?.scale ?? qualidadeAdaptativa.escala;
      const backgroundColor = opcoes?.backgroundColor ?? COMPARTILHAR_CONFIG.BACKGROUND_COLOR;
      
      // ✅ CORREÇÃO: AbortController para operações longas
      abortControllerRef.current = new AbortController();
      
      // Otimizar elemento para captura
      const restaurar = otimizarParaCaptura(resultadoRef.current);
      
      // Scroll para o elemento (apenas para compartilhar, não para salvar)
      if (opcoes?.onSuccess?.toString().includes("clipboard")) {
        resultadoRef.current.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
        await new Promise((resolve) => setTimeout(resolve, COMPARTILHAR_CONFIG.DELAY_APOS_SCROLL));
      }
      
      try {
        // Timeout para geração da imagem
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new CompartilharError(
              `Geração da imagem excedeu ${qualidadeAdaptativa.tempoMaximoMS}ms`,
              "TIMEOUT"
            ));
          }, qualidadeAdaptativa.tempoMaximoMS);
        });
        
        const canvasPromise = html2canvas(resultadoRef.current, {
          backgroundColor,
          scale,
          useCORS: true,
          logging: false,
          allowTaint: false,
          windowWidth: resultadoRef.current.scrollWidth,
          windowHeight: resultadoRef.current.scrollHeight,
          onclone: (clonedDoc, element) => {
            const clonedElement = element as HTMLElement;
            if (clonedElement) {
              clonedElement.style.transform = "none";
            }
          },
        });
        
        const canvas = await Promise.race([canvasPromise, timeoutPromise]);
        
        // ✅ MELHORIA: Atualizar progresso
        setProgresso(50);
        
        const qualidade = opcoes?.qualidade ?? COMPARTILHAR_CONFIG.QUALIDADE_PNG;
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/png", qualidade);
        });
        
        setProgresso(75);
        
        if (!blob) {
          throw new CompartilharError("Falha ao gerar blob da imagem", "BLOB_VAZIO");
        }
        
        // ✅ MELHORIA: Verificar tamanho mínimo
        if (blob.size < COMPARTILHAR_CONFIG.TAMANHO_MINIMO_IMAGEM) {
          console.warn(`Imagem gerada é muito pequena: ${blob.size} bytes`);
        }
        
        // ✅ MELHORIA: Comprimir se for muito grande (>2MB)
        let imagemFinal = blob;
        if (blob.size > 2 * 1024 * 1024) {
          imagemFinal = await comprimirImagem(blob, 0.7);
        }
        
        setProgresso(100);
        
        // Registrar métrica
        registrarMetrica({
          timestamp: new Date(),
          tipo: "clipboard",
          sucesso: true,
          tempoExecucaoMs: Date.now() - inicio,
          tamanhoBytes: imagemFinal.size,
        });
        
        return imagemFinal;
      } catch (error) {
        // Registrar métrica de erro
        registrarMetrica({
          timestamp: new Date(),
          tipo: "clipboard",
          sucesso: false,
          tempoExecucaoMs: Date.now() - inicio,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
        });
        throw error;
      } finally {
        restaurar();
        abortControllerRef.current = null;
      }
    },
    []
  );

  // ✅ MELHORIA: Compartilhar via clipboard com fallback melhorado
  const compartilharResultado = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      const feedback = opcoes?.feedbackPersonalizado;
      
      // Limpar erro anterior
      setErro(null);
      setGerandoImagem(true);
      setProgresso(0);

      try {
        const imagem = await gerarImagem(opcoes);
        
        setProgresso(90);
        
        // Verificar suporte a clipboard moderno
        if (!navigator.clipboard || !navigator.clipboard.write) {
          throw new CompartilharError(
            "Clipboard API não suportada neste navegador",
            "CLIPBOARD_NAO_SUPORTADO"
          );
        }
        
        // ✅ MELHORIA: Try-catch específico para erro de permissão
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [imagem.type]: imagem,
            }),
          ]);
          
          opcoes?.onSuccess?.("clipboard");
          
          const mensagemSucesso = feedback?.sucessoClipboard ?? 
            "✅ Imagem copiada! Cole onde quiser compartilhar (Ctrl+V).";
          alert(mensagemSucesso);
          
        } catch (clipboardError) {
          // Se falhar permissão, fazer download como fallback
          console.warn("Clipboard API falhou, fazendo download:", clipboardError);
          
          if (clipboardError instanceof Error && 
              clipboardError.name === "NotAllowedError") {
            throw new CompartilharError(
              "Permissão negada para acessar clipboard",
              "PERMISSAO_NEGADA"
            );
          }
          
          // Fallback para download
          const url = URL.createObjectURL(imagem);
          const a = document.createElement("a");
          a.href = url;
          a.download = `prf-resultado-${new Date().toISOString().split("T")[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          opcoes?.onSuccess?.("download");
          
          const mensagemDownload = feedback?.sucessoDownload ?? 
            "📸 Imagem salva! Verifique sua pasta de downloads.";
          alert(mensagemDownload);
        }
        
      } catch (error) {
        console.error("Erro ao gerar/compartilhar imagem:", error);
        
        const mensagemErro = feedback?.erro ?? 
          "❌ Erro ao gerar imagem. Tente novamente ou faça um print screen.";
        setErro(error instanceof Error ? error.message : mensagemErro);
        alert(mensagemErro);
        
        opcoes?.onError?.(error instanceof Error ? error : new Error(String(error)));
        
      } finally {
        setGerandoImagem(false);
        setProgresso(0);
        setTimeout(() => setErro(null), 5000); // Limpar erro após 5s
      }
    },
    [gerarImagem]
  );

  // ✅ MELHORIA: Salvar imagem com opções
  const salvarImagem = useCallback(
    async (opcoes?: OpcoesCompartilhamento) => {
      const feedback = opcoes?.feedbackPersonalizado;
      
      setErro(null);
      setGerandoImagem(true);
      setProgresso(0);

      try {
        const qualidadeAdaptativa = detectarQualidadeAdaptativa();
        const scale = opcoes?.scale ?? COMPARTILHAR_CONFIG.SCALE_DOWNLOAD;
        const qualidade = opcoes?.qualidade ?? qualidadeAdaptativa.qualidade;
        
        if (!resultadoRef.current) {
          throw new CompartilharError(
            "Elemento de resultado não encontrado",
            "ELEMENTO_NAO_ENCONTRADO"
          );
        }
        
        // Validar elemento
        const validacao = validarElemento(resultadoRef.current, {
          verificarTamanhoMinimo: true,
          verificarConteudo: true,
        });
        
        if (!validacao.valido) {
          throw new CompartilharError(
            `Elemento inválido: ${validacao.erros.join(", ")}`,
            "ELEMENTO_NAO_ENCONTRADO"
          );
        }
        
        const restaurar = otimizarParaCaptura(resultadoRef.current);
        
        setProgresso(30);
        
        const canvas = await html2canvas(resultadoRef.current, {
          backgroundColor: opcoes?.backgroundColor ?? COMPARTILHAR_CONFIG.BACKGROUND_COLOR,
          scale,
          useCORS: true,
          logging: false,
        });
        
        setProgresso(70);
        
        // ✅ MELHORIA: Usar toBlob para melhor qualidade
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/png", qualidade);
        });
        
        if (!blob) {
          throw new CompartilharError("Falha ao gerar blob da imagem", "BLOB_VAZIO");
        }
        
        setProgresso(90);
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `prf-resultado-${new Date().toISOString().split("T")[0]}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setProgresso(100);
        
        opcoes?.onSuccess?.("download");
        
        const mensagemSucesso = feedback?.sucessoDownload ?? 
          "✅ Imagem salva! Verifique sua pasta de downloads.";
        alert(mensagemSucesso);
        
        // Registrar métrica
        registrarMetrica({
          timestamp: new Date(),
          tipo: "download",
          sucesso: true,
          tempoExecucaoMs: 0,
          tamanhoBytes: blob.size,
        });
        
      } catch (error) {
        console.error("Erro ao salvar imagem:", error);
        
        const mensagemErro = feedback?.erro ?? 
          "❌ Erro ao salvar imagem. Tente novamente.";
        setErro(error instanceof Error ? error.message : mensagemErro);
        alert(mensagemErro);
        
        opcoes?.onError?.(error instanceof Error ? error : new Error(String(error)));
        
        // Registrar métrica de erro
        registrarMetrica({
          timestamp: new Date(),
          tipo: "download",
          sucesso: false,
          tempoExecucaoMs: 0,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
        });
        
      } finally {
        setGerandoImagem(false);
        setProgresso(0);
        setTimeout(() => setErro(null), 5000);
      }
    },
    []
  );

  // ✅ MELHORIA: Compartilhar via Web Share API (dispositivos móveis)
  const compartilharViaWebShare = useCallback(async () => {
    if (!navigator.share) {
      alert("Web Share API não suportada neste navegador");
      return false;
    }
    
    setGerandoImagem(true);
    
    try {
      const imagem = await gerarImagem({ scale: 1.5 });
      const file = new File([imagem], `prf-resultado-${new Date().toISOString().split("T")[0]}.png`, {
        type: "image/png",
      });
      
      await navigator.share({
        title: "Resultado Simulado PRF",
        text: "Veja meu desempenho no simulado da PRF!",
        files: [file],
      });
      
      return true;
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Erro ao compartilhar:", error);
        alert("Não foi possível compartilhar. Tente salvar a imagem.");
      }
      return false;
    } finally {
      setGerandoImagem(false);
    }
  }, [gerarImagem]);

  // ✅ MELHORIA: Copiar texto do resultado (sem imagem)
  const copiarTextoResultado = useCallback(async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      alert("✅ Texto copiado para a área de transferência!");
      return true;
    } catch (error) {
      console.error("Erro ao copiar texto:", error);
      alert("❌ Não foi possível copiar o texto.");
      return false;
    }
  }, []);

  // ✅ MELHORIA: Limpeza ao desmontar
  const cleanup = useCallback(() => {
    limparEstado();
  }, [limparEstado]);

  return {
    resultadoRef,
    gerandoImagem,
    progresso,
    erro,
    compartilharResultado,
    salvarImagem,
    compartilharViaWebShare,
    copiarTextoResultado,
    cleanup,
    // ✅ Funcionalidades extras
    validarElemento: () => resultadoRef.current ? validarElemento(resultadoRef.current) : null,
    obterMetricas,
    calcularTaxaSucesso,
  };
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE DE FEEDBACK OPCIONAL
// ═══════════════════════════════════════════════════════════

export interface FeedbackCompartilharProps {
gerandoImagem: boolean;
progresso: number;
erro: string | null;
onCompartilhar: () => void;
onSalvar: () => void;
onCompartilharWeb?: () => void;
}

export function FeedbackCompartilhar({
gerandoImagem,
progresso,
erro,
onCompartilhar,
onSalvar,
onCompartilharWeb,
}: FeedbackCompartilharProps) {
const suporteWebShare =
typeof navigator !== "undefined" && !!navigator.share;

return React.createElement(
"div",
{
className:
"fixed bottom-4 right-4 z-50 flex flex-col gap-2",
},

// Loading
gerandoImagem
  ? React.createElement(
      "div",
      {
        className:
          "bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 min-w-[200px]",
      },

      React.createElement(
        "div",
        {
          className: "text-sm text-slate-300 mb-2",
        },

        progresso < 30
          ? "📸 Preparando..."
          : progresso < 70
          ? "🎨 Renderizando..."
          : progresso < 100
          ? "💾 Processando..."
          : "✅ Finalizado!"
      ),

      React.createElement(
        "div",
        {
          className:
            "w-full bg-slate-700 rounded-full h-2 overflow-hidden",
        },

        React.createElement("div", {
          className:
            "bg-emerald-500 h-full transition-all duration-300 ease-out",
          style: {
            width: `${progresso}%`,
          },
        })
      ),

      React.createElement(
        "div",
        {
          className:
            "text-xs text-slate-500 mt-1 text-right",
        },
        `${Math.round(progresso)}%`
      )
    )
  : null,

// Error
erro
  ? React.createElement(
      "div",
      {
        className:
          "bg-red-900/90 border border-red-700 rounded-lg p-3 text-sm text-red-200 max-w-[280px]",
      },
      `⚠️ ${erro}`
    )
  : null,

// Buttons Container
React.createElement(
  "div",
  {
    className: "flex gap-2",
  },

  // Copiar
  React.createElement(
    "button",
    {
      onClick: onCompartilhar,
      disabled: gerandoImagem,
      className:
        "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg",
    },
    "📋 Copiar Imagem"
  ),

  // Salvar
  React.createElement(
    "button",
    {
      onClick: onSalvar,
      disabled: gerandoImagem,
      className:
        "bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg",
    },
    "💾 Salvar Imagem"
  ),

  // Compartilhar Web
  suporteWebShare && onCompartilharWeb
    ? React.createElement(
        "button",
        {
          onClick: onCompartilharWeb,
          disabled: gerandoImagem,
          className:
            "bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg",
        },
        "📤 Compartilhar"
      )
    : null
)
);
}