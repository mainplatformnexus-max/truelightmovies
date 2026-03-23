export function H5Footer() {
  const policyLinks = [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
    { label: "DMCA", href: "#" },
  ];

  const siteLinks = [
    { label: "Luo Film", href: "https://luofilm.site" },
    { label: "Luo Watch", href: "https://luowatch.xyz" },
    { label: "Luo Ancient Movies", href: "https://luoancientmovies.com" },
    { label: "VJ Pile SUG", href: "https://vjpilesug.com" },
    { label: "VJ Dimpoz Movies", href: "https://vjdimpozmovies.xyz" },
    { label: "BetMali", href: "https://betmali.site" },
    { label: "Nexus Platform", href: "https://nexusplatform.site" },
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

      <p className="text-white/40 text-xs text-center mb-1">
        Managed under{" "}
        <a
          href="https://www.nexusplatform.site"
          target="_blank"
          rel="noreferrer"
          className="text-white/60 underline underline-offset-2"
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
