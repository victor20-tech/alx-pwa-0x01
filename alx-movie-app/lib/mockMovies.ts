import mockMovies from "@/data/mockMovies.json";
import { MoviesProps } from "@/interfaces";

const MOVIES_PER_PAGE = 12;
const allMockMovies = mockMovies as MoviesProps[];

const normalizeGenre = (genre?: string) =>
  genre ? genre.trim().toLowerCase() : "";

const normalizeYear = (year?: number | null) =>
  typeof year === "number" && !Number.isNaN(year) ? year : undefined;

export const getMockMovies = ({
  year,
  genre,
  page = 1,
}: {
  year?: number | null;
  genre?: string;
  page?: number;
}): MoviesProps[] => {
  const normalizedYear = normalizeYear(year);
  const normalizedGenre = normalizeGenre(genre);
  const validPage = page && page > 0 ? page : 1;

  let filtered = [...allMockMovies];

  if (normalizedYear) {
    filtered = filtered.filter(
      (movie) => Number(movie.releaseYear?.year) === normalizedYear
    );
  }

  if (normalizedGenre) {
    filtered = filtered.filter((movie) =>
      movie.genres?.some(
        (movieGenre) => movieGenre.toLowerCase() === normalizedGenre
      )
    );
  }

  const startIndex = (validPage - 1) * MOVIES_PER_PAGE;
  return filtered.slice(startIndex, startIndex + MOVIES_PER_PAGE);
};

export const getMockMovieById = (id: string): MoviesProps | undefined =>
  allMockMovies.find((movie) => movie.id === id);

export const getTrendingMockMovies = (): MoviesProps[] =>
  [...allMockMovies].sort((a, b) => {
    const yearA = Number(a.releaseYear?.year) || 0;
    const yearB = Number(b.releaseYear?.year) || 0;
    return yearB - yearA;
  });


