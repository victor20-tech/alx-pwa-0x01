import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../commons/Button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/favorites", label: "Favorites" },
  { href: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-elevated/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8 lg:px-10">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-foreground md:text-2xl"
        >
          Cine<span className="text-gradient">Seek</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-accent-dim text-accent"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button title="Sign in" variant="outline" />
          </div>
          <button
            type="button"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-foreground md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-elevated/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium ${
                    active ? "bg-accent-dim text-accent" : "text-foreground/90"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Button title="Sign in" variant="outline" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
