interface MobileNavProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

const navItems = [
  {
    id: "home",
    label: "Home",
    normalIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    id: "movies",
    label: "Movies",
    normalIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 4l2 4M16 4l-2 4M2 12h20M8 20l2-4M16 20l-2-4"/>
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
      </svg>
    ),
  },
  {
    id: "series",
    label: "TV Shows",
    normalIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="15" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    normalIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    activeIcon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ),
  },
];

export function MobileNav({ activeNav, onNavChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1c1d23] border-t border-white/10 z-50 md:hidden pb-safe">
      <ul className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavChange(item.id)}
                className="flex flex-col items-center gap-0.5 w-full py-2"
              >
                <span className={isActive ? "text-[#a855f7]" : "text-white/50"}>
                  {isActive ? item.activeIcon : item.normalIcon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? "text-white font-semibold" : "text-white/50"}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
