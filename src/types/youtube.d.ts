// src/types/youtube.d.ts (mantido, mas removendo duplicatas)
// Declaração de tipos para API do YouTube IFrame Player

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    ytPlayer?: YT.Player;
  }

  namespace YT {
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }

    type SuggestedVideoQuality =
      | "highres"
      | "hd1080"
      | "hd720"
      | "large"
      | "medium"
      | "small"
      | "tiny"
      | "default";
    type PlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

    interface PlayerOptions {
      videoId?: string;
      width?: number | string;
      height?: number | string;
      playerVars?: PlayerVars;
      events?: PlayerEvents;
    }

    interface PlayerVars {
      autoplay?: 0 | 1;
      cc_lang_pref?: string;
      cc_load_policy?: 0 | 1;
      color?: "red" | "white";
      controls?: 0 | 1;
      disablekb?: 0 | 1;
      enablejsapi?: 0 | 1;
      start?: number;
      end?: number;
      hl?: string;
      iv_load_policy?: 0 | 1;
      list?: string;
      listType?: "playlist" | "user_uploads";
      loop?: 0 | 1;
      modestbranding?: 0 | 1;
      origin?: string;
      playlist?: string;
      showinfo?: 0 | 1;
      widget_referrer?: string;
      [key: string]: unknown;
    }

    interface PlayerEvents {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: PlayerEvent) => void;
      onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
      onApiChange?: (event: PlayerEvent) => void;
      [key: string]: unknown;
    }

    interface PlayerEvent {
      target: Player;
      data?: unknown;
    }

    interface OnStateChangeEvent extends PlayerEvent {
      data: PlayerState;
    }

    interface OnPlaybackRateChangeEvent extends PlayerEvent {
      data: PlaybackRate;
    }

    interface OnErrorEvent extends PlayerEvent {
      data: 2 | 5 | 100 | 101 | 150;
    }

    class Player {
      constructor(elementId: string | HTMLElement, options?: PlayerOptions);
      loadVideoById(videoId: string, startSeconds?: number): void;
      loadPlaylist(playlist: string | string[], index?: number): void;
      cueVideoById(videoId: string, startSeconds?: number): void;
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      nextVideo(): void;
      previousVideo(): void;
      playVideoAt(index: number): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      clearVideo(): void;
      getVideoUrl(): string;
      getVideoData(): { video_id: string; author: string; title: string };
      getCurrentTime(): number;
      getDuration(): number;
      getVolume(): number;
      isMuted(): boolean;
      getPlaybackRate(): number;
      getAvailablePlaybackRates(): PlaybackRate[];
      getVideoLoadedFraction(): number;
      getPlayerState(): PlayerState;
      getEmbedCode(): string;
      setVolume(volume: number): void;
      mute(): void;
      unMute(): void;
      setPlaybackRate(rate: PlaybackRate): void;
      setPlaybackQuality(suggestedQuality: SuggestedVideoQuality): void;
      getPlaybackQuality(): SuggestedVideoQuality;
      getAvailableQualityLevels(): SuggestedVideoQuality[];
      setSize(width: number | string, height: number | string): void;
      destroy(): void;
      addEventListener(
        event: string,
        listener: (event: PlayerEvent) => void,
      ): void;
      removeEventListener(
        event: string,
        listener: (event: PlayerEvent) => void,
      ): void;
      getOption(module: string, option: string): unknown;
      setOption(module: string, option: string, value: unknown): void;
    }
  }
}

export {};
