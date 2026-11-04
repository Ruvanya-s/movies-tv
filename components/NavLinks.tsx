'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-[18px] md:gap-[30px]">
      {LINKS.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-base font-medium transition-colors md:text-xl ${
              active ? 'text-cream' : 'text-muted hover:text-cream'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
