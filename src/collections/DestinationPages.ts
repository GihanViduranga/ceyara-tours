import type { CollectionConfig } from 'payload'

export const DestinationPages: CollectionConfig = {
  slug: 'destination-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
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
        description: 'The title of the destination (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the destination title',
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
        description: 'Description for the destination card (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the destination description',
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
        description: 'Full description for the destination detail page (English - used as default)',
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "colombo", "kandy")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: false,
      admin: {
        description: 'Destination card image',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      admin: {
        description: 'Main image for destination detail page (curved image on left)',
      },
    },
    {
      name: 'topAttractions',
      type: 'array',
      label: 'Top Attractions',
      labels: {
        singular: 'Top Attraction',
        plural: 'Top Attractions',
      },
      admin: {
        initCollapsed: false,
        description: 'List of top attractions for this destination',
      },
      minRows: 0,
      fields: [
        {
          name: 'attractionName',
          type: 'text',
          required: true,
          admin: {
            description: 'Attraction name (English)',
          },
        },
        {
          name: 'attractionNameTranslations',
          type: 'group',
          label: 'Attraction Name Translations',
          admin: {
            description: 'Translations for this attraction name',
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
          name: 'attractionDescription',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Attraction description (English)',
          },
        },
        {
          name: 'attractionDescriptionTranslations',
          type: 'group',
          label: 'Attraction Description Translations',
          admin: {
            description: 'Translations for this attraction description',
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
          name: 'attractionImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          hasMany: false,
          admin: {
            description: 'Attraction image',
          },
        },
      ],
    },
  ],
}
