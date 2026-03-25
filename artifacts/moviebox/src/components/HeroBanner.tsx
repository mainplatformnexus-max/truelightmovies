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
      {/* Slides — NO overlays, clean images */}
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
        </div>
      ))}

      {/* Text block — anchored to bottom, compact on mobile */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 md:px-6 pt-8 md:pt-12 pb-7 md:pb-5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
      >
        {/* Meta row */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] md:text-xs font-semibold text-white/70 bg-white/15 px-1.5 py-0.5 rounded uppercase">
            {movie.type === "series" ? "TV" : "Movie"}
          </span>
          <span className="text-[9px] md:text-xs text-white/60">{movie.year}</span>
          {movie.category && <span className="text-[9px] md:text-xs text-white/50">{movie.category}</span>}
        </div>

        {/* Title */}
        <h2 className="text-white text-sm md:text-2xl font-bold leading-tight mb-1 line-clamp-1 md:line-clamp-2">
          {movie.title}
        </h2>

        {/* VJ credit — hidden on very small, tiny on mobile */}
        <p className="text-white/50 text-[9px] md:text-xs mb-2 line-clamp-1">
          By {movie.vjName} · {(movie.views || 0).toLocaleString()} views
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlay?.(movie)}
            className="flex items-center gap-1 px-3 py-0.5 md:px-5 md:py-2 text-[10px] md:text-sm font-semibold text-white rounded-full"
            style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </button>
          <button
            onClick={() => onPlay?.(movie)}
            className="flex items-center gap-1 px-2.5 py-0.5 md:px-5 md:py-2 text-[10px] md:text-sm font-semibold text-white rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Details
          </button>
        </div>
      </div>

      {/* Arrow buttons — small on mobile */}
      {movies.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${i === current ? "w-3 h-1 md:w-4 md:h-1.5 bg-white" : "w-1 h-1 md:w-1.5 md:h-1.5 bg-white/40"}`}
              />
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
