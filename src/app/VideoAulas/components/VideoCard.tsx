// src/app/VideoAulas/components/VideoCard.tsx

"use client";

import { Video } from "@/data/videoaulas/videoAulasData";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, Film, Play, Star } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface VideoCardProps {
  video: Video;
  isAssistido: boolean;
  isFavorito: boolean;
  /** Progresso de 0 a 1 (ex: 0.45 = 45% assistido). Opcional. */
  progressoAssistido?: number;
  onToggleFavorito: () => void;
  onClick: () => void;
}

// ─── Utilitários ────────────────────────────────────────────────────────────

function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;

  // Formato: "1h30min" ou "1h30"
  const hMin = duration.match(/(\d+)h\s*(\d*)(?:min)?/);
  if (hMin) {
    const hours = parseInt(hMin[1]);
    const minutes = parseInt(hMin[2] || "0");
    return hours * 60 + minutes;
  }

  // Formato: "45min" ou "45 min"
  const minOnly = duration.match(/^(\d+)\s*min$/i);
  if (minOnly) return parseInt(minOnly[1]);

  // Formato: "HH:MM:SS" ou "MM:SS"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0] + parts[1] / 60;

  // Fallback: tenta converter diretamente
  const num = parseInt(duration);
  return isNaN(num) ? 0 : num;
}

function formatTempoRestante(minutos: number): string {
  if (minutos <= 0) return "";
  if (minutos < 60) return `~${Math.round(minutos)} min`;
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  return m > 0 ? `~${h}h ${m}min` : `~${h}h`;
}

// Throttle simples baseado em requestAnimationFrame
function useThrottledCallback<T extends (...args: never[]) => void>(
  fn: T,
  deps: React.DependencyList,
): T {
  const rafRef = useRef<number | null>(null);
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useCallback((...args: Parameters<T>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      fnRef.current(...args);
      rafRef.current = null;
    });
  }, []) as T;
}

// ─── Componente ─────────────────────────────────────────────────────────────

function VideoCardBase({
  video,
  isAssistido,
  isFavorito,
  progressoAssistido,
  onToggleFavorito,
  onClick,
}: VideoCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [favPressed, setFavPressed] = useState(false);

  // ── Refs ──
  const cardRef = useRef<HTMLDivElement>(null);
  const quickViewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // CORRIGIDO: usar 'duracao' em vez de 'duration'
  const thumbnailUrl = getYouTubeThumbnail(video.url, "mq");
  const minutosRestantes = parseDurationToMinutes(video.duracao);
  const tempoRestante = !isAssistido
    ? formatTempoRestante(minutosRestantes)
    : "";

  const progressoPct =
    progressoAssistido != null
      ? Math.min(Math.max(progressoAssistido * 100, 0), 100)
      : isAssistido
        ? 100
        : 0;

  // ── Limpa timeout no unmount ──
  useEffect(() => {
    return () => {
      if (quickViewTimeout.current) clearTimeout(quickViewTimeout.current);
    };
  }, []);

  // ── MouseMove com throttle por rAF ──
  const handleMouseMove = useThrottledCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!innerRef.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) * 8;
      innerRef.current.style.setProperty("--rx", `${rx}deg`);
      innerRef.current.style.setProperty("--ry", `${ry}deg`);
    },
    [],
  );

  const handleMouseLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.setProperty("--rx", "0deg");
      innerRef.current.style.setProperty("--ry", "0deg");
    }
    setIsHovered(false);
    quickViewTimeout.current = setTimeout(() => setShowQuickView(false), 120);
  };

  const handleMouseEnter = () => {
    if (quickViewTimeout.current) clearTimeout(quickViewTimeout.current);
    setIsHovered(true);
  };

  const openQuickView = () => {
    if (quickViewTimeout.current) clearTimeout(quickViewTimeout.current);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    quickViewTimeout.current = setTimeout(() => setShowQuickView(false), 120);
  };

  const handleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavPressed(true);
    onToggleFavorito();
    setTimeout(() => setFavPressed(false), 400);
  };

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isAssistido
          ? "ring-1 ring-emerald-500/30"
          : "ring-1 ring-white/10 hover:ring-blue-500/50"
      }`}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      role="button"
      tabIndex={0}
      // CORRIGIDO: usar 'titulo' em vez de 'title'
      aria-label={`Assistir: ${video.titulo}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
        if (e.key === "f" || e.key === "F") {
          e.preventDefault();
          setFavPressed(true);
          onToggleFavorito();
          setTimeout(() => setFavPressed(false), 400);
        }
      }}
    >
      <motion.div
        ref={innerRef}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1, y: isHovered ? -5 : 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 300, damping: 22 },
          y: { type: "spring", stiffness: 300, damping: 22 },
        }}
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transformStyle: "preserve-3d",
          transition: isHovered
            ? "transform 0.08s ease-out"
            : "transform 0.3s ease-out",
        }}
      >
        {/* Frosted Glass base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm z-0" />

        {/* ── Thumbnail ── */}
        <div className="relative aspect-video overflow-hidden bg-slate-800">
          <AnimatePresence>
            {!imgLoaded && !imgError && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10"
                aria-hidden="true"
              >
                <div className="w-full h-full bg-slate-700 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "150%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 gap-2">
              <Film className="w-8 h-8 text-slate-600" aria-hidden="true" />
              <span className="text-xs text-slate-600">Sem prévia</span>
            </div>
          ) : (
            <img
              src={thumbnailUrl}
              alt=""
              aria-hidden="true"
              draggable={false}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setImgLoaded(true);
              }}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors pointer-events-none" />

          {/* CORRIGIDO: usar 'duracao' em vez de 'duration' */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-xs text-white pointer-events-none tabular-nums">
            {video.duracao}
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAssistido && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-xs flex items-center gap-1 pointer-events-none">
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              Assistido
            </div>
          )}

          {progressoPct > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 pointer-events-none">
              <motion.div
                initial={false}
                animate={{ width: `${progressoPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-r-full ${
                  progressoPct >= 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
              />
            </div>
          )}
        </div>

        {/* ── Conteúdo ── */}
        <div className="relative z-10 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* CORRIGIDO: usar 'titulo' em vez de 'title' */}
              <h4
                className={`font-semibold text-sm line-clamp-2 transition-colors ${
                  isAssistido
                    ? "text-slate-400"
                    : "text-slate-200 group-hover:text-blue-400"
                }`}
              >
                {video.titulo}
              </h4>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {/* CORRIGIDO: usar 'descricao' em vez de 'description' */}
                {video.descricao && (
                  <p className="text-xs text-slate-500 line-clamp-1 flex-1 min-w-0">
                    {video.descricao}
                  </p>
                )}
                {tempoRestante && (
                  <span className="text-[10px] text-slate-600 shrink-0 tabular-nums">
                    {tempoRestante}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleFavorito}
              animate={
                favPressed ? { scale: [1, 1.5, 0.9, 1.15, 1] } : { scale: 1 }
              }
              transition={
                favPressed
                  ? { duration: 0.35, times: [0, 0.3, 0.5, 0.75, 1] }
                  : { duration: 0.15 }
              }
              aria-label={
                isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              aria-pressed={isFavorito}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  isFavorito
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-500"
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* ── Quick View (overlay) ── */}
        <AnimatePresence>
          {showQuickView && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-30 p-4 bg-slate-900/95 backdrop-blur-md rounded-xl flex flex-col justify-between"
              onMouseEnter={openQuickView}
              onMouseLeave={closeQuickView}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* CORRIGIDO: usar 'titulo' em vez de 'title' */}
                <p className="text-xs font-semibold text-slate-300 line-clamp-2 mb-2">
                  {video.titulo}
                </p>
                {/* CORRIGIDO: usar 'descricao' em vez de 'description' */}
                <p className="text-xs text-slate-400 line-clamp-4">
                  {video.descricao || "Sem descrição disponível."}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-500 tabular-nums">
                  {/* CORRIGIDO: usar 'duracao' em vez de 'duration' */}
                  ⏱️ {video.duracao}
                  {tempoRestante && (
                    <span className="ml-1 text-slate-600">
                      ({tempoRestante})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition-colors"
                >
                  Assistir agora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador "Prévia rápida" */}
        <AnimatePresence>
          {isHovered && !showQuickView && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] flex items-center gap-1 whitespace-nowrap cursor-default"
              onMouseEnter={openQuickView}
            >
              <Eye className="w-2.5 h-2.5" aria-hidden="true" />
              Prévia rápida
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── React.memo ────────────────────────────────────────────────────────────
export const VideoCard = memo(VideoCardBase, (prev, next) => {
  return (
    prev.video.id === next.video.id &&
    prev.isAssistido === next.isAssistido &&
    prev.isFavorito === next.isFavorito &&
    prev.progressoAssistido === next.progressoAssistido
  );
});

VideoCard.displayName = "VideoCard";
