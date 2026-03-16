import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'image', 'createdAt'],
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload an image for the gallery',
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for the image (for accessibility)',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Order in which the image should appear (lower numbers appear first)',
      },
      defaultValue: 0,
    },
  ],
}
