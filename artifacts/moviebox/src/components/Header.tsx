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
    <header
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 h-10 transition-colors duration-300 ${
        scrolled ? "bg-[#101114]" : "bg-transparent"
      }`}
      style={{ paddingLeft: "216px" }}
    >
      {/* Desktop header content */}
      <div className="hidden md:flex items-center flex-1 gap-4">
        {/* Search box */}
        <div
          className={`flex items-center bg-white/20 rounded-lg h-9 px-3 flex-1 max-w-sm ${
            searchFocused ? "border border-white/60" : ""
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
            className="bg-transparent border-0 outline-none text-white/60 text-sm font-normal ml-2 flex-1 w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="ml-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Download button */}
        <a
          href="#"
          className="flex items-center gap-1 gradient-btn px-3 h-8 text-sm font-medium whitespace-nowrap"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/>
            <path d="M20 18H4v2h16v-2z"/>
          </svg>
          <span>Download MovieBox</span>
        </a>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden items-center w-full gap-2">
        <button onClick={onMenuToggle} className="mr-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M2 8a1 1 0 011-1h20a1 1 0 110 2H3a1 1 0 01-1-1zm0 8a1 1 0 011-1h20a1 1 0 110 2H3a1 1 0 01-1-1zm1 7a1 1 0 100 2h20a1 1 0 100-2H3z" fill="rgba(255,255,255,0.8)"/>
          </svg>
        </button>

        <a href="/" className="flex items-center gap-2 mr-3">
          <svg width="24" height="27" viewBox="0 0 40 45" fill="none">
            <rect width="40" height="45" rx="8" fill="url(#grad)"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1cb7ff"/>
                <stop offset="1" stopColor="#2ff58b"/>
              </linearGradient>
            </defs>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#101114" fontSize="20" fontWeight="bold">M</text>
          </svg>
          <h2 className="text-white font-bold text-lg">MovieBox</h2>
        </a>

        <div
          className={`flex items-center bg-white/20 rounded-lg h-9 px-3 flex-1 ${
            searchFocused ? "border border-white/60" : ""
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-0 outline-none text-white/60 text-sm ml-2 flex-1 w-0"
          />
        </div>

        <a href="#" className="flex items-center gap-1 gradient-btn px-3 h-8 text-sm font-medium ml-2 whitespace-nowrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5z"/>
            <path d="M20 18H4v2h16v-2z"/>
          </svg>
        </a>
      </div>
    </header>
  );
}
