import Link from "next/link";

const links = [
  { href: "/", label: "Generate" },
  { href: "/diff", label: "Diff" },
  { href: "/inspect", label: "Inspect" },
];

export function Navbar() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-brand-500 text-lg tracking-tight">
          ⚡ LumenLens
        </Link>
        <div className="flex gap-1 ml-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="btn-ghost text-sm">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://github.com/your-org/lumen-lens"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
