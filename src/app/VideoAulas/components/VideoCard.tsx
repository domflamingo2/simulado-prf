// src/app/VideoAulas/components/VideoCard.tsx

"use client";

import { Video } from "@/data/videoaulas/videoAulasData";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Eye,
  Film,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
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
  progressoAssistido?: number;
  onToggleFavorito: () => void;
  onClick: () => void;
}

function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;
  const hMin = duration.match(/(\d+)h\s*(\d*)(?:min)?/);
  if (hMin) {
    const hours = parseInt(hMin[1]);
    const minutes = parseInt(hMin[2] || "0");
    return hours * 60 + minutes;
  }
  const minOnly = duration.match(/^(\d+)\s*min$/i);
  if (minOnly) return parseInt(minOnly[1]);
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1];
  if (parts.length === 2) return parts[0] + parts[1] / 60;
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

function useThrottledCallback<T extends (...args: never[]) => void>(
  fn: T,
  deps: React.DependencyList,
): T {
  const rafRef = useRef<number | null>(null);
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  }, deps);
  return useCallback((...args: Parameters<T>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      fnRef.current(...args);
      rafRef.current = null;
    });
  }, []) as T;
}

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

  const cardRef = useRef<HTMLDivElement>(null);
  const quickViewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    return () => {
      if (quickViewTimeout.current) clearTimeout(quickViewTimeout.current);
    };
  }, []);

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
          ? "ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : "ring-1 ring-white/10 hover:ring-blue-500/50"
      }`}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      role="button"
      tabIndex={0}
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: isHovered ? -6 : 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm z-0" />

        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-800">
          <AnimatePresence>
            {!imgLoaded && !imgError && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-10"
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
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
              <Film className="w-8 h-8 text-slate-600" />
              <span className="text-xs text-slate-600">Sem prévia</span>
            </div>
          ) : (
            <img
              src={thumbnailUrl ?? undefined}
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
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-xs text-white pointer-events-none tabular-nums shadow-md">
            ⏱️ {video.duracao}
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
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAssistido && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] flex items-center gap-1.5 pointer-events-none shadow-md">
              <CheckCircle className="w-3 h-3" />
              Assistido
            </div>
          )}

          {progressoPct > 0 && progressoPct < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 pointer-events-none">
              <motion.div
                initial={false}
                animate={{ width: `${progressoPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
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
                {video.descricao && (
                  <p className="text-xs text-slate-500 line-clamp-1 flex-1 min-w-0">
                    {video.descricao}
                  </p>
                )}
                {tempoRestante && (
                  <span className="text-[10px] text-slate-500 shrink-0 tabular-nums flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {tempoRestante}
                  </span>
                )}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleFavorito}
              animate={
                favPressed ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }
              }
              transition={favPressed ? { duration: 0.35 } : { duration: 0.15 }}
              aria-label={
                isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              aria-pressed={isFavorito}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <Star
                className={`w-4 h-4 transition-all duration-200 ${
                  isFavorito
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                    : "text-slate-500 group-hover:text-yellow-400"
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Quick View */}
        <AnimatePresence>
          {showQuickView && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-30 p-4 bg-slate-900/95 backdrop-blur-md rounded-xl flex flex-col justify-between"
              onMouseEnter={openQuickView}
              onMouseLeave={closeQuickView}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white line-clamp-2 flex-1">
                    {video.titulo}
                  </p>
                  {isFavorito && (
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {video.descricao || "Sem descrição disponível."}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 tabular-nums flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duracao}
                  </span>
                  {tempoRestante && (
                    <span className="text-[10px] text-emerald-400">
                      ({tempoRestante} restantes)
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-md"
                >
                  Assistir agora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prévia rápida */}
        <AnimatePresence>
          {isHovered && !showQuickView && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-white text-[10px] flex items-center gap-1.5 whitespace-nowrap cursor-default shadow-md"
              onMouseEnter={openQuickView}
            >
              <Eye className="w-2.5 h-2.5" />
              Prévia rápida
              <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export const VideoCard = memo(VideoCardBase, (prev, next) => {
  return (
    prev.video.id === next.video.id &&
    prev.isAssistido === next.isAssistido &&
    prev.isFavorito === next.isFavorito &&
    prev.progressoAssistido === next.progressoAssistido
  );
});

VideoCard.displayName = "VideoCard";
