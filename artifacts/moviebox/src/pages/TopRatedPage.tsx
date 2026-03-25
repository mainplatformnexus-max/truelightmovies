import { useState } from "react";
import { useContent } from "../lib/useContent";
import type { ContentItem } from "../lib/types";

type SortMode = "views" | "popular" | "newest";

function RankCard({ item, rank, onPlay }: { item: ContentItem; rank: number; onPlay?: (m: ContentItem) => void }) {
  const [err, setErr] = useState(false);
  const rankColor = rank === 1 ? "#f59e0b" : rank === 2 ? "#9ca3af" : rank === 3 ? "#b45309" : "rgba(255,255,255,0.3)";

  return (
    <div
      className="flex items-center gap-3 cursor-pointer group rounded-xl p-2.5 transition-colors hover:bg-white/5"
      onClick={() => onPlay?.(item)}
    >
      <div className="flex-shrink-0 w-8 text-center">
        {rank <= 3 ? (
          <span className="text-xl font-black" style={{ color: rankColor }}>
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
          </span>
        ) : (
          <span className="text-base font-bold" style={{ color: rankColor }}>{rank}</span>
        )}
      </div>
      <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1e2029]">
        {!err && item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-lg">🎬</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold line-clamp-1">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-white/40 text-[11px]">{item.year}</span>
          {item.category && <span className="text-white/40 text-[11px]">· {item.category}</span>}
          <span
            className="text-[10px] font-bold px-1.5 py-px rounded"
            style={item.type === "series"
              ? { background: "rgba(6,182,212,0.15)", color: "#06b6d4" }
              : { background: "rgba(168,85,247,0.15)", color: "#a855f7" }
            }
          >
            {item.type === "series" ? "TV" : "Movie"}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1 text-white/50 text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          {(item.views || 0).toLocaleString()}
        </div>
        {item.popular && (
          <div className="flex items-center gap-0.5 justify-end mt-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span className="text-[10px] text-yellow-400">Popular</span>
          </div>
        )}
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
  );
}

function PodiumCard({ item, rank, onPlay }: { item: ContentItem; rank: number; onPlay?: (m: ContentItem) => void }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div
      className={`cursor-pointer group relative rounded-xl overflow-hidden ${rank === 1 ? "-mt-4" : ""}`}
      style={{ aspectRatio: "2/3" }}
      onClick={() => onPlay?.(item)}
    >
      {!imgErr && item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#2a2d3a] to-[#1a1c24] flex items-center justify-center">
          <span className="text-white/20 text-4xl">🎬</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute top-2 left-2 text-xl">
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-[11px] font-bold line-clamp-2 leading-tight">{item.title}</p>
        <p className="text-white/50 text-[9px] mt-0.5">{(item.views || 0).toLocaleString()} views</p>
      </div>
    </div>
  );
}

export function TopRatedPage({ onPlay }: { onPlay?: (m: ContentItem) => void }) {
  const { all, loading } = useContent();
  const [sortMode, setSortMode] = useState<SortMode>("views");
  const [filter, setFilter] = useState<"all" | "movie" | "series">("all");

  const sorted = [...all]
    .filter(m => filter === "all" || m.type === filter)
    .sort((a, b) => {
      if (sortMode === "popular") {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return (b.views || 0) - (a.views || 0);
      }
      if (sortMode === "newest") return (b.year || 0) - (a.year || 0);
      return (b.views || 0) - (a.views || 0);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Loading top rated...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-28 md:pb-10">
      <div className="mb-5">
        <h1 className="text-white text-sm md:text-xl font-bold mb-0.5">Top Rated</h1>
        <p className="text-white/40 text-xs md:text-sm">Best content ranked by popularity</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex gap-1.5">
          {(["all", "movie", "series"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={filter === id
                ? { background: "linear-gradient(90deg,#a855f7,#ec4899)", color: "white" }
                : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
              }
            >
              {id === "all" ? "All" : id === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-auto">
          {(["views", "popular", "newest"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setSortMode(id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={sortMode === id
                ? { background: "rgba(168,85,247,0.2)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.4)" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }
              }
            >
              {id === "views" ? "Most Viewed" : id === "popular" ? "Popular" : "Newest"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <PodiumCard item={sorted[1]} rank={2} onPlay={onPlay} />
          <PodiumCard item={sorted[0]} rank={1} onPlay={onPlay} />
          <PodiumCard item={sorted[2]} rank={3} onPlay={onPlay} />
        </div>
      )}

      {/* Ranked list */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#13151a" }}>
        {sorted.length > 0 ? (
          sorted.map((item, i) => (
            <div key={item.id} style={{ borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <RankCard item={item} rank={i + 1} onPlay={onPlay} />
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-white/50 text-sm">No content available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
