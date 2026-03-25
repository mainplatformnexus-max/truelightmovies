import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "../components/LoginModal";
import { SubscribeModal } from "../components/SubscribeModal";

export function ProfilePage() {
  const { profile, logout, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName || "");
  const [editPhone, setEditPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "userProfiles", profile.uid), {
        displayName: editName.trim(),
        phone: editPhone.trim(),
      });
      await refreshProfile();
      setSaveMsg("Profile updated!");
      setEditing(false);
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const statusColor: Record<string, string> = {
    active: "#22c55e",
    expired: "#ef4444",
    blocked: "#f97316",
    none: "#6b7280",
  };
  const statusLabel: Record<string, string> = {
    active: "Active",
    expired: "Expired",
    blocked: "Blocked",
    none: "Free",
  };

  const daysLeft = (() => {
    if (!profile?.planExpiry) return null;
    const diff = Math.ceil(
      (new Date(profile.planExpiry).getTime() - Date.now()) / 86400000
    );
    return diff > 0 ? diff : 0;
  })();

  const isMobile = window.innerWidth < 768;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#101114] flex flex-col items-center justify-center px-6 py-10">
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(168,85,247,0.12)", border: "2px solid rgba(168,85,247,0.3)" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.7)" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Sign in to your account</h2>
        <p className="text-white/40 text-sm text-center mb-8 max-w-xs">Log in to manage your subscription, view your profile, and access premium content.</p>
        <button
          onClick={() => setShowLogin(true)}
          className="w-full max-w-xs h-12 rounded-xl font-bold text-sm text-white"
          style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
        >
          Log In / Sign Up
        </button>
      </div>
    );
  }

  const initials = profile.displayName?.charAt(0).toUpperCase() || "U";
  const color = statusColor[profile.status ?? "none"] ?? "#6b7280";
  const label = statusLabel[profile.status ?? "none"] ?? "Free";

  return (
    <div className="min-h-screen bg-[#101114] pb-24">
      {showSubscribe && <SubscribeModal onClose={() => setShowSubscribe(false)} isMobile={isMobile} />}

      {/* Hero banner */}
      <div className="relative h-32 w-full" style={{ background: "linear-gradient(135deg,#1a0533 0%,#0e1015 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #a855f7 0%, transparent 60%)" }} />
      </div>

      {/* Avatar */}
      <div className="relative flex flex-col items-center -mt-12 px-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", borderColor: "#101114" }}
        >
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <h1 className="text-white font-bold text-xl mt-3 leading-tight">{profile.displayName}</h1>
        <p className="text-white/40 text-sm mt-0.5">{profile.email}</p>
        <span className="mt-2 text-xs font-semibold px-3 py-0.5 rounded-full capitalize" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>
          {profile.role === "vj" ? "VJ Creator" : profile.role === "admin" ? "Admin" : "Member"}
        </span>
      </div>

      <div className="px-4 mt-6 space-y-3 max-w-lg mx-auto">

        {/* Subscription card */}
        <div className="rounded-2xl p-4" style={{ background: "#1a1c24", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-sm">Subscription</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: color }}>{label}</span>
          </div>

          {profile.status === "active" && profile.plan ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{profile.plan} VIP Plan</div>
                  <div className="text-white/40 text-xs">{profile.planExpiry ? `Expires ${profile.planExpiry}` : "No expiry set"}</div>
                </div>
              </div>
              {daysLeft !== null && (
                <div className="rounded-xl p-3" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/60 text-xs">Days remaining</span>
                    <span className="text-purple-400 font-bold text-xs">{daysLeft} days</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)", width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-white/40 text-sm mb-3">
                {profile.status === "expired" ? "Your subscription has expired." : "You don't have an active subscription."}
              </p>
              <button
                onClick={() => setShowSubscribe(true)}
                className="px-6 h-9 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>

        {/* Profile details */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#1a1c24", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-white font-bold text-sm">Account Details</span>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setEditName(profile.displayName || ""); setEditPhone(profile.phone || ""); }}
                className="text-purple-400 text-xs font-semibold hover:text-purple-300 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="px-4 py-4 space-y-3">
              <div>
                <label className="text-white/40 text-[11px] font-medium block mb-1">Display Name</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full h-9 rounded-lg px-3 text-white text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>
              <div>
                <label className="text-white/40 text-[11px] font-medium block mb-1">Phone Number</label>
                <input
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full h-9 rounded-lg px-3 text-white text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  placeholder="+256 7XX XXX XXX"
                />
              </div>
              {saveMsg && <p className="text-xs text-center" style={{ color: saveMsg.includes("Failed") ? "#ef4444" : "#22c55e" }}>{saveMsg}</p>}
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex-1 h-9 rounded-lg text-sm text-white/60 border border-white/10 hover:border-white/20 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 h-9 rounded-lg text-sm text-white font-semibold disabled:opacity-50" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {[
                { label: "Name",          value: profile.displayName || "—" },
                { label: "Email",         value: profile.email        || "—" },
                { label: "Phone",         value: profile.phone        || "—" },
                { label: "Member since",  value: profile.joined       || "—" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-white/40 text-xs">{row.label}</span>
                  <span className="text-white text-xs font-medium text-right max-w-[60%] truncate">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full h-11 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-red-500/10"
          style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Log Out
        </button>

        {saveMsg && !editing && <p className="text-center text-xs text-green-400">{saveMsg}</p>}
      </div>
    </div>
  );
}
