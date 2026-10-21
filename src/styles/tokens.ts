/** Tokens voor gebruik in TypeScript (bijv. OG-afbeeldingen). Houd gelijk aan tokens.css. */
export const tokens = {
  colors: {
    bg: '#090D0D',
    panel: '#111918',
    panelAlt: '#18211E',
    brandSage: '#83A987',
    brandSageLight: '#A1CBA1',
    accent: '#04C8F2',
    text: '#F5F5F0',
    textMuted: '#A6B2AE',
    border: '#2B3934',
  },
  breakpoints: { mobileMax: 740, tabletMax: 1199, desktopMin: 1200 },
  maxWidth: 1280,
} as const;
