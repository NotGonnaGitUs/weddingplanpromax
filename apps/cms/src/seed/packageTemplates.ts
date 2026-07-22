/**
 * Destination package seeds — source of truth for apps/web intake chips / matching.
 * Kept in sync with the original hardcoded COUPLES demo data.
 */
export type PackageTemplateSeed = {
  key: string
  names: string
  location: string
  date: string
  guests: number
  budgetTotal: number
  vibe: 'beach' | 'vineyard' | 'island' | 'jungle' | 'coastal' | 'wine'
  isDefaultForVibe: boolean
  palette: { bg: string; accent: string; glow: string }
  inviteCopy: string
  notes?: string
  locationKeywords: { keyword: string }[]
  vendors: {
    category: string
    name: string
    price: number
    note?: string
    flag?: string
  }[]
}

export const packageTemplateSeeds: PackageTemplateSeed[] = [
  {
    key: 'priya-arjun',
    names: 'Priya & Arjun',
    location: 'Goa, India',
    date: 'February 14, 2027',
    guests: 62,
    budgetTotal: 42000,
    vibe: 'beach',
    isDefaultForVibe: true,
    palette: { bg: '#2a1f3d', accent: '#F2A93B', glow: '#E0447C' },
    inviteCopy:
      'Mehndi, music, and the Arabian Sea — three days of celebration on the sands of Goa. Join us as we begin our forever.',
    notes:
      'Three days with our families — mehndi that feels joyful, barefoot dinner by the water, and music loud enough that everyone dances.',
    locationKeywords: [{ keyword: 'goa' }, { keyword: 'india' }],
    vendors: [
      { category: 'Travel', name: 'GoaAir Group Blocks', price: 9800, note: '62 guests, DEL/BOM → GOI' },
      {
        category: 'Venue',
        name: 'Taj-style Beachfront Lawn',
        price: 14500,
        note: '3-day mehndi + sangeet + ceremony',
      },
      {
        category: 'Caterer',
        name: 'Spice Route Caterers',
        price: 10200,
        note: 'Live chaat + seafood counters',
      },
      {
        category: 'Florist',
        name: 'Marigold & Co.',
        price: 4700,
        note: 'Marigold + orchid mandap garlands',
        flag: '15% above typical',
      },
      {
        category: 'Music',
        name: 'DJ Bollywood Nights + dhol duo',
        price: 2800,
        note: 'Sangeet + reception',
      },
    ],
  },
  {
    key: 'jake-emily',
    names: 'Jake & Emily',
    location: 'Tuscany, Italy',
    date: 'September 18, 2027',
    guests: 80,
    budgetTotal: 48000,
    vibe: 'vineyard',
    isDefaultForVibe: true,
    palette: { bg: '#3a2f1f', accent: '#7A8450', glow: '#C96F4A' },
    inviteCopy:
      'Sun-warmed hills, long tables, and wine under the Tuscan stars. Come celebrate love the way Italy does — slowly, joyfully, together.',
    notes:
      'Long tables, golden light, and a weekend that feels like a house party at a villa — not a ballroom.',
    locationKeywords: [
      { keyword: 'tuscany' },
      { keyword: 'italy' },
      { keyword: 'florence' },
      { keyword: 'firenze' },
    ],
    vendors: [
      {
        category: 'Travel',
        name: 'Firenze Charter Coaches',
        price: 8500,
        note: '80 guests, FLR/PSA transfers',
      },
      {
        category: 'Venue',
        name: 'Il Borgo Vineyard Estate',
        price: 18000,
        note: 'Weekend buyout, hilltop chapel',
      },
      {
        category: 'Caterer',
        name: "Nonna's Table Catering",
        price: 12000,
        note: 'Family-style, 6-course antipasti to dolce',
      },
      {
        category: 'Florist',
        name: 'Fiori di Toscana',
        price: 5800,
        note: 'Olive branch + wildflower arrangements',
        flag: '18% above typical',
      },
      {
        category: 'Music',
        name: 'Quartetto Classico + DJ Set',
        price: 3700,
        note: 'Ceremony strings, reception DJ',
      },
    ],
  },
  {
    key: 'marcus-david',
    names: 'Marcus & David',
    location: 'Mykonos, Greece',
    date: 'June 5, 2027',
    guests: 70,
    budgetTotal: 50000,
    vibe: 'island',
    isDefaultForVibe: true,
    palette: { bg: '#1f2f3a', accent: '#2E6FA3', glow: '#FF8C69' },
    inviteCopy:
      "Whitewashed walls, endless blue, and a sunset that never quite ends. We're saying 'I do' on the cliffs of Mykonos.",
    notes:
      'Sunset vows on the cliffs, seafood that keeps coming, and a dance floor that starts before the sun finishes.',
    locationKeywords: [
      { keyword: 'mykonos' },
      { keyword: 'greece' },
      { keyword: 'santorini' },
      { keyword: 'aegean' },
    ],
    vendors: [
      {
        category: 'Travel',
        name: 'Aegean Air Group Charter',
        price: 11000,
        note: '70 guests, JMK island transfers',
      },
      {
        category: 'Venue',
        name: 'Cliffside Caldera Villa',
        price: 19500,
        note: 'Private cliff estate, sunset ceremony',
      },
      {
        category: 'Caterer',
        name: 'Meze & Marble Catering',
        price: 11500,
        note: 'Aegean seafood + mezze stations',
      },
      {
        category: 'Florist',
        name: 'Santorini Bloom Co.',
        price: 4500,
        note: 'White bougainvillea + olive greenery',
        flag: '14% above typical',
      },
      {
        category: 'Music',
        name: 'DJ Kastro + Bouzouki Trio',
        price: 3500,
        note: 'Ceremony bouzouki, reception DJ',
      },
    ],
  },
  {
    key: 'sofia-mateo',
    names: 'Sofia & Mateo',
    location: 'Tulum, Mexico',
    date: 'November 20, 2027',
    guests: 90,
    budgetTotal: 38000,
    vibe: 'jungle',
    isDefaultForVibe: true,
    palette: { bg: '#2f1f2a', accent: '#E8862E', glow: '#C4386B' },
    inviteCopy:
      'Marigolds, mezcal, and the hum of the jungle at dusk. Our wedding is a love letter to Tulum — join the celebration.',
    locationKeywords: [
      { keyword: 'tulum' },
      { keyword: 'mexico' },
      { keyword: 'cancun' },
      { keyword: 'cancún' },
    ],
    vendors: [
      {
        category: 'Travel',
        name: 'Cancún Transfers & Charters',
        price: 7200,
        note: '90 guests, CUN → Tulum vans',
      },
      {
        category: 'Venue',
        name: 'Cenote Jungle Clearing',
        price: 12800,
        note: 'Open-air, lantern-lit ceremony',
      },
      {
        category: 'Caterer',
        name: 'Cocina de la Costa',
        price: 9500,
        note: 'Taco bar + mezcal tasting station',
      },
      {
        category: 'Florist',
        name: 'Cempasúchil Floral Studio',
        price: 4300,
        note: 'Marigold + fuchsia bougainvillea',
        flag: '16% above typical',
      },
      {
        category: 'Music',
        name: 'Mariachi Sunset + DJ',
        price: 4200,
        note: 'Ceremony mariachi, reception DJ',
      },
    ],
  },
  {
    key: 'aiko-wei',
    names: 'Aiko & Wei',
    location: 'Bali, Indonesia',
    date: 'October 9, 2027',
    guests: 56,
    budgetTotal: 34000,
    vibe: 'coastal',
    isDefaultForVibe: true,
    palette: { bg: '#242b2a', accent: '#9BAF9B', glow: '#B9A6D9' },
    inviteCopy:
      'Incense, ocean cliffs, and quiet ceremony as the sun dips into Bali. Come witness two families become one.',
    locationKeywords: [{ keyword: 'bali' }, { keyword: 'indonesia' }, { keyword: 'uluwatu' }],
    vendors: [
      {
        category: 'Travel',
        name: 'Denpasar Group Transfers',
        price: 6000,
        note: '56 guests, DPS island transfers',
      },
      {
        category: 'Venue',
        name: 'Uluwatu Cliffside Pavilion',
        price: 12500,
        note: 'Open pavilion, ocean-facing altar',
      },
      {
        category: 'Caterer',
        name: 'Sawah Rice & Spice Catering',
        price: 8500,
        note: 'Balinese rijsttafel feast',
      },
      {
        category: 'Florist',
        name: 'Frangipani & Lotus',
        price: 3400,
        note: 'Frangipani gate + lotus centerpieces',
        flag: '13% above typical',
      },
      {
        category: 'Music',
        name: 'Gamelan Ensemble + DJ',
        price: 3600,
        note: 'Ceremony gamelan, reception DJ',
      },
    ],
  },
  {
    key: 'lena-sarah',
    names: 'Lena & Sarah',
    location: 'Napa Valley, USA',
    date: 'October 23, 2027',
    guests: 68,
    budgetTotal: 46000,
    vibe: 'wine',
    isDefaultForVibe: true,
    palette: { bg: '#2a1f22', accent: '#7A2E3C', glow: '#C4A265' },
    inviteCopy:
      "Vineyard rows, golden light, and a toast that's been years in the making. Join us for a Napa wedding weekend to remember.",
    locationKeywords: [
      { keyword: 'napa' },
      { keyword: 'sonoma' },
      { keyword: 'california' },
      { keyword: 'wine' },
    ],
    vendors: [
      {
        category: 'Travel',
        name: 'Wine Country Shuttle Fleet',
        price: 5200,
        note: '68 guests, SFO/OAK transfers',
      },
      {
        category: 'Venue',
        name: 'Stone Terrace Vineyard',
        price: 20000,
        note: 'Weekend buyout, barrel room reception',
      },
      {
        category: 'Caterer',
        name: 'Harvest Table Catering',
        price: 13500,
        note: 'Farm-to-table, estate wine pairing',
      },
      {
        category: 'Florist',
        name: 'Cabernet & Bloom',
        price: 4300,
        note: 'Garden rose + grapevine arrangements',
        flag: '17% above typical',
      },
      {
        category: 'Music',
        name: 'String Trio + DJ Set',
        price: 3000,
        note: 'Ceremony strings, reception DJ',
      },
    ],
  },
  {
    key: 'kwame-ngozi',
    names: 'Kwame & Ngozi',
    location: 'Zanzibar, Tanzania',
    date: 'July 31, 2027',
    guests: 75,
    budgetTotal: 40000,
    vibe: 'beach',
    isDefaultForVibe: false,
    palette: { bg: '#1f2a2a', accent: '#E3A008', glow: '#2A7F9E' },
    inviteCopy:
      "Kente cloth, ocean drums, and the warmth of Zanzibar's shore. We invite you to dance us into marriage.",
    locationKeywords: [
      { keyword: 'zanzibar' },
      { keyword: 'tanzania' },
      { keyword: 'africa' },
    ],
    vendors: [
      {
        category: 'Travel',
        name: 'Stone Town Group Charters',
        price: 7500,
        note: '75 guests, ZNZ island transfers',
      },
      {
        category: 'Venue',
        name: 'Indian Ocean Beach Pavilion',
        price: 15500,
        note: 'Beachfront pavilion, tidal-view aisle',
      },
      {
        category: 'Caterer',
        name: 'Swahili Coast Catering',
        price: 10500,
        note: 'Pilau, seafood grill + spice bar',
      },
      {
        category: 'Florist',
        name: 'Kente Bloom Florals',
        price: 3200,
        note: 'Gold kente-wrapped arrangements',
        flag: '12% above typical',
      },
      {
        category: 'Music',
        name: 'Taarab Ensemble + DJ',
        price: 3300,
        note: 'Ceremony taarab, reception DJ',
      },
    ],
  },
]
