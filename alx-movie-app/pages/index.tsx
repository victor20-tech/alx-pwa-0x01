import Button from "@/components/commons/Button";
import HeroTrendingBackdrop from "@/components/commons/HeroTrendingBackdrop";
import MovieCard from "@/components/commons/MovieCard";
import { MoviesProps } from "@/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const router = useRouter();
  const [trendingMovies, setTrendingMovies] = useState<MoviesProps[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<MoviesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const trending = await fetch("/api/trending-movies");
        if (!trending.ok) throw new Error("Failed to fetch trending movies");
        const trendingData = await trending.json();
        setTrendingMovies(trendingData.movies || []);

        const recommended = await fetch("/api/fetch-movies", {
          method: "POST",
          body: JSON.stringify({
            page: 1,
            year: new Date().getFullYear() - 1,
            genre: "",
          }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });

        if (!recommended.ok) {
          throw new Error("Failed to fetch recommended movies");
        }

        const recommendedData = await recommended.json();
        setRecommendedMovies(recommendedData.movies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="text-foreground">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden md:min-h-[calc(100vh-5rem)]">
        <HeroTrendingBackdrop movies={trendingMovies} />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Tonight&apos;s lineup
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
            Discover your next{" "}
            <span className="text-gradient">favorite film</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted md:text-xl">
            Browse trending picks, deep cuts, and the stories you save—one calm,
            poster-first experience built for movie nights.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              title="Browse movies"
              variant="primary"
              action={() => router.push("/movies")}
            />
            <Button
              title="View favorites"
              variant="outline"
              action={() => router.push("/favorites")}
            />
          </div>
        </div>
      </section>

      {error && (
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
            <div className="rounded-2xl border border-danger/30 bg-danger/10 px-6 py-10 text-center">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </section>
      )}

      {!error && (
        <>
          <section className="border-t border-white/5 bg-surface/40 py-16 md:py-20">
            <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-8 lg:px-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-2">
                    Spotlight
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                    Trending <span className="text-gradient">now</span>
                  </h2>
                </div>
                <Button
                  title="View all"
                  variant="outline"
                  action={() => router.push("/movies")}
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
                  <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                  <p className="text-sm">Loading trending titles…</p>
                </div>
              ) : (
                <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                  {trendingMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="min-w-[200px] snap-start md:min-w-[220px] lg:min-w-[240px]"
                    >
                      <MovieCard
                        id={movie.id}
                        title={movie?.titleText?.text || "Unknown Title"}
                        posterImage={movie?.primaryImage?.url || "/placeholder.jpg"}
                        releaseYear={movie?.releaseYear?.year || "N/A"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-white/5 py-16 md:py-20">
            <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-8 lg:px-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-2">
                    Personalized
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                    Recommended <span className="text-gradient">for you</span>
                  </h2>
                </div>
                <Button
                  title="Explore"
                  variant="outline"
                  action={() => router.push("/movies")}
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
                  <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                  <p className="text-sm">Loading recommendations…</p>
                </div>
              ) : (
                <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                  {recommendedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="min-w-[200px] snap-start md:min-w-[220px] lg:min-w-[240px]"
                    >
                      <MovieCard
                        id={movie.id}
                        title={movie?.titleText?.text || "Unknown Title"}
                        posterImage={movie?.primaryImage?.url || "/placeholder.jpg"}
                        releaseYear={movie?.releaseYear?.year || "N/A"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="border-t border-white/5 bg-elevated/50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">
            Ready when the lights go down
          </h2>
          <p className="mt-4 text-muted md:text-lg">
            Create a favorites shelf, bounce between genres, and keep every detail
            page a tap away—no clutter, just cinema.
          </p>
          <div className="mt-10 flex justify-center">
            <Button title="Get started" variant="primary" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
