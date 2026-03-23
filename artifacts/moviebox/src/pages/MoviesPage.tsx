import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { popularMovies, actionMovies, horrorMovies, adventureMovies } from "../data/movies";

interface MoviesPageProps {
  onPlay?: () => void;
}

export function MoviesPage({ onPlay }: MoviesPageProps) {
  return (
    <div className="pt-4">
      <div className="px-3 md:px-0">
        <h1 className="text-white text-xl font-bold mb-6">Movies</h1>
        <MovieRow title="Popular Movies" movies={popularMovies} onPlay={onPlay} />
        <MovieRow title="Action Movies" movies={actionMovies} onPlay={onPlay} />
        <MovieRow title="Horror Movies" movies={horrorMovies} onPlay={onPlay} />
        <MovieRow title="Adventure Movies" movies={adventureMovies} onPlay={onPlay} />
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
