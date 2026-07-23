/**
 * Standardized in-marketplace vendor communication protocol.
 * All couple ↔ vendor contact goes through these message types —
 * no external email drafting for V1 vendor outreach.
 */
export const MESSAGE_TYPES = [
  {
    value: 'inquiry',
    label: 'Inquiry',
    initiatedBy: 'couple',
    description: 'Open a thread with event basics and what the couple needs.',
  },
  {
    value: 'availability_check',
    label: 'Availability check',
    initiatedBy: 'couple',
    description: 'Ask whether the wedding date is free.',
  },
  {
    value: 'quote_request',
    label: 'Quote request',
    initiatedBy: 'couple',
    description: 'Request a formal quote against a standard brief.',
  },
  {
    value: 'quote_response',
    label: 'Quote response',
    initiatedBy: 'vendor',
    description: 'Vendor returns structured pricing and inclusions.',
  },
  {
    value: 'quote_revision',
    label: 'Quote revision',
    initiatedBy: 'either',
    description: 'Adjust scope or price on an existing quote.',
  },
  {
    value: 'clarification',
    label: 'Clarification',
    initiatedBy: 'either',
    description: 'Follow-up question tied to the active quote or inquiry.',
  },
  {
    value: 'booking_request',
    label: 'Booking request',
    initiatedBy: 'couple',
    description: 'Couple accepts a quote and requests to book.',
  },
  {
    value: 'booking_confirmation',
    label: 'Booking confirmation',
    initiatedBy: 'vendor',
    description: 'Vendor confirms the booking and deposit terms.',
  },
  {
    value: 'decline',
    label: 'Decline',
    initiatedBy: 'either',
    description: 'Either side declines the inquiry, quote, or booking.',
  },
  {
    value: 'system',
    label: 'System notice',
    initiatedBy: 'system',
    description: 'Marketplace-generated status notices (e.g. price flag, overdue reply).',
  },
] as const

export type MessageType = (typeof MESSAGE_TYPES)[number]['value']

export const messageTypeOptions = MESSAGE_TYPES.map(({ value, label }) => ({
  value,
  label,
}))

export const CONVERSATION_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'awaiting_vendor', label: 'Awaiting vendor' },
  { value: 'awaiting_couple', label: 'Awaiting couple' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'booking_pending', label: 'Booking pending' },
  { value: 'booked', label: 'Booked' },
  { value: 'declined', label: 'Declined' },
  { value: 'closed', label: 'Closed' },
] as const

export const conversationStatusOptions = CONVERSATION_STATUSES.map(({ value, label }) => ({
  value,
  label,
}))
