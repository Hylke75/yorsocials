import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Analytics } from '@/components/Analytics';
import { JsonLd } from '@/components/JsonLd';
import { NewsletterPopup } from '@/components/NewsletterPopup';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { StagingBanner } from '@/components/StagingBanner';
import { getGlobalContent, getSiteSettings } from '@/content/repository';
import { getContentMode, getSiteUrl } from '@/lib/env';
import { organizationJsonLd } from '@/lib/seo';
import './globals.css';

// Fonts lokaal gehost (SIL Open Font License, zie src/fonts/LICENSE-*).
const spaceGrotesk = localFont({
  src: [
    { path: '../fonts/space-grotesk-latin-wght-normal.woff2', weight: '300 700', style: 'normal' },
    { path: '../fonts/space-grotesk-latin-ext-wght-normal.woff2', weight: '300 700', style: 'normal' },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
  fallback: ['Arial Narrow', 'Arial', 'sans-serif'],
});

const dmSans = localFont({
  src: [
    { path: '../fonts/dm-sans-latin-wght-normal.woff2', weight: '100 1000', style: 'normal' },
    { path: '../fonts/dm-sans-latin-ext-wght-normal.woff2', weight: '100 1000', style: 'normal' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const site = getSiteSettings();
const globalContent = getGlobalContent();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: site.defaultSeo.title, template: `%s | ${site.name}` },
  description: site.defaultSeo.description,
  applicationName: site.name,
  robots: getContentMode() === 'production' ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: site.name, locale: 'nl_NL', type: 'website' },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#090D0D',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>
        <a href="#inhoud" className="skip-link">
          Direct naar inhoud
        </a>
        <StagingBanner />
        <SiteHeader />
        <main id="inhoud" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <Analytics />
        {site.newsletter && (
          <NewsletterPopup endpoint={site.newsletter.endpoint} slug={site.newsletter.slug} content={globalContent.newsletter} />
        )}
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
