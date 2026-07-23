import type { CollectionConfig } from 'payload'
import { vendorCategoryOptions } from '../constants/vendorCategories'

/**
 * Planned wedding associated with a couple.
 * Schema.org anchors: Event (wedding), Offer (package totals), Place (venue area).
 */
export const Weddings: CollectionConfig = {
  slug: 'weddings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'weddingDate', 'status', 'budgetTotal', 'totalCost'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name, e.g. "Alex & Jordan — Fall 2027".',
      },
    },
    {
      name: 'couple',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: true,
      minRows: 1,
      maxRows: 2,
      filterOptions: {
        role: { equals: 'couple' },
      },
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planning',
      options: [
        { label: 'Intake', value: 'intake' },
        { label: 'Planning', value: 'planning' },
        { label: 'Vendors locked', value: 'vendors_locked' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      index: true,
    },
    {
      name: 'weddingDate',
      type: 'date',
      required: true,
      // schema.org/Event → startDate
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
      index: true,
    },
    {
      name: 'guestCount',
      type: 'number',
      required: true,
      min: 1,
      // drives package matching + venue capacity
    },
    {
      name: 'description',
      type: 'textarea',
      // free-text style / vibe for package generation
    },
    {
      name: 'generalArea',
      type: 'group',
      // Input: general area for marketplace matching
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'region', type: 'text', required: true },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'US', required: true },
        { name: 'radiusMiles', type: 'number', defaultValue: 50, min: 1 },
      ],
    },
    {
      name: 'budget',
      type: 'group',
      // Input: budget range
      fields: [
        { name: 'currency', type: 'text', defaultValue: 'USD' },
        { name: 'min', type: 'number', required: true, min: 0 },
        { name: 'max', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'budgetTotal',
      type: 'number',
      min: 0,
      admin: {
        description: 'Working budget ceiling (usually budget.max).',
      },
    },
    {
      name: 'totalCost',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Sum of confirmed event debts (synced from payments).',
      },
    },
    {
      name: 'paymentTotals',
      type: 'group',
      admin: {
        description: 'Synced from payments collection when bookings are confirmed or paid.',
      },
      fields: [
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
      name: 'selectedVendors',
      type: 'array',
      labels: { singular: 'Selected vendor', plural: 'Selected vendors' },
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          options: vendorCategoryOptions,
        },
        {
          name: 'vendor',
          type: 'relationship',
          relationTo: 'vendors',
          required: true,
        },
        {
          name: 'conversation',
          type: 'relationship',
          relationTo: 'conversations',
          admin: {
            description:
              'In-marketplace thread for this wedding ↔ vendor. All outreach uses the standard message scheme.',
          },
        },
        {
          name: 'quotedPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'acceptedPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'priceFlag',
          type: 'select',
          defaultValue: 'within_range',
          options: [
            { label: 'Within typical range', value: 'within_range' },
            { label: 'Above typical range', value: 'above_typical' },
            { label: 'Over budget allocation', value: 'over_budget' },
          ],
        },
        {
          name: 'selectionStatus',
          type: 'select',
          defaultValue: 'shortlisted',
          options: [
            { label: 'Shortlisted', value: 'shortlisted' },
            { label: 'Inquiry sent', value: 'inquiry_sent' },
            { label: 'Quote received', value: 'quote_received' },
            { label: 'Selected', value: 'selected' },
            { label: 'Booked', value: 'booked' },
            { label: 'Rejected', value: 'rejected' },
          ],
        },
      ],
    },
    {
      name: 'packageOptions',
      type: 'array',
      maxRows: 2,
      admin: {
        description:
          'Output of package generator: exactly two wedding package options (subset of vendors).',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
        },
        {
          name: 'estimatedTotal',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'vendors',
          type: 'relationship',
          relationTo: 'vendors',
          hasMany: true,
          required: true,
        },
        {
          name: 'isSelected',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      admin: {
        description: 'V1: weekly steps generated from wedding date + venue.',
      },
      fields: [
        { name: 'weekOf', type: 'date', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'upcoming',
          options: [
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Done', value: 'done' },
            { label: 'At risk', value: 'at_risk' },
          ],
        },
        {
          name: 'relatedCategory',
          type: 'select',
          options: vendorCategoryOptions,
        },
      ],
    },
    {
      name: 'guestList',
      type: 'relationship',
      relationTo: 'guests',
      hasMany: true,
      admin: {
        description: 'Guests belonging to this wedding.',
      },
    },
  ],
}
