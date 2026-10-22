import { Suspense } from 'react';
import { AccentText } from '@/components/AccentText';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { getGlobalContent } from '@/content/repository';
import { parseFieldDefs } from '@/lib/formBuilder';
import { text } from './fields';
import { FormBuilderForm } from './FormBuilderForm';
import type { BlockProps } from './props';
import { BlockSection } from './Section';

/** `formulier_bouwer`: formulier met door de redacteur gekozen velden; inzendingen gaan naar de CMS-leads. */
export function FormulierBouwerBlock({ block, index, page }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const g = getGlobalContent().contactForm;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      <div className="split split--top">
        <div>
          {text(c, 'eyebrow') && <p className="eyebrow">{text(c, 'eyebrow')}</p>}
          {text(c, 'titel') && (
            <h2 id={id} className="h2">
              <AccentText text={text(c, 'titel')} />
            </h2>
          )}
          {text(c, 'intro') && <p className="lead">{text(c, 'intro')}</p>}
        </div>
        <Suspense fallback={<LoadingIndicator />}>
          <FormBuilderForm
            fields={parseFieldDefs(c.velden)}
            submitLabel={text(c, 'knoptekst') || g.submitLabel}
            confirmation={text(c, 'bevestigingstekst') || g.successText}
            footnote={text(c, 'voetnoot')}
            page={page.slug}
          />
        </Suspense>
      </div>
    </BlockSection>
  );
}
