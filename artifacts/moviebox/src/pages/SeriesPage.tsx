import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { popularSeries } from "../data/movies";

export function SeriesPage() {
  return (
    <div className="pt-4">
      <div className="px-3 md:px-0">
        <h1 className="text-white text-xl font-bold mb-6">TV Shows</h1>
        <MovieRow title="Popular Series" movies={popularSeries} showAll />
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
