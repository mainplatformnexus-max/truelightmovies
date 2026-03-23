export function PcFooter() {
  const friendLinks = [
    { label: "Luo Film", href: "https://luofilm.site" },
    { label: "Luo Watch", href: "https://luowatch.xyz" },
    { label: "Luo Ancient Movies", href: "https://luoancientmovies.com" },
    { label: "VJ Pile SUG", href: "https://vjpilesug.com" },
    { label: "VJ Dimpoz Movies", href: "https://vjdimpozmovies.xyz" },
    { label: "BetMali", href: "https://betmali.site" },
    { label: "Nexus Platform", href: "https://nexusplatform.site" },
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
              target="_blank"
              rel="noreferrer"
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
        href="mailto:mainplatform.nexus@gmail.com"
        className="text-white/60 text-xs hover:text-white transition-colors mb-2"
        target="_blank"
        rel="noreferrer"
      >
        Service Email: mainplatform.nexus@gmail.com
      </a>

      <p className="text-white/40 text-xs text-center mb-1">
        Managed under{" "}
        <a
          href="https://www.nexusplatform.site"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
        >
          Nexus Platform
        </a>
      </p>

      <p className="text-white/40 text-xs text-center">
        © 2024–2027 True Light. All Rights Reserved. This site does not store any files on our server.
      </p>
    </footer>
  );
}
