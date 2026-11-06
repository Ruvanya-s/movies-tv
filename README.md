# Reel — Movies & TV

A movie and TV browsing site built with **React** (on **Vite**), **TypeScript** and **Tailwind CSS**,
using data from the TMDB API. Pages are handled by **React Router**.

## Run it

1. Open a terminal in this folder and install dependencies:

   ```
   npm install
   ```

2. Start the dev server:

   ```
   npm run dev
   ```

   It opens http://localhost:5173. Without a key, the dev server shows made-up sample titles and artwork
   from `src/lib/demo.ts` so you can work on the design. A production build without a key shows
   "Movie data isn't connected yet" instead.

## Connect movie data (TMDB)

1. Create a free account at https://www.themoviedb.org and go to **Settings → API** to get a key.
2. Copy `.env.example` to a new file named `.env.local` in this folder.
3. Paste your key: `VITE_TMDB_API_KEY=your_key_here`
   (the short "API Key" or the long "API Read Access Token" both work).
4. Stop the dev server (Ctrl + C) and run `npm run dev` again — Vite reads `.env.local` only on start.

Because React runs in the browser, this key is included in the site's JavaScript and is visible
to visitors. That's normal for TMDB's free, read-only keys.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with instant reload |
| `npm run typecheck` | Check the TypeScript types |
| `npm run build` | Type-check, then build the site into `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally |

## Pages

| URL | What it is |
| --- | --- |
| `/` | Trending hero carousel with a next arrow, rows for trending, in theaters, popular and top rated |
| `/browse` | Movies / TV Shows, genre and sort dropdowns, page links (`?type=tv&genre=18&sort=newest&page=2`) |
| `/search?q=...` | Search across movies and TV |
| `/movie/:id`, `/tv/:id` | Detail page: backdrop, facts, genres, trailer, cast, recommendations |

## Project layout

```
index.html              the one HTML page; default title, description and fonts
vite.config.ts          Vite setup: React, Tailwind, and the "@/" import shortcut
tsconfig.json           TypeScript settings
vercel.json             makes deep links like /movie/123 work on Vercel
public/                 files served as-is (favicon.svg, robots.txt)
src/
  main.tsx              starts React and the router
  App.tsx               the list of URLs and which page each one shows
  index.css             Tailwind import + design tokens (colors, fonts)
  pages/                Home, Browse, Search, Details, NotFound
  components/           Header, Hero, SearchBox, Card, Row, RowTrack, Grid, Layout, Seo, ...
  hooks/useTmdb.ts      loads TMDB data inside a component
  lib/
    tmdb.ts             TMDB client (with a 10-minute cache)
    demo.ts             sample data for development without a key
    types.ts            TypeScript types for TMDB data
    ui.ts               shared Tailwind class groups (buttons, chips, padding)
```

## Styling (Tailwind)

- Colors and fonts are defined once in `src/index.css` under `@theme`.
  Each becomes a class: `--color-accent` → `bg-accent`, `text-accent`, `border-accent`.
- The coral gradient is `--gradient-coral`, used through the `bg-coral` and `text-coral` classes.
- Class groups used in several places live in `src/lib/ui.ts`.

## SEO

Each page sets its own `<title>`, description and preview image, and detail pages include
schema.org `Movie` / `TVSeries` data. Because this is a single-page React app, the content is
built in the browser: Google can still index it (it runs JavaScript), but some link-preview bots
(WhatsApp, Facebook) only see the default tags from `index.html`.

## Deploying

The `dist/` folder from `npm run build` is a static site.

- **Vercel:** import the repo; `vercel.json` is already set up. Add `VITE_TMDB_API_KEY` in the
  project's Environment Variables, then deploy.
- **Netlify:** build command `npm run build`, publish directory `dist`. Add a file
  `public/_redirects` containing `/*  /index.html  200` so links like `/movie/123` work on refresh.
