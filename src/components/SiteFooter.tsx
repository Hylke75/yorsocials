import Link from 'next/link';
import { getServices, getSiteSettings } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { NAV_LINKS } from '@/lib/routes';
import { BookingCTA } from './BookingCTA';
import { CookieSettingsButton } from './consent/CookieSettingsButton';
import { Logo } from './Logo';
import styles from './SiteFooter.module.css';

const SOCIAL_LABELS = { instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube' } as const;

export function SiteFooter() {
  const site = getSiteSettings();
  const socials = site.socialLinks.filter((s) => s.verified);
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <Logo asset={site.logo.onDark} width={180} />
            <p className={styles.tagline}>{site.tagline}</p>
            {(site.email || site.phone) && (
              <ul className={styles.links} style={{ marginTop: 12 }}>
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                )}
                {site.phone && (
                  <li>
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                  </li>
                )}
              </ul>
            )}
          </div>
          <nav aria-label="Footernavigatie">
            <h2 className={styles.heading}>Navigatie</h2>
            <ul className={styles.links}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Diensten">
            <h2 className={styles.heading}>Services</h2>
            <ul className={styles.links}>
              {getServices().map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.heading}>Samen iets maken?</h2>
            <BookingCTA placement="footer" size="small" />
            {socials.length > 0 && (
              <ul className={styles.links} style={{ marginTop: 16 }} aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.platform}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_LABELS[s.platform]}
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
            © {year} {site.legalEntity?.name ?? site.name}
            {getContentMode() === 'staging' && ' — stagingomgeving'}
          </p>
          <ul className={styles.links} style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }} aria-label="Juridisch">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
            <li>
              <CookieSettingsButton className={styles.linkButton} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
