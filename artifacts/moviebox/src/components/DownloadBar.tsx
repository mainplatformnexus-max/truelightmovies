import { useState } from "react";

export function DownloadBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="download-bar flex items-center gap-2">
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 40 45" fill="none">
            <rect width="40" height="45" rx="8" fill="url(#dlGrad)"/>
            <defs>
              <linearGradient id="dlGrad" x1="0" y1="0" x2="40" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7"/>
                <stop offset="1" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">T</text>
          </svg>
        </div>
      </div>

      <div className="flex-1 flex items-center text-[11px] font-medium text-white/80 leading-tight min-w-0 overflow-hidden">
        <span className="truncate">Get <span className="font-bold text-white">TRUE LIGHT</span> App Free!</span>
      </div>

      <a href="#" className="flex-shrink-0 gradient-btn px-3 py-1.5 text-xs font-bold text-[#101114] whitespace-nowrap">
        Install Now
      </a>

      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
