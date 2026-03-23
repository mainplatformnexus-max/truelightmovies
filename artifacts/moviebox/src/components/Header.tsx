import { useState, useEffect, useRef } from "react";
import vjemmaLogo from "@assets/IMG-20260203-WA0010.jpg-removebg-preview_1774231087997.png";
import { useAuth } from "../contexts/AuthContext";
import { SubscribeModal } from "./SubscribeModal";

interface HeaderProps {
  onMenuToggle: () => void;
}

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  borderColor: "rgba(255,255,255,0.1)",
};
const focusInput = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "rgba(168,85,247,0.6)");
const blurInput = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "rgba(255,255,255,0.1)");

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, signup, loginWithGoogle } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"login" | "signup">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const [googlePhone, setGooglePhone] = useState("");
  const [showGooglePhone, setShowGooglePhone] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) { setLoginError("Please fill in all fields."); return; }
    setLoginLoading(true);
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
        setLoginError("Invalid email or password.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName.trim()) { setSignupError("Full name is required."); return; }
    if (!signupEmail) { setSignupError("Email is required."); return; }
    if (!signupPhone.trim()) { setSignupError("Phone number is required."); return; }
    if (signupPassword.length < 6) { setSignupError("Password must be at least 6 characters."); return; }
    if (signupPassword !== signupConfirm) { setSignupError("Passwords do not match."); return; }
    setSignupLoading(true);
    setSignupError("");
    try {
      await signup(signupName.trim(), signupEmail, signupPhone.trim(), signupPassword);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("email-already-in-use")) {
        setSignupError("Email already in use. Try logging in.");
      } else {
        setSignupError("Sign up failed. Please try again.");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setGoogleError("");
    try {
      await loginWithGoogle(googlePhone);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("popup-closed")) {
        setGoogleError("Google sign-in was cancelled.");
      } else {
        setGoogleError("Google sign-in failed.");
      }
    } finally {
      setGoogleLoading(false);
      setShowGooglePhone(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end pt-11 pr-3 md:pr-5">
      <div
        ref={ref}
        className="w-80 rounded-xl shadow-2xl overflow-hidden"
        style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.15))", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xs">
              {view === "login" ? "Welcome back" : "Create account"}
            </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-4">
          {view === "login" ? (
            <>
              <div className="mb-3">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="mb-1">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="flex justify-end mb-3">
                <a href="#" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
              </div>
              {loginError && <p className="text-red-400 text-[10px] mb-2">{loginError}</p>}
              <button
                className="w-full h-9 rounded-lg font-bold text-xs text-white mb-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Log In"}
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-white/30 text-[10px]">or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
              <button
                className="w-full h-9 rounded-lg text-xs text-white font-medium mb-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/15"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                <GoogleIcon />
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </button>
              {googleError && <p className="text-red-400 text-[10px] mb-2">{googleError}</p>}
              <p className="text-center text-white/40 text-[11px]">
                Don't have an account?{" "}
                <button onClick={() => { setView("signup"); setLoginError(""); }} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-2.5">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="mb-2.5">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="mb-2.5">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +256700123456"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="mb-2.5">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Create a password..."
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div className="mb-3">
                <label className="block text-white/50 text-[11px] mb-1 font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password..."
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors"
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              {signupError && <p className="text-red-400 text-[10px] mb-2">{signupError}</p>}
              <button
                className="w-full h-9 rounded-lg font-bold text-xs text-white mb-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                onClick={handleSignup}
                disabled={signupLoading}
              >
                {signupLoading ? "Creating account..." : "Create Account"}
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-white/30 text-[10px]">or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
              {showGooglePhone ? (
                <div className="mb-3">
                  <label className="block text-white/50 text-[11px] mb-1 font-medium">Phone Number <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    placeholder="e.g. +256700123456"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg text-xs text-white placeholder-white/30 outline-none border transition-colors mb-2"
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                  {googleError && <p className="text-red-400 text-[10px] mb-1">{googleError}</p>}
                  <button
                    className="w-full h-9 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/15 disabled:opacity-50"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                    onClick={handleGoogle}
                    disabled={googleLoading || !googlePhone.trim()}
                  >
                    <GoogleIcon />
                    {googleLoading ? "Signing in..." : "Continue with Google"}
                  </button>
                </div>
              ) : (
                <button
                  className="w-full h-9 rounded-lg text-xs text-white font-medium mb-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/15"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  onClick={() => setShowGooglePhone(true)}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              )}
              <p className="text-center text-white/40 text-[11px]">
                Already have an account?{" "}
                <button onClick={() => { setView("login"); setSignupError(""); }} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Log in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
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
  const profileRef = useRef<HTMLDivElement>(null);

  const loggedInUser = profile?.displayName || null;

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
        <button
          onClick={() => { setShowLoginModal(false); setShowSubscribeModal(true); }}
          className="flex items-center gap-1.5 gradient-btn px-4 h-8 text-sm font-medium whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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
        <button
          onClick={() => { setShowLoginModal(false); setShowSubscribeModal(true); }}
          className="flex-shrink-0 gradient-btn flex items-center justify-center w-7 h-7"
          style={{ borderRadius: 6 }}
          aria-label="Subscribe"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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
        <button onClick={onMenuToggle} className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
      </header>
    </>
  );
}
