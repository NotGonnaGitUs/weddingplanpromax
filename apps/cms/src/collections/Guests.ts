import type { CollectionConfig } from 'payload'

/**
 * Guest list entries for a planned wedding.
 * Schema.org anchors: Person + (optional) PostalAddress.
 */
export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'wedding', 'rsvpStatus', 'partySize', 'side'],
  },
  fields: [
    {
      name: 'wedding',
      type: 'relationship',
      relationTo: 'weddings',
      required: true,
      index: true,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      // schema.org/Person → name
    },
    {
      name: 'email',
      type: 'email',
      // schema.org/Person → email
    },
    {
      name: 'phone',
      type: 'text',
      // schema.org/Person → telephone
    },
    {
      name: 'side',
      type: 'select',
      options: [
        { label: 'Partner one', value: 'partner_one' },
        { label: 'Partner two', value: 'partner_two' },
        { label: 'Both', value: 'both' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'partySize',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: {
        description: 'Headcount this invitation covers (plus-ones included).',
      },
    },
    {
      name: 'plusOneAllowed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'plusOneName',
      type: 'text',
    },
    {
      name: 'rsvpStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Invited', value: 'invited' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Declined', value: 'declined' },
        { label: 'Maybe', value: 'maybe' },
      ],
      index: true,
    },
    {
      name: 'mealChoice',
      type: 'text',
    },
    {
      name: 'dietaryRestrictions',
      type: 'textarea',
    },
    {
      name: 'household',
      type: 'text',
      admin: {
        description: 'Group key for mailing / seating households.',
      },
    },
    {
      name: 'address',
      type: 'group',
      // schema.org/PostalAddress
      fields: [
        { name: 'streetAddress', type: 'text' },
        { name: 'addressLocality', type: 'text' },
        { name: 'addressRegion', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'addressCountry', type: 'text', defaultValue: 'US' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Family', value: 'family' },
        { label: 'Wedding party', value: 'wedding_party' },
        { label: 'Child', value: 'child' },
        { label: 'Needs accessibility', value: 'accessibility' },
      ],
    },
  ],
}
