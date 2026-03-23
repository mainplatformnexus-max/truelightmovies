import { useState } from "react";
import type { Movie } from "../data/movies";
import { popularMovies, popularSeries } from "../data/movies";

interface PlayPageProps {
  movie: Movie;
  onBack: () => void;
}

const TMDB_IMG = "https://image.tmdb.org/t/p/";

function generateEpisodes(count: number) {
  const durations = [42, 45, 48, 51, 44, 46, 50, 43, 47, 52];
  return Array.from({ length: count }, (_, i) => ({
    ep: i + 1,
    title: `Episode ${i + 1}`,
    duration: `${durations[i % durations.length]}min`,
  }));
}

function RelatedCard({ movie }: { movie: Movie }) {
  const [err, setErr] = useState(false);
  return (
    <div className="cursor-pointer group">
      <div className="relative rounded-lg overflow-hidden bg-[#2b2e39]" style={{ aspectRatio: "2/3" }}>
        {!err ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2b2e39] to-[#1a1c24]">
            <span className="text-white/20 text-2xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5">
          <div className="flex items-center gap-1">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#facc15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-yellow-400 text-[9px] font-bold">{movie.rating}</span>
          </div>
        </div>
      </div>
      <p className="text-white text-[10px] font-medium mt-1 line-clamp-2 leading-tight">{movie.title}</p>
    </div>
  );
}

export function PlayPage({ movie, onBack }: PlayPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [inList, setInList] = useState(false);
  const [progress] = useState(0);
  const [activeTab, setActiveTab] = useState<"episodes" | "related">(
    movie.type === "series" ? "episodes" : "related"
  );
  const [descExpanded, setDescExpanded] = useState(false);
  const [selectedEp, setSelectedEp] = useState(1);
  const [backdropErr, setBackdropErr] = useState(false);

  const episodeCount = (movie.seasons ?? 1) * 10;
  const episodes = generateEpisodes(episodeCount);

  const related = movie.type === "series"
    ? popularSeries.filter((m) => m.id !== movie.id).slice(0, 9)
    : popularMovies.filter((m) => m.id !== movie.id).slice(0, 9);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#101114] text-white overflow-y-auto">

      {/* ── VIDEO PLAYER ── */}
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
        {!backdropErr ? (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
            onError={() => setBackdropErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#0d0d0d]" />
        )}

        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center px-3 pt-3 pb-8"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)" }}
        >
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span className="text-white text-sm font-semibold line-clamp-1 flex-1 text-center mx-2">
            {movie.title}
          </span>
          <button className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Skip buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none">
          <button className="pointer-events-auto w-10 h-10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.74"/>
            </svg>
          </button>
          <button className="pointer-events-auto w-10 h-10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-.49-3.74"/>
            </svg>
          </button>
        </div>

        {/* Bottom controls */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-10"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
        >
          {/* Progress bar */}
          <div className="relative w-full h-1 bg-white/30 rounded-full mb-2 cursor-pointer">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          {/* Time + fullscreen */}
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">00:00</span>
            <div className="flex items-center gap-4">
              <button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/>
                  <polyline points="14 2 20 2 20 8"/><line x1="20" y1="2" x2="10" y2="12"/>
                </svg>
              </button>
              <button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
                </svg>
              </button>
            </div>
            <span className="text-white/70 text-xs">{movie.type === "series" ? "45:00" : "1:58:00"}</span>
          </div>
        </div>
      </div>

      {/* ── INFO SECTION ── */}
      <div className="px-4 pt-4 pb-28">

        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-white text-lg font-bold leading-snug flex-1">{movie.title}</h1>
          <span
            className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded mt-0.5 text-white"
            style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
          >
            {movie.type === "series" ? "TV" : "HD"}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-yellow-400 text-sm font-bold">{movie.rating}</span>
          </div>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-xs">{movie.year}</span>
          {movie.type === "series" && (
            <>
              <span className="text-white/30 text-xs">|</span>
              <span className="text-white/60 text-xs">{movie.seasons} Season{(movie.seasons ?? 1) > 1 ? "s" : ""}</span>
            </>
          )}
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-xs">{movie.genre[0]}</span>
        </div>

        {/* Genre tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {movie.genre.map((g) => (
            <span key={g} className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">{g}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-around py-3 mb-5 bg-white/5 rounded-2xl">
          <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={liked ? "#ec4899" : "none"}
              stroke={liked ? "#ec4899" : "rgba(255,255,255,0.7)"}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="text-white/50 text-[10px]">Like</span>
          </button>

          <button className="flex flex-col items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span className="text-white/50 text-[10px]">Download</span>
          </button>

          <button className="flex flex-col items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span className="text-white/50 text-[10px]">Share</span>
          </button>

          <button onClick={() => setInList(!inList)} className="flex flex-col items-center gap-1.5">
            {inList ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#a855f7" stroke="#a855f7" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
            <span className="text-white/50 text-[10px]">My List</span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-5">
          <p className={`text-white/65 text-sm leading-relaxed ${descExpanded ? "" : "line-clamp-3"}`}>
            {movie.description}
          </p>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="text-[#a855f7] text-xs mt-1.5 font-semibold"
          >
            {descExpanded ? "Show less ▲" : "More ▼"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-white/10 mb-4">
          {movie.type === "series" && (
            <button
              onClick={() => setActiveTab("episodes")}
              className={`pb-2 mr-6 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === "episodes" ? "text-white border-[#a855f7]" : "text-white/40 border-transparent"
              }`}
            >
              Episodes
            </button>
          )}
          <button
            onClick={() => setActiveTab("related")}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "related" ? "text-white border-[#a855f7]" : "text-white/40 border-transparent"
            }`}
          >
            Related
          </button>
        </div>

        {/* Episodes list */}
        {activeTab === "episodes" && movie.type === "series" && (
          <div className="flex flex-col gap-2">
            {episodes.map((ep) => (
              <button
                key={ep.ep}
                onClick={() => setSelectedEp(ep.ep)}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                  selectedEp === ep.ep
                    ? "bg-[#a855f7]/15 border border-[#a855f7]/35"
                    : "bg-white/5 border border-transparent"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="relative flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1c24]"
                  style={{ width: 88, height: 52 }}
                >
                  <img
                    src={`${TMDB_IMG}w300${movie.backdrop.replace(/.*original/, "")}`}
                    alt=""
                    className="w-full h-full object-cover opacity-50"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedEp === ep.ep ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    ) : (
                      <span className="text-white/50 text-xs font-bold">{ep.ep}</span>
                    )}
                  </div>
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${selectedEp === ep.ep ? "text-[#c084fc]" : "text-white"}`}>
                    {ep.title}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{ep.duration}</p>
                </div>
                {selectedEp === ep.ep && (
                  <div
                    className="flex-shrink-0 w-1 h-7 rounded-full"
                    style={{ background: "linear-gradient(180deg,#a855f7,#ec4899)" }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Related grid */}
        {activeTab === "related" && (
          <div className="grid grid-cols-3 gap-2.5">
            {related.map((m) => (
              <RelatedCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
