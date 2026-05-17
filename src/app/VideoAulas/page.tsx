"use client";

import Footer from "@/components/layout/Footer";
import { NIVEIS } from "@/data/index";
import { categoriasVideo, Video } from "@/data/videoaulas/videoAulasData";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { AnimatePresence, motion } from "framer-motion";
import { Grid, History, List, PlayCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeaderDashboard } from "../dashboard/components/HeaderDashboard";
import { CategoriaSection } from "./components/CategoriaSection";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { OrdenacaoFiltros, OrdenacaoType } from "./components/OrdenacaoFiltros";
import { VideoPlayerPro } from "./components/VideoPlayer";

// ─── Mapa global de vídeos (calculado fora do componente — nunca muda) ────────
// CORRIGIDO: usar 'categoriasVideo' em vez de 'videoAulasData'
const videosMap = new Map<string, Video>();
categoriasVideo.forEach((cat) =>
  cat.videos.forEach((v: Video) => videosMap.set(v.id, v)),
);

// CORRIGIDO: usar 'categoriasVideo' em vez de 'videoAulasData'
const totalVideos = categoriasVideo.reduce(
  (acc, cat) => acc + cat.videos.length,
  0,
);

// ─── Componente ───────────────────────────────────────────────────────────────
export default function VideoAulasPage() {
  const [searchTermGlobal, setSearchTermGlobal] = useState("");
  const [ordenacaoGlobal, setOrdenacaoGlobal] =
    useState<OrdenacaoType>("padrao");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Mapa de progresso por vídeo (0–1), para passar ao VideoCard
  const [progressoMap, setProgressoMap] = useState<Record<string, number>>({});

  const { progress } = useGamificacao();
  const {
    isAssistido,
    marcarAssistido,
    getUltimosAssistidos,
    totalAssistidos,
  } = useVideoProgress();

  // ── Loading com limpeza segura ──────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, []);

  const nivelAtual =
    NIVEIS.find((n) => n.nivel === (progress?.nivel ?? 1)) ?? NIVEIS[0];

  // ── Set de vídeos assistidos — recalcula só quando isAssistido muda ─────────
  const videosAssistidosSet = useMemo(() => {
    const set = new Set<string>();
    categoriasVideo.forEach((cat) =>
      cat.videos.forEach((v: Video) => {
        if (isAssistido(v.id)) set.add(v.id);
      }),
    );
    return set;
    // isAssistido é estável por referência se o hook usa useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAssistido, totalAssistidos]);

  // ── Histórico ───────────────────────────────────────────────────────────────
  const ultimosAssistidosIds = useMemo(
    () => getUltimosAssistidos(5),
    // Reconstrói quando a lista de assistidos muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getUltimosAssistidos, totalAssistidos],
  );

  const ultimosVideos = useMemo(
    () =>
      ultimosAssistidosIds
        .map((id: string) => videosMap.get(id))
        .filter((v: Video | undefined): v is Video => v !== undefined),
    [ultimosAssistidosIds],
  );

  // ── Filtro global de categorias ─────────────────────────────────────────────
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

  // ── Progresso global ────────────────────────────────────────────────────────
  const progressoGlobal =
    totalVideos > 0 ? (totalAssistidos / totalVideos) * 100 : 0;

  // ── Handlers estabilizados ──────────────────────────────────────────────────
  const handleVideoClick = useCallback((videoId: string) => {
    const video = videosMap.get(videoId);
    if (video) setSelectedVideo(video);
  }, []);

  const handleMarcarAssistido = useCallback(
    (videoId: string) => {
      marcarAssistido(videoId);
      // Quando marcado como assistido, progresso vai a 100%
      setProgressoMap((prev) => ({ ...prev, [videoId]: 1 }));
    },
    [marcarAssistido],
  );

  // useCallback estabiliza a referência para o CategoriaSection não re-renderizar
  const handleCompleteCategoria = useCallback((_categoriaNome: string) => {
    // Extensível: ex. disparar toast, animação, XP
  }, []);

  const handleProgressoChange = useCallback(
    (videoId: string, progresso: number) => {
      setProgressoMap((prev) => {
        // Evita re-render se o valor não mudou significativamente (±2%)
        if (Math.abs((prev[videoId] ?? 0) - progresso) < 0.02) return prev;
        return { ...prev, [videoId]: progresso };
      });
    },
    [],
  );

  // ── Fecha player com Escape (nível de página, como fallback) ────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedVideo) {
        // O próprio VideoPlayerPro já trata Escape; este é o fallback
        // caso o player não esteja montado ainda
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedVideo]);

  // ── Título da aba do browser atualiza com o vídeo aberto ───────────────────
  useEffect(() => {
    if (selectedVideo) {
      // CORRIGIDO: usar 'titulo' em vez de 'title'
      document.title = `▶ ${selectedVideo.titulo} — Videoaulas PRF`;
    } else {
      document.title = "Videoaulas PRF 2026";
    }
    return () => {
      document.title = "Videoaulas PRF 2026";
    };
  }, [selectedVideo]);

  // ── Scroll para o topo ao abrir/fechar player ───────────────────────────────
  const mainRef = useRef<HTMLElement>(null);

  // ─── Render ─────────────────────────────────────────────────────────────────

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

  const percentual = Math.round(progressoGlobal);
  const faltam = totalVideos - totalAssistidos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <HeaderDashboard
        streakDias={progress?.streakDias ?? 0}
        nivel={progress?.nivel ?? 1}
        nivelNome={nivelAtual?.nome ?? "Iniciante"}
        nivelCor={nivelAtual?.cor ?? "#3b82f6"}
      />

      <main
        ref={mainRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* ── Cabeçalho ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            {/* Título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Videoaulas PRF 2026
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  <motion.span
                    key={totalAssistidos}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    {totalAssistidos}
                  </motion.span>{" "}
                  de {totalVideos} vídeos assistidos
                </p>
              </div>
            </div>

            {/* Controles de visualização */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-slate-800/60 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grade"
                  aria-pressed={viewMode === "grid"}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="Lista"
                  aria-pressed={viewMode === "list"}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-400 shadow-sm"
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
                className={`p-2 rounded-xl transition-all ${
                  showHistory
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barra de progresso global */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progresso geral</span>
              <motion.span
                key={percentual}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="font-mono font-medium text-slate-400 tabular-nums"
              >
                {percentual}%
              </motion.span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progressoGlobal}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
              >
                {/* Brilho deslizante */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Histórico recente ── */}
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              key="history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <h3 className="font-semibold text-slate-200 text-sm mb-3 flex items-center gap-2">
                  <History
                    className="w-4 h-4 text-purple-400"
                    aria-hidden="true"
                  />
                  Últimos assistidos
                </h3>

                {ultimosVideos.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Nenhum vídeo assistido ainda.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ultimosVideos.map((video: Video) => (
                      <button
                        key={video.id}
                        onClick={() => handleVideoClick(video.id)}
                        className="px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors truncate max-w-[200px]"
                        // CORRIGIDO: usar 'titulo' em vez de 'title'
                        title={video.titulo}
                      >
                        {video.titulo}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Busca e ordenação global ── */}
        <div className="mb-6">
          <OrdenacaoFiltros
            ordenacao={ordenacaoGlobal}
            onOrdenacaoChange={setOrdenacaoGlobal}
            searchTerm={searchTermGlobal}
            onSearchChange={setSearchTermGlobal}
            placeholder="Buscar em todas as matérias..."
          />
        </div>

        {/* ── Lista de categorias ── */}
        <AnimatePresence mode="wait">
          {categoriasFiltradas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4" aria-hidden="true">
                🔍
              </div>
              <p className="text-slate-400 text-sm">
                Nenhum vídeo encontrado para &quot;{searchTermGlobal}&quot;
              </p>
              <button
                onClick={() => setSearchTermGlobal("")}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
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
                  // Abre automaticamente quando há busca ativa
                  defaultOpen={searchTermGlobal.trim() !== ""}
                  videosAssistidos={videosAssistidosSet}
                  onVideoClick={handleVideoClick}
                  onCompleteCategoria={handleCompleteCategoria}
                  ordenacaoGlobal={ordenacaoGlobal}
                  searchTermGlobal={searchTermGlobal}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mensagem motivacional ── */}
        <AnimatePresence>
          {!searchTermGlobal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
            >
              <p className="text-sm text-slate-300 text-center">
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                      }}
                      className="font-bold text-white"
                    >
                      {faltam}
                    </motion.span>{" "}
                    {faltam === 1 ? "vídeo" : "vídeos"} para concluir todas as
                    matérias! Continue assim! 💪
                  </>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Player ── */}
      <VideoPlayerPro
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onMarcarAssistido={handleMarcarAssistido}
        isAssistido={selectedVideo ? isAssistido(selectedVideo.id) : false}
        onProgressoChange={handleProgressoChange}
      />

      <Footer />
    </div>
  );
}
