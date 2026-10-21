import Link from 'next/link';
import { getSiteChrome } from '@/cms/chrome';
import { CmsImage } from '@/cms/CmsImage';
import { getGlobalContent, getServices, getSiteSettings } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { BookingCTA } from './BookingCTA';
import { Logo } from './Logo';
import styles from './SiteFooter.module.css';

export async function SiteFooter() {
  const site = getSiteSettings();
  const chrome = await getSiteChrome();
  const socials = chrome.socials;
  const year = new Date().getFullYear();
  const f = getGlobalContent().footer;
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            {chrome.logoUrl ? (
              <span style={{ display: 'block', width: 180 }}>
                <CmsImage src={chrome.logoUrl} alt={chrome.name} kind="logo" ratio="180 / 40" sizes="180px" />
              </span>
            ) : (
              <Logo asset={site.logo.onDark} width={180} />
            )}
            <p className={styles.tagline}>{chrome.tagline}</p>
            {(chrome.email || chrome.phone) && (
              <ul className={styles.links} style={{ marginTop: 12 }}>
                {chrome.email && (
                  <li>
                    <a href={`mailto:${chrome.email}`}>{chrome.email}</a>
                  </li>
                )}
                {chrome.phone && (
                  <li>
                    <a href={`tel:${chrome.phone.replace(/\s/g, '')}`}>{chrome.phone}</a>
                  </li>
                )}
              </ul>
            )}
          </div>
          <nav aria-label="Footernavigatie">
            <h2 className={styles.heading}>{f.navigationHeading}</h2>
            <ul className={styles.links}>
              {chrome.footerNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {!chrome.footerFromCms && (
          <nav aria-label="Diensten">
            <h2 className={styles.heading}>{f.servicesHeading}</h2>
            <ul className={styles.links}>
              {getServices().map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          )}
          <div>
            <h2 className={styles.heading}>{f.ctaHeading}</h2>
            <BookingCTA placement="footer" size="small" />
            {socials.length > 0 && (
              <ul className={styles.links} style={{ marginTop: 16 }} aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <span className="visually-hidden"> (opent in nieuw venster)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            © {year} {site.legalEntity?.name ?? chrome.name}
            {getContentMode() === 'staging' && f.stagingSuffix}
            {f.credit && (
              <>
                {` · ${f.credit.prefix} `}
                <a href={f.credit.url} className={styles.credit} target="_blank" rel="noopener">
                  {f.credit.name}
                  <span className="visually-hidden"> (opent in nieuw venster)</span>
                </a>
              </>
            )}
          </p>
          <ul className={styles.links} style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }} aria-label="Juridisch">
            {chrome.legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
