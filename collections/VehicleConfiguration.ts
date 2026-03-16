import type { CollectionConfig } from 'payload'

export const VehicleConfiguration: CollectionConfig = {
  slug: 'vehicle-configuration',
  admin: {
    useAsTitle: 'vehicleType',
    description: 'Vehicle configurations with pricing per kilometer',
    defaultColumns: ['vehicleType', 'passengerCount', 'lkrPerKilometer'],
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
  fields: [
    {
      name: 'vehicleType',
      type: 'text',
      label: 'Vehicle Type',
      required: true,
      admin: {
        description: 'Type of vehicle (e.g., Car, Van, Bus, SUV)',
      },
    },
    {
      name: 'passengerCount',
      type: 'number',
      label: 'Passenger Count',
      required: true,
      admin: {
        description: 'Maximum number of passengers the vehicle can accommodate',
        step: 1,
      },
      defaultValue: 1,
    },
    {
      name: 'lkrPerKilometer',
      type: 'number',
      label: 'LKR per One Kilometer',
      required: true,
      admin: {
        description: 'LKR (Sri Lankan Rupees) cost per one kilometer for this vehicle',
        step: 0.01,
      },
      defaultValue: 100,
    },
  ],
}
