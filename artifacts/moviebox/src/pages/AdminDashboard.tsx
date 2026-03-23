import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

type Section = "movies" | "series" | "episodes" | "users" | "activities" | "wallet" | "carousel";

const PLANS = ["1 Day", "1 Week", "1 Month"];
const CATEGORIES = ["Action","Comedy","Drama","Horror","Romance","Sci-Fi","Thriller","Animation","Documentary","Christian"];

interface CarouselItem { id: string; title: string; subtitle?: string; image: string; buttonText?: string; createdAt?: unknown; }
interface AdminMovie { id: string; title: string; category: string; year: number; url: string; thumbnail: string; views: number; popular: boolean; vjName: string; }
interface AdminSeries { id: string; title: string; category: string; year: number; seasons: number; episodes: number; thumbnail: string; popular: boolean; vjName: string; }
interface AdminEpisode { id: string; seriesId: string; seriesTitle?: string; season: number; episode: number; title: string; url: string; duration: string; }
interface AdminUser { id: string; displayName: string; email: string; phone: string; joined: string; plan: string | null; planExpiry: string | null; status: "active" | "expired" | "blocked" | "none"; }
interface Activity { id: string; username: string; phone: string; action: string; time: string; timestamp: number; }
interface AdminTransaction { id: string; type: string; amount: number; description: string; date: string; status: "completed" | "pending" | "failed"; phone?: string; }

const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    active: "bg-green-500/20 text-green-400",
    expired: "bg-yellow-500/20 text-yellow-400",
    blocked: "bg-red-500/20 text-red-400",
    none: "bg-white/10 text-white/40",
    completed: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
  };
  return `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${map[s] || "bg-white/10 text-white/40"}`;
};

const SIDEBAR_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id:"carousel", label:"Carousel", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 5h2v14H1V5zm4 0h2v14H5V5zm17 0H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-1 12H11V7h10v10z"/></svg> },
  { id:"movies", label:"Movies", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg> },
  { id:"series", label:"Series", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg> },
  { id:"episodes", label:"Episodes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> },
  { id:"users", label:"Users", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { id:"activities", label:"Activities", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5v-5l-2.28 2.28C7.81 18 6 15.21 6 12c0-4.08 3.05-7.44 7-7.93V2.05z"/></svg> },
  { id:"wallet", label:"Wallet", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> },
];

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-80 rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-white text-sm text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-9 rounded-lg text-xs text-white/70 border border-white/20 hover:border-white/40 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 h-9 rounded-lg text-xs text-white font-bold transition-opacity hover:opacity-90" style={{ background: "linear-gradient(90deg,#ef4444,#dc2626)" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function EditMovieModal({ movie, onSave, onClose }: { movie: AdminMovie; onSave: (m: AdminMovie) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...movie });
  const save = async () => {
    await updateDoc(doc(db, "movies", movie.id), {
      title: form.title,
      url: form.url,
      thumbnail: form.thumbnail,
      category: form.category,
      year: form.year,
      popular: form.popular,
    });
    onSave(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 className="text-white font-bold text-sm mb-4">Edit Movie</h3>
        {(["title","url","thumbnail"] as const).map(k => (
          <div key={k} className="mb-3">
            <label className="text-white/50 text-[11px] block mb-1 capitalize">{k}</label>
            <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10 focus:border-purple-500/60" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "#1a1d24" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Year</label>
            <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>
        <label className="flex items-center gap-2 mb-5 cursor-pointer">
          <input type="checkbox" checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} className="accent-purple-500 w-4 h-4" />
          <span className="text-white/70 text-xs">Mark as Popular</span>
        </label>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-xs text-white/70 border border-white/20 hover:border-white/40 transition-colors">Cancel</button>
          <button onClick={save} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function EditSeriesModal({ series, onSave, onClose }: { series: AdminSeries; onSave: (s: AdminSeries) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...series });
  const save = async () => {
    await updateDoc(doc(db, "series", series.id), {
      title: form.title,
      thumbnail: form.thumbnail,
      category: form.category,
      year: form.year,
      seasons: form.seasons,
      popular: form.popular,
    });
    onSave(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 className="text-white font-bold text-sm mb-4">Edit Series</h3>
        {(["title","thumbnail"] as const).map(k => (
          <div key={k} className="mb-3">
            <label className="text-white/50 text-[11px] block mb-1 capitalize">{k}</label>
            <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10 focus:border-purple-500/60" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-2 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "#1a1d24" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Year</label>
            <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} className="w-full h-9 px-2 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Seasons</label>
            <input type="number" value={form.seasons} onChange={e => setForm(p => ({ ...p, seasons: +e.target.value }))} className="w-full h-9 px-2 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>
        <label className="flex items-center gap-2 mb-5 cursor-pointer">
          <input type="checkbox" checked={form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} className="accent-purple-500 w-4 h-4" />
          <span className="text-white/70 text-xs">Mark as Popular</span>
        </label>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-xs text-white/70 border border-white/20 hover:border-white/40 transition-colors">Cancel</button>
          <button onClick={save} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function EditEpisodeModal({ episode, onSave, onClose }: { episode: AdminEpisode; onSave: (e: AdminEpisode) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...episode });
  const save = async () => {
    await updateDoc(doc(db, "episodes", episode.id), {
      title: form.title,
      url: form.url,
      duration: form.duration,
      season: form.season,
      episode: form.episode,
    });
    onSave(form);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 className="text-white font-bold text-sm mb-4">Edit Episode</h3>
        {(["title","url","duration"] as const).map(k => (
          <div key={k} className="mb-3">
            <label className="text-white/50 text-[11px] block mb-1 capitalize">{k}</label>
            <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10 focus:border-purple-500/60" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Season</label>
            <input type="number" value={form.season} onChange={e => setForm(p => ({ ...p, season: +e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div>
            <label className="text-white/50 text-[11px] block mb-1">Episode #</label>
            <input type="number" value={form.episode} onChange={e => setForm(p => ({ ...p, episode: +e.target.value }))} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-xs text-white/70 border border-white/20 hover:border-white/40 transition-colors">Cancel</button>
          <button onClick={save} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ManageUserModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [plan, setPlan] = useState(user.plan || "1 Month");
  const [action, setAction] = useState<"activate" | "deactivate" | "block" | "upgrade" | "downgrade">("activate");
  const [saving, setSaving] = useState(false);

  const apply = async () => {
    setSaving(true);
    try {
      let updates: Partial<AdminUser> = {};
      if (action === "activate" || action === "upgrade" || action === "downgrade") {
        const now = new Date();
        if (plan === "1 Day") now.setDate(now.getDate() + 1);
        else if (plan === "1 Week") now.setDate(now.getDate() + 7);
        else now.setMonth(now.getMonth() + 1);
        updates = { plan, status: "active", planExpiry: now.toISOString().split("T")[0] };
      } else if (action === "deactivate") {
        updates = { status: "expired", planExpiry: new Date().toISOString().split("T")[0] };
      } else if (action === "block") {
        updates = { status: "blocked", plan: null, planExpiry: null };
      }
      await updateDoc(doc(db, "userProfiles", user.id), updates);

      if (action === "activate" || action === "upgrade") {
        await addDoc(collection(db, "activities"), {
          username: user.displayName,
          phone: user.phone,
          action: `Admin ${action}d subscription — ${plan}`,
          time: new Date().toLocaleString(),
          timestamp: Date.now(),
          createdAt: serverTimestamp(),
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 className="text-white font-bold text-sm mb-1">Manage User</h3>
        <p className="text-white/50 text-xs mb-5">{user.displayName} · {user.phone || user.email}</p>
        <div className="mb-4">
          <label className="text-white/50 text-[11px] block mb-2">Action</label>
          <div className="grid grid-cols-2 gap-2">
            {(["activate","deactivate","block","upgrade","downgrade"] as const).map(a => (
              <button key={a} onClick={() => setAction(a)} className="h-8 rounded-lg text-xs font-medium capitalize border transition-all" style={{ background: action === a ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)", borderColor: action === a ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)", color: action === a ? "#a855f7" : "rgba(255,255,255,0.6)" }}>{a}</button>
            ))}
          </div>
        </div>
        {(action === "activate" || action === "upgrade" || action === "downgrade") && (
          <div className="mb-5">
            <label className="text-white/50 text-[11px] block mb-2">Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} className="w-full h-9 px-3 rounded-lg text-xs text-white outline-none border border-white/10" style={{ background: "#1a1d24" }}>
              {PLANS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg text-xs text-white/70 border border-white/20 hover:border-white/40 transition-colors">Cancel</button>
          <button onClick={apply} disabled={saving} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: action === "block" ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#a855f7,#ec4899)" }}>
            {saving ? "Saving..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

const ADMIN_EMAIL = "mainplatform.nexus@gmail.com";

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const { profile } = useAuth();
  const [section, setSection] = useState<Section>("carousel");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [carousel, setCarousel] = useState<CarouselItem[]>([]);
  const [carouselForm, setCarouselForm] = useState({ title: "", subtitle: "", image: "", buttonText: "" });
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselSaving, setCarouselSaving] = useState(false);

  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [series, setSeries] = useState<AdminSeries[]>([]);
  const [episodes, setEpisodes] = useState<AdminEpisode[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [editMovie, setEditMovie] = useState<AdminMovie | null>(null);
  const [editSeries, setEditSeries] = useState<AdminSeries | null>(null);
  const [editEpisode, setEditEpisode] = useState<AdminEpisode | null>(null);
  const [manageUser, setManageUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  const [movieSearch, setMovieSearch] = useState("");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(query(collection(db, "carousel"), orderBy("createdAt", "desc")), snap => {
      setCarousel(snap.docs.map(d => ({ id: d.id, ...d.data() } as CarouselItem)));
    }));
    unsubs.push(onSnapshot(query(collection(db, "movies"), orderBy("createdAt", "desc")), snap => {
      setMovies(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminMovie)));
      setLoading(false);
    }));
    unsubs.push(onSnapshot(query(collection(db, "series"), orderBy("createdAt", "desc")), snap => {
      setSeries(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminSeries)));
    }));
    unsubs.push(onSnapshot(query(collection(db, "episodes"), orderBy("createdAt", "desc")), snap => {
      setEpisodes(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminEpisode)));
    }));
    unsubs.push(onSnapshot(collection(db, "userProfiles"), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminUser)));
    }));
    unsubs.push(onSnapshot(query(collection(db, "activities"), orderBy("timestamp", "desc")), snap => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
    }));
    unsubs.push(onSnapshot(query(collection(db, "transactions"), orderBy("createdAt", "desc")), snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminTransaction)));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const colMap: Record<string, string> = { movie: "movies", series: "series", episode: "episodes" };
    const col = colMap[confirmDelete.type];
    if (col) await deleteDoc(doc(db, col, confirmDelete.id));
    setConfirmDelete(null);
  };

  const filteredMovies = movies.filter(m => m.title?.toLowerCase().includes(movieSearch.toLowerCase()) || m.category?.toLowerCase().includes(movieSearch.toLowerCase()));
  const filteredSeries = series.filter(s => s.title?.toLowerCase().includes(seriesSearch.toLowerCase()) || s.category?.toLowerCase().includes(seriesSearch.toLowerCase()));
  const filteredUsers = users.filter(u => u.displayName?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()) || u.phone?.includes(userSearch));
  const filteredActivities = activities.filter(a => a.username?.toLowerCase().includes(activitySearch.toLowerCase()) || a.action?.toLowerCase().includes(activitySearch.toLowerCase()) || a.phone?.includes(activitySearch));

  const totalRevenue = transactions.filter(t => t.status === "completed" && t.type === "subscription").reduce((s, t) => s + t.amount, 0);
  const walletBalance = totalRevenue - transactions.filter(t => t.status === "completed" && t.type === "withdrawal").reduce((s, t) => s + t.amount, 0);

  const tableHead = "text-white/40 text-[11px] font-semibold uppercase tracking-wide py-2.5 px-3 text-left border-b border-white/5";
  const tableCell = "py-2.5 px-3 text-xs text-white/80 border-b border-white/5";

  const searchInput = (val: string, set: (v: string) => void, ph: string) => (
    <input value={val} onChange={e => set(e.target.value)} placeholder={ph} className="w-full max-w-xs h-8 px-3 rounded-lg text-xs text-white/80 outline-none border border-white/10 focus:border-purple-500/40 placeholder:text-white/25" style={{ background: "rgba(255,255,255,0.05)" }} />
  );

  const iconBtn = (label: string, color: string, onClick: () => void) => (
    <button onClick={onClick} title={label} className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors hover:opacity-90" style={{ background: color, color: "white" }}>{label}</button>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#0d0f12" }}>
        <div className="text-white/40 text-sm">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0d0f12", color: "white" }}>
      {editMovie && <EditMovieModal movie={editMovie} onSave={m => setMovies(ms => ms.map(x => x.id === m.id ? m : x))} onClose={() => setEditMovie(null)} />}
      {editSeries && <EditSeriesModal series={editSeries} onSave={s => setSeries(ss => ss.map(x => x.id === s.id ? s : x))} onClose={() => setEditSeries(null)} />}
      {editEpisode && <EditEpisodeModal episode={editEpisode} onSave={e => setEpisodes(es => es.map(x => x.id === e.id ? e : x))} onClose={() => setEditEpisode(null)} />}
      {manageUser && <ManageUserModal user={manageUser} onClose={() => setManageUser(null)} />}
      {confirmDelete && <ConfirmModal message={`Delete this ${confirmDelete.type}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:static top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} style={{ width: 200, background: "#13151a", borderRight: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div className="flex items-center justify-between px-4 h-14 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div>
            <div className="text-white font-bold text-xs leading-tight">Admin Dashboard</div>
            <div className="text-white/30 text-[10px] mt-0.5">True Light</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all"
              style={{ background: section === item.id ? "rgba(168,85,247,0.12)" : "transparent", color: section === item.id ? "#a855f7" : "rgba(255,255,255,0.55)" }}>
              <span style={{ color: section === item.id ? "#a855f7" : "rgba(255,255,255,0.4)" }}>{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            Exit to Site
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#13151a" }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white/50 hover:text-white mr-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <span className="text-white font-bold text-sm capitalize">{section}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {profile?.photoURL && <img src={profile.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />}
            <span className="text-white/50 text-xs hidden md:inline">{profile?.displayName || "Admin"} · Admin</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {section === "carousel" && (
            <div>
              <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <div>
                  <h2 className="text-white font-bold text-base">Home Carousel</h2>
                  <p className="text-white/40 text-xs mt-0.5">Manage the hero banner slides shown on the homepage</p>
                </div>
                <button onClick={() => setShowCarouselModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Add Slide
                </button>
              </div>

              {showCarouselModal && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
                  <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-white font-bold text-base">New Carousel Slide</h3>
                      <button onClick={() => setShowCarouselModal(false)} className="text-white/40 hover:text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5">Title *</label>
                        <input value={carouselForm.title} onChange={e => setCarouselForm(f => ({ ...f, title: e.target.value }))} placeholder="Slide title..." className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 placeholder:text-white/20" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5">Subtitle</label>
                        <input value={carouselForm.subtitle} onChange={e => setCarouselForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Short description..." className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 placeholder:text-white/20" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5">Image URL *</label>
                        <input value={carouselForm.image} onChange={e => setCarouselForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 placeholder:text-white/20" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5">Button Text</label>
                        <input value={carouselForm.buttonText} onChange={e => setCarouselForm(f => ({ ...f, buttonText: e.target.value }))} placeholder="Watch Now" className="w-full h-9 px-3 rounded-lg text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 placeholder:text-white/20" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => setShowCarouselModal(false)} className="flex-1 h-9 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 border border-white/10 transition-colors">Cancel</button>
                      <button
                        disabled={carouselSaving || !carouselForm.title || !carouselForm.image}
                        onClick={async () => {
                          setCarouselSaving(true);
                          try {
                            await addDoc(collection(db, "carousel"), { ...carouselForm, createdAt: serverTimestamp() });
                            setCarouselForm({ title: "", subtitle: "", image: "", buttonText: "" });
                            setShowCarouselModal(false);
                          } finally {
                            setCarouselSaving(false);
                          }
                        }}
                        className="flex-1 h-9 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                        {carouselSaving ? "Saving..." : "Add Slide"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {carousel.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-white/10 mb-3"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M1 5h2v14H1V5zm4 0h2v14H5V5zm17 0H10c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-1 12H11V7h10v10z"/></svg></div>
                  <div className="text-white/40 text-sm">No carousel slides yet</div>
                  <div className="text-white/25 text-xs mt-1">Add your first slide to customize the homepage hero banner</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carousel.map(item => (
                    <div key={item.id} className="rounded-xl overflow-hidden group relative" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="aspect-video bg-white/5 relative overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-white font-bold text-sm leading-tight">{item.title}</div>
                          {item.subtitle && <div className="text-white/60 text-xs mt-0.5 line-clamp-1">{item.subtitle}</div>}
                          {item.buttonText && <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-medium text-white" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>{item.buttonText}</div>}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 p-2" style={{ background: "#1a1d24" }}>
                        <button onClick={async () => { if (window.confirm("Remove this slide?")) await deleteDoc(doc(db, "carousel", item.id)); }} className="text-red-400/60 hover:text-red-400 text-xs transition-colors px-2 py-1">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "movies" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">All Movies ({movies.length})</h2>
                {searchInput(movieSearch, setMovieSearch, "Search movies...")}
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 680 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Title</th>
                        <th className={tableHead}>Category</th>
                        <th className={tableHead}>Year</th>
                        <th className={tableHead}>Views</th>
                        <th className={tableHead}>VJ</th>
                        <th className={tableHead}>Popular</th>
                        <th className={tableHead}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMovies.map((m, i) => (
                        <tr key={m.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell + " font-medium text-white"}>{m.title}</td>
                          <td className={tableCell}><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-400">{m.category}</span></td>
                          <td className={tableCell}>{m.year}</td>
                          <td className={tableCell}>{(m.views || 0).toLocaleString()}</td>
                          <td className={tableCell + " text-white/50"}>{m.vjName || "—"}</td>
                          <td className={tableCell}>{m.popular ? <span className="text-green-400 text-[10px] font-bold">YES</span> : <span className="text-white/25 text-[10px]">no</span>}</td>
                          <td className={tableCell}>
                            <div className="flex gap-1.5">
                              {iconBtn("Edit", "rgba(168,85,247,0.5)", () => setEditMovie(m))}
                              {iconBtn("Delete", "rgba(239,68,68,0.5)", () => setConfirmDelete({ type:"movie", id:m.id }))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMovies.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No movies found</div>}
              </div>
            </div>
          )}

          {section === "series" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">All Series ({series.length})</h2>
                {searchInput(seriesSearch, setSeriesSearch, "Search series...")}
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 640 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Title</th>
                        <th className={tableHead}>Category</th>
                        <th className={tableHead}>Year</th>
                        <th className={tableHead}>Seasons</th>
                        <th className={tableHead}>Episodes</th>
                        <th className={tableHead}>VJ</th>
                        <th className={tableHead}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSeries.map((s, i) => (
                        <tr key={s.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell + " font-medium text-white"}>{s.title}</td>
                          <td className={tableCell}><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/15 text-blue-400">{s.category}</span></td>
                          <td className={tableCell}>{s.year}</td>
                          <td className={tableCell}>{s.seasons}</td>
                          <td className={tableCell}>{s.episodes}</td>
                          <td className={tableCell + " text-white/50"}>{s.vjName || "—"}</td>
                          <td className={tableCell}>
                            <div className="flex gap-1.5">
                              {iconBtn("Edit", "rgba(168,85,247,0.5)", () => setEditSeries(s))}
                              {iconBtn("Delete", "rgba(239,68,68,0.5)", () => setConfirmDelete({ type:"series", id:s.id }))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredSeries.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No series found</div>}
              </div>
            </div>
          )}

          {section === "episodes" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">All Episodes ({episodes.length})</h2>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 680 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Series</th>
                        <th className={tableHead}>S</th>
                        <th className={tableHead}>Ep</th>
                        <th className={tableHead}>Title</th>
                        <th className={tableHead}>Duration</th>
                        <th className={tableHead}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {episodes.map((e, i) => (
                        <tr key={e.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell + " text-white/70"}>{e.seriesTitle || series.find(s => s.id === e.seriesId)?.title || "—"}</td>
                          <td className={tableCell}>{e.season}</td>
                          <td className={tableCell}>{e.episode}</td>
                          <td className={tableCell + " font-medium text-white"}>{e.title}</td>
                          <td className={tableCell + " text-white/50"}>{e.duration}</td>
                          <td className={tableCell}>
                            <div className="flex gap-1.5">
                              {iconBtn("Edit", "rgba(168,85,247,0.5)", () => setEditEpisode(e))}
                              {iconBtn("Delete", "rgba(239,68,68,0.5)", () => setConfirmDelete({ type:"episode", id:e.id }))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {episodes.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No episodes found</div>}
              </div>
            </div>
          )}

          {section === "users" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">All Users ({users.length})</h2>
                {searchInput(userSearch, setUserSearch, "Search by name, email, phone...")}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label:"Total Users", val: users.length, color:"#a855f7" },
                  { label:"Active Subscribers", val: users.filter(u=>u.status==="active").length, color:"#22c55e" },
                  { label:"Expired", val: users.filter(u=>u.status==="expired").length, color:"#f59e0b" },
                  { label:"Blocked", val: users.filter(u=>u.status==="blocked").length, color:"#ef4444" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-white/50 text-[11px] mb-1">{s.label}</div>
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 780 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Name</th>
                        <th className={tableHead}>Phone</th>
                        <th className={tableHead}>Joined</th>
                        <th className={tableHead}>Plan</th>
                        <th className={tableHead}>Expiry</th>
                        <th className={tableHead}>Status</th>
                        <th className={tableHead}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell}>
                            <div className="font-medium text-white">{u.displayName}</div>
                            <div className="text-white/35 text-[10px]">{u.email}</div>
                          </td>
                          <td className={tableCell + " text-white/60"}>{u.phone || "—"}</td>
                          <td className={tableCell + " text-white/50"}>{u.joined}</td>
                          <td className={tableCell}>{u.plan ? <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-400">{u.plan}</span> : <span className="text-white/25 text-[10px]">—</span>}</td>
                          <td className={tableCell + " text-white/50"}>{u.planExpiry || "—"}</td>
                          <td className={tableCell}><span className={statusBadge(u.status)}>{u.status}</span></td>
                          <td className={tableCell}>{iconBtn("Manage", "rgba(168,85,247,0.5)", () => setManageUser(u))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No users found</div>}
              </div>
            </div>
          )}

          {section === "activities" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">Site Activities ({activities.length})</h2>
                {searchInput(activitySearch, setActivitySearch, "Search by user, action, phone...")}
              </div>
              <p className="text-white/40 text-xs mb-4">Showing all user interactions — latest first</p>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 640 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Username</th>
                        <th className={tableHead}>Phone</th>
                        <th className={tableHead}>Action / What was clicked</th>
                        <th className={tableHead}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((a, i) => (
                        <tr key={a.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>{a.username?.charAt(0)}</div>
                              <span className="font-medium text-white text-xs">{a.username}</span>
                            </div>
                          </td>
                          <td className={tableCell + " text-white/55"}>{a.phone}</td>
                          <td className={tableCell}><span className="text-white/80">{a.action}</span></td>
                          <td className={tableCell + " text-white/40 whitespace-nowrap"}>{a.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredActivities.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No activities recorded yet</div>}
              </div>
            </div>
          )}

          {section === "wallet" && (
            <div>
              <h2 className="text-white font-bold text-base mb-5">Wallet — Read Only</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label:"Current Balance", val: fmt(walletBalance), color:"#a855f7" },
                  { label:"Total Revenue", val: fmt(totalRevenue), color:"#22c55e" },
                  { label:"Total Transactions", val: transactions.length.toString(), color:"#f59e0b" },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl p-5" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-white/50 text-xs mb-2">{c.label}</div>
                    <div className="text-2xl font-bold" style={{ color: c.color }}>{c.val}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="px-4 py-3 border-b" style={{ background: "#1a1d24", borderColor: "rgba(255,255,255,0.07)" }}>
                  <span className="text-white font-semibold text-sm">Transaction History</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 600 }}>
                    <thead style={{ background: "#1a1d24" }}>
                      <tr>
                        <th className={tableHead}>#</th>
                        <th className={tableHead}>Description</th>
                        <th className={tableHead}>Phone</th>
                        <th className={tableHead}>Amount</th>
                        <th className={tableHead}>Date</th>
                        <th className={tableHead}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t, i) => (
                        <tr key={t.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                          <td className={tableCell + " text-white/30"}>{i+1}</td>
                          <td className={tableCell + " font-medium text-white"}>{t.description}</td>
                          <td className={tableCell + " text-white/55"}>{t.phone || "—"}</td>
                          <td className={tableCell}><span className={t.type === "withdrawal" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>{t.type === "withdrawal" ? "-" : "+"}{fmt(t.amount)}</span></td>
                          <td className={tableCell + " text-white/50"}>{t.date}</td>
                          <td className={tableCell}><span className={statusBadge(t.status)}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No transactions found</div>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
