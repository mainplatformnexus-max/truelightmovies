import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
}

const navItems = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    id: "movies",
    label: "Movies",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
      </svg>
    ),
  },
  {
    id: "series",
    label: "TV Shows",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
      </svg>
    ),
  },
  {
    id: "categories",
    label: "Categories",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22s4.5-2.01 4.5-4.5S19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5S16.12 15 17.5 15s2.5 1.12 2.5 2.5S18.88 20 17.5 20zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
      </svg>
    ),
  },
  {
    id: "top-rated",
    label: "Top Rated",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
    ),
  },
  {
    id: "history",
    label: "Watch History",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3a9 9 0 100 18A9 9 0 0013 3zm-1 4.5v5.25l4.5 2.7-.75 1.23-5.25-3.18V7.5H12z"/>
      </svg>
    ),
  },
];

export function Sidebar({ isOpen, onClose, activeNav, onNavChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[50] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[200px] bg-[#101114] z-[60] flex flex-col py-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-3 mb-12 mt-1">
          <a href="/" className="flex items-center gap-2">
            <div className="relative" style={{ width: 24, height: 27 }}>
              <svg width="24" height="27" viewBox="0 0 40 45" fill="none">
                <rect width="40" height="45" rx="8" fill="url(#sidebarGrad)"/>
                <defs>
                  <linearGradient id="sidebarGrad" x1="0" y1="0" x2="40" y2="45" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7"/>
                    <stop offset="1" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#101114" fontSize="20" fontWeight="bold">M</text>
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg leading-none">MovieBox</h2>
          </a>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col flex-1">
          {navItems.map((item, i) => (
            <div key={item.id}>
              {i === 4 && (
                <div className="my-3 mx-3 h-px bg-white/10" />
              )}
              <button
                onClick={() => { onNavChange(item.id); onClose(); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg mb-2 mx-0 text-left transition-colors ${
                  activeNav === item.id
                    ? "nav-active"
                    : "hover:bg-white/10"
                }`}
                style={{ width: "calc(100% - 0px)" }}
              >
                <span className={`flex-shrink-0 ${activeNav === item.id ? "text-[#a855f7]" : "text-white/80"}`}>
                  {item.icon}
                </span>
                <span
                  className={`text-base font-bold leading-5 nav-title ${
                    activeNav === item.id ? "" : "text-white/80"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </div>
          ))}
        </nav>

        {/* Get App section */}
        <div className="px-3 mt-4">
          <div className="h-px bg-white/10 mb-3" />
          <p className="text-white text-xs font-medium text-center mb-3">Get the App</p>
          <a
            href="#"
            className="flex items-center justify-center gap-2 gradient-btn w-full h-10 text-sm font-medium text-[#101114]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.34.07 2.27.74 3.05.8 1.16-.24 2.27-.93 3.51-.84 1.48.12 2.6.72 3.33 1.87-3.06 1.83-2.32 5.83.61 6.96-.57 1.57-1.3 3.12-2.5 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span>Download App</span>
          </a>

          {/* Footer links */}
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
            {["About", "Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="text-white/60 text-xs hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-2">© 2024 MovieBox</p>
        </div>
      </aside>
    </>
  );
}
