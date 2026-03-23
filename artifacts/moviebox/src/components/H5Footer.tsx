export function H5Footer() {
  const links = [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
    { label: "DMCA", href: "#" },
    { label: "Free Movies", href: "#" },
    { label: "123Movies", href: "#" },
    { label: "Watch Movies Online", href: "#" },
  ];

  return (
    <footer className="md:hidden flex flex-col items-center bg-[#28292E] p-4 mb-16">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white/60 text-xs"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="mailto:moviebox.ng@mbox.ng"
        className="text-white/60 text-xs mb-2"
      >
        Service Email: moviebox.ng@mbox.ng
      </a>

      <p className="text-white/40 text-xs text-center">
        © 2024 MovieBox. All Rights Reserved.
      </p>
    </footer>
  );
}
