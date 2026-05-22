// src/app/VideoAulas/components/CategoriaSection.tsx

"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { categoriasVideo, Video } from "@/data/videoaulas/videoAulasData";
import { useFavoritos } from "@/hooks/useFavoritos";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GraficoProgresso } from "./GraficoProgresso";
import { OrdenacaoFiltros, OrdenacaoType } from "./OrdenacaoFiltros";
import { VideoCard } from "./VideoCard";

// ============================================================
// TIPOS CORRIGIDOS
// ============================================================

type Categoria = (typeof categoriasVideo)[0];

interface CategoriaSectionProps {
  categoria: Categoria;
  categoriaIndex: number;
  defaultOpen?: boolean;
  videosAssistidos: Set<string>;
  onVideoClick: (videoId: string) => void;
  onCompleteCategoria: (categoriaNome: string) => void;
  ordenacaoGlobal: OrdenacaoType;
  searchTermGlobal: string;
  viewMode: "grid" | "list";
}

// ============================================================
// CONSTANTES E UTILITÁRIOS
// ============================================================

const gradientesPorMateria: Record<string, string> = {
  "Língua Portuguesa": "from-emerald-900/40 via-emerald-800/20 to-green-900/30",
  "Ética no Serviço Público":
    "from-yellow-900/40 via-yellow-800/20 to-amber-900/30",
  "Raciocínio Lógico-Matemático":
    "from-purple-900/40 via-purple-800/20 to-pink-900/30",
  "Direito Constitucional":
    "from-indigo-900/40 via-indigo-800/20 to-purple-900/30",
  "Direito Administrativo": "from-slate-800/60 via-slate-800/30 to-gray-800/40",
  Administração: "from-teal-900/40 via-teal-800/20 to-emerald-900/30",
  Arquivologia: "from-rose-900/40 via-rose-800/20 to-pink-900/30",
  Informática: "from-cyan-900/40 via-cyan-800/20 to-blue-900/30",
  "Legislação PRF": "from-red-900/40 via-red-800/20 to-orange-900/30",
};

const iconesAnimados: Record<string, string[]> = {
  "Língua Portuguesa": ["📖", "📚", "✍️", "🔤", "📝"],
  "Ética no Serviço Público": ["✨", "⭐", "🌟", "💫", "🕊️"],
  "Raciocínio Lógico-Matemático": ["🧠", "🔢", "📐", "🎲", "🧮"],
  "Direito Constitucional": ["⚖️", "📜", "🏛️", "📋", "🔏"],
  "Direito Administrativo": ["🏛️", "📋", "⚙️", "📊", "🔧"],
  Administração: ["📊", "📈", "📉", "🎯", "💼"],
  Arquivologia: ["📂", "📁", "🗂️", "📑", "🔖"],
  Informática: ["💻", "🖥️", "⌨️", "🖱️", "💾"],
  "Legislação PRF": ["🚗", "🚦", "🚓", "🛣️", "🚔"],
};

const coresBorda: Record<string, string> = {
  "Língua Portuguesa": "emerald-500",
  "Ética no Serviço Público": "yellow-500",
  "Raciocínio Lógico-Matemático": "purple-500",
  "Direito Constitucional": "indigo-500",
  "Direito Administrativo": "slate-500",
  Administração: "teal-500",
  Arquivologia: "rose-500",
  Informática: "cyan-500",
  "Legislação PRF": "red-500",
};

function durationToSeconds(duration: string): number {
  if (!duration) return 0;
  const hMatch = duration.match(/(\d+)h\s*(?:(\d+)(?:min)?)?/);
  if (hMatch) {
    const hours = parseInt(hMatch[1]);
    const minutes = parseInt(hMatch[2] || "0");
    return hours * 3600 + minutes * 60;
  }
  const minMatch = duration.match(/^(\d+)min$/);
  if (minMatch) return parseInt(minMatch[1]) * 60;
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parseInt(duration) || 0;
}

function formatTempoRestante(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas > 0) return `${horas}h ${minutos}min`;
  return `${minutos}min`;
}

// ============================================================
// COMPONENTE DE PROGRESSO CIRCULAR
// ============================================================

function CircularProgress({
  percent,
  gradientId,
}: {
  percent: number;
  gradientId: string;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative w-12 h-12">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#334155"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-300 tabular-nums">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function CategoriaSection({
  categoria,
  categoriaIndex,
  defaultOpen = true,
  videosAssistidos,
  onVideoClick,
  onCompleteCategoria,
  ordenacaoGlobal,
  searchTermGlobal,
  viewMode,
}: CategoriaSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [ordenacao, setOrdenacao] = useState<OrdenacaoType>(ordenacaoGlobal);
  const [searchTerm, setSearchTerm] = useState(searchTermGlobal);
  const [iconeIndex, setIconeIndex] = useState(0);
  const [showChainEffect, setShowChainEffect] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const completaDisparadaRef = useRef(false);
  const { isFavorito, toggleFavorito } = useFavoritos();

  const gradientId = useMemo(
    () => `grad${categoria.nome.replace(/[^a-zA-Z0-9]/g, "")}${categoriaIndex}`,
    [categoria.nome, categoriaIndex],
  );

  const corBorda = coresBorda[categoria.nome] ?? "blue-500";

  useEffect(() => setOrdenacao(ordenacaoGlobal), [ordenacaoGlobal]);
  useEffect(() => setSearchTerm(searchTermGlobal), [searchTermGlobal]);

  const totalVideos = categoria.videos.length;
  const assistidosCount = useMemo(
    () =>
      categoria.videos.filter((v: Video) => videosAssistidos.has(v.id)).length,
    [categoria.videos, videosAssistidos],
  );
  const progressPercent =
    totalVideos > 0 ? (assistidosCount / totalVideos) * 100 : 0;
  const isCompleta = assistidosCount === totalVideos && totalVideos > 0;

  const tempoRestanteSegundos = useMemo(
    () =>
      categoria.videos
        .filter((v: Video) => !videosAssistidos.has(v.id))
        .reduce(
          (acc: number, v: Video) => acc + durationToSeconds(v.duracao),
          0,
        ),
    [categoria.videos, videosAssistidos],
  );

  useEffect(() => {
    if (!isOpen) return;
    const icons = iconesAnimados[categoria.nome];
    if (!icons || icons.length <= 1) return;
    const id = setInterval(
      () => setIconeIndex((p) => (p + 1) % icons.length),
      3000,
    );
    return () => clearInterval(id);
  }, [categoria.nome, isOpen]);

  useEffect(() => {
    if (isCompleta && !completaDisparadaRef.current) {
      completaDisparadaRef.current = true;
      setShowChainEffect(true);
      onCompleteCategoria(categoria.nome);
      const t = setTimeout(() => setShowChainEffect(false), 3000);
      return () => clearTimeout(t);
    }
    if (!isCompleta) completaDisparadaRef.current = false;
  }, [isCompleta, categoria.nome, onCompleteCategoria]);

  const videosOrdenados = useMemo(() => {
    let videos = [...categoria.videos];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      videos = videos.filter(
        (v: Video) =>
          v.titulo.toLowerCase().includes(term) ||
          v.descricao?.toLowerCase().includes(term),
      );
    }
    switch (ordenacao) {
      case "nao-assistidos":
        videos.sort(
          (a, b) =>
            Number(videosAssistidos.has(a.id)) -
            Number(videosAssistidos.has(b.id)),
        );
        break;
      case "assistidos":
        videos.sort(
          (a, b) =>
            Number(videosAssistidos.has(b.id)) -
            Number(videosAssistidos.has(a.id)),
        );
        break;
      case "favoritos":
        videos.sort(
          (a, b) => Number(isFavorito(b.id)) - Number(isFavorito(a.id)),
        );
        break;
      case "mais-longos":
        videos.sort(
          (a, b) => durationToSeconds(b.duracao) - durationToSeconds(a.duracao),
        );
        break;
      case "mais-curtos":
        videos.sort(
          (a, b) => durationToSeconds(a.duracao) - durationToSeconds(b.duracao),
        );
        break;
      default:
        break;
    }
    return videos;
  }, [categoria.videos, ordenacao, searchTerm, videosAssistidos, isFavorito]);

  const gradiente =
    gradientesPorMateria[categoria.nome] ?? "from-slate-800/50 to-slate-900/30";
  const iconeAnimado =
    iconesAnimados[categoria.nome]?.[iconeIndex] ?? categoria.icone;
  const semResultados =
    searchTerm.trim() !== "" && videosOrdenados.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(categoriaIndex * 0.08, 0.4),
        duration: 0.4,
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efeito de glow na borda */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-${corBorda}/30 to-${corBorda}/20 rounded-2xl blur-xl transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <AnimatePresence>
        {showChainEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -10 }}
            transition={{ type: "spring", damping: 18, stiffness: 300 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/30 whitespace-nowrap">
              <Sparkles className="w-4 h-4 animate-pulse" />
              🎉 Categoria Concluída! 🎉
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard
        className={`overflow-hidden bg-gradient-to-br ${gradiente} border border-white/10 transition-all duration-300 ${
          isHovered ? `shadow-xl shadow-${corBorda}/10` : ""
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={`cat-${gradientId}`}
          className="w-full text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <div className="p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                <motion.span
                  key={iconeAnimado}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-3xl shrink-0 cursor-pointer"
                >
                  {iconeAnimado}
                </motion.span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-200 truncate">
                    {categoria.nome}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {totalVideos} vídeos
                    </span>
                    {isCompleta ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center gap-1 animate-pulse">
                        <CheckCircle className="w-3 h-3" />
                        100% Completo
                      </span>
                    ) : tempoRestanteSegundos > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTempoRestante(tempoRestanteSegundos)} restantes
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:block">
                  <CircularProgress
                    percent={progressPercent}
                    gradientId={gradientId}
                  />
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </div>
            </div>

            {totalVideos > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Progresso
                  </span>
                  <motion.span
                    key={assistidosCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="font-mono font-medium text-slate-300"
                  >
                    {assistidosCount}/{totalVideos}
                  </motion.span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className={`h-full rounded-full relative ${
                      progressPercent === 100
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`cat-${gradientId}`}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="p-5 space-y-5">
                <GraficoProgresso
                  videos={categoria.videos}
                  videosAssistidos={videosAssistidos}
                  categoriaNome={categoria.nome}
                />

                <OrdenacaoFiltros
                  ordenacao={ordenacao}
                  onOrdenacaoChange={setOrdenacao}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />

                {semResultados ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-slate-400">
                      Nenhum vídeo encontrado para &quot;{searchTerm}&quot;
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "flex flex-col gap-3"
                    }
                  >
                    {videosOrdenados.map((video: Video, idx: number) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                      >
                        <VideoCard
                          video={video}
                          isAssistido={videosAssistidos.has(video.id)}
                          isFavorito={isFavorito(video.id)}
                          onToggleFavorito={() => toggleFavorito(video.id)}
                          onClick={() => onVideoClick(video.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
