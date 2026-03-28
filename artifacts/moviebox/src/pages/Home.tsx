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
  { id: "action",     label: "Action",     emoji: "🔥", bg: "linear-gradient(135deg,#c0392b,#e74c3c)" },
  { id: "drama",      label: "Drama",      emoji: "🎭", bg: "linear-gradient(135deg,#2980b9,#3498db)" },
  { id: "comedy",     label: "Comedy",     emoji: "😂", bg: "linear-gradient(135deg,#f39c12,#f1c40f)" },
  { id: "war",        label: "War",        emoji: "⚔️", bg: "linear-gradient(135deg,#5d6d7e,#7f8c8d)" },
  { id: "highschool", label: "Highschool", emoji: "🏫", bg: "linear-gradient(135deg,#27ae60,#2ecc71)" },
  { id: "indian",     label: "Indian",     emoji: "🪔", bg: "linear-gradient(135deg,#d35400,#e67e22)" },
  { id: "thriller",   label: "Thriller",   emoji: "🔪", bg: "linear-gradient(135deg,#6c3483,#a855f7)" },
  { id: "sci-fi",     label: "Sci-Fi",     emoji: "🚀", bg: "linear-gradient(135deg,#0e6655,#1abc9c)" },
];

function GenreGrid() {
  const handleClick = (id: string) => {
    const el = document.getElementById(`genre-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mb-4 overflow-x-auto scrollbar-hide px-3 md:px-0">
      <div className="flex gap-1.5 w-max">
        {GENRE_TILES.map((g) => (
          <button
            key={g.id}
            onClick={() => handleClick(g.id)}
            className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-white text-[10px] md:text-xs font-medium whitespace-nowrap transition-transform active:scale-95 hover:opacity-90"
            style={{ background: g.bg }}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HomePage({ onPlay }: HomePageProps) {
  const { movies, series, all, popular, loading } = useContent();
  const { items: carouselItems, loading: carouselLoading } = useCarousel();
  const [current, setCurrent] = useState(0);
  const [imgErr, setImgErr] = useState<Record<string, boolean>>({});

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

  const actionMovies    = byCategory(all, "action");
  const horrorMovies    = byCategory(all, "horror");
  const adventureMovies = byCategory(all, "adventure");
  const dramaMovies     = byCategory(all, "drama");
  const comedyMovies    = byCategory(all, "comedy");
  const thrillerMovies  = byCategory(all, "thriller");
  const warMovies       = byCategory(all, "war");
  const highschoolMovies = byCategory(all, "highschool");
  const indianMovies    = byCategory(all, "indian");
  const scifiMovies     = byCategory(all, "sci-fi");

  const showAdminCarousel = !carouselLoading && carouselItems.length > 0;
  const carouselItem = carouselItems[current] ?? null;

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

      <GenreGrid />

      <div className="px-3 md:px-0">
        {series.length > 0 && (
          <MovieRow title="TV Series" movies={series} onPlay={onPlay} />
        )}
        {movies.length > 0 && (
          <MovieRow title="Movies" movies={movies} onPlay={onPlay} />
        )}
        {popular.length > 0 && (
          <MovieRow title="Popular" movies={popular} onPlay={onPlay} />
        )}
        <div id="genre-action">
          {actionMovies.length > 0 && (
            <MovieRow title="Action" movies={actionMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-horror">
          {horrorMovies.length > 0 && (
            <MovieRow title="Horror" movies={horrorMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-adventure">
          {adventureMovies.length > 0 && (
            <MovieRow title="Adventure" movies={adventureMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-drama">
          {dramaMovies.length > 0 && (
            <MovieRow title="Drama" movies={dramaMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-comedy">
          {comedyMovies.length > 0 && (
            <MovieRow title="Comedy" movies={comedyMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-thriller">
          {thrillerMovies.length > 0 && (
            <MovieRow title="Thriller" movies={thrillerMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-war">
          {warMovies.length > 0 && (
            <MovieRow title="War" movies={warMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-highschool">
          {highschoolMovies.length > 0 && (
            <MovieRow title="Highschool" movies={highschoolMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-indian">
          {indianMovies.length > 0 && (
            <MovieRow title="Indian" movies={indianMovies} onPlay={onPlay} />
          )}
        </div>
        <div id="genre-sci-fi">
          {scifiMovies.length > 0 && (
            <MovieRow title="Sci-Fi" movies={scifiMovies} onPlay={onPlay} />
          )}
        </div>
        {all.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/20 text-5xl mb-3">🎬</div>
            <p className="text-white/40 text-sm">No content yet — VJ is uploading soon!</p>
          </div>
        )}
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
