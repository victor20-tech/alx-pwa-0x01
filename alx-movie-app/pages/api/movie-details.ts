import { getMockMovieById } from "@/lib/mockMovies";
import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const normalizeGenres = (raw: unknown): string[] | undefined => {
  if (raw == null) return undefined;
  if (Array.isArray(raw)) {
    const list = raw.filter((g): g is string => typeof g === "string");
    return list.length ? list : undefined;
  }
  if (typeof raw === "object") {
    const list = Object.values(raw as Record<string, unknown>).filter(
      (g): g is string => typeof g === "string"
    );
    return list.length ? list : undefined;
  }
  return undefined;
};

const normalizeMovie = (movie: MoviesProps): MoviesProps => {
  const genres = normalizeGenres(movie.genres as unknown);
  return { ...movie, ...(genres ? { genres } : {}) };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", ["GET"]);
    return response
      .status(405)
      .end(`Method ${request.method} Not Allowed`);
  }

  const { id } = request.query;

  if (!id || typeof id !== "string") {
    return response.status(400).json({ error: "Movie ID is required" });
  }

  try {
    if (!process.env.MOVIE_API_KEY) {
      throw new Error("Movie API key is missing");
    }

    const resp = await fetch(
      `https://moviesdatabase.p.rapidapi.com/titles/${id}`,
      {
        headers: {
          "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
          "x-rapidapi-key": `${process.env.MOVIE_API_KEY}`,
        },
      }
    );

    if (!resp.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const movieData: unknown = await resp.json();
    const record =
      movieData && typeof movieData === "object"
        ? (movieData as Record<string, unknown>)
        : null;

    const candidate = record?.results ?? record?.title ?? movieData;
    let movie: MoviesProps | null = null;

    if (candidate && typeof candidate === "object" && !Array.isArray(candidate) && "id" in candidate) {
      movie = candidate as MoviesProps;
    } else if (Array.isArray(candidate) && candidate[0] && typeof candidate[0] === "object" && "id" in candidate[0]) {
      movie = candidate[0] as MoviesProps;
    }

    if (!movie) {
      throw new Error("Unexpected movie details response");
    }

    return response.status(200).json({ movie: normalizeMovie(movie) });
  } catch (error) {
    const fallbackMovie = getMockMovieById(id);
    if (fallbackMovie) {
      return response.status(200).json({
        movie: normalizeMovie(fallbackMovie),
        fallback: true,
        message:
          error instanceof Error
            ? `${error.message}. Serving mock data instead.`
            : "Serving mock data.",
      });
    }

    return response.status(500).json({
      error:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
}

