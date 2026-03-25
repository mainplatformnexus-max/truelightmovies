import { useRef, useState, useEffect, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onPlay?: () => void;
}

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function VideoPlayer({ src, poster, title, onPlay }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [showVol, setShowVol] = useState(false);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing && !scrubbing) setShowControls(false);
    }, 3000);
  }, [playing, scrubbing]);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [playing, resetHideTimer]);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); onPlay?.(); } else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      (c.requestFullscreen?.() || (c as any).webkitRequestFullscreen?.());
    } else {
      document.exitFullscreen?.();
    }
  };

  const seekTo = (e: React.MouseEvent | React.TouchEvent) => {
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={(e) => { if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "VIDEO") togglePlay(); }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        onPlay={() => { setPlaying(true); resetHideTimer(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
        }}
        onLoadedMetadata={() => { setDuration(videoRef.current?.duration || 0); }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => setPlaying(false)}
      />

      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Big center play/pause on tap (mobile) */}
      {!playing && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", border: "2px solid rgba(255,255,255,0.2)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}
        style={{ background: showControls ? "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.75) 100%)" : "none" }}
      >
        {/* Top bar */}
        <div className="flex items-center px-3 pt-2.5 pointer-events-auto">
          {title && (
            <p className="text-white text-xs md:text-sm font-semibold line-clamp-1 flex-1">{title}</p>
          )}
        </div>

        {/* Bottom controls */}
        <div className="px-3 pb-2.5 pointer-events-auto">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-5 flex items-center cursor-pointer mb-1 group"
            onMouseDown={(e) => { setScrubbing(true); seekTo(e); }}
            onMouseMove={(e) => { if (scrubbing) seekTo(e); }}
            onMouseUp={() => setScrubbing(false)}
            onMouseLeave={() => setScrubbing(false)}
            onTouchStart={(e) => { setScrubbing(true); seekTo(e); }}
            onTouchMove={(e) => { if (scrubbing) seekTo(e); }}
            onTouchEnd={() => setScrubbing(false)}
          >
            {/* Track */}
            <div className="absolute left-0 right-0 h-1 rounded-full bg-white/20 group-hover:h-1.5 transition-all overflow-hidden">
              {/* Buffered */}
              <div className="absolute left-0 top-0 bottom-0 rounded-full bg-white/30" style={{ width: `${bufferedPct}%` }} />
              {/* Played */}
              <div
                className="absolute left-0 top-0 bottom-0 rounded-full"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
              />
            </div>
            {/* Thumb */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
              style={{ left: `${progress}%`, top: "50%", transform: "translate(-50%,-50%)" }}
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Play/pause */}
            <button onClick={togglePlay} className="text-white hover:text-white/80 transition-colors flex-shrink-0">
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>

            {/* Volume */}
            <div className="relative flex items-center">
              <button onClick={toggleMute} onMouseEnter={() => setShowVol(true)} onMouseLeave={() => setShowVol(false)} className="text-white hover:text-white/80 transition-colors flex-shrink-0">
                {muted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0018 19.73l2 2L21 20.46 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
              {showVol && (
                <div className="absolute left-6 bottom-0 flex items-center pl-2"
                  onMouseEnter={() => setShowVol(true)} onMouseLeave={() => setShowVol(false)}>
                  <input
                    type="range" min="0" max="1" step="0.05" value={volume}
                    onChange={e => {
                      const v = videoRef.current;
                      const val = Number(e.target.value);
                      if (v) { v.volume = val; v.muted = val === 0; }
                      setVolume(val);
                      setMuted(val === 0);
                    }}
                    className="w-16 accent-purple-400 cursor-pointer h-1"
                  />
                </div>
              )}
            </div>

            {/* Time */}
            <span className="text-white/70 text-[10px] md:text-xs font-mono flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-white/80 transition-colors flex-shrink-0">
              {fullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
