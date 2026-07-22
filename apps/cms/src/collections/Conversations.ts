import type { CollectionConfig } from 'payload'
import { vendorCategoryOptions } from '../constants/vendorCategories'
import { conversationStatusOptions } from '../constants/communicationScheme'
import { createEventDebtOnBooking } from '../hooks/createEventDebtOnBooking'

/**
 * One marketplace thread per wedding ↔ vendor pair.
 * Schema.org anchors: CommunicateAction context; participants as Person/Organization.
 */
export const Conversations: CollectionConfig = {
  slug: 'conversations',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'wedding', 'vendor', 'status', 'lastMessageAt'],
  },
  hooks: {
    afterChange: [createEventDebtOnBooking],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Auto-set from message type + vendor category when opened.',
      },
    },
    {
      name: 'wedding',
      type: 'relationship',
      relationTo: 'weddings',
      required: true,
      index: true,
    },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: true,
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'awaiting_vendor',
      options: conversationStatusOptions,
      index: true,
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      admin: {
        description: 'Couple user(s) + vendor account user(s) on this thread.',
      },
    },
    {
      name: 'openedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'activeQuote',
      type: 'group',
      admin: {
        description: 'Latest structured quote on this thread (denormalized for comparison UI).',
      },
      fields: [
        { name: 'currency', type: 'text', defaultValue: 'USD' },
        { name: 'total', type: 'number', min: 0 },
        { name: 'validUntil', type: 'date' },
        {
          name: 'priceFlag',
          type: 'select',
          options: [
            { label: 'Within typical range', value: 'within_range' },
            { label: 'Above typical range', value: 'above_typical' },
            { label: 'Over budget allocation', value: 'over_budget' },
          ],
        },
      ],
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
      index: true,
    },
    {
      name: 'lastMessageType',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'unreadByCouple',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'unreadByVendor',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}
