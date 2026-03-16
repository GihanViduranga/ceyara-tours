import type { CollectionConfig } from 'payload'

export const TripConfiguration: CollectionConfig = {
  slug: 'trip-configuration',
  admin: {
    useAsTitle: 'name',
    description:
      'Default configuration for trip planning calculations. Only one configuration document should exist.',
    defaultColumns: ['name', 'stayTimeInMinutes', 'travelingHoursPerDay', 'defaultStayCost'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
    update: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }: { req: { user?: any } }) => {
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Ensure only one configuration document exists
        if (operation === 'create') {
          const existingConfigs = await req.payload.find({
            collection: 'trip-configuration' as any,
            limit: 1,
          })
          if (existingConfigs.totalDocs > 0) {
            throw new Error(
              'Only one trip configuration is allowed. Please update the existing configuration instead.',
            )
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Default Trip Configuration',
      admin: {
        description: 'Configuration name (for reference)',
      },
    },
    {
      name: 'stayTimeInMinutes',
      type: 'number',
      label: 'Stay Time in One Place (Minutes)',
      required: true,
      admin: {
        description: 'Default stay time in one place (in minutes)',
        step: 15,
      },
      defaultValue: 60,
    },
    {
      name: 'travelingHoursPerDay',
      type: 'number',
      label: 'Traveling Hours per Day',
      required: true,
      admin: {
        description: 'Default traveling hours per day',
        step: 0.5,
      },
      defaultValue: 8,
    },
    {
      name: 'defaultStayCost',
      type: 'number',
      label: 'Default Stay Cost (LKR)',
      required: true,
      admin: {
        description: 'Default cost to visit/stay at a place in Sri Lankan Rupees (LKR)',
        step: 1,
      },
      defaultValue: 0,
    },
  ],
}
