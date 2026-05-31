import Button from "@/components/commons/Button";
import Loading from "@/components/commons/Loading";
import { MoviesProps } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const formatRuntime = (seconds?: number) => {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return null;
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours <= 0) return `${mins} min`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const MovieDetail: React.FC = () => {
  const router = useRouter();
  const idParam = router.query.id;
  const id = typeof idParam === "string" ? idParam : undefined;

  const [movie, setMovie] = useState<MoviesProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const synopsis = useMemo(() => {
    const text = movie?.plot?.plotText?.plainText;
    return text?.trim() || null;
  }, [movie]);

  const runtimeLabel = useMemo(
    () => formatRuntime(movie?.runtime?.seconds),
    [movie?.runtime?.seconds]
  );

  const ratingLabel = useMemo(() => {
    const r = movie?.ratingsSummary?.aggregateRating;
    if (r == null || Number.isNaN(r)) return null;
    return r.toFixed(1);
  }, [movie?.ratingsSummary?.aggregateRating]);

  const voteCountLabel = useMemo(() => {
    const n = movie?.ratingsSummary?.voteCount;
    if (n == null || Number.isNaN(n)) return null;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ratings`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}k ratings`;
    return `${n} ratings`;
  }, [movie?.ratingsSummary?.voteCount]);

  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setIsFavorite(favorites.includes(id));
  }, [id]);

  useEffect(() => {
    if (!router.isReady) return;

    if (!id) {
      setLoading(false);
      setMovie(null);
      setError("Missing movie id.");
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/movie-details?id=${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setMovie(data.movie ?? null);
        if (!data.movie) {
          setError("This title could not be loaded.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchMovieDetails();
  }, [router.isReady, id]);

  const toggleFavorite = () => {
    if (typeof window === "undefined" || !id) return;
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    if (favorites.includes(id)) {
      const updatedFavorites = favorites.filter((fav) => fav !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  if (!router.isReady || loading) {
    return <Loading />;
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16 sm:py-20">
        <div className="glass-panel w-full max-w-lg rounded-3xl px-6 py-10 text-center sm:px-8 sm:py-12">
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl md:text-4xl">
            Not found
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            {error || "The movie you are looking for is unavailable."}
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              title="Back to movies"
              variant="primary"
              action={() => router.push("/movies")}
            />
          </div>
        </div>
      </div>
    );
  }

  const title = movie.titleText?.text || "Unknown title";
  const year = movie.releaseYear?.year || "—";
  const typeLabel = movie.titleType
    ? movie.titleType.replace(/_/g, " ")
    : null;

  return (
    <div className="text-foreground">
      <section className="border-b border-white/5 bg-linear-to-b from-surface/30 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-10">
          <Button
            title="← Back to movies"
            variant="outline"
            action={() => router.push("/movies")}
          />
        </div>
      </section>

      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="glass-panel mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl p-2 sm:max-w-xs md:max-w-sm lg:mx-0 lg:max-w-none">
                {movie.primaryImage?.url ? (
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl">
                    <Image
                      src={movie.primaryImage.url}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 38vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex aspect-2/3 w-full items-center justify-center rounded-xl bg-surface-2 px-4">
                    <p className="text-center text-sm text-muted">Poster unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-7">
            <header className="space-y-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                {typeLabel || "Title"}
              </p>
              <h1 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-foreground">
                  {year}
                </span>
                {runtimeLabel && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-muted">
                    {runtimeLabel}
                  </span>
                )}
                {ratingLabel && (
                  <span className="rounded-full bg-accent-dim px-3 py-1 text-sm font-semibold text-accent">
                    {ratingLabel}
                    <span className="ml-1 font-normal text-foreground/80">/10</span>
                    {voteCountLabel ? (
                      <span className="ml-1 font-normal text-muted">· {voteCountLabel}</span>
                    ) : null}
                  </span>
                )}
              </div>
            </header>

            {movie.genres && movie.genres.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {movie.genres.map((g) => (
                  <li key={g}>
                    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted sm:text-sm">
                      {g}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={toggleFavorite}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition sm:w-auto ${
                  isFavorite
                    ? "bg-linear-to-r from-accent to-accent-2 text-background shadow-[0_12px_40px_rgba(45,212,191,0.25)]"
                    : "border border-white/15 bg-white/5 text-foreground hover:border-accent/40 hover:bg-accent-dim"
                }`}
              >
                {isFavorite ? "Saved to favorites" : "Add to favorites"}
              </button>
            </div>

            {synopsis && (
              <section className="glass-panel rounded-2xl p-5 sm:p-6" aria-labelledby="synopsis-heading">
                <h2 id="synopsis-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Synopsis
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
                  {synopsis}
                </p>
              </section>
            )}

            <section
              className="glass-panel rounded-2xl p-5 sm:p-6"
              aria-labelledby="details-heading"
            >
              <h2 id="details-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
                Details
              </h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-5 sm:text-base">
                <div className="rounded-xl bg-white/3 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    IMDb ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-sm text-foreground/90 sm:text-base">
                    {movie.id}
                  </dd>
                </div>
                <div className="rounded-xl bg-white/3 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Format
                  </dt>
                  <dd className="mt-1 capitalize text-foreground/90">
                    {typeLabel || "—"}
                  </dd>
                </div>
                <div className="rounded-xl bg-white/3 px-4 py-3 sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Release year
                  </dt>
                  <dd className="mt-1 text-foreground/90">{year}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MovieDetail;
