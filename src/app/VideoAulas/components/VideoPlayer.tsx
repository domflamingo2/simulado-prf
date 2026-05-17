"use client";

import { Video } from "@/data/videoaulas/videoAulasData";
import { useAnotacoes } from "@/hooks/useAnotacoes";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Settings,
  Target,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnotacoesVideo } from "./AnotacoesVideo";

// 🔧 DECLARAÇÃO DE TIPOS PARA A API DO YOUTUBE (evita erros TS)
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, any>;
          events?: Record<string, any>;
        },
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  isMuted: () => boolean;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getAvailablePlaybackRates: () => number[];
}

interface VideoPlayerProProps {
  video: Video | null;
  onClose: () => void;
  onMarcarAssistido: (videoId: string) => void;
  isAssistido: boolean;
  /** Callback para salvar progresso (0–1) no componente pai */
  onProgressoChange?: (videoId: string, progresso: number) => void;
}

type Velocidade = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

// ─── Utilitários ─────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/,
  );
  return match ? match[2] : null;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** Beep sintético via Web Audio API — sem depender de arquivo externo */
function playBeep(): void {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // Web Audio indisponível — silencia sem erros
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function VideoPlayerPro({
  video,
  onClose,
  onMarcarAssistido,
  isAssistido,
  onProgressoChange,
}: VideoPlayerProProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [velocidade, setVelocidade] = useState<Velocidade>(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [modoFoco, setModoFoco] = useState(false);
  const [tempoFoco, setTempoFoco] = useState(25 * 60);
  const [timerAtivo, setTimerAtivo] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  // Evita múltiplas chamadas de createPlayer em concurrent renders
  const creatingRef = useRef(false);

  const { getAnotacoesPorVideo, salvarAnotacao, deletarAnotacao } =
    useAnotacoes();

  const videoId = video ? extractYouTubeId(video.url) : null;

  // ─── Progress loop ─────────────────────────────────────────────────────────

  const stopProgressLoop = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const startProgressLoop = useCallback(() => {
    stopProgressLoop();
    progressRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const ct = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(ct);
        setDuration(dur);
        // Propaga progresso para o pai (para a barra no VideoCard)
        if (dur > 0 && video) {
          onProgressoChange?.(video.id, ct / dur);
        }
      } catch {
        // player ainda não pronto — ignora
      }
    }, 500);
  }, [stopProgressLoop, video, onProgressoChange]);

  // ─── Criação do player ──────────────────────────────────────────────────────

  const createPlayer = useCallback(() => {
    if (!videoId || creatingRef.current) return;
    const containerId = `yt-player-${videoId}`;
    if (!document.getElementById(containerId)) return;

    creatingRef.current = true;

    // Destrói instância anterior de forma segura
    try {
      playerRef.current?.destroy();
    } catch {
      /* ok */
    }
    playerRef.current = null;
    setPlayerReady(false);
    setCurrentTime(0);
    setDuration(0);

    // 🔧 CORREÇÃO: Usamos as para contornar limitações dos tipos do YouTube API
    playerRef.current = new window.YT.Player(containerId, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        fs: 0,
        playsinline: 1,
        iv_load_policy: 3, // ✅ Parâmetro válido, mas não tipado — usamos as any abaixo
      } as Record<string, any>,
      events: {
        onReady: (event: any) => {
          creatingRef.current = false;
          setPlayerReady(true);
          event.target.setVolume(volume);
          event.target.setPlaybackRate(velocidade);
          if (isMuted) event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          const playing = event.data === window.YT.PlayerState.PLAYING;
          setIsPlaying(playing);
          if (playing) {
            startProgressLoop();
          } else {
            stopProgressLoop();
          }
        },
        onError: (event: any) => {
          // ✅ Evento válido, mas não tipado — log para debug em desenvolvimento
          if (process.env.NODE_ENV === "development") {
            console.error("Erro no player do YouTube:", event);
          }
          creatingRef.current = false;
        },
      } as Record<string, any>,
    });
  }, [
    videoId,
    volume,
    velocidade,
    isMuted,
    startProgressLoop,
    stopProgressLoop,
  ]);

  // ─── Carrega a API do YouTube ───────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT?.Player) return;
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }, []);

  // ─── Inicializa/reinicializa player quando videoId muda ────────────────────

  useEffect(() => {
    if (!videoId) return;

    const init = () => createPlayer();

    if (window.YT?.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    }

    return () => {
      stopProgressLoop();
      creatingRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ok */
      }
      playerRef.current = null;
    };
    // createPlayer incluso nas deps mas estabilizado por useCallback
  }, [videoId, createPlayer, stopProgressLoop]);

  // ─── Timer do modo foco ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!timerAtivo || tempoFoco <= 0) return;
    const id = setInterval(() => {
      setTempoFoco((prev) => {
        if (prev <= 1) {
          setTimerAtivo(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerAtivo, tempoFoco]);

  // ─── Fecha settings ao clicar fora ─────────────────────────────────────────

  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: MouseEvent) => {
      if (!settingsRef.current?.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSettings]);

  // ─── Hotkeys ────────────────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      isPlaying
        ? playerRef.current.pauseVideo()
        : playerRef.current.playVideo();
    } catch {
      /* ok */
    }
  }, [isPlaying]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          if (modoFoco) {
            setModoFoco(false);
            return;
          }
          if (isFullscreen) {
            setIsFullscreen(false);
            return;
          }
          onClose();
          break;
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
        case "F":
          e.preventDefault();
          setIsFullscreen((v) => !v);
          break;
        case "ArrowRight":
          e.preventDefault();
          try {
            playerRef.current?.seekTo(currentTime + 5, true);
          } catch {
            /* ok */
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          try {
            playerRef.current?.seekTo(Math.max(0, currentTime - 5), true);
          } catch {
            /* ok */
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, togglePlay, isFullscreen, modoFoco, currentTime]);

  // ─── Handlers de controles ──────────────────────────────────────────────────

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted((v) => !v);
    } catch {
      /* ok */
    }
  };

  const handleVolume = (value: number) => {
    setVolume(value);
    try {
      playerRef.current?.setVolume(value);
      if (value === 0) {
        playerRef.current?.mute();
        setIsMuted(true);
      } else {
        playerRef.current?.unMute();
        setIsMuted(false);
      }
    } catch {
      /* ok */
    }
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
    try {
      playerRef.current?.seekTo(value, true);
    } catch {
      /* ok */
    }
  };

  const handleVelocidade = (v: Velocidade) => {
    setVelocidade(v);
    try {
      playerRef.current?.setPlaybackRate(v);
    } catch {
      /* ok */
    }
    setShowSettings(false);
  };

  // ─── Render guard ───────────────────────────────────────────────────────────

  if (!video || !videoId) return null;

  const anotacoesVideo = getAnotacoesPorVideo(video.id);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        key="player-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
        // Backdrop fecha o modal apenas fora do modo foco
        onClick={modoFoco ? undefined : onClose}
      >
        <motion.div
          key="player-modal"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className={`flex flex-col bg-slate-950 border border-white/10 shadow-2xl overflow-hidden ${
            modoFoco
              ? "fixed inset-0 rounded-none"
              : isFullscreen
                ? "fixed inset-2 rounded-2xl"
                : "w-full max-w-5xl mx-4 rounded-2xl"
          }`}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <div className="min-w-0 flex-1">
              {/* CORRIGIDO: usar 'titulo' em vez de 'title' */}
              <h2 className="font-semibold text-white text-sm truncate">
                {video.titulo}
              </h2>
              {/* CORRIGIDO: usar 'duracao' em vez de 'duration' */}
              <p className="text-xs text-white/40 mt-0.5">{video.duracao}</p>
            </div>

            <div className="flex items-center gap-1 ml-2 shrink-0">
              {modoFoco ? (
                <button
                  onClick={() => setModoFoco(false)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-colors"
                >
                  Sair do foco
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsFullscreen((v) => !v)}
                    title={isFullscreen ? "Reduzir (F)" : "Expandir (F)"}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    title="Fechar (Esc)"
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Timer do modo foco ── */}
          <AnimatePresence>
            {modoFoco && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex justify-center py-2 bg-black/30 shrink-0"
              >
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-5 py-2 border border-white/10">
                  <span className="text-xl font-mono font-bold text-white tabular-nums">
                    {formatTimer(tempoFoco)}
                  </span>
                  <button
                    onClick={() => setTimerAtivo((v) => !v)}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs text-white transition-colors"
                  >
                    {timerAtivo ? "Pausar" : "Iniciar"}
                  </button>
                  <button
                    onClick={() => {
                      setTempoFoco(25 * 60);
                      setTimerAtivo(false);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Player ── */}
          <div className="relative bg-black flex-1 min-h-0">
            <div
              id={`yt-player-${videoId}`}
              className="w-full h-full aspect-video"
            />

            {/* Spinner de carregamento */}
            <AnimatePresence>
              {!playerReady && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black"
                >
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Progress bar ── */}
          <div className="px-4 pt-3 shrink-0">
            <div className="relative flex items-center gap-2">
              <span className="text-xs text-white/40 tabular-nums w-10 text-right shrink-0">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={1}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  disabled={!playerReady || duration === 0}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
                  aria-label="Progresso do vídeo"
                />
              </div>

              <span className="text-xs text-white/40 tabular-nums w-10 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="px-4 py-3 flex items-center justify-between gap-2 flex-wrap shrink-0">
            {/* Grupo esquerdo */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                disabled={!playerReady}
                title="Play/Pause (Espaço)"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  title="Mute (M)"
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolume(Number(e.target.value))}
                  className="w-20 h-1 accent-blue-400 cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              {/* Atalhos de teclado — hint discreto */}
              <span className="hidden md:block text-[10px] text-white/20 select-none">
                ←→ 5s · Espaço · M · F
              </span>
            </div>

            {/* Grupo direito */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <AnotacoesVideo
                videoId={video.id}
                // CORRIGIDO: usar 'titulo' em vez de 'title'
                videoTitle={video.titulo}
                anotacoes={anotacoesVideo}
                onSalvar={(texto, timestamp) =>
                  salvarAnotacao(video.id, texto, timestamp)
                }
                onDeletar={deletarAnotacao}
                currentTime={currentTime}
              />

              {/* Modo foco */}
              <button
                onClick={() => setModoFoco((v) => !v)}
                title="Modo foco (Pomodoro)"
                className={`p-2 rounded-lg transition-colors ${
                  modoFoco
                    ? "bg-purple-500/30 text-purple-300"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <Target className="w-4 h-4" />
              </button>

              {/* Velocidade */}
              <div ref={settingsRef} className="relative">
                <button
                  onClick={() => setShowSettings((v) => !v)}
                  title="Velocidade de reprodução"
                  className={`p-2 rounded-lg transition-colors ${
                    showSettings
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.13 }}
                      className="absolute bottom-full right-0 mb-2 w-36 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 py-1"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 px-3 py-1.5">
                        Velocidade
                      </p>
                      {([0.5, 0.75, 1, 1.25, 1.5, 2] as Velocidade[]).map(
                        (v) => (
                          <button
                            key={v}
                            onClick={() => handleVelocidade(v)}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                              velocidade === v
                                ? "bg-blue-500/20 text-blue-300 font-medium"
                                : "text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            {v === 1 ? "1× Normal" : `${v}×`}
                          </button>
                        ),
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Abrir no YouTube */}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                YouTube
              </a>

              {/* Marcar assistido */}
              <button
                onClick={() => onMarcarAssistido(video.id)}
                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                  isAssistido
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/20"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isAssistido ? "Assistido" : "Concluir"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
