import { useRef } from "react";
import type { ContentItem } from "../lib/types";
import { MovieCard } from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: ContentItem[];
  showAll?: boolean;
  onPlay?: (movie: ContentItem) => void;
}

export function MovieRow({ title, movies, showAll = false, onPlay }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-0 md:px-0">
        <h2 className="section-title text-white font-bold text-base md:text-xl leading-5 truncate max-w-[90%]">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">{movies.length}</span>
          <div className="hidden md:flex items-center gap-1 ml-2">
            <button onClick={() => scroll("left")} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scroll("right")} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {showAll ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
          {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onPlay={onPlay} />)}
        </div>
      ) : (
        <div ref={scrollRef} className="flex items-start overflow-x-auto scrollbar-hide gap-2 md:gap-4 pb-2">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-row-card flex-shrink-0" style={{ width: "calc(30.3% - 0.35rem)", minWidth: "calc(30.3% - 0.35rem)" }}>
              <MovieCard movie={movie} onPlay={onPlay} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
