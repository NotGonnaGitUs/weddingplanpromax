import type { CollectionConfig } from 'payload'

/**
 * Shared account model for couples and vendors.
 * Schema.org anchors: Person (profile), Organization (vendor business link).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'displayName', 'onboardingStatus'],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'couple',
      options: [
        { label: 'Couple', value: 'couple' },
        { label: 'Vendor', value: 'vendor' },
        { label: 'Admin', value: 'admin' },
      ],
      index: true,
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      // schema.org/Person → name
    },
    {
      name: 'phone',
      type: 'text',
      // schema.org/Person → telephone
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'onboardingStatus',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        { label: 'Not started', value: 'not_started' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Complete', value: 'complete' },
      ],
    },
    {
      name: 'accountProgress',
      type: 'group',
      fields: [
        {
          name: 'profileComplete',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'preferencesComplete',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'firstWeddingCreated',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'vendorProfileLinked',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'percentComplete',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 0,
          admin: {
            description: 'Derived onboarding completion (0–100).',
          },
        },
      ],
    },
    {
      name: 'coupleProfile',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.role === 'couple',
      },
      fields: [
        {
          name: 'partnerOneName',
          type: 'text',
        },
        {
          name: 'partnerTwoName',
          type: 'text',
        },
        {
          name: 'engagementDate',
          type: 'date',
        },
        {
          name: 'preferredStyle',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Classic', value: 'classic' },
            { label: 'Modern', value: 'modern' },
            { label: 'Rustic', value: 'rustic' },
            { label: 'Garden', value: 'garden' },
            { label: 'Destination', value: 'destination' },
            { label: 'Minimal', value: 'minimal' },
          ],
        },
        {
          name: 'homeArea',
          type: 'group',
          // schema.org/PostalAddress (coarse)
          fields: [
            { name: 'city', type: 'text' },
            { name: 'region', type: 'text' },
            { name: 'postalCode', type: 'text' },
            { name: 'country', type: 'text', defaultValue: 'US' },
          ],
        },
        {
          name: 'referralCode',
          type: 'text',
          unique: true,
          admin: {
            description: 'Built-in referral: each wedding can invite newly engaged friends.',
          },
        },
        {
          name: 'referredBy',
          type: 'relationship',
          relationTo: 'users',
          filterOptions: {
            role: { equals: 'couple' },
          },
        },
      ],
    },
    {
      name: 'vendorAccount',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.role === 'vendor',
      },
      fields: [
        {
          name: 'vendorListing',
          type: 'relationship',
          relationTo: 'vendors',
          admin: {
            description: 'Primary marketplace listing owned by this account.',
          },
        },
        {
          name: 'businessRole',
          type: 'select',
          options: [
            { label: 'Owner', value: 'owner' },
            { label: 'Manager', value: 'manager' },
            { label: 'Staff', value: 'staff' },
          ],
          defaultValue: 'owner',
        },
      ],
    },
    {
      name: 'coupleBalances',
      type: 'group',
      admin: {
        description: 'Marketplace debt ledger for the couple. Maintained by payment automation.',
        condition: (_, siblingData) => siblingData?.role === 'couple',
      },
      fields: [
        {
          name: 'stripeCustomerId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'totalDebt',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'totalPaid',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'outstandingBalance',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'savedWeddings',
      type: 'relationship',
      relationTo: 'weddings',
      hasMany: true,
      admin: {
        description: 'Past or bookmarked wedding plans for this account.',
        condition: (_, siblingData) => siblingData?.role === 'couple',
      },
    },
    {
      name: 'planTier',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Straightforward ($29/mo)', value: 'straightforward' },
        { label: 'Complex ($99/mo)', value: 'complex' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.role === 'couple',
      },
    },
  ],
}
