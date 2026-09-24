'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLink {
  href: string;
  label: string;
  /** Match only the exact path instead of the path and its descendants. */
  exact?: boolean;
}

interface NavLinksProps {
  links: NavLink[];
  /** Accessible name for the navigation landmark. */
  label?: string;
}

function isActive(pathname: string, link: NavLink): boolean {
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export default function NavLinks({ links, label = 'Main' }: NavLinksProps) {
  const pathname = usePathname();

  // With nested links (e.g. /meetings and /meetings/current), only the most specific match is active.
  const activeHref = links
    .filter((link) => isActive(pathname, link))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav aria-label={label} className="print:hidden">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = link.href === activeHref;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`focus-ring inline-block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-primary-soft'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
