import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const PLANS = [
  { id: "day", label: "1 Day", price: 2000, original: 3000, discount: 33 },
  { id: "week", label: "1 Week", price: 5000, original: 8000, discount: 38 },
  { id: "month", label: "1 Month", price: 20000, original: 30000, discount: 33 },
];
const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

const BENEFITS = [
  { icon: "🎬", title: "Members Access", desc: "VIP exclusive content/episodes" },
  { icon: "📱", title: "Multi-Device", desc: "Phone, PC, and TV" },
  { icon: "🎯", title: "High Resolution", desc: "Watch 1080P videos" },
  { icon: "⚡", title: "Early Access", desc: "New episodes first" },
  { icon: "⬇️", title: "Fast Download", desc: "Up to 5 videos at once" },
  { icon: "🚫", title: "Ad Free", desc: "Clean ad-free experience" },
];

export function SubscribeModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const { profile } = useAuth();
  const loggedInUser = profile?.displayName || null;
  const [selectedPlan, setSelectedPlan] = useState(0);
  const plan = PLANS[selectedPlan];
  const saved = plan.original - plan.price;

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center"
        style={{ background: "rgba(0,0,0,0.8)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full rounded-t-2xl overflow-hidden" style={{ background: "#13151a" }}>
          <div className="flex items-center justify-between px-4 pt-2.5 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-white font-bold text-xs">VIP Subscription</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors p-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="px-3 pt-2.5 pb-3">
            <div className="flex gap-1.5 mb-2">
              {PLANS.map((p, i) => (
                <button key={p.id} onClick={() => setSelectedPlan(i)}
                  className="relative flex-1 rounded-lg py-2 px-1 text-center transition-all border"
                  style={{ background: i === selectedPlan ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)", borderColor: i === selectedPlan ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.08)" }}
                >
                  {p.discount > 0 && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-white text-[8px] font-bold px-1 py-px rounded-full whitespace-nowrap" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>{p.discount}% off</div>}
                  <div className="text-white/60 text-[9px] mt-0.5 leading-tight">{p.label}</div>
                  <div className="text-sm font-bold leading-tight" style={{ color: i === selectedPlan ? "#a855f7" : "white" }}>UGX {p.price.toLocaleString()}</div>
                  <div className="text-white/30 text-[9px] line-through">UGX {p.original.toLocaleString()}</div>
                </button>
              ))}
            </div>
            <p className="text-white/40 text-[10px] mb-2">· New subscribers get {plan.discount}% off the first term!</p>
            <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div>
                <div className="text-white/50 text-[10px]">You pay</div>
                <div className="text-white text-base font-bold leading-tight">{fmt(plan.price)}</div>
              </div>
              <div>
                <div className="text-white/40 text-[10px]">Pay via</div>
                <img src="https://pbs.twimg.com/media/Ggq-h4CXEAAv6wk.jpg" alt="Mobile Money" className="h-6 rounded mt-0.5 object-cover" style={{ maxWidth: 70 }} />
              </div>
              <div className="text-white text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save {fmt(saved)}</div>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-center gap-1 rounded-md px-1.5 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <span className="text-xs leading-none">{b.icon}</span>
                  <span className="text-white/70 text-[9px] font-medium leading-tight">{b.title}</span>
                </div>
              ))}
            </div>
            <button className="w-full h-10 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Subscribe · {fmt(plan.price)}</button>
            <div className="flex justify-center gap-3 mt-1.5">
              <a href="#" className="text-white/25 text-[9px] hover:text-white/50 transition-colors">VIP Terms</a>
              <a href="#" className="text-white/25 text-[9px] hover:text-white/50 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: "90vh" }}>
        <button onClick={onClose} className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="flex-1 overflow-y-auto p-6 pt-8" style={{ background: "#13151a" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              {loggedInUser ? (
                <span className="text-white text-sm font-bold uppercase">{loggedInUser.charAt(0)}</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
            </div>
            <span className="text-white font-semibold text-sm">{loggedInUser ? loggedInUser : <>Log in/Sign up &rsaquo;</>}</span>
          </div>
          <div className="flex gap-2 mb-3">
            {PLANS.map((p, i) => (
              <button key={p.id} onClick={() => setSelectedPlan(i)}
                className="relative flex-1 rounded-xl p-3 text-left transition-all border"
                style={{ background: i === selectedPlan ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)", borderColor: i === selectedPlan ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)" }}
              >
                {p.discount > 0 && <div className="absolute -top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>{p.discount}% off</div>}
                <div className="text-white/70 text-xs mb-1 mt-1 leading-tight">{p.label} Subscription</div>
                <div className="text-xl font-bold" style={{ color: i === selectedPlan ? "#a855f7" : "white" }}>UGX {p.price.toLocaleString()}</div>
                <div className="text-white/30 text-xs line-through mt-0.5">UGX {p.original.toLocaleString()}</div>
              </button>
            ))}
          </div>
          <p className="text-white/40 text-xs mb-5">· New subscribers get {plan.discount}% off the first term!</p>
          <h3 className="text-white font-bold text-base mb-3">VIP Membership Benefits</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Members Access", desc: "Enjoy VIP exclusive content/episodes", color: "#f59e0b" },
              { title: "Multi-Device Access", desc: "One account on phone, PC, and TV", color: "#8b5cf6" },
              { title: "High Resolution", desc: "Watch 1080P videos", color: "#ef4444" },
              { title: "Early Access", desc: "VIP members watch new episodes first", color: "#06b6d4" },
              { title: "Fast Download", desc: "Boost up to 5 videos at once", color: "#eab308" },
              { title: "Pre-roll Ad Free", desc: "Enjoy a clean, ad-free experience", color: "#22c55e" },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: b.color }} />
                <div>
                  <div className="text-white text-xs font-semibold leading-tight">{b.title}</div>
                  <div className="text-white/40 text-[11px] leading-snug mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-60 flex-shrink-0 flex flex-col p-5" style={{ background: "#0e1015", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-4">
            <div className="text-white/50 text-xs mb-1">You pay</div>
            <div className="text-white font-bold text-2xl mb-2">{fmt(plan.price)}</div>
            <div className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save {fmt(saved)}</div>
          </div>
          <div className="border-t mb-4" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <div>
            <div className="text-white text-xs font-semibold mb-3">Payment Method</div>
            <div className="rounded-xl overflow-hidden border cursor-pointer" style={{ borderColor: "rgba(168,85,247,0.4)" }}>
              <img src="https://pbs.twimg.com/media/Ggq-h4CXEAAv6wk.jpg" alt="Mobile Money" className="w-full object-cover" style={{ maxHeight: 90 }} />
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "#22c55e" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <span className="text-white/60 text-xs">Mobile Money selected</span>
            </div>
          </div>
          <div className="flex-1" />
          <button className="w-full h-11 rounded-xl font-bold text-sm text-white mt-4 hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
            Pay now · {fmt(plan.price)}
          </button>
          <div className="flex justify-center gap-2 mt-3">
            <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">VIP Terms</a>
            <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
