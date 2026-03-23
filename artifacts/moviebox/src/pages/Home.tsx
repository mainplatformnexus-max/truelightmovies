import { HeroBanner } from "../components/HeroBanner";
import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { useContent } from "../lib/useContent";
import type { ContentItem } from "../lib/types";

interface HomePageProps {
  onPlay?: (movie: ContentItem) => void;
}

export function HomePage({ onPlay }: HomePageProps) {
  const { movies, series, all, popular, loading } = useContent();

  if (loading) {
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

  return (
    <div>
      <div className="mb-6">
        <HeroBanner movies={featured} onPlay={onPlay} />
      </div>
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
