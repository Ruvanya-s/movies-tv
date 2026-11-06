// Sample data for designing the site before a TMDB key is added (development only).
// Every title, person and image here is made up; artwork is drawn as SVG below.
// Delete this file, and the `isDemo` lines in tmdb.ts, once you no longer need it.

import { NotFoundError, type Params } from './tmdb';
import type { MediaType, TmdbDetail, TmdbList, TmdbListItem } from './types';

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
];

type Seed = [title: string, type: MediaType, date: string, rating: number, genres: number[], overview: string];

const SEEDS: Seed[] = [
  ['Salt Meridian', 'movie', '2026-03-14', 8.1, [12, 18], 'A disgraced navigator is hired to chart the one sea route no crew has survived, and learns why the old maps were burned.'],
  ['The Hollow Tide', 'tv', '2025-09-02', 8.6, [9648, 18], 'When the water leaves a fishing town overnight, what it uncovers on the seabed turns every neighbor into a suspect.'],
  ['Ember Protocol', 'movie', '2026-06-20', 7.8, [28, 878], 'An off-world firefighter has six hours to stop a burning colony ship from falling onto the city that abandoned it.'],
  ['Nine Winters', 'tv', '2024-11-18', 8.9, [18], 'Nine years, nine winters, and one family holding a remote mountain inn together through everything they refuse to say.'],
  ['Glass Orchard', 'movie', '2025-04-11', 7.4, [10749, 18], 'Two rival botanists inherit a greenhouse together and must keep it alive for one year to sell it.'],
  ['Kestrel Station', 'tv', '2026-01-09', 8.3, [878, 53], 'The crew of a failing orbital outpost start receiving distress calls in their own voices.'],
  ['The Lantern Keepers', 'movie', '2024-10-25', 7.9, [12], 'Three siblings cross a blacked-out country to relight the signal towers their mother once tended.'],
  ['Velvet Static', 'tv', '2025-02-27', 8.0, [53, 9648], 'A late-night radio host realizes an anonymous caller is describing crimes before they happen.'],
  ['Northbound Ash', 'movie', '2026-08-01', 7.2, [28, 53], 'A long-haul driver with a sealed cargo is pursued up an empty highway through a season of wildfires.'],
  ['The Midnight Cartographer', 'movie', '2023-12-08', 8.4, [12, 9648], 'A mapmaker discovers that streets she draws at night have started to appear in the city by morning.'],
  ['Sundown Republic', 'tv', '2026-05-16', 7.7, [18, 28], 'A tiny desert nation declares independence as a joke, then finds itself with a treasury, a border and enemies.'],
  ['A Quiet Engine', 'movie', '2025-07-18', 8.2, [878, 18], 'An aging mechanic is the only person who can repair the machine keeping her island warm, and she has no apprentice.'],
  ['Copper Coast', 'tv', '2023-08-21', 7.5, [35, 18], 'Three failed chefs open a seaside diner in the worst possible town, at the worst possible time.'],
  ['The Long Arcade', 'movie', '2024-05-03', 7.1, [35], 'A family arcade has one summer to pay its debts, and only the high-score champion from 1989 can save it.'],
  ['Saffron Hour', 'movie', '2026-02-13', 7.6, [10749], 'Every evening at the same hour, two strangers on opposite trains share one minute at a crossing.'],
  ['Wolves of Aldermere', 'tv', '2024-03-29', 8.7, [12, 28], 'Rival houses fight over a frozen valley as something older than either bloodline begins to wake beneath it.'],
  ['Blue Hour Club', 'tv', '2025-10-10', 7.9, [35, 10749], 'The regulars of a jazz bar scheme to keep it open, one terrible idea at a time.'],
  ['Tidewater', 'movie', '2025-11-21', 8.0, [53, 18], 'A coastal detective returns home to reopen the one case she closed too quickly.'],
  ['Halcyon Drift', 'movie', '2026-09-05', 7.3, [878, 12], 'A salvage team boards a luxury liner lost in deep space and finds the party still going.'],
  ['The Paper Season', 'tv', '2026-04-04', 8.1, [18, 9648], 'A small-town newspaper\'s last reporter follows one obituary into a decades-old cover-up.'],
  ['Crimson Parallel', 'movie', '2024-08-16', 7.7, [28, 53], 'An ex-courier wakes with a stranger\'s memories and a day to deliver what he stole.'],
  ['Far Harbor Lights', 'tv', '2023-05-12', 8.2, [10749, 18], 'Letters found in a lighthouse wall connect three generations of people who never quite met.'],
  ['Atlas of Small Fires', 'movie', '2025-01-24', 7.8, [18], 'A volunteer fire crew in a dry valley faces the summer that will decide whether the valley survives.'],
  ['Moonrise Protocol', 'tv', '2026-07-07', 7.6, [878, 28], 'A lunar mining strike turns into a revolution when Earth stops answering.'],
];

// --- Artwork ---------------------------------------------------------------

const PALETTES = [
  ['#1b1464', '#ff6b5b', '#ffd29d', '#14213d'],
  ['#0b3c5d', '#38a3a5', '#f4ede0', '#0a2233'],
  ['#2b0f3a', '#c2397f', '#ffb347', '#1a0b26'],
  ['#04212e', '#0f7173', '#f2c14e', '#021318'],
  ['#3a1c0f', '#e07a2f', '#ffe2a8', '#1f0e07'],
  ['#0f1c4d', '#4b6fd6', '#dfe9ff', '#0a1130'],
  ['#3d0b1b', '#b3123c', '#ff9d76', '#1c050d'],
  ['#13302a', '#5a9e6f', '#f1e8b8', '#0a1c18'],
];

/** Small repeatable random generator, so artwork looks the same on every load. */
function random(seed: number) {
  let s = seed * 2654435761 + 1;
  return () => {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >>> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return s / 4294967296;
  };
}

type Paint = { w: number; h: number; glow: string; low: string; ground: string; r: () => number };

function ridge({ w, h, r }: Paint, top: number, fill: string, opacity: number) {
  const pts = [`0,${h}`];
  const steps = 7;
  for (let i = 0; i <= steps; i++) pts.push(`${(w * i) / steps},${h * (top + r() * 0.13)}`);
  pts.push(`${w},${h}`);
  return `<polygon points="${pts.join(' ')}" fill="${fill}" opacity="${opacity}"/>`;
}

const SCENES: ((p: Paint) => string)[] = [
  // Sun over mountains
  (p) =>
    `<circle cx="${p.w * 0.66}" cy="${p.h * 0.44}" r="${Math.min(p.w, p.h) * 0.2}" fill="url(#g)"/>` +
    ridge(p, 0.5, p.ground, 0.45) + ridge(p, 0.62, p.ground, 0.75) + ridge(p, 0.76, p.ground, 1),
  // Skyline under a moon
  (p) => {
    let city = `<circle cx="${p.w * 0.72}" cy="${p.h * 0.28}" r="${Math.min(p.w, p.h) * 0.13}" fill="url(#g)"/>`;
    for (const [base, opacity] of [[0.5, 0.5], [0.66, 1]]) {
      for (let x = -10; x < p.w; ) {
        const bw = p.w * (0.05 + p.r() * 0.08);
        const y = p.h * (base + p.r() * 0.18);
        city += `<rect x="${x}" y="${y}" width="${bw}" height="${p.h - y}" fill="${p.ground}" opacity="${opacity}"/>`;
        x += bw + 2;
      }
    }
    return city;
  },
  // Low sun on water
  (p) => {
    const horizon = p.h * 0.58;
    let sea = `<circle cx="${p.w * 0.62}" cy="${horizon}" r="${Math.min(p.w, p.h) * 0.24}" fill="url(#g)"/>`;
    sea += `<rect y="${horizon}" width="${p.w}" height="${p.h - horizon}" fill="${p.ground}"/>`;
    for (let i = 0; i < 12; i++) {
      const y = horizon + (p.h - horizon) * (i / 12) + 6;
      const bw = Math.min(p.w, p.h) * (0.42 - i * 0.012) * (0.6 + p.r() * 0.5);
      sea += `<rect x="${p.w * 0.62 - bw / 2}" y="${y}" width="${bw}" height="${3 + i * 0.5}" rx="2" fill="${p.glow}" opacity="${0.6 - i * 0.04}"/>`;
    }
    return sea;
  },
  // Ringed planet in a starfield
  (p) => {
    const m = Math.min(p.w, p.h);
    const [cx, cy] = [p.w * 0.64, p.h * 0.42];
    let space = `<rect width="${p.w}" height="${p.h}" fill="${p.ground}" opacity="0.6"/>`;
    for (let i = 0; i < 70; i++) {
      space += `<circle cx="${p.r() * p.w}" cy="${p.r() * p.h}" r="${0.6 + p.r() * 1.4}" fill="#fff" opacity="${0.3 + p.r() * 0.6}"/>`;
    }
    space += `<circle cx="${cx}" cy="${cy}" r="${m * 0.24}" fill="url(#g)"/>`;
    space += `<ellipse cx="${cx}" cy="${cy}" rx="${m * 0.42}" ry="${m * 0.07}" transform="rotate(-18 ${cx} ${cy})" fill="none" stroke="${p.glow}" stroke-width="${m * 0.014}" opacity="0.85"/>`;
    return space;
  },
  // A lone figure against a huge disc
  (p) => {
    const m = Math.min(p.w, p.h);
    const cx = p.w * 0.64;
    const ground = p.h * 0.74;
    return (
      `<circle cx="${cx}" cy="${p.h * 0.46}" r="${m * 0.33}" fill="url(#g)"/>` +
      `<ellipse cx="${cx}" cy="${p.h * 1.04}" rx="${p.w * 0.9}" ry="${p.h - ground + p.h * 0.04}" fill="${p.ground}"/>` +
      // Long coat: narrow shoulders flaring to the hem.
      `<path d="M${cx - m * 0.03} ${ground - m * 0.17} Q${cx} ${ground - m * 0.19} ${cx + m * 0.03} ${ground - m * 0.17} L${cx + m * 0.055} ${ground + m * 0.03} L${cx - m * 0.05} ${ground + m * 0.03} Z" fill="${p.ground}"/>` +
      `<circle cx="${cx}" cy="${ground - m * 0.205}" r="${m * 0.024}" fill="${p.ground}"/>`
    );
  },
];

function posterText(title: string, w: number, h: number) {
  const lines: string[] = [];
  for (const word of title.toUpperCase().split(' ')) {
    const last = lines[lines.length - 1];
    if (last && last.length + word.length < 12) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(58, (w * 0.84) / (longest * 0.72));
  const start = h * 0.93 - (lines.length - 1) * size * 1.05;
  const text = lines
    .map((l, i) => `<tspan x="${w / 2}" y="${start + i * size * 1.05}">${l}</tspan>`)
    .join('');
  return `<text text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-weight="900" font-size="${size}" fill="#f4ede0">${text}</text>`;
}

function artwork(index: number, title: string, w: number, h: number, withTitle: boolean) {
  const [top, low, glow, ground] = PALETTES[index % PALETTES.length];
  const scene = SCENES[(index * 3 + 1) % SCENES.length];
  const body = scene({ w, h, glow, low, ground, r: random(index + 1) });
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>` +
    `<linearGradient id="s" x2="0" y2="1"><stop stop-color="${top}"/><stop offset=".75" stop-color="${low}"/></linearGradient>` +
    `<radialGradient id="g"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="${glow}"/><stop offset="1" stop-color="${low}"/></radialGradient>` +
    `<linearGradient id="f" x2="0" y2="1"><stop offset=".55" stop-opacity="0"/><stop offset="1" stop-opacity=".75"/></linearGradient>` +
    `</defs><rect width="${w}" height="${h}" fill="url(#s)"/>${body}` +
    (withTitle ? `<rect width="${w}" height="${h}" fill="url(#f)"/>${posterText(title, w, h)}` : '') +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// --- Responses -------------------------------------------------------------

const ITEMS = SEEDS.map(([title, type, date, rating, genres, overview], i) => ({
  id: 1000 + i,
  media_type: type,
  title: type === 'movie' ? title : undefined,
  name: type === 'tv' ? title : undefined,
  release_date: type === 'movie' ? date : undefined,
  first_air_date: type === 'tv' ? date : undefined,
  poster_path: artwork(i, title, 400, 600, true),
  backdrop_path: artwork(i, title, 1280, 720, false),
  vote_average: rating,
  vote_count: 500 + i * 37,
  overview,
  genre_ids: genres,
  date,
}));
type Item = (typeof ITEMS)[number];

const hash = (s: string) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);

/** A stable order per endpoint, so each row looks different but doesn't change between visits. */
function shuffled(items: Item[], key: string) {
  const r = random(hash(key));
  return items.map((item) => [r(), item] as const).sort((a, b) => a[0] - b[0]).map(([, item]) => item);
}

const list = (results: TmdbListItem[]): TmdbList => ({ page: 1, total_pages: 1, results });

const CAST = ['Mara Okafor', 'Teo Lindqvist', 'Priya Halloran', 'Jonah Vale', 'Ines Marchetti', 'Sam Adeyemi', 'Lena Whitlock', 'Rafe Costa'];
const ROLES = ['The Navigator', 'Captain Reyes', 'Dr. Ansel', 'The Stranger', 'Ada', 'Wren', 'Inspector Holt', 'Old Tam'];

function detail(item: Item): TmdbDetail {
  const tv = item.media_type === 'tv';
  return {
    ...item,
    tagline: 'Sample title for previewing the design',
    genres: GENRES.filter((g) => item.genre_ids.includes(g.id)),
    runtime: tv ? undefined : 95 + (item.id % 50),
    number_of_seasons: tv ? 1 + (item.id % 4) : undefined,
    status: tv ? 'Returning Series' : 'Released',
    original_language: 'en',
    created_by: tv ? [{ name: CAST[item.id % CAST.length] }] : [],
    credits: {
      cast: CAST.map((name, i) => ({ credit_id: String(i), name, character: ROLES[i], profile_path: null })),
      crew: tv ? [] : [{ job: 'Director', name: CAST[(item.id + 3) % CAST.length] }],
    },
    videos: { results: [] },
  };
}

/** Answers the same requests as the TMDB API, with the same response shapes. */
export function demoResponse(path: string, params: Params = {}): unknown {
  const byType = (type: string) => ITEMS.filter((i) => i.media_type === type);

  const match = path.match(/^\/(movie|tv)\/(\d+)(\/recommendations|\/videos)?$/);
  if (match) {
    const [, type, id, sub] = match;
    const item = ITEMS.find((i) => i.id === Number(id) && i.media_type === type);
    if (!item) throw new NotFoundError('Not found');
    if (sub === '/videos') return { results: [] };
    if (sub) return list(shuffled(byType(type).filter((i) => i !== item), path));
    return detail(item);
  }

  if (path.startsWith('/genre/')) return { genres: GENRES };

  if (path.startsWith('/search/')) {
    const q = String(params.query ?? '').toLowerCase();
    return list(ITEMS.filter((i) => `${i.title ?? ''}${i.name ?? ''}`.toLowerCase().includes(q)));
  }

  if (path.startsWith('/discover/')) {
    const genre = Number(params.with_genres) || null;
    const items = byType(path.split('/')[2]).filter((i) => !genre || i.genre_ids.includes(genre));
    const sort = String(params.sort_by);
    if (sort.startsWith('vote_average')) items.sort((a, b) => b.vote_average - a.vote_average);
    else if (sort.includes('date')) items.sort((a, b) => b.date.localeCompare(a.date));
    return list(sort.startsWith('popularity') ? shuffled(items, path) : items);
  }

  if (path.startsWith('/trending/')) return list(shuffled(ITEMS, path));

  const type = path.split('/')[1];
  if (type === 'movie' || type === 'tv') return list(shuffled(byType(type), path));
  return {}; // e.g. /configuration
}
