import { useState } from "react";

type Section = "movies" | "series" | "episodes" | "users" | "activities" | "wallet";

const PLANS = ["1 Day", "1 Week", "1 Month"];
const CATEGORIES = ["Action","Comedy","Drama","Horror","Romance","Sci-Fi","Thriller","Animation","Documentary","Christian"];

interface AdminMovie { id: number; title: string; category: string; year: number; url: string; thumbnail: string; views: number; popular: boolean; vjName: string; }
interface AdminSeries { id: number; title: string; category: string; year: number; seasons: number; episodes: number; thumbnail: string; popular: boolean; vjName: string; }
interface AdminEpisode { id: number; seriesId: number; seriesTitle: string; season: number; episode: number; title: string; url: string; duration: string; }
interface AdminUser { id: number; name: string; email: string; phone: string; joined: string; plan: string | null; planExpiry: string | null; status: "active" | "expired" | "blocked" | "none"; }
interface Activity { id: number; username: string; phone: string; action: string; time: string; timestamp: number; }
interface AdminTransaction { id: number; type: string; amount: number; description: string; date: string; status: "completed" | "pending" | "failed"; phone?: string; }

const initMovies: AdminMovie[] = [
  { id:1, title:"Deadpool & Wolverine", category:"Action", year:2024, url:"https://example.com/dp.mp4", thumbnail:"", views:12400, popular:true, vjName:"VJ Emma" },
  { id:2, title:"Dune: Part Two", category:"Sci-Fi", year:2024, url:"https://example.com/dune.mp4", thumbnail:"", views:9800, popular:true, vjName:"VJ Emma" },
  { id:3, title:"Oppenheimer", category:"Drama", year:2023, url:"https://example.com/opp.mp4", thumbnail:"", views:7200, popular:false, vjName:"VJ Emma" },
  { id:4, title:"Gladiator II", category:"Action", year:2024, url:"https://example.com/gl2.mp4", thumbnail:"", views:5600, popular:true, vjName:"VJ Emma" },
  { id:5, title:"Moana 2", category:"Animation", year:2024, url:"https://example.com/mn2.mp4", thumbnail:"", views:4300, popular:false, vjName:"VJ Emma" },
];

const initSeries: AdminSeries[] = [
  { id:1, title:"House of the Dragon", category:"Drama", year:2022, seasons:2, episodes:18, thumbnail:"", popular:true, vjName:"VJ Emma" },
  { id:2, title:"The Last of Us", category:"Thriller", year:2023, seasons:1, episodes:9, thumbnail:"", popular:true, vjName:"VJ Emma" },
  { id:3, title:"Fallout", category:"Sci-Fi", year:2024, seasons:1, episodes:8, thumbnail:"", popular:false, vjName:"VJ Emma" },
  { id:4, title:"Shogun", category:"Drama", year:2024, seasons:1, episodes:10, thumbnail:"", popular:true, vjName:"VJ Emma" },
];

const initEpisodes: AdminEpisode[] = [
  { id:1, seriesId:1, seriesTitle:"House of the Dragon", season:1, episode:1, title:"The Heirs of the Dragon", url:"https://example.com/hotd-s1e1.mp4", duration:"1h 06m" },
  { id:2, seriesId:1, seriesTitle:"House of the Dragon", season:1, episode:2, title:"The Rogue Prince", url:"https://example.com/hotd-s1e2.mp4", duration:"58m" },
  { id:3, seriesId:2, seriesTitle:"The Last of Us", season:1, episode:1, title:"When You're Lost in the Darkness", url:"https://example.com/tlou-s1e1.mp4", duration:"1h 21m" },
  { id:4, seriesId:2, seriesTitle:"The Last of Us", season:1, episode:2, title:"Infected", url:"https://example.com/tlou-s1e2.mp4", duration:"55m" },
  { id:5, seriesId:3, seriesTitle:"Fallout", season:1, episode:1, title:"The End", url:"https://example.com/fo-s1e1.mp4", duration:"1h 02m" },
];

const initUsers: AdminUser[] = [
  { id:1, name:"Alice Nakamura", email:"alice@email.com", phone:"+256701234567", joined:"2024-01-15", plan:"1 Month", planExpiry:"2026-04-15", status:"active" },
  { id:2, name:"Bob Okello", email:"bob@email.com", phone:"+256782345678", joined:"2024-03-20", plan:"1 Week", planExpiry:"2026-03-27", status:"expired" },
  { id:3, name:"Carol Amina", email:"carol@email.com", phone:"+256753456789", joined:"2024-06-01", plan:null, planExpiry:null, status:"none" },
  { id:4, name:"David Ssempa", email:"david@email.com", phone:"+256774567890", joined:"2025-01-10", plan:"1 Month", planExpiry:"2026-05-10", status:"active" },
  { id:5, name:"Eve Namukasa", email:"eve@email.com", phone:"+256705678901", joined:"2025-02-28", plan:null, planExpiry:null, status:"blocked" },
  { id:6, name:"Frank Mugisha", email:"frank@email.com", phone:"+256786789012", joined:"2025-03-15", plan:"1 Day", planExpiry:"2026-03-16", status:"active" },
  { id:7, name:"Grace Achieng", email:"grace@email.com", phone:"+256757890123", joined:"2025-04-02", plan:null, planExpiry:null, status:"none" },
];

const initActivities: Activity[] = [
  { id:1, username:"David Ssempa", phone:"+256774567890", action:"Clicked 'Watch Now' on Deadpool & Wolverine", time:"2026-03-23 14:32:05", timestamp:1742737925 },
  { id:2, username:"Alice Nakamura", phone:"+256701234567", action:"Opened Subscribe Modal", time:"2026-03-23 14:28:12", timestamp:1742737692 },
  { id:3, username:"Bob Okello", phone:"+256782345678", action:"Clicked 'See All' on Popular Series", time:"2026-03-23 14:25:44", timestamp:1742737544 },
  { id:4, username:"Frank Mugisha", phone:"+256786789012", action:"Clicked on House of the Dragon", time:"2026-03-23 14:20:30", timestamp:1742737230 },
  { id:5, username:"Grace Achieng", phone:"+256757890123", action:"Opened Login Modal", time:"2026-03-23 14:18:55", timestamp:1742737135 },
  { id:6, username:"David Ssempa", phone:"+256774567890", action:"Selected '1 Month' subscription plan", time:"2026-03-23 14:15:02", timestamp:1742736902 },
  { id:7, username:"Carol Amina", phone:"+256753456789", action:"Clicked on Dune: Part Two", time:"2026-03-23 14:10:18", timestamp:1742736618 },
  { id:8, username:"Alice Nakamura", phone:"+256701234567", action:"Clicked 'Watch Now' on House of the Dragon", time:"2026-03-23 13:58:44", timestamp:1742735924 },
  { id:9, username:"Bob Okello", phone:"+256782345678", action:"Clicked 'Top Rated' in Sidebar", time:"2026-03-23 13:45:22", timestamp:1742735122 },
  { id:10, username:"Frank Mugisha", phone:"+256786789012", action:"Opened Subscribe Modal", time:"2026-03-23 13:40:11", timestamp:1742734811 },
  { id:11, username:"Grace Achieng", phone:"+256757890123", action:"Clicked on Oppenheimer", time:"2026-03-23 13:35:07", timestamp:1742734507 },
  { id:12, username:"Carol Amina", phone:"+256753456789", action:"Clicked 'Movies' in Sidebar", time:"2026-03-23 13:20:33", timestamp:1742733633 },
  { id:13, username:"David Ssempa", phone:"+256774567890", action:"Clicked 'TV Shows' in Sidebar", time:"2026-03-23 13:12:08", timestamp:1742733128 },
  { id:14, username:"Alice Nakamura", phone:"+256701234567", action:"Completed Payment — 1 Month Plan", time:"2026-03-23 12:58:15", timestamp:1742732295 },
  { id:15, username:"Bob Okello", phone:"+256782345678", action:"Clicked on Fallout Series", time:"2026-03-23 12:45:00", timestamp:1742731500 },
];

const initTransactions: AdminTransaction[] = [
  { id:1, type:"subscription", amount:20000, description:"1 Month Plan — Alice Nakamura", date:"2026-03-23", status:"completed", phone:"+256701234567" },
  { id:2, type:"subscription", amount:5000, description:"1 Week Plan — Bob Okello", date:"2026-03-20", status:"completed", phone:"+256782345678" },
  { id:3, type:"subscription", amount:2000, description:"1 Day Plan — Frank Mugisha", date:"2026-03-15", status:"completed", phone:"+256786789012" },
  { id:4, type:"subscription", amount:20000, description:"1 Month Plan — David Ssempa", date:"2026-03-10", status:"completed", phone:"+256774567890" },
  { id:5, type:"subscription", amount:5000, description:"1 Week Plan — Carol Amina", date:"2026-03-05", status:"pending", phone:"+256753456789" },
];

const totalRevenue = initTransactions.filter(t => t.status === "completed").reduce((s,t) => s + t.amount, 0);
const walletBalance = totalRevenue;

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

const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

const SIDEBAR_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
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
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function EditSeriesModal({ series, onSave, onClose }: { series: AdminSeries; onSave: (s: AdminSeries) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...series });
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
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function EditEpisodeModal({ episode, onSave, onClose }: { episode: AdminEpisode; onSave: (e: AdminEpisode) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...episode });
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
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ManageUserModal({ user, onSave, onClose }: { user: AdminUser; onSave: (u: AdminUser) => void; onClose: () => void }) {
  const [plan, setPlan] = useState(user.plan || "1 Month");
  const [action, setAction] = useState<"activate" | "deactivate" | "block" | "upgrade" | "downgrade">("activate");

  const apply = () => {
    let updated = { ...user };
    if (action === "activate" || action === "upgrade" || action === "downgrade") {
      updated.plan = plan;
      updated.status = "active";
      const now = new Date();
      if (plan === "1 Day") now.setDate(now.getDate() + 1);
      else if (plan === "1 Week") now.setDate(now.getDate() + 7);
      else now.setMonth(now.getMonth() + 1);
      updated.planExpiry = now.toISOString().split("T")[0];
    } else if (action === "deactivate") {
      updated.status = "expired";
      updated.planExpiry = new Date().toISOString().split("T")[0];
    } else if (action === "block") {
      updated.status = "blocked";
      updated.plan = null;
      updated.planExpiry = null;
    }
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 className="text-white font-bold text-sm mb-1">Manage User</h3>
        <p className="text-white/50 text-xs mb-5">{user.name} · {user.phone}</p>

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
          <button onClick={apply} className="flex-1 h-9 rounded-lg text-xs text-white font-bold hover:opacity-90 transition-opacity" style={{ background: action === "block" ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#a855f7,#ec4899)" }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<Section>("movies");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [movies, setMovies] = useState<AdminMovie[]>(initMovies);
  const [series, setSeries] = useState<AdminSeries[]>(initSeries);
  const [episodes, setEpisodes] = useState<AdminEpisode[]>(initEpisodes);
  const [users, setUsers] = useState<AdminUser[]>(initUsers);
  const activities = [...initActivities].sort((a,b) => b.timestamp - a.timestamp);
  const transactions = initTransactions;

  const [editMovie, setEditMovie] = useState<AdminMovie | null>(null);
  const [editSeries, setEditSeries] = useState<AdminSeries | null>(null);
  const [editEpisode, setEditEpisode] = useState<AdminEpisode | null>(null);
  const [manageUser, setManageUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number } | null>(null);

  const [movieSearch, setMovieSearch] = useState("");
  const [seriesSearch, setSeriesSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "movie") setMovies(m => m.filter(x => x.id !== confirmDelete.id));
    if (confirmDelete.type === "series") setSeries(s => s.filter(x => x.id !== confirmDelete.id));
    if (confirmDelete.type === "episode") setEpisodes(e => e.filter(x => x.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase()) || m.category.toLowerCase().includes(movieSearch.toLowerCase()));
  const filteredSeries = series.filter(s => s.title.toLowerCase().includes(seriesSearch.toLowerCase()) || s.category.toLowerCase().includes(seriesSearch.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.phone.includes(userSearch));
  const filteredActivities = activities.filter(a => a.username.toLowerCase().includes(activitySearch.toLowerCase()) || a.action.toLowerCase().includes(activitySearch.toLowerCase()) || a.phone.includes(activitySearch));

  const tableHead = "text-white/40 text-[11px] font-semibold uppercase tracking-wide py-2.5 px-3 text-left border-b border-white/5";
  const tableCell = "py-2.5 px-3 text-xs text-white/80 border-b border-white/5";
  const searchInput = (val: string, set: (v:string)=>void, ph: string) => (
    <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} className="w-full max-w-xs h-8 px-3 rounded-lg text-xs text-white/80 outline-none border border-white/10 focus:border-purple-500/40 placeholder:text-white/25" style={{ background: "rgba(255,255,255,0.05)" }} />
  );

  const iconBtn = (label: string, color: string, onClick: ()=>void) => (
    <button onClick={onClick} title={label} className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors hover:opacity-90" style={{ background: color, color: "white" }}>{label}</button>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0d0f12", color: "white" }}>
      {/* Modals */}
      {editMovie && <EditMovieModal movie={editMovie} onSave={m => setMovies(ms => ms.map(x => x.id === m.id ? m : x))} onClose={() => setEditMovie(null)} />}
      {editSeries && <EditSeriesModal series={editSeries} onSave={s => setSeries(ss => ss.map(x => x.id === s.id ? s : x))} onClose={() => setEditSeries(null)} />}
      {editEpisode && <EditEpisodeModal episode={editEpisode} onSave={e => setEpisodes(es => es.map(x => x.id === e.id ? e : x))} onClose={() => setEditEpisode(null)} />}
      {manageUser && <ManageUserModal user={manageUser} onSave={u => setUsers(us => us.map(x => x.id === u.id ? u : x))} onClose={() => setManageUser(null)} />}
      {confirmDelete && <ConfirmModal message={`Delete this ${confirmDelete.type}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ width: 200, background: "#13151a", borderRight: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}
      >
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
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all"
              style={{ background: section === item.id ? "rgba(168,85,247,0.12)" : "transparent", color: section === item.id ? "#a855f7" : "rgba(255,255,255,0.55)" }}
            >
              <span style={{ color: section === item.id ? "#a855f7" : "rgba(255,255,255,0.4)" }}>{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            Exit to Site
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
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
          <span className="text-white/30 text-xs hidden md:inline">True Light · Admin</span>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* ── MOVIES ── */}
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
                          <td className={tableCell}>{m.views.toLocaleString()}</td>
                          <td className={tableCell + " text-white/50"}>{m.vjName}</td>
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

          {/* ── SERIES ── */}
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
                          <td className={tableCell + " text-white/50"}>{s.vjName}</td>
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

          {/* ── EPISODES ── */}
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
                          <td className={tableCell + " text-white/70"}>{e.seriesTitle}</td>
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

          {/* ── USERS ── */}
          {section === "users" && (
            <div>
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-white font-bold text-base">All Users ({users.length})</h2>
                {searchInput(userSearch, setUserSearch, "Search by name, email, phone...")}
              </div>

              {/* Stats row */}
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
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-white/35 text-[10px]">{u.email}</div>
                          </td>
                          <td className={tableCell + " text-white/60"}>{u.phone}</td>
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

          {/* ── ACTIVITIES ── */}
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
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>{a.username.charAt(0)}</div>
                              <span className="font-medium text-white text-xs">{a.username}</span>
                            </div>
                          </td>
                          <td className={tableCell + " text-white/55"}>{a.phone}</td>
                          <td className={tableCell}>
                            <span className="text-white/80">{a.action}</span>
                          </td>
                          <td className={tableCell + " text-white/40 whitespace-nowrap"}>{a.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredActivities.length === 0 && <div className="py-10 text-center text-white/30 text-sm">No activities found</div>}
              </div>
            </div>
          )}

          {/* ── WALLET ── */}
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
                          <td className={tableCell}><span className="text-green-400 font-semibold">+{fmt(t.amount)}</span></td>
                          <td className={tableCell + " text-white/50"}>{t.date}</td>
                          <td className={tableCell}><span className={statusBadge(t.status)}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
