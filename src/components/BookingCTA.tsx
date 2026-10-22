import { getGlobalContent, getSiteSettings } from '@/content/repository';
import { ButtonLink } from './Button';

interface BookingCTAProps {
  placement: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'green';
  size?: 'default' | 'small';
  className?: string;
}

/**
 * "Plan een kennismaking". Zolang er geen bevestigde boekingslink is (siteSettings.bookingUrl),
 * verwijst de knop naar het contactformulier in plaats van naar een niet-bestaande agenda.
 */
export function BookingCTA({ placement, label = getGlobalContent().bookingLabel, variant = 'primary', size, className }: BookingCTAProps) {
  const { bookingUrl } = getSiteSettings();
  if (bookingUrl) {
    return (
      <ButtonLink href={bookingUrl} external trackAs="booking" variant={variant} size={size} placement={placement} className={className} icon="calendar">
        {label}
      </ButtonLink>
    );
  }
  return (
    <ButtonLink href="/contact#formulier" variant={variant} size={size} placement={placement} className={className}>
      {label}
    </ButtonLink>
  );
}
