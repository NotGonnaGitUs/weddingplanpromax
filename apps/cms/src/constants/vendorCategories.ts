/**
 * Core marketplace categories for V1 package generation.
 * Labels match the web demo display names where categories overlap.
 * Mapped to nearest Schema.org types where applicable.
 */
export const VENDOR_CATEGORIES = [
  {
    value: 'travel',
    label: 'Travel',
    schemaOrgType: 'TravelAgency',
    description: 'Guest group travel and airport-to-venue transfers',
  },
  {
    value: 'venue',
    label: 'Venue',
    schemaOrgType: 'EventVenue',
    description: 'Ceremony and/or reception location',
  },
  {
    value: 'caterer',
    label: 'Caterer',
    schemaOrgType: 'FoodEstablishment',
    description: 'Food and beverage service',
  },
  {
    value: 'photographer',
    label: 'Photographer',
    schemaOrgType: 'ProfessionalService',
    description: 'Wedding photography',
  },
  {
    value: 'florist',
    label: 'Florist',
    schemaOrgType: 'Florist',
    description: 'Floral design and arrangements',
  },
  {
    value: 'music',
    label: 'Music',
    schemaOrgType: 'EntertainmentBusiness',
    description: 'DJ, band, or live entertainment',
  },
  {
    value: 'videographer',
    label: 'Videographer',
    schemaOrgType: 'ProfessionalService',
    description: 'Wedding videography and films',
  },
  {
    value: 'bakery',
    label: 'Bakery',
    schemaOrgType: 'Bakery',
    description: 'Wedding cake and desserts',
  },
  {
    value: 'officiant',
    label: 'Officiant',
    schemaOrgType: 'ProfessionalService',
    description: 'Ceremony officiant',
  },
] as const

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number]['value']

export const vendorCategoryOptions = VENDOR_CATEGORIES.map(({ value, label }) => ({
  value,
  label,
}))
