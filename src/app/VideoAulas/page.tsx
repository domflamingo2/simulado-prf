// src/app/VideoAulas/page.tsx

"use client";

import Footer from "@/components/layout/Footer";
import { NIVEIS } from "@/data/questoes/index";
import { categoriasVideo, Video } from "@/data/videoaulas/videoAulasData";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { AnimatePresence, motion } from "framer-motion";
import {
  Grid,
  History,
  List,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HeaderDashboard } from "../dashboard/components/HeaderDashboard";
import { CategoriaSection } from "./components/CategoriaSection";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { OrdenacaoFiltros, OrdenacaoType } from "./components/OrdenacaoFiltros";
import { VideoPlayerPro } from "./components/VideoPlayer";

const videosMap = new Map<string, Video>();
categoriasVideo.forEach((cat) =>
  cat.videos.forEach((v: Video) => videosMap.set(v.id, v)),
);

const totalVideos = categoriasVideo.reduce(
  (acc, cat) => acc + cat.videos.length,
  0,
);

export default function VideoAulasPage() {
  const [searchTermGlobal, setSearchTermGlobal] = useState("");
  const [ordenacaoGlobal, setOrdenacaoGlobal] =
    useState<OrdenacaoType>("padrao");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { progress } = useGamificacao();
  const {
    isAssistido,
    marcarAssistido,
    getUltimosAssistidos,
    totalAssistidos,
  } = useVideoProgress();

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, []);

  const nivelAtual =
    NIVEIS.find((n) => n.nivel === (progress?.nivel ?? 1)) ?? NIVEIS[0];

  const videosAssistidosSet = useMemo(() => {
    const set = new Set<string>();
    categoriasVideo.forEach((cat) =>
      cat.videos.forEach((v: Video) => {
        if (isAssistido(v.id)) set.add(v.id);
      }),
    );
    return set;
  }, [isAssistido]);

  const ultimosAssistidosIds = useMemo(
    () => getUltimosAssistidos(5),
    [getUltimosAssistidos],
  );

  const ultimosVideos = useMemo(
    () =>
      ultimosAssistidosIds
        .map((id: string) => videosMap.get(id))
        .filter((v: Video | undefined): v is Video => v !== undefined),
    [ultimosAssistidosIds],
  );

  const categoriasFiltradas = useMemo(() => {
    const term = searchTermGlobal.trim().toLowerCase();
    if (!term) return categoriasVideo;
    return categoriasVideo
      .map((cat) => ({
        ...cat,
        videos: cat.videos.filter(
          (v: Video) =>
            v.titulo.toLowerCase().includes(term) ||
            v.descricao?.toLowerCase().includes(term),
        ),
      }))
      .filter((cat) => cat.videos.length > 0);
  }, [searchTermGlobal]);

  const progressoGlobal =
    totalVideos > 0 ? (totalAssistidos / totalVideos) * 100 : 0;
  const percentual = Math.round(progressoGlobal);
  const faltam = totalVideos - totalAssistidos;

  const handleVideoClick = useCallback((videoId: string) => {
    const video = videosMap.get(videoId);
    if (video) setSelectedVideo(video);
  }, []);

  const handleMarcarAssistido = useCallback(
    (videoId: string) => {
      marcarAssistido(videoId);
    },
    [marcarAssistido],
  );

  const handleCompleteCategoria = useCallback(() => {}, []);

  useEffect(() => {
    if (selectedVideo) {
      document.title = `▶ ${selectedVideo.titulo} — Videoaulas PRF`;
    } else {
      document.title = "Videoaulas PRF 2026";
    }
    return () => {
      document.title = "Videoaulas PRF 2026";
    };
  }, [selectedVideo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <HeaderDashboard
          streakDias={progress?.streakDias ?? 0}
          nivel={progress?.nivel ?? 1}
          nivelNome={nivelAtual?.nome ?? "Iniciante"}
          nivelCor={nivelAtual?.cor ?? "#3b82f6"}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <HeaderDashboard
        streakDias={progress?.streakDias ?? 0}
        nivel={progress?.nivel ?? 1}
        nivelNome={nivelAtual?.nome ?? "Iniciante"}
        nivelCor={nivelAtual?.cor ?? "#3b82f6"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com gradiente */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 blur-xl opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Videoaulas PRF 2026
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {totalAssistidos} de {totalVideos} vídeos assistidos
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                    Material atualizado
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800/60 rounded-xl p-1 gap-1 border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grade"
                  aria-pressed={viewMode === "grid"}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="Lista"
                  aria-pressed={viewMode === "list"}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowHistory((v) => !v)}
                title="Histórico recente"
                aria-pressed={showHistory}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  showHistory
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barra de progresso global com efeito shimmer */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="w-3 h-3 text-blue-400" />
                <span>Progresso geral</span>
              </div>
              <motion.span
                key={percentual}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="font-mono font-semibold text-blue-400"
              >
                {percentual}%
              </motion.span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressoGlobal}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Histórico recente */}
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              key="history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 rounded-lg bg-purple-500/20">
                    <History className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm">
                    Últimos assistidos
                  </h3>
                </div>

                {ultimosVideos.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Nenhum vídeo assistido ainda.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ultimosVideos.map((video: Video) => (
                      <motion.button
                        key={video.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVideoClick(video.id)}
                        className="px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all duration-200"
                        title={video.titulo}
                      >
                        {video.titulo.length > 30
                          ? video.titulo.slice(0, 27) + "..."
                          : video.titulo}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Busca e ordenação */}
        <div className="mb-6">
          <OrdenacaoFiltros
            ordenacao={ordenacaoGlobal}
            onOrdenacaoChange={setOrdenacaoGlobal}
            searchTerm={searchTermGlobal}
            onSearchChange={setSearchTermGlobal}
            placeholder="Buscar em todas as matérias..."
          />
        </div>

        {/* Lista de categorias */}
        <AnimatePresence mode="wait">
          {categoriasFiltradas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-sm">
                Nenhum vídeo encontrado para "{searchTermGlobal}"
              </p>
              <button
                onClick={() => setSearchTermGlobal("")}
                className="mt-3 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-all"
              >
                Limpar busca
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {categoriasFiltradas.map((categoria, idx) => (
                <CategoriaSection
                  key={categoria.nome}
                  categoria={categoria}
                  categoriaIndex={idx}
                  defaultOpen={searchTermGlobal.trim() !== ""}
                  videosAssistidos={videosAssistidosSet}
                  onVideoClick={handleVideoClick}
                  onCompleteCategoria={handleCompleteCategoria}
                  ordenacaoGlobal={ordenacaoGlobal}
                  searchTermGlobal={searchTermGlobal}
                  viewMode={viewMode}
                  onOrdenacaoGlobalChange={setOrdenacaoGlobal}
                  onSearchGlobalChange={setSearchTermGlobal}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensagem motivacional */}
        <AnimatePresence>
          {!searchTermGlobal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">
                  Status da sua jornada
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {faltam === 0 ? (
                  <>
                    🎉 Parabéns! Você completou todas as videoaulas! Continue
                    revisando para fixar o conteúdo! 🎉
                  </>
                ) : (
                  <>
                    🎯 Faltam{" "}
                    <motion.span
                      key={faltam}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="font-bold text-white text-lg"
                    >
                      {faltam}
                    </motion.span>{" "}
                    {faltam === 1 ? "vídeo" : "vídeos"} para concluir todas as
                    matérias! Continue assim! 💪
                  </>
                )}
              </p>
              <div className="mt-3 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Player */}
      <VideoPlayerPro
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onMarcarAssistido={handleMarcarAssistido}
        isAssistido={selectedVideo ? isAssistido(selectedVideo.id) : false}
      />

      <Footer />
    </div>
  );
}
