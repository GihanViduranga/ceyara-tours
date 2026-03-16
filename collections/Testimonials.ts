import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'title', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    update: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The testimonial title (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the testimonial title',
      },
      fields: [
        {
          name: 'de',
          type: 'text',
          label: 'German (DE)',
          required: false,
        },
        {
          name: 'fr',
          type: 'text',
          label: 'French (FR)',
          required: false,
        },
        {
          name: 'nl',
          type: 'text',
          label: 'Dutch (NL)',
          required: false,
        },
        {
          name: 'it',
          type: 'text',
          label: 'Italian (IT)',
          required: false,
        },
        {
          name: 'es',
          type: 'text',
          label: 'Spanish (ES)',
          required: false,
        },
        {
          name: 'ru',
          type: 'text',
          label: 'Russian (RU)',
          required: false,
        },
      ],
    },
    {
      name: 'feedback',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The customer feedback/testimonial (English - used as default)',
      },
    },
    {
      name: 'feedbackTranslations',
      type: 'group',
      label: 'Feedback Translations',
      admin: {
        description: 'Translations for the customer feedback',
      },
      fields: [
        {
          name: 'de',
          type: 'textarea',
          label: 'German (DE)',
          required: false,
        },
        {
          name: 'fr',
          type: 'textarea',
          label: 'French (FR)',
          required: false,
        },
        {
          name: 'nl',
          type: 'textarea',
          label: 'Dutch (NL)',
          required: false,
        },
        {
          name: 'it',
          type: 'textarea',
          label: 'Italian (IT)',
          required: false,
        },
        {
          name: 'es',
          type: 'textarea',
          label: 'Spanish (ES)',
          required: false,
        },
        {
          name: 'ru',
          type: 'textarea',
          label: 'Russian (RU)',
          required: false,
        },
      ],
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer name (English - used as default)',
      },
    },
    {
      name: 'customerNameTranslations',
      type: 'group',
      label: 'Customer Name Translations',
      admin: {
        description: 'Translations for the customer name (if needed)',
      },
      fields: [
        {
          name: 'de',
          type: 'text',
          label: 'German (DE)',
          required: false,
        },
        {
          name: 'fr',
          type: 'text',
          label: 'French (FR)',
          required: false,
        },
        {
          name: 'nl',
          type: 'text',
          label: 'Dutch (NL)',
          required: false,
        },
        {
          name: 'it',
          type: 'text',
          label: 'Italian (IT)',
          required: false,
        },
        {
          name: 'es',
          type: 'text',
          label: 'Spanish (ES)',
          required: false,
        },
        {
          name: 'ru',
          type: 'text',
          label: 'Russian (RU)',
          required: false,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Order in which the testimonial should appear (lower numbers appear first)',
      },
      defaultValue: 0,
    },
  ],
}
