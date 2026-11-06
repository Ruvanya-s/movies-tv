// Tailwind class groups used in several places, kept here so they stay consistent.

/** Side padding for page content. */
export const gutter = 'px-4 md:px-10 lg:px-16';

/** Cancels `gutter` so a scrolling row runs edge to edge but still starts aligned with the page. */
export const bleed = '-mx-4 px-4 scroll-px-4 md:-mx-10 md:px-10 md:scroll-px-10 lg:-mx-16 lg:px-16 lg:scroll-px-16';

/** Small uppercase label above headings ("TRENDING TODAY"). */
export const eyebrow = 'block text-[13px] md:text-sm font-bold uppercase tracking-[0.22em] text-accent';

/** Frosted glass surface with cream text. Add a `bg-cream/…` tint to set how milky it looks. */
export const glass =
  'border border-cream/40 text-cream shadow-[inset_0_1px_0_rgb(244_237_224/0.25),0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150';

/**
 * Round cream glass arrow, used everywhere an arrow appears. Add a size and `grid`.
 * Dimming what's behind the glass keeps the cream chevron readable over bright images.
 */
export const glassArrow = `${glass} shrink-0 cursor-pointer place-items-center rounded-full bg-cream/25 backdrop-brightness-75 transition-all hover:scale-110 hover:bg-cream/40`;

/** Primary pill button. */
export const btn =
  'inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3 text-base font-extrabold text-bg shadow-[0_10px_30px_-8px_rgb(255_107_91/0.7)] transition-all hover:-translate-y-px hover:shadow-[0_14px_36px_-6px_rgb(255_107_91/0.9)]';

/** Outlined pill button. */
export const btnGhost =
  'inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3 text-base font-extrabold text-bg transition-all hover:-translate-y-px hover:bg-white';

/** Genre chip; pass `active` to highlight it. */
export const chip = (active = false) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
    active ? 'border-transparent bg-coral text-bg' : 'border-cream/50 text-cream hover:border-accent hover:text-accent'
  }`;

/** Option inside a segmented control (Movies | TV Shows), which sits on cream. */
export const segment = (active = false) =>
  `whitespace-nowrap rounded-full px-6 py-2 font-bold text-bg transition-colors ${
    active ? 'bg-coral shadow-[0_6px_20px_-6px_rgb(255_107_91/0.8)]' : 'hover:text-[#c9372c]'
  }`;

/** Rating badge. */
export const pill = 'inline-flex items-center gap-1.5 rounded-full bg-coral px-2.5 py-1 font-bold text-bg';
