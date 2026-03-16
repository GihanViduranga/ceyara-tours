import type { CollectionConfig } from 'payload'

export const VisitingPlaces: CollectionConfig = {
  slug: 'visiting-places',
  admin: {
    useAsTitle: 'name',
    description: 'Manage visiting places that can be selected for trip planning',
    defaultColumns: ['name', 'latitude', 'longitude', 'stayDuration', 'stayCost'],
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the visiting place',
      },
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
      admin: {
        description: 'Latitude coordinate of the place (must be within Sri Lanka: 5.9 to 9.8)',
        step: 0.000001,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true
        if (value < 5.9 || value > 9.8) {
          return 'Latitude must be within Sri Lanka bounds (5.9 to 9.8)'
        }
        return true
      },
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      admin: {
        description: 'Longitude coordinate of the place (must be within Sri Lanka: 79.7 to 81.9)',
        step: 0.000001,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true
        if (value < 79.7 || value > 81.9) {
          return 'Longitude must be within Sri Lanka bounds (79.7 to 81.9)'
        }
        return true
      },
    },
    {
      name: 'stayDuration',
      type: 'number',
      label: 'Stay Duration (Minutes)',
      required: false,
      admin: {
        description: 'Duration to stay at this place in minutes (e.g., 60 for 1 hour)',
        step: 15,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true
        if (value < 0) {
          return 'Stay duration must be a positive number'
        }
        return true
      },
    },
    {
      name: 'stayCost',
      type: 'number',
      label: 'Stay Cost (LKR)',
      required: false,
      admin: {
        description: 'Cost to visit/stay at this place in Sri Lankan Rupees (LKR)',
        step: 1,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true
        if (value < 0) {
          return 'Stay cost must be a positive number'
        }
        return true
      },
    },
  ],
}
