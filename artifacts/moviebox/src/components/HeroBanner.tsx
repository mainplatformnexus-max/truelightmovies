import { useState, useEffect, useCallback } from "react";
import type { ContentItem } from "../lib/types";

interface HeroBannerProps {
  movies: ContentItem[];
  onPlay?: (movie: ContentItem) => void;
}

export function HeroBanner({ movies, onPlay }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(movies.length, 1));
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + Math.max(movies.length, 1)) % Math.max(movies.length, 1));
  }, [movies.length]);

  useEffect(() => {
    if (movies.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, movies.length]);

  useEffect(() => { setCurrent(0); }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-[#1a1c24] flex items-center justify-center" style={{ aspectRatio: "16/5.5" }}>
        <div className="text-center">
          <div className="text-white/20 text-5xl mb-3">🎬</div>
          <p className="text-white/40 text-sm">No content yet — VJ is uploading soon!</p>
        </div>
      </div>
    );
  }

  const movie = movies[Math.min(current, movies.length - 1)];

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1c24]" style={{ aspectRatio: "16/5.5" }}>
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          {!imgErrors[m.id] && m.thumbnail ? (
            <img
              src={m.thumbnail}
              alt={m.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(prev => ({ ...prev, [m.id]: true }))}
            />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, #1a2a4a ${i * 20}%, #0d1520 100%)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101114] via-[#101114]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-transparent to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="px-6 max-w-lg">
          <div className="hero-meta flex items-center gap-2 mb-3">
            <span className="hero-badge text-xs font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded">
              {movie.type === "series" ? "TV SERIES" : "MOVIE"}
            </span>
            <span className="text-xs text-white/60">{movie.year}</span>
            <span className="text-xs text-white/50">{movie.category}</span>
          </div>
          <h2 className="hero-title text-white text-2xl md:text-3xl font-bold leading-tight mb-3 line-clamp-2">
            {movie.title}
          </h2>
          <p className="text-white/60 text-xs mb-2 hidden md:block">
            By {movie.vjName} · {(movie.views || 0).toLocaleString()} views
          </p>
          <div className="flex items-center gap-2 mb-4 flex-wrap hidden md:flex">
            <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{movie.category}</span>
            {movie.type === "series" && movie.seasons && (
              <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{movie.seasons} Season{movie.seasons > 1 ? "s" : ""}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlay?.(movie)}
              className="hero-btn flex items-center gap-2 gradient-btn px-5 py-2 text-sm font-semibold rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch Now
            </button>
            <button className="hero-btn flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2 text-sm font-semibold text-white rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              Details
            </button>
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {movies.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`swiper-bullet transition-all duration-300 ${i === current ? "active" : ""}`} />
            ))}
          </div>

          <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2">
            {movies.slice(0, 5).map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrent(i)}
                className={`relative rounded overflow-hidden transition-all duration-300 ${i === current ? "ring-2 ring-[#a855f7]" : "opacity-60 hover:opacity-90"}`}
                style={{ width: 60, height: 36 }}
              >
                {m.thumbnail ? (
                  <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" onError={() => {}} />
                ) : (
                  <div className="w-full h-full bg-[#2b2e39] flex items-center justify-center">
                    <span className="text-white/30 text-xs">🎬</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
