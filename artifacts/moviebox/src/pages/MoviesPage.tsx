import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { useContent } from "../lib/useContent";
import type { ContentItem } from "../lib/types";

interface MoviesPageProps {
  onPlay?: (movie: ContentItem) => void;
}

export function MoviesPage({ onPlay }: MoviesPageProps) {
  const { movies, loading } = useContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Loading movies...</div>
      </div>
    );
  }

  const byCategory = (category: string) =>
    movies.filter(m => m.category?.toLowerCase() === category.toLowerCase());

  const actionMovies = byCategory("action");
  const horrorMovies = byCategory("horror");
  const adventureMovies = byCategory("adventure");
  const dramaMovies = byCategory("drama");
  const comedyMovies = byCategory("comedy");
  const thrillerMovies = byCategory("thriller");
  const categories = ["action", "horror", "adventure", "drama", "comedy", "thriller"];
  const otherMovies = movies.filter(
    m => !categories.includes(m.category?.toLowerCase() ?? "")
  );

  return (
    <div className="pt-4">
      <div className="px-3 md:px-0">
        <h1 className="text-white text-sm md:text-xl font-bold mb-3 md:mb-6">Movies</h1>
        {movies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/20 text-5xl mb-3">🎬</div>
            <p className="text-white/40 text-sm">No movies uploaded yet.</p>
          </div>
        )}
        {movies.length > 0 && (
          <MovieRow title="All Movies" movies={movies} onPlay={onPlay} />
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
        {otherMovies.length > 0 && (
          <MovieRow title="Other" movies={otherMovies} onPlay={onPlay} />
        )}
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
