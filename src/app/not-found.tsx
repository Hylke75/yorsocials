import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { HeroEditorial } from '@/components/HeroEditorial';
import { getPages } from '@/content/repository';

const content = getPages().notFound;

export const metadata: Metadata = {
  title: content.title,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const { hero } = content;
  return (
    <HeroEditorial
      eyebrow={hero.eyebrow}
      heading={hero.heading}
      description={hero.description}
      image={hero.image}
      size="compact"
      actions={
        <>
          <ButtonLink href="/" icon="arrowLeft" iconPosition="start" placement="404-home">
            {content.homeLabel}
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" placement="404-contact">
            {content.contactLabel}
          </ButtonLink>
        </>
      }
    />
  );
}
