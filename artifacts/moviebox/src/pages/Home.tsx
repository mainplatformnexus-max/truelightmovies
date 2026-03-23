import { HeroBanner } from "../components/HeroBanner";
import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import {
  featuredMovies,
  popularSeries,
  popularMovies,
  actionMovies,
  horrorMovies,
  adventureMovies,
} from "../data/movies";

export function HomePage() {
  return (
    <div>
      {/* Hero Banner / Carousel */}
      <div className="mb-6">
        <HeroBanner movies={featuredMovies} />
      </div>

      {/* Content sections */}
      <div className="px-3 md:px-0">
        <MovieRow title="Popular Series" movies={popularSeries} />
        <MovieRow title="Popular Movie" movies={popularMovies} />
        <MovieRow title="Action Movies" movies={actionMovies} />
        <MovieRow title="Horror Movies" movies={horrorMovies} />
        <MovieRow title="Adventure Movies" movies={adventureMovies} />
      </div>

      {/* Footers */}
      <PcFooter />
      <H5Footer />
    </div>
  );
}
