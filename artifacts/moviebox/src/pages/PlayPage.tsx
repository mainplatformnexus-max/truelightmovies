import { useState, useEffect, useRef } from "react";
import type { ContentItem, EpisodeItem } from "../lib/types";
import { useContent } from "../lib/useContent";
import { useAuth } from "../contexts/AuthContext";
import { SubscribeModal } from "../components/SubscribeModal";
import { VideoPlayer } from "../components/VideoPlayer";
import { useUserActions, recordWatchHistory, downloadContent, shareContent } from "../lib/useUserActions";

interface PlayPageProps {
  movie: ContentItem;
  onBack: () => void;
}

function RelatedCard({ movie, onPlay }: { movie: ContentItem; onPlay?: (m: ContentItem) => void }) {
  const [err, setErr] = useState(false);
  return (
    <div className="cursor-pointer group" onClick={() => onPlay?.(movie)}>
      <div className="relative rounded-lg overflow-hidden bg-[#2b2e39]" style={{ aspectRatio: "2/3" }}>
        {!err && movie.thumbnail ? (
          <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" onError={() => setErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2b2e39] to-[#1a1c24]">
            <span className="text-white/20 text-2xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5">
          <span className="text-white/70 text-[9px] font-bold bg-black/40 px-1 rounded">{movie.type === "series" ? "TV" : "HD"}</span>
        </div>
      </div>
      <p className="text-white text-[10px] font-medium mt-1 line-clamp-2 leading-tight">{movie.title}</p>
    </div>
  );
}

export function PlayPage({ movie, onBack }: PlayPageProps) {
  const { profile } = useAuth();
  const { all, episodes: allEpisodes } = useContent();
  const isSubscribed = profile?.status === "active" || profile?.role === "vj" || profile?.role === "admin";

  const [showSubModal, setShowSubModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareToast, setShareToast] = useState("");
  const historyRecorded = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [progress] = useState(0);
  const [activeTab, setActiveTab] = useState<"episodes" | "related">(movie.type === "series" ? "episodes" : "related");
  const [selectedEp, setSelectedEp] = useState(1);
  const [backdropErr, setBackdropErr] = useState(false);
  const [activeMovie, setActiveMovie] = useState<ContentItem>(movie);

  const { liked, inList, toggleLike, toggleList } = useUserActions(profile?.uid, activeMovie.id);

  const seriesEpisodes: EpisodeItem[] = allEpisodes.filter(e => e.seriesId === activeMovie.id);
  const episodeCount = seriesEpisodes.length > 0 ? seriesEpisodes.length : (activeMovie.seasons ?? 1) * 10;
  const episodes = seriesEpisodes.length > 0
    ? seriesEpisodes
    : Array.from({ length: episodeCount }, (_, i) => ({
        id: `ep-${i + 1}`,
        seriesId: activeMovie.id,
        title: `Episode ${i + 1}`,
        season: 1,
        episode: i + 1,
        url: activeMovie.url,
        duration: "45min",
      } as EpisodeItem));

  const related = all.filter(m => m.id !== activeMovie.id && m.category === activeMovie.category).slice(0, 14);
  const fallbackRelated = all.filter(m => m.id !== activeMovie.id).slice(0, 14);
  const displayRelated = related.length > 0 ? related : fallbackRelated;

  const currentEpUrl = seriesEpisodes.find(e => e.episode === selectedEp)?.url ?? activeMovie.url;

  const handleRelatedPlay = (m: ContentItem) => {
    setActiveMovie(m);
    setBackdropErr(false);
    setSelectedEp(1);
    setActiveTab(m.type === "series" ? "episodes" : "related");
    historyRecorded.current = false;
  };

  const requireSub = (cb: () => void) => {
    if (!isSubscribed) { setShowSubModal(true); return; }
    cb();
  };

  const handlePlay = () => {
    requireSub(() => {
      setIsPlaying(!isPlaying);
    });
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (isSubscribed && profile?.uid && !historyRecorded.current) {
      historyRecorded.current = true;
      recordWatchHistory(profile.uid, activeMovie);
    }
  };

  const handleDownload = () => {
    requireSub(() => {
      if (activeMovie.url) {
        downloadContent(activeMovie.url, activeMovie.title, activeMovie.vjName);
      }
    });
  };

  const handleShare = async () => {
    const result = await shareContent(activeMovie.title, window.location.href);
    if (result === "copied") {
      setShareToast("Link copied!");
      setTimeout(() => setShareToast(""), 2500);
    } else if (result === "shared") {
      setShareToast("Shared!");
      setTimeout(() => setShareToast(""), 2500);
    }
  };

  const handleLike = () => {
    if (!profile) { setShowSubModal(true); return; }
    toggleLike(activeMovie);
  };

  const handleList = () => {
    if (!profile) { setShowSubModal(true); return; }
    toggleList(activeMovie);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#101114] text-white overflow-y-auto">
      {showSubModal && <SubscribeModal onClose={() => setShowSubModal(false)} isMobile={isMobile} />}

      {/* Share toast */}
      {shareToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2 rounded-full text-white text-xs font-semibold shadow-lg"
          style={{ background: "rgba(168,85,247,0.9)", backdropFilter: "blur(8px)" }}>
          {shareToast}
        </div>
      )}

      {/* VIDEO PLAYER */}
      <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
        {isSubscribed && activeMovie.url ? (
          <video
            key={`${activeMovie.id}-ep-${selectedEp}`}
            src={currentEpUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay={isPlaying}
            onPlay={handleVideoPlay}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <>
            {!backdropErr && activeMovie.thumbnail ? (
              <img src={activeMovie.thumbnail} alt={activeMovie.title} className="w-full h-full object-cover opacity-40" onError={() => setBackdropErr(true)} />
            ) : (
              <div className="w-full h-full bg-[#0d0d0d]" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 active:scale-95 transition-transform"
              >
                {!isSubscribed ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>
            {!isSubscribed && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-white/50 text-xs bg-black/60 px-3 py-1 rounded-full">Subscribe to watch</span>
              </div>
            )}
          </>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center px-3 pt-3 pb-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)" }}>
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center flex-shrink-0 pointer-events-auto">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span className="text-white text-sm font-semibold line-clamp-1 flex-1 text-center mx-2">{activeMovie.title}</span>
          <div className="w-8 h-8 flex-shrink-0" />
        </div>

        {(!isSubscribed || !activeMovie.url) && (
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-10 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
            <div className="relative w-full h-1 bg-white/30 rounded-full mb-2">
              <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#a855f7,#ec4899)" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">00:00</span>
              <span className="text-white/70 text-xs">{activeMovie.type === "series" ? "45:00" : "1:58:00"}</span>
            </div>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="px-4 pt-4 pb-28">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-white text-lg font-bold leading-snug flex-1">{activeMovie.title}</h1>
          <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded mt-0.5 text-white" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
            {activeMovie.type === "series" ? "TV" : "HD"}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-white/60 text-xs">{activeMovie.year}</span>
          {activeMovie.type === "series" && activeMovie.seasons && (
            <><span className="text-white/30 text-xs">|</span><span className="text-white/60 text-xs">{activeMovie.seasons} Season{activeMovie.seasons > 1 ? "s" : ""}</span></>
          )}
          {activeMovie.category && (
            <><span className="text-white/30 text-xs">|</span><span className="text-white/60 text-xs">{activeMovie.category}</span></>
          )}
          {activeMovie.vjName && (
            <><span className="text-white/30 text-xs">|</span><span className="text-white/60 text-xs">By {activeMovie.vjName}</span></>
          )}
          <span className="text-white/40 text-xs">{(activeMovie.views || 0).toLocaleString()} views</span>
        </div>

        {activeMovie.category && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">{activeMovie.category}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-around py-3 mb-5 bg-white/5 rounded-2xl">
          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? "#ec4899" : "none"} stroke={liked ? "#ec4899" : "rgba(255,255,255,0.7)"} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className={`text-[10px] ${liked ? "text-pink-400" : "text-white/50"}`}>
              {liked ? "Liked" : "Like"}
            </span>
          </button>

          {/* Download */}
          <button onClick={handleDownload} className="flex flex-col items-center gap-1.5 relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke={isSubscribed ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"} strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {!isSubscribed && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(168,85,247,0.8)" className="absolute top-0 right-0">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            )}
            <span className="text-white/50 text-[10px]">Download</span>
          </button>

          {/* Share */}
          <button onClick={handleShare} className="flex flex-col items-center gap-1.5 relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span className="text-white/50 text-[10px]">Share</span>
          </button>

          {/* My List */}
          <button onClick={handleList} className="flex flex-col items-center gap-1.5">
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
            <span className={`text-[10px] ${inList ? "text-purple-400" : "text-white/50"}`}>
              {inList ? "In List" : "My List"}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-white/10 mb-4">
          {activeMovie.type === "series" && (
            <button onClick={() => setActiveTab("episodes")} className={`pb-2 mr-6 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab === "episodes" ? "text-white border-[#a855f7]" : "text-white/40 border-transparent"}`}>
              Episodes
            </button>
          )}
          <button onClick={() => setActiveTab("related")} className={`pb-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab === "related" ? "text-white border-[#a855f7]" : "text-white/40 border-transparent"}`}>
            Related
          </button>
        </div>

        {/* Episodes */}
        {activeTab === "episodes" && activeMovie.type === "series" && (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {episodes.map((ep) => (
              <button key={ep.id}
                onClick={() => requireSub(() => setSelectedEp(ep.episode))}
                className="aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95"
                style={selectedEp === ep.episode
                  ? { background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "1px solid rgba(168,85,247,0.6)", color: "white" }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid transparent" }
                }
              >
                {ep.episode}
              </button>
            ))}
          </div>
        )}

        {/* Related */}
        {activeTab === "related" && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
            {displayRelated.length > 0 ? (
              displayRelated.map((m) => <RelatedCard key={m.id} movie={m} onPlay={handleRelatedPlay} />)
            ) : (
              <p className="text-white/30 text-sm col-span-full text-center py-6">No related content yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
