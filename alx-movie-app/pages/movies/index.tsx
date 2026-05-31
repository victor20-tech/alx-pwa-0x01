import Button from "@/components/commons/Button";
import Loading from "@/components/commons/Loading";
import MovieCard from "@/components/commons/MovieCard";
import { MoviesProps } from "@/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const genreOptions = ["All", "Animation", "Comedy", "Fantasy", "Drama", "Action"];
const years = [2024, 2023, 2022, 2021, 2020, 2019];

const Movies: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [year, setYear] = useState<number | null>(null);
  const [genre, setGenre] = useState<string>("All");
  const [movies, setMovies] = useState<MoviesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetch-movies", {
        method: "POST",
        body: JSON.stringify({
          page,
          year,
          genre: genre === "All" ? "" : genre,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      const results: MoviesProps[] = data.movies || [];
      setMovies(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, year, genre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm.trim()) return movies;
    return movies.filter((movie) =>
      movie?.titleText?.text
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
  }, [movies, searchTerm]);

  const fieldClass =
    "w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20 md:text-base";

  return (
    <div className="min-h-[60vh] px-4 py-12 text-foreground md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-3xl p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search titles..."
              value={searchTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value)
              }
              className={`${fieldClass} md:max-w-md`}
            />

            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setYear(event.target.value ? Number(event.target.value) : null)
              }
              value={year ?? ""}
              className={`${fieldClass} md:w-48`}
            >
              <option value="">All years</option>
              {years.map((yearOption: number) => (
                <option value={yearOption} key={yearOption} className="bg-surface">
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Catalog
          </p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-5xl">
              {year ? `${year} ` : ""}
              {genre === "All" ? "All genres" : genre}
              <span className="text-gradient"> movies</span>
            </h1>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {genreOptions.map((genreOption: string) => (
              <Button
                title={genreOption}
                key={genreOption}
                variant="ghost"
                isActive={genre === genreOption}
                action={() => {
                  setGenre(genreOption);
                  setPage(1);
                }}
              />
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredMovies?.map((movie: MoviesProps) => (
              <div
                key={movie.id}
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
            ))}
          </div>

          {filteredMovies.length === 0 && !loading && !error && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted">No movies match those filters.</p>
              <p className="mt-2 text-sm text-muted">
                Try another year or genre, or clear your search.
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-end gap-3">
            <Button
              title="Previous"
              variant="outline"
              action={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
            />
            <Button title="Next" variant="primary" action={() => setPage((prev) => prev + 1)} />
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Movies;
