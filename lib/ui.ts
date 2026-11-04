// Tailwind class groups used in several places, kept here so they stay consistent.

/** Side padding for page content. */
export const gutter = 'px-4 md:px-6';

/** Small uppercase label above headings ("NOW SHOWING"). */
export const eyebrow = 'block text-[15px] md:text-[17px] font-bold uppercase tracking-[0.22em] text-[#efe2cf]';

/** Primary pill button. */
export const btn =
  'inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-base font-extrabold text-bg transition-transform hover:-translate-y-px';

/** Outlined pill button. */
export const btnGhost =
  'inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-extrabold text-cream transition-transform hover:-translate-y-px';

/** Genre chip; pass `active` to highlight it. */
export const chip = (active = false) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
    active
      ? 'border-accent bg-accent text-bg'
      : 'border-border text-muted hover:border-muted hover:text-cream'
  }`;

/** Option inside a segmented control (Films | Series). */
export const segment = (active = false) =>
  `whitespace-nowrap rounded-full px-5 py-2.5 font-bold transition-colors ${
    active ? 'bg-cream text-bg' : 'text-muted hover:text-cream'
  }`;

/** Rating badge. */
export const pill = 'inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-bold text-bg';
