import type { CollectionConfig } from 'payload'

export const ExperiencePages: CollectionConfig = {
  slug: 'experience-pages',
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
        description: 'The title of the experience (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the experience title',
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
        description: 'Description for the experience card (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the experience description',
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
        description: 'Full description for the experience detail page (English - used as default)',
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
        description: 'URL-friendly identifier (e.g., "ayubowan-welcome", "tea-ceremony")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: false,
      admin: {
        description: 'Experience card image',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      admin: {
        description: 'Main image for experience detail page (curved image on left)',
      },
    },
    {
      name: 'whereYouCanExperience',
      type: 'array',
      label: 'Where You Can Experience',
      labels: {
        singular: 'Location',
        plural: 'Locations',
      },
      minRows: 0,
      admin: {
        initCollapsed: false,
        description: 'List of locations where this experience can be enjoyed',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Location title (English)',
          },
        },
        {
          name: 'titleTranslations',
          type: 'group',
          label: 'Title Translations',
          admin: {
            description: 'Translations for this location title',
          },
          fields: [
            { name: 'de', type: 'text', label: 'German (DE)', required: false },
            { name: 'fr', type: 'text', label: 'French (FR)', required: false },
            { name: 'nl', type: 'text', label: 'Dutch (NL)', required: false },
            { name: 'it', type: 'text', label: 'Italian (IT)', required: false },
            { name: 'es', type: 'text', label: 'Spanish (ES)', required: false },
            { name: 'ru', type: 'text', label: 'Russian (RU)', required: false },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Location description (English)',
          },
        },
        {
          name: 'descriptionTranslations',
          type: 'group',
          label: 'Description Translations',
          admin: {
            description: 'Translations for this location description',
          },
          fields: [
            { name: 'de', type: 'textarea', label: 'German (DE)', required: false },
            { name: 'fr', type: 'textarea', label: 'French (FR)', required: false },
            { name: 'nl', type: 'textarea', label: 'Dutch (NL)', required: false },
            { name: 'it', type: 'textarea', label: 'Italian (IT)', required: false },
            { name: 'es', type: 'textarea', label: 'Spanish (ES)', required: false },
            { name: 'ru', type: 'textarea', label: 'Russian (RU)', required: false },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          hasMany: false,
          admin: {
            description: 'Location image',
          },
        },
      ],
    },
  ],
}
