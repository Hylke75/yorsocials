'use client';

import { useConsent } from './ConsentProvider';

export function CookieSettingsButton({ className, children = 'Cookie-instellingen' }: { className?: string; children?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" className={className} onClick={openPreferences}>
      {children}
    </button>
  );
}
