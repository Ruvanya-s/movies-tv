'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronIcon } from './Icons';

type RowTrackProps = {
  title: string;
  seeAll?: string;
  /** "poster" for movie cards, "person" for the smaller cast circles. */
  size?: 'poster' | 'person';
  children: ReactNode;
};

const columns = {
  poster: 'auto-cols-[clamp(140px,15vw,200px)]',
  person: 'auto-cols-[clamp(96px,9vw,130px)]',
};

// The only interactive part of a row: the scroll buttons. Cards are rendered on the server.
export default function RowTrack({ title, seeAll, size = 'poster', children }: RowTrackProps) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const iconBtn =
    'grid size-[38px] place-items-center rounded-full border border-border bg-surface transition-colors hover:bg-surface-2';

  return (
    <section className="mb-[52px]">
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="font-display text-lg font-bold md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAll && (
            <Link href={seeAll} className="mr-2 font-semibold text-muted hover:text-cream">
              See all
            </Link>
          )}
          <button type="button" className={iconBtn} onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronIcon dir="left" />
          </button>
          <button type="button" className={iconBtn} onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronIcon />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className={`no-scrollbar grid grid-flow-col ${columns[size]} snap-x snap-proximity gap-[18px] overflow-x-auto pb-2 *:snap-start`}
      >
        {children}
      </div>
    </section>
  );
}
