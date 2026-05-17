// src/utils/youtubeUtils.ts
// Utilitários centralizados para YouTube

export type YouTubeThumbnailQuality = "default" | "mq" | "hq" | "sd" | "maxres";

/**
 * Extrai o ID do vídeo do YouTube a partir de diferentes formatos de URL
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^#&?]{11})/,
    /youtube\.com\/embed\/([^#&?]{11})/,
    /youtube\.com\/v\/([^#&?]{11})/,
    /youtube\.com\/shorts\/([^#&?]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1] && match[1].length === 11) {
      return match[1];
    }
  }

  return null;
}

/**
 * Gera URL da thumbnail do YouTube
 */
export function getYouTubeThumbnail(
  url: string,
  quality: YouTubeThumbnailQuality = "mq",
): string {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    console.warn(`[YouTube] Invalid URL: ${url}`);
    return "/images/video-placeholder.svg";
  }

  const qualities: Record<YouTubeThumbnailQuality, string> = {
    default: "default.jpg", // 120x90
    mq: "mqdefault.jpg", // 320x180
    hq: "hqdefault.jpg", // 480x360
    sd: "sddefault.jpg", // 640x480
    maxres: "maxresdefault.jpg", // 1920x1080
  };

  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}`;
}

/**
 * Retorna todas as opções de thumbnail disponíveis
 */
export function getAllYouTubeThumbnails(
  url: string,
): Record<YouTubeThumbnailQuality, string> | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

/**
 * Verifica se uma thumbnail existe (útil para fallback)
 */
export async function checkThumbnailExists(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

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
 * Tenta encontrar a melhor thumbnail disponível
 */
export async function getBestYouTubeThumbnail(url: string): Promise<string> {
  const thumbnails = getAllYouTubeThumbnails(url);
  if (!thumbnails) return "/images/video-placeholder.svg";

  // Tenta do maior pro menor
  const qualities: YouTubeThumbnailQuality[] = [
    "maxres",
    "sd",
    "hq",
    "mq",
    "default",
  ];

  for (const quality of qualities) {
    const exists = await checkThumbnailExists(thumbnails[quality]);
    if (exists) return thumbnails[quality];
  }

  return thumbnails.mq; // Fallback padrão
}

/**
 * Valida se uma URL é do YouTube
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
