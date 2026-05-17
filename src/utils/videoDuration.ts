// src/utils/videoDuration.ts
// Utilitários centralizados para manipulação de duração

/**
 * Converte string de duração para segundos
 * Suporta formatos:
 * - "52:30" -> 3150 segundos
 * - "1h30min" -> 5400 segundos
 * - "1:30:00" -> 5400 segundos
 * - "90min" -> 5400 segundos
 */
export function durationToSeconds(duration: string): number {
  if (!duration) return 0;

  // Formato: "1h30min" ou "1h 30min"
  const hMatch = duration.match(/(\d+)h\s*(?:(\d+)(?:min)?)?/);
  if (hMatch) {
    const hours = parseInt(hMatch[1]);
    const minutes = parseInt(hMatch[2] || "0");
    return hours * 3600 + minutes * 60;
  }

  // Formato: "90min"
  const minMatch = duration.match(/^(\d+)min$/);
  if (minMatch) return parseInt(minMatch[1]) * 60;

  // Formato: "MM:SS" ou "HH:MM:SS"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  // Fallback: tenta converter diretamente
  const num = parseInt(duration);
  return isNaN(num) ? 0 : num;
}

// ALIAS para compatibilidade com código existente
export const duracaoSegundos = durationToSeconds;

/**
 * Converte segundos para string de duração formatada
 * @param seconds - Total de segundos
 * @param format - Formato de saída: 'full' (1h 30min), 'short' (1:30:00), 'compact' (1h30)
 */
export function secondsToDuration(
  seconds: number,
  format: "full" | "short" | "compact" = "full",
): string {
  if (seconds <= 0) return format === "short" ? "00:00" : "0min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (format === "short") {
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  if (format === "compact") {
    if (hours > 0) return `${hours}h${minutes > 0 ? minutes : ""}`;
    return `${minutes}min`;
  }

  // Formato full (padrão)
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes}min${secs > 0 ? ` ${secs}s` : ""}`;
}

/**
 * Soma durações de múltiplos vídeos
 */
export function sumDurations(
  videos: { duracaoSegundos?: number; duracao?: string }[],
): number {
  return videos.reduce((total, video) => {
    if (video.duracaoSegundos) return total + video.duracaoSegundos;
    if (video.duracao) return total + duracaoSegundos(video.duracao);
    return total;
  }, 0);
}

/**
 * Formata duração total a partir de uma lista de vídeos
 */
export function formatTotalDuration(
  videos: { duracaoSegundos?: number; duracao?: string }[],
): string {
  const total = sumDurations(videos);
  return secondsToDuration(total);
}
