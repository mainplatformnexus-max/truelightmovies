import { useState } from "react";
import type { Movie } from "../data/movies";

interface MovieCardProps {
  movie: Movie;
  variant?: "portrait" | "landscape";
  className?: string;
}

export function MovieCard({ movie, variant = "portrait", className = "" }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  if (variant === "landscape") {
    return (
      <a
        href="#"
        className={`movie-card flex-shrink-0 cursor-pointer group ${className}`}
        style={{ width: "calc(50% - 0.5rem)" }}
      >
        <div className="relative bg-[#2b2e39] rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {!imgError ? (
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2b2e39] to-[#1a1c24] flex items-center justify-center">
              <span className="text-white/20 text-4xl">🎬</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-sm font-bold line-clamp-1">{movie.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400 text-xs">★ {movie.rating}</span>
              <span className="text-white/60 text-xs">{movie.year}</span>
            </div>
          </div>
          {movie.type === "series" && (
            <div className="absolute top-2 right-2 bg-black/60 rounded px-1 py-0.5 text-white/80 text-xs">
              {movie.seasons}S
            </div>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href="#"
      className={`movie-card flex-shrink-0 cursor-pointer group relative ${className}`}
    >
      <div className="relative bg-[#2b2e39] rounded-lg overflow-hidden" style={{ aspectRatio: "2/3" }}>
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2b2e39] to-[#1a1c24] flex items-center justify-center">
            <span className="text-white/20 text-4xl">🎬</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
          <button className="w-full gradient-btn py-1.5 text-xs font-semibold text-[#101114] rounded-full mb-1">
            ▶ Watch Now
          </button>
        </div>

        {/* Rating badge */}
        {movie.rating >= 8.0 && (
          <div className="absolute top-1.5 left-1.5 bg-yellow-500/90 rounded px-1 py-0.5 text-[#101114] text-xs font-bold leading-none">
            TOP
          </div>
        )}

        {/* Series badge */}
        {movie.type === "series" && (
          <div className="absolute top-1.5 right-1.5 bg-[#a855f7]/90 rounded px-1 py-0.5 text-white text-xs font-bold leading-none">
            TV
          </div>
        )}
      </div>

      <div className="mt-1.5 px-0.5">
        <p className="movie-card-title text-white text-xs font-medium line-clamp-1 leading-4">{movie.title}</p>
        <div className="movie-card-meta flex items-center gap-1.5 mt-0.5">
          <span className="text-yellow-400 text-xs">★ {movie.rating}</span>
          <span className="text-white/50 text-xs">{movie.year}</span>
        </div>
      </div>
    </a>
  );
}
