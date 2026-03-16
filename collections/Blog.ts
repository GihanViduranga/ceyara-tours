import type { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'slug'],
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
        description: 'The title of the blog post (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the blog post title',
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
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: 'Ceyara Tours',
      admin: {
        description: 'Author name for the blog post',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Publication date of the blog post',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short excerpt/summary of the blog post (English - used as default)',
      },
    },
    {
      name: 'excerptTranslations',
      type: 'group',
      label: 'Excerpt Translations',
      admin: {
        description: 'Translations for the blog post excerpt',
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
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Full content of the blog post (English - used as default)',
      },
    },
    {
      name: 'contentTranslations',
      type: 'group',
      label: 'Content Translations',
      admin: {
        description: 'Translations for the blog post content',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Featured image for the blog post',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug for the blog post (e.g., "blog-post-title")',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for sorting blog posts (higher numbers appear first)',
      },
    },
  ],
}
