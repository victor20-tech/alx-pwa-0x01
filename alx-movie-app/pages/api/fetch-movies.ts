import { getMockMovies } from "@/lib/mockMovies";
import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const buildMoviesUrl = (year: number, page: number, genre?: string) => {
  const url = new URL("https://moviesdatabase.p.rapidapi.com/titles");
  url.searchParams.set("year", `${year}`);
  url.searchParams.set("sort", "year.decr");
  url.searchParams.set("limit", "12");
  url.searchParams.set("page", `${page}`);
  if (genre) {
    url.searchParams.set("genre", genre);
  }
  return url.toString();
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", ["POST"]);
    return response
      .status(405)
      .end(`Method ${request.method} Not Allowed in here`);
  }

  const { year, page, genre } = request.body ?? {};

  const currentYear = new Date().getFullYear();
  const normalizedYear =
    typeof year === "number" && !Number.isNaN(year) ? year : currentYear;
  const normalizedPage =
    typeof page === "number" && page > 0 ? page : 1;
  const normalizedGenre =
    typeof genre === "string" && genre.trim() ? genre.trim() : undefined;

  try {
    if (!process.env.MOVIE_API_KEY) {
      throw new Error("Movie API key is missing");
    }

    const resp = await fetch(
      buildMoviesUrl(normalizedYear, normalizedPage, normalizedGenre),
      {
        headers: {
          "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
          "x-rapidapi-key": `${process.env.MOVIE_API_KEY}`,
        },
      }
    );

    if (!resp.ok) {
      throw new Error("Failed to fetch movies");
    }

    const moviesResponse = await resp.json();
    const movies: MoviesProps[] = moviesResponse.results;

    return response.status(200).json({
      movies,
    });
  } catch (error) {
    const movies = getMockMovies({
      year: normalizedYear,
      genre: normalizedGenre,
      page: normalizedPage,
    });

    return response.status(200).json({
      movies,
      fallback: true,
      message:
        error instanceof Error
          ? `${error.message}. Serving mock data instead.`
          : "Serving mock data.",
    });
  }
}