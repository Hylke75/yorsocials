import Link from 'next/link';
import { getSiteChrome } from '@/cms/chrome';
import { CmsImage } from '@/cms/CmsImage';
import { getSiteSettings } from '@/content/repository';
import { BookingCTA } from './BookingCTA';
import { ButtonLink } from './Button';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import styles from './SiteHeader.module.css';

export async function SiteHeader() {
  const chrome = await getSiteChrome();
  const local = getSiteSettings();
  const action = chrome.action;
  const cta = (placement: string, className?: string, size?: 'small') =>
    action ? (
      <ButtonLink href={action.href} placement={placement} className={className} size={size}>
        {action.label}
      </ButtonLink>
    ) : (
      <BookingCTA placement={placement} className={className} size={size} />
    );
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${chrome.name} – naar de homepage`}>
          {chrome.logoUrl ? (
            <span className={styles.cmsLogo}>
              <CmsImage src={chrome.logoUrl} alt={chrome.name} kind="logo" ratio="200 / 44" sizes="200px" priority />
            </span>
          ) : (
            <Logo asset={local.logo.onDark} width={200} priority />
          )}
        </Link>
        <MobileNav links={chrome.mainNav} cta={cta('header-mobiel')} />
        {cta('header', styles.desktopCta, 'small')}
      </div>
    </header>
  );
}
