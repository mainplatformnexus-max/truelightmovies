import { useState, useEffect, useRef } from "react";
import vjemmaLogo from "@assets/IMG-20260203-WA0010.jpg-removebg-preview_1774231087997.png";
import { useAuth } from "../contexts/AuthContext";
import { SubscribeModal } from "./SubscribeModal";
import { LoginModal } from "./LoginModal";

interface HeaderProps {
  onMenuToggle: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { profile, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const loggedInUser = profile?.displayName || null;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setInstallPrompt(null);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

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

  const VIPIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 7l4 9h12l4-9-5 4-5-7-5 7-5-4z"/>
      <rect x="6" y="17" width="12" height="2" rx="1"/>
    </svg>
  );

  const InstallIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v13M7 11l5 5 5-5"/>
      <path d="M4 20h16"/>
    </svg>
  );

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showSubscribeModal && <SubscribeModal onClose={() => setShowSubscribeModal(false)} isMobile={isMobile} />}

      {/* ── DESKTOP HEADER ── */}
      <header
        className={`hidden md:flex fixed top-0 right-0 z-[100] items-center px-4 h-10 gap-3 transition-colors duration-300 ${scrolled ? "bg-[#101114]" : "bg-transparent"}`}
        style={{ left: 200 }}
      >
        <div className={`flex items-center bg-white/20 rounded-lg h-9 px-3 flex-1 max-w-sm transition-all ${searchFocused ? "border border-white/60" : "border border-transparent"}`}>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
        <div className="flex-1" />

        {installPrompt && !installed && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-white/80 border border-white/25 hover:border-white/50 rounded-lg transition-colors whitespace-nowrap"
          >
            <InstallIcon />
            <span>Install App</span>
          </button>
        )}

        <button
          onClick={() => { if (!loggedInUser) { setShowSubscribeModal(false); setShowLoginModal(true); } else { setShowLoginModal(false); setShowSubscribeModal(true); } }}
          className="flex items-center gap-1.5 gradient-btn px-4 h-8 text-sm font-medium whitespace-nowrap"
        >
          <VIPIcon />
          <span>Subscribe</span>
        </button>

        {loggedInUser ? (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white hover:opacity-90 transition-opacity overflow-hidden"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
            >
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                loggedInUser.charAt(0).toUpperCase()
              )}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-48 rounded-xl shadow-2xl overflow-hidden z-[300]" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-white text-xs font-semibold truncate">{loggedInUser}</p>
                  <p className="text-white/40 text-[10px] truncate">{profile?.email}</p>
                  {profile?.phone && <p className="text-white/30 text-[10px]">{profile.phone}</p>}
                  <p className="text-purple-400 text-[10px] capitalize mt-0.5">{profile?.plan || "Free plan"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setShowSubscribeModal(false); setShowLoginModal((v) => !v); }}
            className="h-8 px-4 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors whitespace-nowrap"
          >
            Login
          </button>
        )}
      </header>

      {/* ── MOBILE HEADER ── */}
      <header
        className={`flex md:hidden fixed top-0 left-0 right-0 z-[100] items-center px-3 h-12 gap-2 transition-colors duration-300 ${scrolled ? "bg-[#101114]" : "bg-[#101114]/90 backdrop-blur-sm"}`}
      >
        <div className="flex items-center flex-shrink-0">
          <img src={vjemmaLogo} alt="VJ Emma True Light Film" style={{ height: 36, width: "auto" }} />
        </div>
        <div className={`flex items-center bg-white/15 rounded-md h-7 px-2 flex-1 min-w-0 transition-all ${searchFocused ? "border border-white/50" : "border border-transparent"}`}>
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
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {installPrompt && !installed && (
          <button
            onClick={handleInstall}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-white/25 text-white/70"
            aria-label="Install App"
          >
            <InstallIcon />
          </button>
        )}

        <button
          onClick={() => { if (!loggedInUser) { setShowSubscribeModal(false); setShowLoginModal(true); } else { setShowLoginModal(false); setShowSubscribeModal(true); } }}
          className="flex-shrink-0 gradient-btn flex items-center justify-center w-7 h-7"
          style={{ borderRadius: 6 }}
          aria-label="Subscribe"
        >
          <VIPIcon />
        </button>

        {loggedInUser ? (
          <div ref={profileRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white overflow-hidden"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
            >
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                loggedInUser.charAt(0).toUpperCase()
              )}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 top-9 w-44 rounded-xl shadow-2xl overflow-hidden z-[300]" style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-white text-xs font-semibold truncate">{loggedInUser}</p>
                  <p className="text-purple-400 text-[10px] capitalize mt-0.5">{profile?.plan || "Free plan"}</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setShowSubscribeModal(false); setShowLoginModal((v) => !v); }}
            className="flex-shrink-0 h-7 px-3 text-[11px] font-medium text-white/80 border border-white/20 rounded-md hover:border-white/40 transition-colors whitespace-nowrap"
          >
            Login
          </button>
        )}
      </header>
    </>
  );
}
