export function PcFooter() {
  const friendLinks = [
    { label: "Free Movies", href: "#" },
    { label: "123Movies", href: "#" },
    { label: "Movies Online", href: "#" },
    { label: "Movie4k", href: "#" },
    { label: "Watch Movies Online Free", href: "#" },
    { label: "Watch Series", href: "#" },
    { label: "Fmovies", href: "#" },
  ];

  const policyLinks = [
    { label: "About Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "DMCA", href: "#" },
  ];

  return (
    <footer className="hidden md:flex flex-col items-center w-full pt-6 pb-[44px] px-5 mt-8 border-t border-white/10">
      {/* Friend links */}
      <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 mb-4">
        {friendLinks.map((link, i) => (
          <span key={link.label} className="flex items-center">
            <a
              href={link.href}
              className="text-white/60 text-xs hover:text-white transition-colors"
            >
              {link.label}
            </a>
            {i < friendLinks.length - 1 && (
              <span className="inline-block w-px h-2.5 bg-white/30 ml-2" />
            )}
          </span>
        ))}
      </div>

      {/* Policy links */}
      <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 mb-4">
        {policyLinks.map((link, i) => (
          <span key={link.label} className="flex items-center">
            <a
              href={link.href}
              className="text-white/60 text-xs hover:text-white transition-colors"
            >
              {link.label}
            </a>
            {i < policyLinks.length - 1 && (
              <span className="inline-block w-px h-2.5 bg-white/30 ml-2" />
            )}
          </span>
        ))}
      </div>

      <a
        href="mailto:moviebox.ng@mbox.ng"
        className="text-white/60 text-xs hover:text-white transition-colors mb-3"
        target="_blank"
        rel="noreferrer"
      >
        Service Email: moviebox.ng@mbox.ng
      </a>

      <p className="text-white/40 text-xs text-center">
        © 2024 MovieBox. All Rights Reserved. This site does not store any files on our server.
      </p>
    </footer>
  );
}
