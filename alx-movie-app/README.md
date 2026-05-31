## CineSeek – Movie Recommendation App

CineSeek is a movie discovery and recommendation experience focused on quick browsing, personal favorites, and delightful UI touches. It showcases dynamic routing, reusable UI components, API integrations, and persistence through `localStorage`.

## Features

- **Dynamic routing** – Detailed movie pages served via `pages/movies/[id].tsx`.
- **Trending & recommendations** – Landing page highlights two curated sections powered by the RapidAPI Movies Database.
- **Favorites with persistence** – Users can heart movies and manage them under `/favorites`, stored locally for instant recall.
- **Filtering & pagination** – Browse movies by year, genre, and page with responsive cards.
- **PWA ready** – Configured with `@ducanh2912/next-pwa`.

## Tech Stack

- Next.js 16 (Pages Router) with React 19
- TypeScript
- Tailwind CSS utility classes
- RapidAPI Movies Database
- LocalStorage for lightweight persistence

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env.local`
   ```
   MOVIE_API_KEY=your_rapidapi_key
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`

## API Routes

| Route | Description |
|-------|-------------|
| `/api/fetch-movies` | Paginates, filters, and returns movie collections |
| `/api/trending-movies` | Returns trending movies for the current year |
| `/api/movie-details` | Returns detailed info for a single movie |

## Deployment

Deploy effortlessly on [Vercel](https://vercel.com). Set `MOVIE_API_KEY` in project settings, trigger a build, and you’re live.

## Commit Workflow

- `feat: integrate movie API for fetching data`
- `feat: implement detailed movie pages with dynamic routing`
- `feat: add functionality to save favorite movies`
- `style: design UI enhancements`
- `fix: resolve rendering issues on dynamic pages`
- `docs: add API setup and usage instructions`

Enjoy exploring CineSeek! Contributions and feature ideas are welcome.
