import { getTrendingMockMovies } from "@/lib/mockMovies";
import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

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

  try {
    if (!process.env.MOVIE_API_KEY) {
      throw new Error("Movie API key is missing");
    }

    const currentYear = new Date().getFullYear();
    const resp = await fetch(
      `https://moviesdatabase.p.rapidapi.com/titles?year=${currentYear}&sort=year.decr&limit=12&page=1`,
      {
        headers: {
          "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
          "x-rapidapi-key": `${process.env.MOVIE_API_KEY}`,
        },
      }
    );

    if (!resp.ok) {
      throw new Error("Failed to fetch trending movies");
    }

    const data = await resp.json();
    const movies: MoviesProps[] = data.results || [];

    return response.status(200).json({ movies });
  } catch (error) {
    const trendingMock = getTrendingMockMovies().slice(0, 12);
    return response.status(200).json({
      movies: trendingMock,
      fallback: true,
      message:
        error instanceof Error
          ? `${error.message}. Serving mock data instead.`
          : "Serving mock data.",
    });
  }
}

