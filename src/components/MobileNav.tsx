'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { isActivePath } from '@/lib/routes';
import { Icon } from './Icon';
import styles from './SiteHeader.module.css';

interface MobileNavProps {
  links: { href: string; label: string }[];
  cta: ReactNode;
}

/**
 * Hoofdnavigatie. Desktop: horizontale lijst. Mobiel (≤960px): uitklapmenu met
 * aria-expanded, Escape om te sluiten (focus terug naar de knop) en sluiten bij navigatie.
 */
export function MobileNav({ links, cta }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Menu sluiten bij routewissel (state afleiden tijdens render i.p.v. effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const firstLink = navRef.current?.querySelector('a');
    firstLink?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onResize() {
      if (window.matchMedia('(min-width: 961px)').matches) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <nav ref={navRef} id="hoofdmenu" aria-label="Hoofdnavigatie" className={[styles.nav, open && styles.navOpen].filter(Boolean).join(' ')}>
        <ul className={styles.list}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link} aria-current={isActivePath(pathname, l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCta}>{cta}</div>
      </nav>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="hoofdmenu"
        aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? 'close' : 'menu'} size={24} />
      </button>
    </>
  );
}
