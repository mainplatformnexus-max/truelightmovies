import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { ContentItem } from "../lib/types";

interface HistoryItem {
  docId: string;
  contentId: string;
  title: string;
  thumbnail: string;
  type: "movie" | "series";
  category: string;
  year: number;
  watchedAt: { seconds: number } | null;
}

function HistoryCard({ item, onPlay, onRemove }: { item: HistoryItem; onPlay?: (id: string) => void; onRemove: (docId: string) => void }) {
  const [err, setErr] = useState(false);
  const timeAgo = (ts: { seconds: number } | null) => {
    if (!ts) return "Recently";
    const now = Date.now() / 1000;
    const diff = now - ts.seconds;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(ts.seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3 group rounded-xl p-2.5 transition-colors hover:bg-white/5">
      <div
        className="relative flex-shrink-0 rounded-lg overflow-hidden bg-[#1e2029] cursor-pointer"
        style={{ width: 80, height: 112 }}
        onClick={() => onPlay?.(item.contentId)}
      >
        {!err && item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={() => setErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span className="text-white/20 text-xl">🎬</span></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div className="absolute top-1 left-1">
          <span className="text-[9px] font-bold text-white px-1 py-0.5 rounded"
            style={{ background: item.type === "series" ? "rgba(6,182,212,0.8)" : "rgba(168,85,247,0.8)" }}>
            {item.type === "series" ? "TV" : "HD"}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPlay?.(item.contentId)}>
        <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{item.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-white/40 text-[11px]">{item.year}</span>
          {item.category && <span className="text-white/40 text-[11px]">· {item.category}</span>}
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-white/30 text-[11px]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
          {timeAgo(item.watchedAt)}
        </div>
      </div>
      <button
        onClick={() => onRemove(item.docId)}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove from history"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
      </button>
    </div>
  );
}

export function WatchHistoryPage({ onPlay }: { onPlay?: (contentId: string) => void }) {
  const { profile } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    if (!profile?.uid) { setLoading(false); return; }
    setLoading(true);
    try {
      const q = query(
        collection(db, "watchHistory"),
        where("uid", "==", profile.uid),
        orderBy("watchedAt", "desc")
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map(d => ({ docId: d.id, ...d.data() } as HistoryItem)));
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [profile?.uid]);

  const removeItem = async (docId: string) => {
    await deleteDoc(doc(db, "watchHistory", docId));
    setHistory(prev => prev.filter(h => h.docId !== docId));
  };

  const clearAll = async () => {
    if (!profile?.uid || !history.length) return;
    setClearing(true);
    try {
      const batch = writeBatch(db);
      history.forEach(h => batch.delete(doc(db, "watchHistory", h.docId)));
      await batch.commit();
      setHistory([]);
    } finally {
      setClearing(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(168,85,247,0.15)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="1.5"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
        </div>
        <p className="text-white font-semibold text-base mb-1">Sign in to see your history</p>
        <p className="text-white/40 text-sm">Your watch history will appear here once you log in.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-28 md:pb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-sm md:text-xl font-bold mb-0.5">Watch History</h1>
          <p className="text-white/40 text-xs md:text-sm">{history.length} titles watched</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            disabled={clearing}
            className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-400/10 disabled:opacity-50"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-white/40 text-sm animate-pulse">Loading history...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📺</div>
          <p className="text-white font-semibold mb-1">No watch history yet</p>
          <p className="text-white/40 text-sm">Start watching content and it will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#13151a" }}>
          {history.map((item, i) => (
            <div key={item.docId} style={{ borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <HistoryCard item={item} onPlay={onPlay} onRemove={removeItem} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
