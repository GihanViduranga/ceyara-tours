import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role'],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      required: true,
    },
  ],
  access: {
    admin: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
    create: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
    read: ({ req: { user } }: { req: { user?: any } }) => {
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }: { req: { user?: any } }) => {
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
  },
}
