import type { CollectionConfig } from 'payload'
import { paymentKindOptions, paymentStatusOptions } from '../constants/payments'
import { createMarketplacePaymentEndpoint } from '../endpoints/createMarketplacePayment'
import { stripeWebhookEndpoint } from '../endpoints/stripeWebhook'
import {
  syncPaymentBalancesAfterChange,
  syncPaymentBalancesAfterDelete,
} from '../hooks/syncPaymentBalances'

/**
 * Marketplace ledger: what is due and owed between couples, vendors, and the platform.
 * Settled through Stripe (PaymentIntents + Connect transfers).
 */
export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'status', 'amount', 'amountDue', 'billingPeriod', 'vendor'],
  },
  endpoints: [createMarketplacePaymentEndpoint, stripeWebhookEndpoint],
  hooks: {
    afterChange: [syncPaymentBalancesAfterChange],
    afterDelete: [syncPaymentBalancesAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: paymentKindOptions,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'due',
      options: paymentStatusOptions,
      index: true,
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
      name: 'couple',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      filterOptions: {
        role: { equals: 'couple' },
      },
      index: true,
    },
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      index: true,
    },
    {
      name: 'parentDebt',
      type: 'relationship',
      relationTo: 'payments',
      admin: {
        description: 'For deposit/balance_payment/refund rows, the event_debt they apply to.',
        condition: (_, siblingData) =>
          ['deposit', 'balance_payment', 'refund', 'marketplace_fee', 'vendor_payout'].includes(
            siblingData?.kind,
          ),
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'USD',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Gross amount for this row (major currency units).',
      },
    },
    {
      name: 'amountPaid',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'amountDue',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Remaining balance on this row (automation maintains for event_debt).',
      },
    },
    {
      name: 'platformFee',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'platformFeeRate',
      type: 'number',
      min: 0,
      max: 1,
      admin: {
        description: 'Fee rate applied when the debt was created (e.g. 0.1 = 10%).',
      },
    },
    {
      name: 'vendorNet',
      type: 'number',
      min: 0,
      admin: {
        description: 'Amount owed to the vendor after platform fee.',
      },
    },
    {
      name: 'billingPeriod',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'UTC month key YYYY-MM used for vendor monthly tallies.',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'lineItems',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true, min: 0 },
        { name: 'quantity', type: 'number', min: 0, defaultValue: 1 },
      ],
    },
    {
      name: 'stripe',
      type: 'group',
      admin: {
        description: 'Stripe processor references (PaymentIntents + Connect).',
      },
      fields: [
        {
          name: 'customerId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'paymentIntentId',
          type: 'text',
          index: true,
          admin: { readOnly: true },
        },
        {
          name: 'checkoutSessionId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'chargeId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'transferId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'connectAccountId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'refundId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'latestEventId',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
  ],
  timestamps: true,
}
