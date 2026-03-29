import { HeroBanner } from "../components/HeroBanner";
import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { useContent } from "../lib/useContent";
import { useCarousel } from "../lib/useCarousel";
import type { ContentItem } from "../lib/types";
import { useState } from "react";

interface HomePageProps {
  onPlay?: (movie: ContentItem) => void;
}

const GENRE_TILES = [
  { id: "action",     label: "Action",    bg: "linear-gradient(135deg,#c0392b,#e74c3c)" },
  { id: "drama",      label: "Drama",     bg: "linear-gradient(135deg,#2980b9,#3498db)" },
  { id: "comedy",     label: "Comedy",    bg: "linear-gradient(135deg,#f39c12,#f1c40f)" },
  { id: "war",        label: "War",       bg: "linear-gradient(135deg,#5d6d7e,#7f8c8d)" },
  { id: "highschool", label: "Highschool",bg: "linear-gradient(135deg,#27ae60,#2ecc71)" },
  { id: "indian",     label: "Indian",    bg: "linear-gradient(135deg,#d35400,#e67e22)" },
  { id: "thriller",   label: "Thriller",  bg: "linear-gradient(135deg,#6c3483,#a855f7)" },
  { id: "sci-fi",     label: "Sci-Fi",    bg: "linear-gradient(135deg,#0e6655,#1abc9c)" },
  { id: "christian",  label: "Christian", bg: "linear-gradient(135deg,#1a5276,#2e86c1)" },
];

function ContentCard({ item, onPlay }: { item: ContentItem; onPlay?: (m: ContentItem) => void }) {
  const [err, setErr] = useState(false);
  return (
    <div className="cursor-pointer group" onClick={() => onPlay?.(item)}>
      <div className="relative rounded-xl overflow-hidden bg-[#1e2029]" style={{ aspectRatio: "2/3" }}>
        {!err && item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2b2e39] to-[#1a1c24]">
            <span className="text-white/20 text-3xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-1.5 left-1.5">
          <span className="text-white/80 text-[9px] font-bold bg-black/50 px-1.5 py-0.5 rounded">
            {item.type === "series" ? "TV" : "HD"}
          </span>
        </div>
      </div>
      <p className="text-white/80 text-[10px] md:text-xs font-medium mt-1.5 line-clamp-2 leading-tight">{item.title}</p>
    </div>
  );
}

export function HomePage({ onPlay }: HomePageProps) {
  const { movies, series, all, popular, loading } = useContent();
  const { items: carouselItems, loading: carouselLoading } = useCarousel();
  const [current, setCurrent] = useState(0);
  const [imgErr, setImgErr] = useState<Record<string, boolean>>({});
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const contentLoading = loading;

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Loading content...</div>
      </div>
    );
  }

  const featured = popular.length > 0 ? popular : all.slice(0, 5);

  const byCategory = (items: ContentItem[], category: string) =>
    items.filter(i => i.category?.toLowerCase() === category.toLowerCase());

  const showAdminCarousel = !carouselLoading && carouselItems.length > 0;
  const carouselItem = carouselItems[current] ?? null;

  const filteredByGenre = selectedGenre
    ? all.filter(i => i.category?.toLowerCase() === selectedGenre.toLowerCase())
    : [];

  const activeGenre = GENRE_TILES.find(g => g.id === selectedGenre);

  return (
    <div>
      {showAdminCarousel ? (
        <div className="relative w-full overflow-hidden bg-[#1a1c24] mb-6" style={{ aspectRatio: "16/5.5" }}>
          {carouselItems.map((item, i) => (
            <div key={item.id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
              {!imgErr[item.id] && item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgErr(p => ({ ...p, [item.id]: true }))}
                />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, #1a2a4a ${i * 20}%, #0d1520 100%)` }} />
              )}
            </div>
          ))}
          {carouselItem && (
            <div className="absolute bottom-0 left-0 right-0 px-3 md:px-6 pt-8 md:pt-12 pb-7 md:pb-5"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}>
              <h2 className="text-white text-sm md:text-2xl font-bold leading-tight mb-1 line-clamp-1 md:line-clamp-2">{carouselItem.title}</h2>
              {carouselItem.subtitle && (
                <p className="text-white/70 text-[9px] md:text-sm mb-2 line-clamp-1">{carouselItem.subtitle}</p>
              )}
              {carouselItem.buttonText && (
                <button className="flex items-center gap-1 px-3 py-0.5 md:px-5 md:py-2 text-[10px] md:text-sm font-semibold text-white rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                  {carouselItem.buttonText}
                </button>
              )}
            </div>
          )}
          {carouselItems.length > 1 && (
            <>
              <button onClick={() => setCurrent(c => (c - 1 + carouselItems.length) % carouselItems.length)} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => setCurrent(c => (c + 1) % carouselItems.length)} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                {carouselItems.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`transition-all duration-300 rounded-full ${i === current ? "w-3 h-1 md:w-4 md:h-1.5 bg-white" : "w-1 h-1 md:w-1.5 md:h-1.5 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <HeroBanner movies={featured} onPlay={onPlay} />
        </div>
      )}

      {/* Genre filter bar */}
      <div className="mb-4 overflow-x-auto scrollbar-hide px-3 md:px-0">
        <div className="flex gap-1.5 w-max">
          {GENRE_TILES.map((g) => {
            const isActive = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(isActive ? null : g.id)}
                className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-white text-[10px] md:text-xs font-medium whitespace-nowrap transition-all active:scale-95"
                style={{
                  background: isActive ? g.bg : "rgba(255,255,255,0.1)",
                  outline: isActive ? `2px solid white` : "2px solid transparent",
                  outlineOffset: "1px",
                  opacity: !selectedGenre || isActive ? 1 : 0.5,
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered genre view */}
      {selectedGenre ? (
        <div className="px-3 md:px-0 pb-28 md:pb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-white font-semibold text-sm" style={{ background: activeGenre?.bg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {activeGenre?.label}
            </h2>
            <span className="text-white/40 text-xs">({filteredByGenre.length} titles)</span>
            <button
              onClick={() => setSelectedGenre(null)}
              className="ml-auto text-[10px] text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Clear
            </button>
          </div>
          {filteredByGenre.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
              {filteredByGenre.map(item => (
                <ContentCard key={item.id} item={item} onPlay={onPlay} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-white/20 text-4xl mb-3">🎬</div>
              <p className="text-white/40 text-sm">No {activeGenre?.label} content yet.</p>
              <p className="text-white/25 text-xs mt-1">Check back soon!</p>
            </div>
          )}
        </div>
      ) : (
        /* Default all-rows view */
        <div className="px-3 md:px-0">
          {series.length > 0 && <MovieRow title="TV Series" movies={series} onPlay={onPlay} />}
          {movies.length > 0 && <MovieRow title="Movies" movies={movies} onPlay={onPlay} />}
          {popular.length > 0 && <MovieRow title="Popular" movies={popular} onPlay={onPlay} />}
          {byCategory(all, "action").length > 0 && <MovieRow title="Action" movies={byCategory(all, "action")} onPlay={onPlay} />}
          {byCategory(all, "drama").length > 0 && <MovieRow title="Drama" movies={byCategory(all, "drama")} onPlay={onPlay} />}
          {byCategory(all, "comedy").length > 0 && <MovieRow title="Comedy" movies={byCategory(all, "comedy")} onPlay={onPlay} />}
          {byCategory(all, "war").length > 0 && <MovieRow title="War" movies={byCategory(all, "war")} onPlay={onPlay} />}
          {byCategory(all, "highschool").length > 0 && <MovieRow title="Highschool" movies={byCategory(all, "highschool")} onPlay={onPlay} />}
          {byCategory(all, "indian").length > 0 && <MovieRow title="Indian" movies={byCategory(all, "indian")} onPlay={onPlay} />}
          {byCategory(all, "thriller").length > 0 && <MovieRow title="Thriller" movies={byCategory(all, "thriller")} onPlay={onPlay} />}
          {byCategory(all, "sci-fi").length > 0 && <MovieRow title="Sci-Fi" movies={byCategory(all, "sci-fi")} onPlay={onPlay} />}
          {byCategory(all, "christian").length > 0 && <MovieRow title="Christian" movies={byCategory(all, "christian")} onPlay={onPlay} />}
          {byCategory(all, "horror").length > 0 && <MovieRow title="Horror" movies={byCategory(all, "horror")} onPlay={onPlay} />}
          {byCategory(all, "adventure").length > 0 && <MovieRow title="Adventure" movies={byCategory(all, "adventure")} onPlay={onPlay} />}
          {all.length === 0 && (
            <div className="text-center py-20">
              <div className="text-white/20 text-5xl mb-3">🎬</div>
              <p className="text-white/40 text-sm">No content yet — VJ is uploading soon!</p>
            </div>
          )}
        </div>
      )}

      <PcFooter />
      <H5Footer />
    </div>
  );
}
