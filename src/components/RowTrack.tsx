import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronIcon } from './Icons';
import { bleed, glassArrow } from '@/lib/ui';

type RowTrackProps = {
  title: string;
  seeAll?: string;
  children: ReactNode;
};

// Arrows appear on hover or keyboard focus; on touch screens rows are swiped instead.
const arrow = `${glassArrow} absolute top-[38%] z-10 hidden size-14 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 md:grid`;

/** A titled, horizontally scrolling row that runs off the right edge of the page. */
export default function RowTrack({ title, seeAll, children }: RowTrackProps) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="group/row mb-12 md:mb-14">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-display text-xl font-bold md:text-[26px]">
          <span className="h-6 w-1.5 rounded-full bg-coral md:h-7" aria-hidden="true" />
          {title}
        </h2>
        {seeAll && (
          <Link
            to={seeAll}
            aria-label={`View all: ${title}`}
            className="group/all flex shrink-0 items-center gap-2.5 text-sm font-semibold text-muted transition-colors hover:text-cream"
          >
            View all
            <span className={`${glassArrow} grid size-9 group-hover/all:scale-110 group-hover/all:bg-cream/40`}>
              <ChevronIcon size={18} />
            </span>
          </Link>
        )}
      </div>
      <div className="relative">
        <button type="button" className={`${arrow} -left-3`} onClick={() => scroll(-1)} aria-label="Scroll left">
          <ChevronIcon dir="left" size={26} />
        </button>
        <div
          ref={track}
          className={`no-scrollbar grid grid-flow-col auto-cols-[clamp(140px,14.5vw,220px)] ${bleed} snap-x snap-proximity gap-4 overflow-x-auto pt-2 pb-2 *:snap-start md:gap-5`}
        >
          {children}
        </div>
        <button type="button" className={`${arrow} -right-3`} onClick={() => scroll(1)} aria-label="Scroll right">
          <ChevronIcon size={26} />
        </button>
      </div>
    </section>
  );
}
