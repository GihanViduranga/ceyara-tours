import type { CollectionConfig } from 'payload'

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  admin: {
    useAsTitle: 'plateNumber',
    defaultColumns: ['plateNumber', 'model', 'vehicleType', 'driver', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  },
  fields: [
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
      index: true,
      admin: {
        description: 'Driver that owns this vehicle',
      },
    },
    {
      name: 'plateNumber',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Vehicle plate number',
      },
    },
    {
      name: 'model',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Vehicle model (e.g., Toyota Prius 2018)',
      },
    },
    {
      name: 'vehicleType',
      type: 'select',
      label: 'Vehicle Type',
      required: true,
      options: [
        { label: 'Car', value: 'Car' },
        { label: 'Van', value: 'Van' },
        { label: 'Bus', value: 'Bus' },
      ],
      admin: {
        description: 'Select the type of vehicle',
      },
    },
    {
      name: 'vehiclePhotoFront',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Vehicle photo - front',
      },
    },
    {
      name: 'vehiclePhotoBack',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Vehicle photo - back',
      },
    },
    {
      name: 'vehiclePhotoLeft',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Vehicle photo - left side',
      },
    },
    {
      name: 'vehiclePhotoRight',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Vehicle photo - right side',
      },
    },
  ],
}

