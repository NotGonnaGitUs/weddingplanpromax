import type { CollectionConfig } from 'payload'
import { vendorCategoryOptions } from '../constants/vendorCategories'

/**
 * Marketplace vendor listing.
 * Primary Schema.org basis: LocalBusiness (+ category-specific subtypes),
 * with nested Service / Offer / AggregateRating / PostalAddress / GeoCoordinates.
 */
export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'serviceAreaSummary', 'priceRange', '_status'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'schemaOrgType',
      type: 'text',
      admin: {
        description: 'Nearest Schema.org @type (e.g. EventVenue, Florist, Bakery).',
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      // schema.org/Thing → name
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: vendorCategoryOptions,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      // schema.org/Thing → description
    },
    {
      name: 'url',
      type: 'text',
      // schema.org/Thing → url
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      // schema.org/Thing → image
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: { equals: 'vendor' },
      },
    },
    {
      name: 'contactPoint',
      type: 'group',
      // schema.org/ContactPoint
      fields: [
        { name: 'email', type: 'email' },
        { name: 'telephone', type: 'text' },
        { name: 'contactType', type: 'text', defaultValue: 'customer service' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      // schema.org/PostalAddress
      fields: [
        { name: 'streetAddress', type: 'text' },
        { name: 'addressLocality', type: 'text', required: true },
        { name: 'addressRegion', type: 'text', required: true },
        { name: 'postalCode', type: 'text' },
        { name: 'addressCountry', type: 'text', defaultValue: 'US', required: true },
      ],
    },
    {
      name: 'geo',
      type: 'group',
      // schema.org/GeoCoordinates
      fields: [
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
      ],
    },
    {
      name: 'areaServed',
      type: 'array',
      // schema.org/Service → areaServed
      labels: { singular: 'Service area', plural: 'Service areas' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'city', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'radiusMiles', type: 'number', min: 0 },
      ],
    },
    {
      name: 'serviceAreaSummary',
      type: 'text',
      admin: {
        description: 'Short label for admin/list views (e.g. "Greater Austin, 50 mi").',
      },
    },
    {
      name: 'priceRange',
      type: 'select',
      // schema.org/LocalBusiness → priceRange (extended with numeric bounds for matching)
      options: [
        { label: '$', value: '$' },
        { label: '$$', value: '$$' },
        { label: '$$$', value: '$$$' },
        { label: '$$$$', value: '$$$$' },
      ],
    },
    {
      name: 'typicalPrice',
      type: 'group',
      admin: {
        description: 'Used to flag quotes outside typical range vs couple budget.',
      },
      fields: [
        { name: 'currency', type: 'text', defaultValue: 'USD' },
        { name: 'minPrice', type: 'number', min: 0, required: true },
        { name: 'maxPrice', type: 'number', min: 0, required: true },
        { name: 'unitText', type: 'text', defaultValue: 'wedding' },
      ],
    },
    {
      name: 'capacity',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.category === 'venue',
        description: 'schema.org/Place → maximumAttendeeCapacity',
      },
      fields: [
        { name: 'maximumAttendeeCapacity', type: 'number', min: 1 },
        { name: 'minimumAttendeeCapacity', type: 'number', min: 1 },
      ],
    },
    {
      name: 'services',
      type: 'array',
      // schema.org/Service + Offer catalog
      labels: { singular: 'Service offer', plural: 'Service offers' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'serviceType',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'offers',
          type: 'group',
          // schema.org/Offer
          fields: [
            { name: 'price', type: 'number', min: 0 },
            { name: 'priceCurrency', type: 'text', defaultValue: 'USD' },
            {
              name: 'availability',
              type: 'select',
              defaultValue: 'InStock',
              options: [
                { label: 'Available', value: 'InStock' },
                { label: 'Limited', value: 'LimitedAvailability' },
                { label: 'Unavailable', value: 'OutOfStock' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'aggregateRating',
      type: 'group',
      // schema.org/AggregateRating
      fields: [
        { name: 'ratingValue', type: 'number', min: 0, max: 5 },
        { name: 'reviewCount', type: 'number', min: 0, defaultValue: 0 },
        { name: 'bestRating', type: 'number', defaultValue: 5 },
        { name: 'worstRating', type: 'number', defaultValue: 1 },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      // schema.org/Thing → sameAs
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'amenities',
      type: 'array',
      // schema.org/LocationFeatureSpecification (simplified)
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'value', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
    {
      name: 'billing',
      type: 'group',
      admin: {
        description:
          'Marketplace billing via Stripe Connect. monthlyBillings is maintained by payment automation.',
      },
      fields: [
        {
          name: 'stripeConnectAccountId',
          type: 'text',
          index: true,
          admin: {
            description: 'Stripe Connect Express/Standard account id (acct_...).',
          },
        },
        {
          name: 'chargesEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'payoutsEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'currentMonthGross',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'currentMonthNet',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'currentMonthOutstanding',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'lifetimeGross',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'lifetimeCollected',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'monthlyBillings',
          type: 'array',
          admin: {
            readOnly: true,
            description: 'Per-month tally of marketplace billings for this vendor.',
          },
          fields: [
            { name: 'period', type: 'text', required: true },
            { name: 'grossBillings', type: 'number', min: 0, defaultValue: 0 },
            { name: 'platformFees', type: 'number', min: 0, defaultValue: 0 },
            { name: 'netBillings', type: 'number', min: 0, defaultValue: 0 },
            { name: 'amountCollected', type: 'number', min: 0, defaultValue: 0 },
            { name: 'amountOutstanding', type: 'number', min: 0, defaultValue: 0 },
            { name: 'paymentCount', type: 'number', min: 0, defaultValue: 0 },
          ],
        },
      ],
    },
  ],
}
