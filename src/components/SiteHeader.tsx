import Link from 'next/link';
import { getSiteSettings } from '@/content/repository';
import { NAV_LINKS } from '@/lib/routes';
import { BookingCTA } from './BookingCTA';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const site = getSiteSettings();
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name} – naar de homepage`}>
          <Logo asset={site.logo.onDark} width={200} priority />
        </Link>
        <MobileNav links={[...NAV_LINKS]} cta={<BookingCTA placement="header-mobiel" />} />
        <BookingCTA placement="header" size="small" className={styles.desktopCta} />
      </div>
    </header>
  );
}
