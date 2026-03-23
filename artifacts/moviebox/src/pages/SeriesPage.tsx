import { MovieRow } from "../components/MovieRow";
import { PcFooter } from "../components/PcFooter";
import { H5Footer } from "../components/H5Footer";
import { useContent } from "../lib/useContent";
import type { ContentItem } from "../lib/types";

interface SeriesPageProps {
  onPlay?: (movie: ContentItem) => void;
}

export function SeriesPage({ onPlay }: SeriesPageProps) {
  const { series, loading } = useContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Loading series...</div>
      </div>
    );
  }

  const byCategory = (category: string) =>
    series.filter(s => s.category?.toLowerCase() === category.toLowerCase());

  const categories = ["action", "drama", "comedy", "thriller", "horror", "adventure"];
  const categorized = categories.map(cat => ({ label: cat.charAt(0).toUpperCase() + cat.slice(1), items: byCategory(cat) }));
  const other = series.filter(s => !categories.includes(s.category?.toLowerCase() ?? ""));

  return (
    <div className="pt-4">
      <div className="px-3 md:px-0">
        <h1 className="text-white text-xl font-bold mb-6">TV Shows</h1>
        {series.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/20 text-5xl mb-3">📺</div>
            <p className="text-white/40 text-sm">No series uploaded yet.</p>
          </div>
        )}
        {series.length > 0 && (
          <MovieRow title="All Series" movies={series} showAll onPlay={onPlay} />
        )}
        {categorized.map(({ label, items }) =>
          items.length > 0 ? (
            <MovieRow key={label} title={label} movies={items} onPlay={onPlay} />
          ) : null
        )}
        {other.length > 0 && (
          <MovieRow title="Other" movies={other} onPlay={onPlay} />
        )}
      </div>
      <PcFooter />
      <H5Footer />
    </div>
  );
}
