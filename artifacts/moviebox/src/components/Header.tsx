import { useState, useEffect, useRef } from "react";
import vjemmaLogo from "@assets/IMG-20260203-WA0010.jpg-removebg-preview_1774231087997.png";

interface HeaderProps {
  onMenuToggle: () => void;
}

const PLANS = [
  { id: "monthly", label: "Monthly", price: 3.59, original: 5.99, discount: 40 },
  { id: "quarterly", label: "Quarterly", price: 10.49, original: 17.49, discount: 40 },
  { id: "annual", label: "Annual", price: 28.99, original: 56.99, discount: 50 },
];

const BENEFITS = [
  { icon: "🎬", title: "Members Access", desc: "VIP exclusive content/episodes" },
  { icon: "📱", title: "Multi-Device", desc: "Phone, PC, and TV" },
  { icon: "🎯", title: "High Resolution", desc: "Watch 1080P videos" },
  { icon: "⚡", title: "Early Access", desc: "New episodes first" },
  { icon: "⬇️", title: "Fast Download", desc: "Up to 5 videos at once" },
  { icon: "🚫", title: "Ad Free", desc: "Clean ad-free experience" },
];

function LoginModal({ onClose, onSwitchToSubscribe }: { onClose: () => void; onSwitchToSubscribe: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end pt-12 pr-4 md:pr-6">
      <div
        ref={ref}
        className="w-80 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.15))", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm">Welcome back</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-white/50 text-xs mb-1.5 font-medium">Email or Username</label>
            <input
              type="text"
              placeholder="Enter your email..."
              className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder-white/30 outline-none border transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(168,85,247,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div className="mb-5">
            <label className="block text-white/50 text-xs mb-1.5 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password..."
              className="w-full h-10 px-3 rounded-lg text-sm text-white placeholder-white/30 outline-none border transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(168,85,247,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <div className="flex justify-end mt-1.5">
              <a href="#" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
            </div>
          </div>

          <button
            className="w-full h-10 rounded-xl font-bold text-sm text-white mb-3 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
          >
            Log In
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p className="text-center text-white/40 text-xs">
            Don't have an account?{" "}
            <button
              onClick={() => { onClose(); onSwitchToSubscribe(); }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Subscribe now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SubscribeModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const plan = PLANS[selectedPlan];
  const saved = (plan.original - plan.price).toFixed(2);

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center"
        style={{ background: "rgba(0,0,0,0.8)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="w-full rounded-t-2xl overflow-hidden"
          style={{ background: "#13151a", maxHeight: "92vh" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-white font-bold text-sm">VIP Subscription</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="px-4 pt-3 pb-4">
            {/* Plan pills */}
            <div className="flex gap-2 mb-3">
              {PLANS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(i)}
                  className="relative flex-1 rounded-xl py-2.5 px-1 text-center transition-all border"
                  style={{
                    background: i === selectedPlan ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)",
                    borderColor: i === selectedPlan ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  {p.discount > 0 && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                    >
                      {p.discount}% off
                    </div>
                  )}
                  <div className="text-white/60 text-[10px] mt-1 leading-tight">{p.label}</div>
                  <div
                    className="text-lg font-bold leading-tight"
                    style={{ color: i === selectedPlan ? "#a855f7" : "white" }}
                  >
                    ${p.price.toFixed(2)}
                  </div>
                  <div className="text-white/30 text-[10px] line-through">${p.original.toFixed(2)}</div>
                </button>
              ))}
            </div>

            <p className="text-white/40 text-[11px] mb-3">· New subscribers get {plan.discount}% off the first term!</p>

            {/* Price + savings row */}
            <div className="flex items-center justify-between mb-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div>
                <div className="text-white/50 text-xs mb-0.5">You pay</div>
                <div className="text-white text-2xl font-bold">${plan.price.toFixed(2)}</div>
              </div>
              <div
                className="text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
              >
                Save ${saved}
              </div>
            </div>

            {/* Benefits — 2-column compact */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-white/70 text-[11px] font-medium leading-tight">{b.title}</span>
                </div>
              ))}
            </div>

            {/* Pay button */}
            <button
              className="w-full h-12 rounded-xl font-bold text-base text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
            >
              Subscribe · Pay ${plan.price.toFixed(2)}
            </button>

            <div className="flex justify-center gap-3 mt-2">
              <a href="#" className="text-white/25 text-[10px] hover:text-white/50 transition-colors">VIP Terms</a>
              <a href="#" className="text-white/25 text-[10px] hover:text-white/50 transition-colors">Privacy Policy</a>
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
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* LEFT PANEL */}
        <div className="flex-1 overflow-y-auto p-6 pt-8" style={{ background: "#13151a" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Log in/Sign up &rsaquo;</span>
          </div>

          <div className="flex gap-2 mb-3">
            {PLANS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(i)}
                className="relative flex-1 rounded-xl p-3 text-left transition-all border"
                style={{
                  background: i === selectedPlan ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)",
                  borderColor: i === selectedPlan ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)",
                }}
              >
                {p.discount > 0 && (
                  <div
                    className="absolute -top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                  >
                    {p.discount}% off
                  </div>
                )}
                <div className="text-white/70 text-xs mb-1 mt-1 leading-tight">{p.label} Subscription</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white/60 text-xs align-top mt-1">$</span>
                  <span className="text-2xl font-bold" style={{ color: i === selectedPlan ? "#a855f7" : "white" }}>{p.price.toFixed(2)}</span>
                </div>
                <div className="text-white/30 text-xs line-through mt-0.5">${p.original.toFixed(2)}</div>
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

        {/* RIGHT PANEL */}
        <div className="w-56 flex-shrink-0 flex flex-col p-5" style={{ background: "#0e1015", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-0.5 mb-2">
              <span className="text-white/60 text-sm align-top mt-1">$</span>
              <span className="text-5xl font-bold text-white">{plan.price.toFixed(2)}</span>
            </div>
            <div className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
              Saved ${saved}
            </div>
          </div>
          <div className="border-t mb-4" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <div>
            <div className="text-white text-xs font-semibold mb-3">Choose Payment Method</div>
            <div className="rounded-xl p-3 flex flex-col items-center gap-1 border cursor-pointer" style={{ background: "rgba(168,85,247,0.05)", borderColor: "rgba(168,85,247,0.4)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1677ff" }}>
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                  <path d="M20 6C12.27 6 6 12.27 6 20s6.27 14 14 14 14-6.27 14-14S27.73 6 20 6zm-2.5 18.5l-5-3.5 1.2-1.7 3.3 2.3 7-8.6 1.7 1.4-8.2 10.1z" fill="white"/>
                </svg>
              </div>
              <span className="text-white text-[11px] font-medium">Card / PayPal</span>
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#22c55e" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <button
            className="w-full h-11 rounded-xl font-bold text-sm text-white mt-4 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
          >
            Pay now ${plan.price.toFixed(2)}
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

export function Header({ onMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToSubscribe={() => setShowSubscribeModal(true)}
        />
      )}
      {showSubscribeModal && (
        <SubscribeModal
          onClose={() => setShowSubscribeModal(false)}
          isMobile={isMobile}
        />
      )}

      {/* ── DESKTOP HEADER ── */}
      <header
        className={`hidden md:flex fixed top-0 right-0 z-[100] items-center px-4 h-10 gap-3 transition-colors duration-300 ${
          scrolled ? "bg-[#101114]" : "bg-transparent"
        }`}
        style={{ left: 200 }}
      >
        <div
          className={`flex items-center bg-white/20 rounded-lg h-9 px-3 flex-1 max-w-sm transition-all ${
            searchFocused ? "border border-white/60" : "border border-transparent"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-0 outline-none text-white/60 text-sm font-normal ml-2 flex-1 w-0 min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="ml-1 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Subscribe first, Login second */}
        <button
          onClick={() => { setShowLoginModal(false); setShowSubscribeModal(true); }}
          className="flex items-center gap-1.5 gradient-btn px-4 h-8 text-sm font-medium whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Subscribe</span>
        </button>

        <button
          onClick={() => { setShowSubscribeModal(false); setShowLoginModal((v) => !v); }}
          className="h-8 px-4 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors whitespace-nowrap"
        >
          Login
        </button>
      </header>

      {/* ── MOBILE HEADER ── */}
      <header
        className={`flex md:hidden fixed top-0 left-0 right-0 z-[100] items-center px-3 h-12 gap-2 transition-colors duration-300 ${
          scrolled ? "bg-[#101114]" : "bg-[#101114]/90 backdrop-blur-sm"
        }`}
      >
        {/* Logo image */}
        <div className="flex items-center flex-shrink-0">
          <img
            src={vjemmaLogo}
            alt="VJ Emma True Light Film"
            style={{ height: 36, width: "auto" }}
          />
        </div>

        {/* Search */}
        <div
          className={`flex items-center bg-white/15 rounded-md h-7 px-2 flex-1 min-w-0 transition-all ${
            searchFocused ? "border border-white/50" : "border border-transparent"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-0 outline-none text-white/70 text-xs ml-1.5 flex-1 w-0 min-w-0 placeholder:text-white/35"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="ml-1 flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Subscribe icon — first */}
        <button
          onClick={() => { setShowLoginModal(false); setShowSubscribeModal(true); }}
          className="flex-shrink-0 gradient-btn flex items-center justify-center w-7 h-7"
          style={{ borderRadius: 6 }}
          aria-label="Subscribe"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </button>

        {/* Login icon — second */}
        <button
          onClick={() => { setShowSubscribeModal(false); setShowLoginModal((v) => !v); }}
          className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded border border-white/20 hover:border-white/40 transition-colors"
          aria-label="Login"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </header>
    </>
  );
}
