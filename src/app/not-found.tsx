import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { HeroEditorial } from '@/components/HeroEditorial';
import { media } from '@/content/data/media';

export const metadata: Metadata = {
  title: 'Pagina niet gevonden',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <HeroEditorial
      eyebrow="Deze pagina bestaat niet"
      heading={
        <>
          Oops. <span className="accent-green">404.</span>
        </>
      }
      description="De pagina die je zoekt is niet (meer) beschikbaar. Gelukkig is de weg naar een goed idee nooit ver."
      image={media.hero}
      size="compact"
      actions={
        <>
          <ButtonLink href="/" icon="arrowLeft" iconPosition="start" placement="404-home">
            Terug naar home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" placement="404-contact">
            Neem contact op
          </ButtonLink>
        </>
      }
    />
  );
}
