import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuToggle: () => void;
}

const PLANS = [
  {
    id: "monthly",
    label: "Monthly Subscription",
    price: 3.59,
    original: 5.99,
    discount: 40,
  },
  {
    id: "quarterly",
    label: "Quarterly Subscription",
    price: 10.49,
    original: 17.49,
    discount: 40,
  },
  {
    id: "annual",
    label: "Annual Subscription",
    price: 28.99,
    original: 56.99,
    discount: 50,
  },
];

const BENEFITS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 19.07a1 1 0 0 0 1.71 1.05C7.42 17.5 10 14 17 12V8z"/>
        <path d="M5 12V5l7-3 7 3v7l-7 4-7-4z" opacity=".4"/>
      </svg>
    ),
    title: "Members Access",
    desc: "Enjoy VIP exclusive content/episodes",
    color: "#f59e0b",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="3" width="20" height="14" rx="2" opacity=".4"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Multi-Device Access",
    desc: "One account on phone, PC, and TV",
    color: "#8b5cf6",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity=".4"/>
        <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    title: "High Resolution",
    desc: "Watch 1080P videos",
    color: "#ef4444",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5z" opacity=".4"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "Early Access",
    desc: "VIP members watch new episodes first",
    color: "#06b6d4",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 16l-5-5h3V4h4v7h3l-5 5z" opacity=".4"/>
        <path d="M20 18H4v2h16v-2z"/>
      </svg>
    ),
    title: "Fast Download",
    desc: "Boost up to 5 videos at once",
    color: "#eab308",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity=".4"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: "Pre-roll Ad Free",
    desc: "Enjoy a clean, ad-free experience",
    color: "#22c55e",
  },
];

function SubscribeModal({ onClose }: { onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);
  const plan = PLANS[selectedPlan];
  const saved = (plan.original - plan.price).toFixed(2);
  const visibleCount = 3;

  const prevSlide = () => {
    if (carouselStart > 0) setCarouselStart(carouselStart - 1);
  };
  const nextSlide = () => {
    if (carouselStart + visibleCount < PLANS.length) setCarouselStart(carouselStart + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* LEFT PANEL */}
        <div
          className="flex-1 overflow-y-auto p-6 pt-8"
          style={{ background: "#13151a" }}
        >
          {/* Login prompt */}
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">
              Log in/Sign up &rsaquo;
            </span>
          </div>

          {/* Plan carousel */}
          <div className="relative flex items-center gap-2 mb-3">
            <button
              onClick={prevSlide}
              disabled={carouselStart === 0}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="flex gap-2 flex-1 overflow-hidden">
              {PLANS.slice(carouselStart, carouselStart + visibleCount).map((p, i) => {
                const planIdx = carouselStart + i;
                const isSelected = planIdx === selectedPlan;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(planIdx)}
                    className="relative flex-1 rounded-xl p-3 text-left transition-all border"
                    style={{
                      background: isSelected ? "rgba(0,200,255,0.08)" : "rgba(255,255,255,0.04)",
                      borderColor: isSelected ? "rgba(0,200,255,0.5)" : "rgba(255,255,255,0.08)",
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
                    <div className="text-white/70 text-xs mb-1 mt-1 leading-tight">{p.label}</div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-white/60 text-xs align-top mt-1">$</span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: isSelected ? "#00c8ff" : "white" }}
                      >
                        {p.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-white/30 text-xs line-through mt-0.5">${p.original.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              disabled={carouselStart + visibleCount >= PLANS.length}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <p className="text-white/40 text-xs mb-5">
            · New subscribers get {PLANS[selectedPlan].discount}% off the first term!
          </p>

          {/* Benefits */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">VIP Membership Benefits</h3>
            <div className="grid grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: b.color + "22", color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold leading-tight">{b.title}</div>
                    <div className="text-white/40 text-[11px] leading-snug mt-0.5">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="w-56 flex-shrink-0 flex flex-col p-5"
          style={{ background: "#0e1015", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Price */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-0.5 mb-2">
              <span className="text-white/60 text-sm align-top mt-1">$</span>
              <span className="text-5xl font-bold text-white">{plan.price.toFixed(2)}</span>
            </div>
            <div
              className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
            >
              Saved ${saved}
            </div>
          </div>

          <div
            className="border-t mb-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          />

          {/* Payment method */}
          <div>
            <div className="text-white text-xs font-semibold mb-3">Choose Payment Method</div>
            <div
              className="rounded-xl p-3 flex flex-col items-center gap-1 border cursor-pointer"
              style={{
                background: "rgba(0,200,255,0.05)",
                borderColor: "rgba(0,200,255,0.4)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "#1677ff" }}
              >
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                  <path d="M20 6C12.27 6 6 12.27 6 20s6.27 14 14 14 14-6.27 14-14S27.73 6 20 6zm-2.5 18.5l-5-3.5 1.2-1.7 3.3 2.3 7-8.6 1.7 1.4-8.2 10.1z" fill="white"/>
                </svg>
              </div>
              <span className="text-white text-[11px] font-medium">Card / PayPal</span>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#22c55e" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Pay button */}
          <button
            className="w-full h-11 rounded-xl font-bold text-sm text-white mt-4 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
          >
            Pay now ${plan.price.toFixed(2)}
          </button>

          <div className="flex justify-center gap-2 mt-3">
            <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">"VIP Membership Terms"</a>
            <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">"Privacy Policy"</a>
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showSubscribeModal && <SubscribeModal onClose={() => setShowSubscribeModal(false)} />}

      {/* ── DESKTOP HEADER ── hidden on mobile */}
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

        {/* Login button */}
        <button className="h-8 px-4 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors whitespace-nowrap">
          Login
        </button>

        {/* Subscribe button */}
        <button
          onClick={() => setShowSubscribeModal(true)}
          className="flex items-center gap-1.5 gradient-btn px-4 h-8 text-sm font-medium whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Subscribe</span>
        </button>
      </header>

      {/* ── MOBILE HEADER ── */}
      <header
        className={`flex md:hidden fixed top-0 left-0 right-0 z-[100] items-center px-3 h-11 gap-2 transition-colors duration-300 ${
          scrolled ? "bg-[#101114]" : "bg-[#101114]/85 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg width="18" height="20" viewBox="0 0 40 45" fill="none">
            <rect width="40" height="45" rx="8" fill="url(#mobileGrad)"/>
            <defs>
              <linearGradient id="mobileGrad" x1="0" y1="0" x2="40" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">T</text>
          </svg>
          <span className="text-white font-bold text-sm leading-none tracking-wide">TRUE LIGHT</span>
        </div>

        {/* Search — takes remaining space */}
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

        {/* Subscribe icon button */}
        <button
          onClick={() => setShowSubscribeModal(true)}
          className="flex-shrink-0 gradient-btn flex items-center justify-center w-7 h-7"
          style={{ borderRadius: 6 }}
          aria-label="Subscribe"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </button>
      </header>
    </>
  );
}
