import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

type Section = "overview" | "movies" | "series" | "episodes" | "users" | "wallet";

interface Movie {
  id: string;
  title: string;
  category: string;
  year: number;
  url: string;
  popular: boolean;
  thumbnail: string;
  views: number;
  vjName: string;
}

interface Series {
  id: string;
  title: string;
  category: string;
  year: number;
  url: string;
  popular: boolean;
  thumbnail: string;
  seasons: number;
  episodes: number;
}

interface Episode {
  id: string;
  seriesId: string;
  title: string;
  season: number;
  episode: number;
  url: string;
  duration: string;
}

interface User {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  joined: string;
  plan: string | null;
  planExpiry: string | null;
  status: "active" | "expired" | "none" | "blocked";
}

interface Transaction {
  id: string;
  type: "subscription" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  phone?: string;
}

const CATEGORIES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Animation", "Documentary", "Christian", "War", "Highschool", "Indian"];

function EditMovieModal({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const [form, setForm] = useState({ ...movie });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "movies", movie.id), {
        title: form.title, url: form.url, thumbnail: form.thumbnail,
        category: form.category, year: Number(form.year), popular: form.popular,
      });
      onClose();
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-white font-bold text-sm">Edit Movie</span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>
        <div className="p-5 space-y-3">
          <Input label="Movie Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
          <Input label="Movie URL" placeholder="https://..." value={form.url} onChange={v => setForm(p => ({ ...p, url: v }))} />
          <Input label="Thumbnail URL" placeholder="https://..." value={form.thumbnail} onChange={v => setForm(p => ({ ...p, thumbnail: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={CATEGORIES} value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} />
            <Input label="Year" type="number" value={String(form.year)} onChange={v => setForm(p => ({ ...p, year: Number(v) }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, popular: !p.popular }))} className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors" style={{ background: form.popular ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.15)" }}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.popular ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className="text-white/70 text-xs">Popular</span>
          </label>
          <GradBtn onClick={save}>{saving ? "Saving..." : "Save Changes"}</GradBtn>
        </div>
      </div>
    </div>
  );
}

function EditSeriesModal({ series, onClose }: { series: Series; onClose: () => void }) {
  const [form, setForm] = useState({ ...series });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "series", series.id), {
        title: form.title, thumbnail: form.thumbnail, category: form.category,
        year: Number(form.year), seasons: Number(form.seasons), popular: form.popular,
      });
      onClose();
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-white font-bold text-sm">Edit Series</span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>
        <div className="p-5 space-y-3">
          <Input label="Series Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
          <Input label="Thumbnail URL" placeholder="https://..." value={form.thumbnail} onChange={v => setForm(p => ({ ...p, thumbnail: v }))} />
          <div className="grid grid-cols-3 gap-3">
            <Select label="Category" options={CATEGORIES} value={form.category} onChange={v => setForm(p => ({ ...p, category: v }))} />
            <Input label="Year" type="number" value={String(form.year)} onChange={v => setForm(p => ({ ...p, year: Number(v) }))} />
            <Input label="Seasons" type="number" value={String(form.seasons)} onChange={v => setForm(p => ({ ...p, seasons: Number(v) }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm(p => ({ ...p, popular: !p.popular }))} className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors" style={{ background: form.popular ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.15)" }}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.popular ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className="text-white/70 text-xs">Popular</span>
          </label>
          <GradBtn onClick={save}>{saving ? "Saving..." : "Save Changes"}</GradBtn>
        </div>
      </div>
    </div>
  );
}

function EditEpisodeModal({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  const [form, setForm] = useState({ ...episode });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "episodes", episode.id), {
        title: form.title, url: form.url, duration: form.duration,
        season: Number(form.season), episode: Number(form.episode),
      });
      onClose();
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-white font-bold text-sm">Edit Episode</span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>
        <div className="p-5 space-y-3">
          <Input label="Episode Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} />
          <Input label="Episode URL" placeholder="https://..." value={form.url} onChange={v => setForm(p => ({ ...p, url: v }))} />
          <Input label="Duration" placeholder="e.g. 45m" value={form.duration} onChange={v => setForm(p => ({ ...p, duration: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Season #" type="number" value={String(form.season)} onChange={v => setForm(p => ({ ...p, season: Number(v) }))} />
            <Input label="Episode #" type="number" value={String(form.episode)} onChange={v => setForm(p => ({ ...p, episode: Number(v) }))} />
          </div>
          <GradBtn onClick={save}>{saving ? "Saving..." : "Save Changes"}</GradBtn>
        </div>
      </div>
    </div>
  );
}

const navItems: { id: Section; label: string; icon: JSX.Element }[] = [
  { id: "overview", label: "Overview", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
  { id: "movies", label: "Movies", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg> },
  { id: "series", label: "Series", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg> },
  { id: "episodes", label: "Episodes", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg> },
  { id: "users", label: "Users", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { id: "wallet", label: "Wallet", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> },
];

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="text-white/50 text-xs mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-white/40 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: JSX.Element }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-white font-bold text-lg">{title}</h2>
      {action}
    </div>
  );
}

function GradBtn({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 font-semibold text-white hover:opacity-90 transition-opacity rounded-lg ${small ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2"}`} style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
      {children}
    </button>
  );
}

function Input({ label, type = "text", placeholder, value, onChange }: { label?: string; type?: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      {label && <label className="block text-white/50 text-xs mb-1 font-medium">{label}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border transition-colors"
        style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(168,85,247,0.6)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
    </div>
  );
}

function Select({ label, options, value, onChange }: { label?: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      {label && <label className="block text-white/50 text-xs mb-1 font-medium">{label}</label>}
      <select value={value} onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border transition-colors appearance-none"
        style={{ background: "#1a1d24", borderColor: "rgba(255,255,255,0.1)" }}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-white font-bold text-sm">{title}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function OverviewSection({ movies, series, episodes, users, transactions }: { movies: Movie[]; series: Series[]; episodes: Episode[]; users: User[]; transactions: Transaction[] }) {
  const balance = transactions.filter(t => t.type === "subscription" && t.status === "completed").reduce((s, t) => s + t.amount, 0)
    - transactions.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const activeUsers = users.filter(u => u.status === "active").length;
  return (
    <div>
      <SectionHeader title="Dashboard Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Movies" value={movies.length} sub={`${movies.filter(m => m.popular).length} popular`} color="#a855f7" />
        <StatCard label="Total Series" value={series.length} sub={`${episodes.length} episodes`} color="#ec4899" />
        <StatCard label="Total Users" value={users.length} sub={`${activeUsers} active subscriptions`} color="#06b6d4" />
        <StatCard label="Wallet Balance" value={`UGX ${balance.toLocaleString()}`} sub="Available to withdraw" color="#22c55e" />
        <StatCard label="Total Revenue" value={`UGX ${transactions.filter(t => t.type === "subscription").reduce((s, t) => s + t.amount, 0).toLocaleString()}`} sub="All time" color="#f59e0b" />
        <StatCard label="Transactions" value={transactions.length} sub={`${transactions.filter(t => t.status === "pending").length} pending`} color="#8b5cf6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-white font-semibold text-sm mb-3">Recent Transactions</div>
          <div className="space-y-2">
            {transactions.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-medium">{t.description}</div>
                  <div className="text-white/40 text-[10px]">{t.date}</div>
                </div>
                <div className={`text-xs font-bold ${t.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}>
                  {t.type === "withdrawal" ? "-" : "+"}UGX {t.amount.toLocaleString()}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-white/30 text-xs">No transactions yet</p>}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-white font-semibold text-sm mb-3">User Breakdown</div>
          {[
            { label: "Active Subscribers", count: users.filter(u => u.status === "active").length, color: "#22c55e" },
            { label: "Expired Subscribers", count: users.filter(u => u.status === "expired").length, color: "#f59e0b" },
            { label: "Never Subscribed", count: users.filter(u => u.status === "none").length, color: "#ef4444" },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
              <div className="text-white/60 text-xs flex-1">{r.label}</div>
              <div className="text-white text-xs font-bold">{r.count}</div>
              {users.length > 0 && (
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(r.count / users.length) * 100}%`, background: r.color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoviesSection({ movies, setMovies, vjName }: { movies: Movie[]; setMovies: (m: Movie[]) => void; vjName: string }) {
  const [showModal, setShowModal] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const [form, setForm] = useState({ title: "", category: "", year: new Date().getFullYear().toString(), url: "", thumbnail: "", popular: false });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    if (!form.title || !form.category) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "movies"), {
        title: form.title,
        category: form.category,
        year: Number(form.year),
        url: form.url,
        thumbnail: form.thumbnail,
        popular: form.popular,
        views: 0,
        vjName,
        createdAt: serverTimestamp(),
      });
      setForm({ title: "", category: "", year: new Date().getFullYear().toString(), url: "", thumbnail: "", popular: false });
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const togglePopular = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "movies", id), { popular: !current });
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "movies", id));
  };

  return (
    <div>
      {editMovie && <EditMovieModal movie={editMovie} onClose={() => setEditMovie(null)} />}
      {showModal && (
        <Modal title="Upload Movie" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <Input label="Movie Title" placeholder="Enter title..." value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Category" options={CATEGORIES} value={form.category} onChange={v => setForm({ ...form, category: v })} />
              <Input label="Year" type="number" placeholder="2024" value={form.year} onChange={v => setForm({ ...form, year: v })} />
            </div>
            <Input label="Movie URL" placeholder="https://..." value={form.url} onChange={v => setForm({ ...form, url: v })} />
            <Input label="Thumbnail URL" placeholder="https://... (poster image)" value={form.thumbnail} onChange={v => setForm({ ...form, thumbnail: v })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setForm({ ...form, popular: !form.popular })} className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5" style={{ background: form.popular ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.15)" }}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.popular ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <span className="text-white/70 text-xs">Mark as Popular</span>
            </label>
            <GradBtn onClick={save}>{saving ? "Uploading..." : "Upload Movie"}</GradBtn>
          </div>
        </Modal>
      )}
      <SectionHeader title="Movies" action={<GradBtn onClick={() => setShowModal(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Upload Movie</GradBtn>} />
      <div className="mb-4"><Input placeholder="Search movies..." value={search} onChange={setSearch} /></div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1a1d24", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Title", "Category", "Year", "Views", "Popular", "Actions"].map(h => <th key={h} className="text-left text-white/50 text-xs font-medium px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-white text-sm font-medium">{m.title}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>{m.category}</span></td>
                <td className="px-4 py-3 text-white/60 text-sm">{m.year}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{m.views.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePopular(m.id, m.popular)} className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${m.popular ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40 hover:bg-white/15"}`}>
                    {m.popular ? "Popular" : "Set Popular"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditMovie(m)} className="text-purple-400/70 hover:text-purple-400 text-xs transition-colors">Edit</button>
                    <button onClick={() => remove(m.id)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">No movies found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SeriesSection({ series, setSeries, vjName }: { series: Series[]; setSeries: (s: Series[]) => void; vjName: string }) {
  const [showModal, setShowModal] = useState(false);
  const [editSeries, setEditSeries] = useState<Series | null>(null);
  const [form, setForm] = useState({ title: "", category: "", year: new Date().getFullYear().toString(), thumbnail: "", popular: false, seasons: "1" });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = series.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  const save = async () => {
    if (!form.title || !form.category) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "series"), {
        title: form.title,
        category: form.category,
        year: Number(form.year),
        url: "",
        thumbnail: form.thumbnail,
        popular: form.popular,
        seasons: Number(form.seasons),
        episodes: 0,
        vjName,
        createdAt: serverTimestamp(),
      });
      setForm({ title: "", category: "", year: new Date().getFullYear().toString(), thumbnail: "", popular: false, seasons: "1" });
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const togglePopular = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "series", id), { popular: !current });
  };
  const remove = async (id: string) => await deleteDoc(doc(db, "series", id));

  return (
    <div>
      {editSeries && <EditSeriesModal series={editSeries} onClose={() => setEditSeries(null)} />}
      {showModal && (
        <Modal title="Add Series" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <Input label="Series Title" placeholder="Enter title..." value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Category" options={CATEGORIES} value={form.category} onChange={v => setForm({ ...form, category: v })} />
              <Input label="Year" type="number" placeholder="2024" value={form.year} onChange={v => setForm({ ...form, year: v })} />
            </div>
            <Input label="Number of Seasons" type="number" placeholder="1" value={form.seasons} onChange={v => setForm({ ...form, seasons: v })} />
            <Input label="Thumbnail URL" placeholder="https://... (poster image)" value={form.thumbnail} onChange={v => setForm({ ...form, thumbnail: v })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setForm({ ...form, popular: !form.popular })} className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5" style={{ background: form.popular ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.15)" }}>
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.popular ? "translate-x-5" : "translate-x-0"}`} />
              </div>
              <span className="text-white/70 text-xs">Mark as Popular</span>
            </label>
            <GradBtn onClick={save}>{saving ? "Adding..." : "Add Series"}</GradBtn>
          </div>
        </Modal>
      )}
      <SectionHeader title="Series" action={<GradBtn onClick={() => setShowModal(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Add Series</GradBtn>} />
      <div className="mb-4"><Input placeholder="Search series..." value={search} onChange={setSearch} /></div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1a1d24", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Title", "Category", "Year", "Seasons", "Episodes", "Popular", "Actions"].map(h => <th key={h} className="text-left text-white/50 text-xs font-medium px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-white text-sm font-medium">{s.title}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(236,72,153,0.15)", color: "#ec4899" }}>{s.category}</span></td>
                <td className="px-4 py-3 text-white/60 text-sm">{s.year}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{s.seasons}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{s.episodes}</td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePopular(s.id, s.popular)} className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${s.popular ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40 hover:bg-white/15"}`}>
                    {s.popular ? "Popular" : "Set Popular"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditSeries(s)} className="text-purple-400/70 hover:text-purple-400 text-xs transition-colors">Edit</button>
                    <button onClick={() => remove(s.id)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30 text-sm">No series found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EpisodesSection({ series, episodes }: { series: Series[]; episodes: Episode[] }) {
  const [showModal, setShowModal] = useState(false);
  const [editEpisode, setEditEpisode] = useState<Episode | null>(null);
  const [filterSeries, setFilterSeries] = useState("");
  const [form, setForm] = useState({ seriesId: "", title: "", season: "1", episode: "1", url: "", duration: "" });
  const [saving, setSaving] = useState(false);

  const selectedSeriesObj = series.find(s => s.id === form.seriesId);
  const seasons = selectedSeriesObj ? Array.from({ length: selectedSeriesObj.seasons }, (_, i) => String(i + 1)) : ["1"];
  const filtered = episodes.filter(e => !filterSeries || e.seriesId === filterSeries);

  const save = async () => {
    if (!form.seriesId || !form.title || !form.url) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "episodes"), {
        seriesId: form.seriesId,
        title: form.title,
        season: Number(form.season),
        episode: Number(form.episode),
        url: form.url,
        duration: form.duration,
        createdAt: serverTimestamp(),
      });
      setForm({ seriesId: "", title: "", season: "1", episode: "1", url: "", duration: "" });
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => await deleteDoc(doc(db, "episodes", id));
  const getSeriesName = (id: string) => series.find(s => s.id === id)?.title ?? "Unknown";

  return (
    <div>
      {editEpisode && <EditEpisodeModal episode={editEpisode} onClose={() => setEditEpisode(null)} />}
      {showModal && (
        <Modal title="Add Episode" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <Select label="Select Series" options={series.map(s => s.title)} value={selectedSeriesObj?.title ?? ""} onChange={v => { const s = series.find(x => x.title === v); setForm({ ...form, seriesId: s ? s.id : "", season: "1" }); }} />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Season" options={seasons} value={form.season} onChange={v => setForm({ ...form, season: v })} />
              <Input label="Episode Number" type="number" placeholder="1" value={form.episode} onChange={v => setForm({ ...form, episode: v })} />
            </div>
            <Input label="Episode Title" placeholder="Episode title..." value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <Input label="Episode URL" placeholder="https://..." value={form.url} onChange={v => setForm({ ...form, url: v })} />
            <Input label="Duration" placeholder="e.g. 45m or 1h 20m" value={form.duration} onChange={v => setForm({ ...form, duration: v })} />
            <GradBtn onClick={save}>{saving ? "Adding..." : "Add Episode"}</GradBtn>
          </div>
        </Modal>
      )}
      <SectionHeader title="Episodes" action={<GradBtn onClick={() => setShowModal(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Add Episode</GradBtn>} />
      <div className="mb-4">
        <Select options={series.map(s => s.title)} value={series.find(s => s.id === filterSeries)?.title ?? ""} onChange={v => { const s = series.find(x => x.title === v); setFilterSeries(s ? s.id : ""); }} />
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1a1d24", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Series", "S", "E", "Title", "Duration", "Actions"].map(h => <th key={h} className="text-left text-white/50 text-xs font-medium px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-white/70 text-sm">{getSeriesName(e.seriesId)}</td>
                <td className="px-4 py-3 text-white/60 text-sm">S{e.season}</td>
                <td className="px-4 py-3 text-white/60 text-sm">E{e.episode}</td>
                <td className="px-4 py-3 text-white text-sm font-medium">{e.title}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{e.duration || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditEpisode(e)} className="text-purple-400/70 hover:text-purple-400 text-xs transition-colors">Edit</button>
                    <button onClick={() => remove(e.id)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">No episodes found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersSection({ users }: { users: User[] }) {
  const [tab, setTab] = useState<"all" | "active" | "none">("all");
  const [search, setSearch] = useState("");

  const filtered = users
    .filter(u => tab === "all" ? true : tab === "active" ? u.status === "active" : u.status === "none")
    .filter(u => u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (u: User) => {
    if (u.status === "active") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">Active</span>;
    if (u.status === "expired") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">Expired</span>;
    if (u.status === "blocked") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium">Blocked</span>;
    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40 font-medium">No Plan</span>;
  };

  return (
    <div>
      <SectionHeader title="Users" />
      <div className="flex gap-2 mb-4">
        {([["all", "All Users"], ["active", "Active Subscribers"], ["none", "Never Subscribed"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === id ? "text-white" : "text-white/50 hover:text-white/70"}`} style={{ background: tab === id ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.07)" }}>
            {label} ({users.filter(u => id === "all" ? true : id === "active" ? u.status === "active" : u.status === "none").length})
          </button>
        ))}
      </div>
      <div className="mb-4"><Input placeholder="Search users..." value={search} onChange={setSearch} /></div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1a1d24", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Name", "Email", "Phone", "Joined", "Plan", "Expiry", "Status"].map(h => <th key={h} className="text-left text-white/50 text-xs font-medium px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-white text-sm font-medium">{u.displayName}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{u.phone || "—"}</td>
                <td className="px-4 py-3 text-white/50 text-sm">{u.joined}</td>
                <td className="px-4 py-3 text-white/70 text-sm">{u.plan ?? "—"}</td>
                <td className="px-4 py-3 text-white/50 text-sm">{u.planExpiry ?? "—"}</td>
                <td className="px-4 py-3">{statusBadge(u)}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30 text-sm">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PAYMENT_API_BASE = "https://function-bun-production-ac72.up.railway.app";

function formatWithdrawMsisdn(raw: string): string {
  const cleaned = raw.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+256")) return cleaned;
  if (cleaned.startsWith("256")) return "+" + cleaned;
  if (cleaned.startsWith("0")) return "+256" + cleaned.slice(1);
  return "+256" + cleaned;
}

function WalletSection({ transactions }: { transactions: Transaction[] }) {
  const { profile } = useAuth();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [phone, setPhone] = useState(profile?.phone || "");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState<"all" | "subscription" | "withdrawal">("all");
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  const income = transactions.filter(t => t.type === "subscription" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const withdrawn = transactions.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const balance = income - withdrawn;
  const filtered = transactions.filter(t => filter === "all" ? true : t.type === filter);

  const amountNum = Number(amount);
  const amountExceedsBalance = amountNum > balance;
  const amountTooLow = amountNum > 0 && amountNum < 1000;

  const doWithdraw = async () => {
    if (!phone || !amount || amountNum < 1000 || amountExceedsBalance) return;
    const msisdn = formatWithdrawMsisdn(phone);
    setSaving(true);
    setWithdrawError("");
    try {
      const res = await fetch(`${PAYMENT_API_BASE}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn,
          amount: amountNum,
          description: "True Light Movie VJ Earnings Withdrawal",
        }),
      });
      const data = await res.json();
      console.log("Withdraw response:", data);

      if (data.success) {
        await addDoc(collection(db, "transactions"), {
          type: "withdrawal",
          amount: amountNum,
          description: `Withdrawal to ${msisdn}`,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
          phone: msisdn,
          createdAt: serverTimestamp(),
        });
        setWithdrawDone(true);
        setTimeout(() => {
          setWithdrawDone(false);
          setShowWithdraw(false);
          setPhone("");
          setAmount("");
          setWithdrawError("");
        }, 3000);
      } else {
        setWithdrawError(data.message || data.error || "Withdrawal failed. Please try again.");
      }
    } catch {
      setWithdrawError("Network error. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {showWithdraw && (
        <Modal title="Withdraw — Mobile Money" onClose={() => { if (!saving) { setShowWithdraw(false); setWithdrawError(""); } }}>
          {withdrawDone ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(34,197,94,0.15)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <div className="text-white font-bold text-sm">Withdrawal Successful!</div>
              <div className="text-white/50 text-xs mt-1">UGX {amountNum.toLocaleString()} → {formatWithdrawMsisdn(phone)}</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="text-white/50 text-xs mb-0.5">Available Balance</div>
                <div className="text-green-400 font-bold text-xl">UGX {balance.toLocaleString()}</div>
              </div>
              <Input label="Mobile Money Phone Number" placeholder="e.g. 0776123456" value={phone} onChange={v => { setPhone(v); setWithdrawError(""); }} />
              <Input label="Amount (UGX)" type="number" placeholder="Minimum UGX 1,000" value={amount} onChange={v => { setAmount(v); setWithdrawError(""); }} />
              {amountExceedsBalance && amountNum > 0 && <p className="text-red-400 text-xs">Amount exceeds your available balance of UGX {balance.toLocaleString()}</p>}
              {amountTooLow && <p className="text-yellow-400 text-xs">Minimum withdrawal is UGX 1,000</p>}
              {withdrawError && (
                <div className="p-2.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <p className="text-red-400 text-xs text-center">{withdrawError}</p>
                </div>
              )}
              <button
                onClick={doWithdraw}
                disabled={saving || amountExceedsBalance || amountTooLow || !phone || !amount}
                className="flex items-center gap-1.5 font-semibold text-white hover:opacity-90 transition-opacity rounded-lg text-sm px-4 py-2 disabled:opacity-50 w-full justify-center"
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/><path d="M20 18H4v2h16v-2z"/></svg>
                {saving ? "Processing…" : `Withdraw UGX ${amountNum > 0 ? amountNum.toLocaleString() : "—"}`}
              </button>
            </div>
          )}
        </Modal>
      )}
      <SectionHeader title="Wallet" action={<GradBtn onClick={() => setShowWithdraw(true)}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/><path d="M20 18H4v2h16v-2z"/></svg>Withdraw</GradBtn>} />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Balance" value={`UGX ${balance.toLocaleString()}`} sub="Available" color="#22c55e" />
        <StatCard label="Total Revenue" value={`UGX ${income.toLocaleString()}`} sub="All subscriptions" color="#a855f7" />
        <StatCard label="Total Withdrawn" value={`UGX ${withdrawn.toLocaleString()}`} sub="All time" color="#f59e0b" />
      </div>
      <div className="flex gap-2 mb-4">
        {([["all", "All"], ["subscription", "Subscriptions"], ["withdrawal", "Withdrawals"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === id ? "text-white" : "text-white/50 hover:text-white/70"}`} style={{ background: filter === id ? "linear-gradient(90deg,#a855f7,#ec4899)" : "rgba(255,255,255,0.07)" }}>
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#1a1d24", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Type", "Description", "Amount", "Date", "Status"].map(h => <th key={h} className="text-left text-white/50 text-xs font-medium px-4 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.type === "subscription" ? "bg-purple-500/15 text-purple-400" : "bg-orange-500/15 text-orange-400"}`}>{t.type === "subscription" ? "Subscription" : "Withdrawal"}</span></td>
                <td className="px-4 py-3 text-white/70 text-sm">{t.description}</td>
                <td className={`px-4 py-3 text-sm font-bold ${t.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}>{t.type === "withdrawal" ? "-" : "+"}UGX {t.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-white/50 text-sm">{t.date}</td>
                <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.status === "completed" ? "bg-green-500/15 text-green-400" : t.status === "pending" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"}`}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-white/30 text-sm">No transactions found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VJDashboard({ onBack }: { onBack: () => void }) {
  const { profile } = useAuth();
  const vjName = profile?.displayName || "VJ Emma";

  const [section, setSection] = useState<Section>("overview");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(query(collection(db, "movies"), orderBy("createdAt", "desc")), snap => {
      setMovies(snap.docs.map(d => ({ id: d.id, ...d.data() } as Movie)));
      setLoading(false);
    }));

    unsubs.push(onSnapshot(query(collection(db, "series"), orderBy("createdAt", "desc")), snap => {
      setSeries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Series)));
    }));

    unsubs.push(onSnapshot(query(collection(db, "episodes"), orderBy("createdAt", "desc")), snap => {
      setEpisodes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Episode)));
    }));

    unsubs.push(onSnapshot(collection(db, "userProfiles"), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    }));

    unsubs.push(onSnapshot(query(collection(db, "transactions"), orderBy("createdAt", "desc")), snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const renderSection = () => {
    if (loading) return <div className="flex items-center justify-center py-20"><div className="text-white/40 text-sm">Loading data...</div></div>;
    switch (section) {
      case "overview": return <OverviewSection movies={movies} series={series} episodes={episodes} users={users} transactions={transactions} />;
      case "movies": return <MoviesSection movies={movies} setMovies={setMovies} vjName={vjName} />;
      case "series": return <SeriesSection series={series} setSeries={setSeries} vjName={vjName} />;
      case "episodes": return <EpisodesSection series={series} episodes={episodes} />;
      case "users": return <UsersSection users={users} />;
      case "wallet": return <WalletSection transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0d0f13" }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[50] lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full z-[60] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: 220, background: "#101114", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white text-xs mb-4 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Back to Site
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9z"/></svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">VJ Dashboard</div>
              <div className="text-white/40 text-[10px]">{vjName}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${section === item.id ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              style={section === item.id ? { background: "linear-gradient(90deg,rgba(168,85,247,0.2),rgba(236,72,153,0.1))", borderLeft: "2px solid #a855f7" } : {}}>
              <span style={{ color: section === item.id ? "#a855f7" : "inherit" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 text-white/20 text-[10px]" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {vjName} · True Light Film
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[220px]">
        <div className="sticky top-0 z-40 flex items-center px-5 h-12" style={{ background: "#101114", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white mr-3 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </button>
          <h1 className="text-white font-bold text-sm capitalize">{section}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              {profile?.photoURL ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" /> : <span className="text-white text-xs font-bold">{vjName.charAt(0)}</span>}
            </div>
            <span className="text-white/60 text-xs hidden sm:block">{vjName}</span>
          </div>
        </div>
        <main className="flex-1 p-5 overflow-auto">{renderSection()}</main>
      </div>
    </div>
  );
}
