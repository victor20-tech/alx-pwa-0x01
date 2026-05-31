import Button from "@/components/commons/Button";
import Loading from "@/components/commons/Loading";
import MovieCard from "@/components/commons/MovieCard";
import { MoviesProps } from "@/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Favorites: React.FC = () => {
  const router = useRouter();
  const [favoriteMovies, setFavoriteMovies] = useState<MoviesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (typeof window === "undefined") return;
      setLoading(true);
      setError(null);

      try {
        const favoriteIds: string[] = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );

        if (favoriteIds.length === 0) {
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        const moviePromises = favoriteIds.map(async (movieId) => {
          try {
            const response = await fetch(`/api/movie-details?id=${movieId}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data.movie as MoviesProps;
          } catch {
            return null;
          }
        });

        const movies = await Promise.all(moviePromises);
        setFavoriteMovies(movies.filter((movie): movie is MoviesProps => !!movie));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = (movieId: string) => {
    if (typeof window === "undefined") return;
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const updatedFavorites = favorites.filter((fav) => fav !== movieId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 py-12 text-foreground md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-2">
              Your shelf
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">
              Favorites <span className="text-gradient">collection</span>
            </h1>
          </div>
          <Button title="← Back to movies" variant="outline" action={() => router.push("/movies")} />
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {favoriteMovies.length === 0 ? (
          <div className="mt-16 rounded-3xl glass-panel px-8 py-16 text-center">
            <p className="font-serif text-2xl font-semibold md:text-3xl">Nothing saved yet</p>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Tap the heart on any title to park it here for quick revisits.
            </p>
            <div className="mt-8 flex justify-center">
              <Button title="Browse movies" variant="primary" action={() => router.push("/movies")} />
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="group relative">
                <div
                  onClick={() => router.push(`/movies/${movie.id}`)}
                  className="cursor-pointer"
                >
                  <MovieCard
                    id={movie.id}
                    title={movie?.titleText?.text || "Unknown Title"}
                    posterImage={movie?.primaryImage?.url || "/placeholder.jpg"}
                    releaseYear={movie?.releaseYear?.year || "N/A"}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFavorite(movie.id)}
                  className="absolute right-4 top-4 rounded-full border border-white/10 bg-background/80 px-3 py-1 text-xs font-semibold text-danger opacity-0 shadow-lg backdrop-blur transition hover:bg-danger/20 group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
