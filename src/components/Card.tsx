import { Link } from 'react-router';
import { StarIcon } from './Icons';
import type { Title } from '@/lib/types';

type CardProps = { item: Title; priority?: boolean };

export default function Card({ item, priority = false }: CardProps) {
  return (
    <Link to={`/${item.type}/${item.id}`} className="group block min-w-0" title={item.title}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] border border-line bg-surface">
        {item.poster ? (
          // TMDB serves posters already resized from its own image CDN.
          <img
            src={item.poster}
            alt={`${item.title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            width={342}
            height={513}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center p-3 text-center font-display text-sm text-muted">
            {item.title}
          </div>
        )}
        {item.rating && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-bg/85 px-2 py-0.5 text-[13px] font-bold text-accent">
            <StarIcon /> {item.rating}
          </span>
        )}
      </div>
      <h3 className="mt-2.5 truncate text-[15px] font-bold">{item.title}</h3>
      <div className="mt-0.5 truncate text-[13px] text-muted">
        {item.year || '—'} · {item.type === 'tv' ? 'Series' : 'Film'}
      </div>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="min-w-0" aria-hidden="true">
      <div className="skeleton aspect-[2/3] rounded-[10px]" />
      <div className="skeleton mt-3 h-3 rounded-md" />
      <div className="skeleton mt-2 h-3 w-[55%] rounded-md" />
    </div>
  );
}
