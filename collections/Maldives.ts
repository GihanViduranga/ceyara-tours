import type { CollectionConfig } from 'payload'

export const Maldives: CollectionConfig = {
  slug: 'maldives',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'duration', 'slug'],
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Maldives', value: 'maldives' },
        { label: 'Maldives & Sri Lanka', value: 'maldives-sri-lanka' },
      ],
      admin: {
        description: 'Select the type of itinerary',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the Maldives package (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the package title',
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
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description of the package (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the package description',
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
      name: 'fullDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Full detailed description for the detail page (English - used as default)',
      },
    },
    {
      name: 'fullDescriptionTranslations',
      type: 'group',
      label: 'Full Description Translations',
      admin: {
        description: 'Translations for the full description',
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
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Duration of the package (e.g., "12 Days", "4 Days")',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Location (e.g., "Maldives", "Sri Lanka + Maldives")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image for the package card',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Hero image for the detail page (optional)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "sri-lanka-maldives-honeymoon-tour")',
      },
    },
    {
      name: 'itineraryDays',
      type: 'array',
      label: 'Itinerary Days',
      admin: {
        description: 'Day-by-day itinerary',
      },
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          required: true,
          admin: {
            description: 'Day number (1, 2, 3, etc.)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Day title (e.g., "BIA to Kotugoda")',
          },
        },
        {
          name: 'titleTranslations',
          type: 'group',
          label: 'Title Translations',
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
          name: 'activities',
          type: 'array',
          label: 'Activities',
          fields: [
            {
              name: 'activity',
              type: 'text',
              required: true,
            },
            {
              name: 'translations',
              type: 'group',
              label: 'Activity Translations',
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
          ],
        },
        {
          name: 'images',
          type: 'array',
          label: 'Day Images',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
          ],
        },
      ],
    },
  ],
}
