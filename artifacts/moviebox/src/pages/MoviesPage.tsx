import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { popularMovies, actionMovies, horrorMovies, adventureMovies } from "../data/movies";

export function MoviesPage() {
  return (
    <div className="pt-4">
      <div className="px-3 md:px-0">
        <h1 className="text-white text-xl font-bold mb-6">Movies</h1>
        <MovieRow title="Popular Movies" movies={popularMovies} />
        <MovieRow title="Action Movies" movies={actionMovies} />
        <MovieRow title="Horror Movies" movies={horrorMovies} />
        <MovieRow title="Adventure Movies" movies={adventureMovies} />
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
