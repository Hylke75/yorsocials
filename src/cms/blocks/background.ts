/**
 * Achtergrond-token uit het CMS → sectieklasse van deze (donkere) site. Lichte tokens worden het
 * zachte sectievlak, donkere de standaardachtergrond. Onbekend/null → standaard.
 */
export function backgroundClass(bg: string | null): string {
  switch (bg) {
    case 'mist':
    case 'mistdof':
    case 'limoenlicht':
    case 'wit':
    case 'steen':
      return 'section--soft';
    default:
      return '';
  }
}
