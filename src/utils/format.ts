export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-MA')} MAD`;
}

export const CATEGORY_MAP: Record<number, { label: string; color: string }> = {
  5: { label: 'Économique', color: '#22C55E' },
  6: { label: 'Luxe', color: '#8B5CF6' },
  7: { label: 'SUV', color: '#3B82F6' },
};

export function getCategoryLabel(categoryId: number): string {
  return CATEGORY_MAP[categoryId]?.label ?? 'Autre';
}

export function getCategoryColor(categoryId: number): string {
  return CATEGORY_MAP[categoryId]?.color ?? '#6B7280';
}

export const WHATSAPP_NUMBER = '212663050204';
export const PHONE_MOBILE = '+212 663-050204';
export const PHONE_LANDLINE = '+212 537-700294';
export const AGENCY_ADDRESS = '53 Av. Brahim Roudani, Rabat';
export const AGENCY_EMAIL = 'contact@prestigecars.ma';
export const MAPS_URL =
  'https://www.google.com/maps/place/33.9716,-6.8498';
