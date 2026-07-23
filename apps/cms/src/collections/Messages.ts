import type { CollectionConfig } from 'payload'
import { messageTypeOptions } from '../constants/communicationScheme'

/**
 * Standardized marketplace messages.
 * Free-form body is optional; structuredPayload carries the protocol fields.
 * Schema.org: Message / CommunicateAction (simplified for marketplace).
 */
export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'conversation', 'senderRole', 'createdAt'],
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: messageTypeOptions,
      index: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Null when senderRole is system.',
      },
    },
    {
      name: 'senderRole',
      type: 'select',
      required: true,
      options: [
        { label: 'Couple', value: 'couple' },
        { label: 'Vendor', value: 'vendor' },
        { label: 'System', value: 'system' },
      ],
      index: true,
    },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description: 'Optional human note. Protocol data lives in structuredPayload.',
      },
    },
    {
      name: 'structuredPayload',
      type: 'group',
      admin: {
        description:
          'Standard fields by message type. Clients should validate against the communication scheme.',
      },
      fields: [
        // Shared inquiry / quote-request brief
        {
          name: 'eventBrief',
          type: 'group',
          fields: [
            { name: 'weddingDate', type: 'date' },
            { name: 'guestCount', type: 'number', min: 1 },
            { name: 'venueName', type: 'text' },
            { name: 'serviceSummary', type: 'textarea' },
            { name: 'budgetAllocation', type: 'number', min: 0 },
            { name: 'styleNotes', type: 'textarea' },
          ],
        },
        // Availability
        {
          name: 'availability',
          type: 'group',
          fields: [
            {
              name: 'dateAvailable',
              type: 'select',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Tentative', value: 'tentative' },
              ],
            },
            { name: 'alternateDates', type: 'textarea' },
          ],
        },
        // Quote response / revision
        {
          name: 'quote',
          type: 'group',
          fields: [
            { name: 'currency', type: 'text', defaultValue: 'USD' },
            { name: 'subtotal', type: 'number', min: 0 },
            { name: 'tax', type: 'number', min: 0 },
            { name: 'total', type: 'number', min: 0 },
            { name: 'depositAmount', type: 'number', min: 0 },
            { name: 'validUntil', type: 'date' },
            { name: 'inclusions', type: 'textarea' },
            { name: 'exclusions', type: 'textarea' },
            {
              name: 'lineItems',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'quantity', type: 'number', min: 0, defaultValue: 1 },
                { name: 'unitPrice', type: 'number', min: 0 },
                { name: 'amount', type: 'number', min: 0, required: true },
              ],
            },
          ],
        },
        // Booking
        {
          name: 'booking',
          type: 'group',
          fields: [
            { name: 'acceptedTotal', type: 'number', min: 0 },
            { name: 'depositDue', type: 'number', min: 0 },
            { name: 'depositDueDate', type: 'date' },
            { name: 'termsSummary', type: 'textarea' },
            { name: 'confirmationCode', type: 'text' },
          ],
        },
        // Decline
        {
          name: 'decline',
          type: 'group',
          fields: [
            {
              name: 'reasonCode',
              type: 'select',
              options: [
                { label: 'Date unavailable', value: 'date_unavailable' },
                { label: 'Out of budget', value: 'out_of_budget' },
                { label: 'Scope mismatch', value: 'scope_mismatch' },
                { label: 'Chose another vendor', value: 'chose_other' },
                { label: 'Other', value: 'other' },
              ],
            },
            { name: 'note', type: 'textarea' },
          ],
        },
        // System
        {
          name: 'system',
          type: 'group',
          fields: [
            { name: 'code', type: 'text' },
            { name: 'severity', type: 'json' },
          ],
        },
      ],
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'inReplyTo',
      type: 'relationship',
      relationTo: 'messages',
      admin: {
        description: 'Optional parent message for quote_revision / clarification chains.',
      },
    },
  ],
  timestamps: true,
}
