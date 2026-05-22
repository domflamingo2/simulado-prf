// src/utils/youtubeUtils.ts
// Utilitários centralizados para YouTube

export type YouTubeThumbnailQuality = "default" | "mq" | "hq" | "sd" | "maxres";

// Dimensões de referência por qualidade
const QUALITY_FILENAMES: Record<YouTubeThumbnailQuality, string> = {
  default: "default.jpg", // 120×90
  mq: "mqdefault.jpg", // 320×180
  hq: "hqdefault.jpg", // 480×360
  sd: "sddefault.jpg", // 640×480
  maxres: "maxresdefault.jpg", // 1920×1080
};

const THUMBNAIL_BASE = "https://img.youtube.com/vi";
const FALLBACK_IMAGE = "/images/video-placeholder.svg";

// ─── Extração de ID ───────────────────────────────────────────────────────────

/**
 * Extrai o ID do vídeo (11 chars) a partir de diferentes formatos de URL do YouTube.
 * Retorna `null` se a URL for inválida ou não reconhecida.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([^#&?]{11})/, // FIX: suporta v= no meio de query string
    /youtu\.be\/([^#&?]{11})/,
    /youtube\.com\/embed\/([^#&?]{11})/,
    /youtube\.com\/v\/([^#&?]{11})/,
    /youtube\.com\/shorts\/([^#&?]{11})/,
    /youtube\.com\/live\/([^#&?]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]?.length === 11) return match[1];
  }

  return null;
}

// ─── Thumbnails síncronas ─────────────────────────────────────────────────────

/**
 * Gera a URL de thumbnail para um ID de vídeo conhecido.
 * Use quando você já tem o `videoId`; evita repetir a extração.
 */
export function getThumbnailById(
  videoId: string,
  quality: YouTubeThumbnailQuality = "mq",
): string {
  return `${THUMBNAIL_BASE}/${videoId}/${QUALITY_FILENAMES[quality]}`;
}

/**
 * Gera a URL de thumbnail a partir de uma URL do YouTube.
 * Retorna `null` se a URL for inválida (em vez de gerar `…/vi/null/…`).
 *
 * FIX: versão anterior retornava URL quebrada quando extractYouTubeId === null.
 */
export function getYouTubeThumbnail(
  url: string,
  quality: YouTubeThumbnailQuality = "mq",
): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return getThumbnailById(videoId, quality);
}

/**
 * Retorna todas as qualidades de thumbnail para uma URL.
 * Retorna `null` se a URL for inválida.
 */
export function getAllYouTubeThumbnails(
  url: string,
): Record<YouTubeThumbnailQuality, string> | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return (Object.keys(QUALITY_FILENAMES) as YouTubeThumbnailQuality[]).reduce(
    (acc, quality) => {
      acc[quality] = getThumbnailById(videoId, quality);
      return acc;
    },
    {} as Record<YouTubeThumbnailQuality, string>,
  );
}

// ─── Thumbnails assíncronas ───────────────────────────────────────────────────

/**
 * Verifica se uma thumbnail existe via requisição HEAD.
 *
 * FIX: a versão anterior falha com CORS em ambientes de browser porque
 * img.youtube.com não retorna cabeçalhos CORS para requisições HEAD.
 * A estratégia correta é tentar carregar como <img> (modo "no-cors").
 * Em ambientes Node/SSR, usa fetch com HEAD normalmente.
 */
export async function checkThumbnailExists(url: string): Promise<boolean> {
  // Ambiente browser: usa HTMLImageElement (imune a CORS)
  if (typeof window !== "undefined" && typeof Image !== "undefined") {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onload = img.onerror = null;
        resolve(false);
      }, 4000);

      img.onload = () => {
        clearTimeout(timeout);
        // YouTube serve uma imagem 120×90 cinza para thumbnails inexistentes
        // Detectamos pelo tamanho natural (só disponível após onload)
        const missing = img.naturalWidth === 120 && img.naturalHeight === 90;
        resolve(!missing);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      img.src = url;
    });
  }

  // Ambiente servidor (Next.js SSR / Node)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Tenta encontrar a melhor thumbnail disponível, do maior para o menor.
 * Retorna o fallback local se nenhuma qualidade for encontrada.
 */
export async function getBestYouTubeThumbnail(url: string): Promise<string> {
  const thumbnails = getAllYouTubeThumbnails(url);
  if (!thumbnails) return FALLBACK_IMAGE;

  const order: YouTubeThumbnailQuality[] = [
    "maxres",
    "sd",
    "hq",
    "mq",
    "default",
  ];

  for (const quality of order) {
    const exists = await checkThumbnailExists(thumbnails[quality]);
    if (exists) return thumbnails[quality];
  }

  // Se todas as verificações falharem, mq é a mais segura (sempre presente)
  return thumbnails.mq;
}

// ─── Validação ────────────────────────────────────────────────────────────────

/**
 * Verifica se uma URL pertence ao YouTube e tem um ID válido.
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
