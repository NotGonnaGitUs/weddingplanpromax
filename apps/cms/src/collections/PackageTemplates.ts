import type { CollectionConfig } from 'payload'

/**
 * Curated destination packages used by the web demo intake flow.
 * Public-read so apps/web can load seeds from the Payload REST/Local API.
 */
export const PackageTemplates: CollectionConfig = {
  slug: 'package-templates',
  admin: {
    useAsTitle: 'names',
    defaultColumns: ['names', 'location', 'vibe', 'budgetTotal', 'guests'],
    description: 'Demo wedding packages (destination + vendor bundle) for the planning UI.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stable id used by the web app (e.g. priya-arjun).',
      },
    },
    {
      name: 'names',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'text',
      required: true,
    },
    {
      name: 'guests',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'budgetTotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'vibe',
      type: 'select',
      required: true,
      options: [
        { label: 'Beach', value: 'beach' },
        { label: 'Vineyard', value: 'vineyard' },
        { label: 'Island', value: 'island' },
        { label: 'Jungle', value: 'jungle' },
        { label: 'Coastal', value: 'coastal' },
        { label: 'Wine', value: 'wine' },
      ],
      index: true,
    },
    {
      name: 'isDefaultForVibe',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When true, this package is the default seed for its vibe.',
      },
    },
    {
      name: 'palette',
      type: 'group',
      fields: [
        { name: 'bg', type: 'text', required: true },
        { name: 'accent', type: 'text', required: true },
        { name: 'glow', type: 'text', required: true },
      ],
    },
    {
      name: 'inviteCopy',
      type: 'textarea',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'locationKeywords',
      type: 'array',
      labels: { singular: 'Keyword', plural: 'Location keywords' },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'vendors',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Vendor line', plural: 'Vendor lines' },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: {
            description: 'Display category label used by the web demo (Venue, Caterer, …).',
          },
        },
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true, min: 0 },
        { name: 'note', type: 'text' },
        {
          name: 'flag',
          type: 'text',
          admin: {
            description: 'Optional price callout, e.g. "15% above typical".',
          },
        },
      ],
    },
  ],
}
