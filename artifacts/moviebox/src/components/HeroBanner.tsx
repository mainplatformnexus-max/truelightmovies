import { useState, useEffect, useCallback } from "react";
import type { Movie } from "../data/movies";

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % movies.length);
  }, [movies.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const movie = movies[current];

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1c24]" style={{ aspectRatio: "16/5.5" }}>
      {/* Backdrop images */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {!imgErrors[m.id] ? (
            <img
              src={m.backdrop}
              alt={m.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(prev => ({ ...prev, [m.id]: true }))}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, #1a2a3a ${i * 30}%, #0a1520 100%)`
              }}
            />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101114] via-[#101114]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-6 max-w-lg">
          <div className="hero-meta flex items-center gap-2 mb-3">
            <span className="hero-badge text-xs font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded">
              {movie.type === "series" ? "TV SERIES" : "MOVIE"}
            </span>
            <span className="text-xs text-white/60">{movie.year}</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white/80 text-xs font-medium">{movie.rating}</span>
            </div>
          </div>

          <h2 className="hero-title text-white text-2xl md:text-3xl font-bold leading-tight mb-3 line-clamp-2">
            {movie.title}
          </h2>

          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2 hidden md:block">
            {movie.description}
          </p>

          <div className="flex items-center gap-2 mb-4 flex-wrap hidden md:flex">
            {movie.genre.slice(0, 3).map((g) => (
              <span key={g} className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hero-btn flex items-center gap-2 gradient-btn px-5 py-2 text-sm font-semibold rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Now
            </button>
            <button className="hero-btn flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2 text-sm font-semibold text-white rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`swiper-bullet transition-all duration-300 ${i === current ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Thumbnail strip (desktop) */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2">
        {movies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setCurrent(i)}
            className={`relative rounded overflow-hidden transition-all duration-300 ${
              i === current ? "ring-2 ring-[#a855f7]" : "opacity-60 hover:opacity-90"
            }`}
            style={{ width: 60, height: 36 }}
          >
            <img
              src={m.backdrop}
              alt={m.title}
              className="w-full h-full object-cover"
              onError={() => {}}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
