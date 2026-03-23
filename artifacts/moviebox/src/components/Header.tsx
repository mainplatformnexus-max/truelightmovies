import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP HEADER ── hidden on mobile */}
      <header
        className={`hidden md:flex fixed top-0 right-0 z-[100] items-center px-4 h-10 gap-4 transition-colors duration-300 ${
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

        <a href="#" className="flex items-center gap-2 gradient-btn px-4 h-8 text-sm font-medium whitespace-nowrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/>
            <path d="M20 18H4v2h16v-2z"/>
          </svg>
          <span>Download TRUE LIGHT</span>
        </a>
      </header>

      {/* ── MOBILE HEADER ── no hamburger, bottom nav handles navigation */}
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

        {/* Download icon */}
        <a
          href="#"
          className="flex-shrink-0 gradient-btn flex items-center justify-center w-7 h-7"
          style={{ borderRadius: 6 }}
          aria-label="Download"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/>
            <path d="M20 18H4v2h16v-2z"/>
          </svg>
        </a>
      </header>
    </>
  );
}
