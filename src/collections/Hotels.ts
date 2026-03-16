import type { CollectionConfig } from 'payload'

export const Hotels: CollectionConfig = {
  slug: 'hotels',
  admin: {
    useAsTitle: 'hotelName',
    defaultColumns: ['hotelName', 'starRating', 'latitude', 'longitude', 'createdAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor' // Only admins/editors can create
    },
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor' // Only admins/editors can update
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor' // Only admins/editors can delete
    },
  },
  fields: [
    {
      name: 'hotelName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the hotel',
      },
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
      admin: {
        description: 'Latitude coordinate of the hotel location',
        step: 0.000001,
      },
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      admin: {
        description: 'Longitude coordinate of the hotel location',
        step: 0.000001,
      },
    },
    {
      name: 'starRating',
      type: 'select',
      required: true,
      options: [
        {
          label: '1 Star',
          value: '1',
        },
        {
          label: '2 Stars',
          value: '2',
        },
        {
          label: '3 Stars',
          value: '3',
        },
        {
          label: '4 Stars',
          value: '4',
        },
        {
          label: '5 Stars',
          value: '5',
        },
      ],
      admin: {
        description: 'Star rating of the hotel',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Small description about the hotel (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the hotel description',
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
      name: 'images',
      type: 'array',
      label: 'Hotel Images',
      required: false,
      admin: {
        description: 'Hotel images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
    {
      name: 'packages',
      type: 'array',
      label: 'Hotel Packages',
      required: false,
      admin: {
        description: 'Add packages with room prices for this hotel',
      },
      fields: [
        {
          name: 'packageName',
          type: 'text',
          label: 'Package Name',
          required: true,
          admin: {
            description: 'Name of the package (e.g., "Standard Room", "Deluxe Suite")',
          },
        },
        {
          name: 'roomPricePerNight',
          type: 'number',
          label: 'Room Price Per Night (LKR)',
          required: true,
          admin: {
            description: 'Price for one night in LKR',
            step: 0.01,
          },
        },
        {
          name: 'packageDescription',
          type: 'textarea',
          label: 'Package Description',
          required: false,
          admin: {
            description: 'Description of what is included in this package',
          },
        },
      ],
    },
  ],
}

