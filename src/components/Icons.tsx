import type { SVGProps } from 'react';

type IconProps = { size?: number } & SVGProps<SVGSVGElement>;

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function ClapperIcon({ size = 30, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...rest}>
      <path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M3.6 7.4 17.9 3.6a1 1 0 0 1 1.2.7l.6 2.3L5 10.5 4.3 8.6a1 1 0 0 1-.7-1.2z" />
      <path d="m8.6 5.9 2.5 3.4M13.6 4.6l2.5 3.4" />
    </svg>
  );
}

export function SearchIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function StarIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
    </svg>
  );
}

export function ChevronIcon({ size = 20, dir = 'right', ...rest }: IconProps & { dir?: 'left' | 'right' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      className={dir === 'left' ? 'rotate-180' : undefined}
      aria-hidden="true"
      {...rest}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
