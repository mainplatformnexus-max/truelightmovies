import { useState } from "react";
import { useContent } from "../lib/useContent";
import type { ContentItem } from "../lib/types";

const CATEGORIES = [
  "All", "Action", "Comedy", "Drama", "Horror", "Romance",
  "Sci-Fi", "Thriller", "Animation", "Documentary", "Christian",
];

function ContentCard({ item, onPlay }: { item: ContentItem; onPlay?: (m: ContentItem) => void }) {
  const [err, setErr] = useState(false);
  return (
    <div className="cursor-pointer group" onClick={() => onPlay?.(item)}>
      <div className="relative rounded-xl overflow-hidden bg-[#1e2029]" style={{ aspectRatio: "2/3" }}>
        {!err && item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2d3a] to-[#1a1c24]">
            <span className="text-white/20 text-3xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded"
            style={{ background: item.type === "series" ? "rgba(6,182,212,0.85)" : "rgba(168,85,247,0.85)" }}>
            {item.type === "series" ? "TV" : "HD"}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <p className="text-white text-xs font-semibold mt-2 line-clamp-2 leading-tight">{item.title}</p>
      <p className="text-white/40 text-[10px] mt-0.5">{item.year} · {item.category}</p>
    </div>
  );
}

export function CategoriesPage({ onPlay }: { onPlay?: (m: ContentItem) => void }) {
  const { all, loading } = useContent();
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = all
    .filter(m => selected === "All" || m.category?.toLowerCase() === selected.toLowerCase())
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()));

  const counts: Record<string, number> = { All: all.length };
  CATEGORIES.slice(1).forEach(cat => {
    counts[cat] = all.filter(m => m.category?.toLowerCase() === cat.toLowerCase()).length;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-28 md:pb-10">
      <div className="mb-5">
        <h1 className="text-white text-xl font-bold mb-1">Browse Categories</h1>
        <p className="text-white/40 text-sm">{all.length} titles available</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl text-sm text-white outline-none border"
          style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.filter(c => counts[c] > 0 || c === "All").map(cat => (
          <button
            key={cat}
            onClick={() => { setSelected(cat); setSearch(""); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={selected === cat
              ? { background: "linear-gradient(90deg,#a855f7,#ec4899)", color: "white" }
              : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }
            }
          >
            {cat}
            <span className={`text-[10px] px-1 rounded-full ${selected === cat ? "bg-white/20" : "bg-white/10"}`}>
              {counts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">
          {search ? `Results for "${search}"` : selected === "All" ? "All Content" : selected}
          <span className="text-white/40 font-normal ml-2">({filtered.length})</span>
        </h2>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {filtered.map(m => <ContentCard key={m.id} item={m} onPlay={onPlay} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-white/50 text-sm">No titles in this category yet.</p>
          <p className="text-white/30 text-xs mt-1">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
