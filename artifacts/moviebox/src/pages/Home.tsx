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

  const actionMovies = byCategory(all, "action");
  const horrorMovies = byCategory(all, "horror");
  const adventureMovies = byCategory(all, "adventure");
  const dramaMovies = byCategory(all, "drama");
  const comedyMovies = byCategory(all, "comedy");
  const thrillerMovies = byCategory(all, "thriller");

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
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="w-full px-3 md:px-6 pb-8 md:pb-0 md:max-w-lg"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                <h2 className="text-white text-base md:text-2xl font-bold leading-tight mb-1 line-clamp-2">{carouselItem.title}</h2>
                {carouselItem.subtitle && (
                  <p className="text-white/70 text-xs md:text-sm mb-2 line-clamp-1 md:line-clamp-2">{carouselItem.subtitle}</p>
                )}
                {carouselItem.buttonText && (
                  <button className="flex items-center gap-1.5 px-3 py-1 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-white rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                    {carouselItem.buttonText}
                  </button>
                )}
              </div>
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
        {actionMovies.length > 0 && (
          <MovieRow title="Action" movies={actionMovies} onPlay={onPlay} />
        )}
        {horrorMovies.length > 0 && (
          <MovieRow title="Horror" movies={horrorMovies} onPlay={onPlay} />
        )}
        {adventureMovies.length > 0 && (
          <MovieRow title="Adventure" movies={adventureMovies} onPlay={onPlay} />
        )}
        {dramaMovies.length > 0 && (
          <MovieRow title="Drama" movies={dramaMovies} onPlay={onPlay} />
        )}
        {comedyMovies.length > 0 && (
          <MovieRow title="Comedy" movies={comedyMovies} onPlay={onPlay} />
        )}
        {thrillerMovies.length > 0 && (
          <MovieRow title="Thriller" movies={thrillerMovies} onPlay={onPlay} />
        )}
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
