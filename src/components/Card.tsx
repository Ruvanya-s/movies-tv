import { Link } from 'react-router';
import type { Title } from '@/lib/types';

type CardProps = { item: Title; priority?: boolean };

export default function Card({ item, priority = false }: CardProps) {
  return (
    <Link to={`/${item.type}/${item.id}`} className="group block min-w-0 text-center" title={item.title}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_0_2px_var(--color-accent)]">
        {item.poster ? (
          // TMDB serves posters already resized from its own image CDN.
          <img
            src={item.poster}
            alt={`${item.title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            width={342}
            height={513}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center p-3 text-center font-display text-sm text-muted">
            {item.title}
          </div>
        )}
        <span className="absolute inset-0 bg-linear-to-t from-accent/55 to-transparent to-55% opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm leading-snug font-semibold transition-colors group-hover:text-accent md:text-[15px]">
        {item.title}
      </h3>
      <div className="mt-1 truncate text-[13px] text-muted">{item.year || '—'}</div>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="min-w-0" aria-hidden="true">
      <div className="skeleton aspect-[2/3] rounded-2xl" />
      <div className="skeleton mx-auto mt-3 h-3 w-[80%] rounded-md" />
      <div className="skeleton mx-auto mt-2 h-3 w-[50%] rounded-md" />
    </div>
  );
}
