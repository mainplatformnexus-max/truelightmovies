export function H5Footer() {
  const policyLinks = [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
    { label: "DMCA", href: "#" },
  ];

  const siteLinks = [
    { label: "Free Movies", href: "https://luofilm.site" },
    { label: "123Movies", href: "https://luowatch.xyz" },
    { label: "Movies Online", href: "https://luoancientmovies.com" },
    { label: "Movie4k", href: "https://vjpilesug.com" },
    { label: "Watch Movies Online Free", href: "https://vjdimpozmovies.xyz" },
    { label: "Watch Series", href: "https://betmali.site" },
    { label: "Fmovies", href: "https://nexusplatform.site" },
  ];

  return (
    <footer className="md:hidden flex flex-col items-center bg-[#28292E] p-4 mb-16">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
        {policyLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white/60 text-xs"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-3">
        {siteLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-white/60 text-xs"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="mailto:mainplatform.nexus@gmail.com"
        className="text-white/60 text-xs mb-2"
      >
        Service Email: mainplatform.nexus@gmail.com
      </a>

      <p className="text-white/40 text-xs text-center">
        © 2024–2027 MovieBox. All Rights Reserved. This site does not store any files on our server.
      </p>
    </footer>
  );
}
