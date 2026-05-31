import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-elevated/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between md:px-10 lg:px-10">
        <div className="text-center md:text-left">
          <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Cine<span className="text-gradient">Seek</span>
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Curated discovery for film lovers—trailers, details, and lists without the noise.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <Link href="/movies" className="transition hover:text-accent">
            Movies
          </Link>
          <Link href="/favorites" className="transition hover:text-accent">
            Favorites
          </Link>
          <Link href="/contact" className="transition hover:text-accent">
            Contact
          </Link>
          <Link href="/privacy" className="transition hover:text-accent">
            Privacy
          </Link>
        </nav>

        <div className="flex gap-3 text-muted">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-accent/40 hover:text-accent"
            aria-label="Twitter"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-accent/40 hover:text-accent"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-accent/40 hover:text-accent"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} CineSeek. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
