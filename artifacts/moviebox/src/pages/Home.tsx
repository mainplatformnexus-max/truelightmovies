import { HeroBanner } from "../components/HeroBanner";
import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import type { Movie } from "../data/movies";
import { featuredMovies, popularSeries, popularMovies, actionMovies, horrorMovies, adventureMovies } from "../data/movies";

interface HomePageProps {
  onPlay?: (movie: Movie) => void;
}

export function HomePage({ onPlay }: HomePageProps) {
  return (
    <div>
      <div className="mb-6">
        <HeroBanner movies={featuredMovies} onPlay={onPlay} />
      </div>
      <div className="px-3 md:px-0">
        <MovieRow title="Popular Series" movies={popularSeries} onPlay={onPlay} />
        <MovieRow title="Popular Movie" movies={popularMovies} onPlay={onPlay} />
        <MovieRow title="Action Movies" movies={actionMovies} onPlay={onPlay} />
        <MovieRow title="Horror Movies" movies={horrorMovies} onPlay={onPlay} />
        <MovieRow title="Adventure Movies" movies={adventureMovies} onPlay={onPlay} />
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
