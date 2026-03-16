import type { CollectionConfig } from 'payload'

export const AccommodationPages: CollectionConfig = {
  slug: 'accommodation-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'slug'],
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
        description: 'The title of the accommodation (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the accommodation title',
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
        description: 'Description for the accommodation card (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the accommodation description',
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
      name: 'location',
      type: 'text',
      required: false,
      admin: {
        description: 'Location of the accommodation (e.g., "Colombo", "Kandy")',
      },
    },
    {
      name: 'locationTranslations',
      type: 'group',
      label: 'Location Translations',
      admin: {
        description: 'Translations for the location',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: false,
      admin: {
        description: 'Accommodation card image',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      admin: {
        description: 'Main hero image for the accommodation detail page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug for navigation (e.g., "luxury-beach-resort")',
      },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: false,
      admin: {
        description:
          'Full description shown on the accommodation detail page (English - used as default)',
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
      name: 'numberOfRooms',
      type: 'number',
      required: false,
      admin: {
        description: 'Number of rooms (e.g., 13)',
      },
    },
    {
      name: 'numberOfRestaurants',
      type: 'number',
      required: false,
      admin: {
        description: 'Number of restaurants (e.g., 1)',
      },
    },
    {
      name: 'managedBy',
      type: 'text',
      required: false,
      admin: {
        description: 'Management company (e.g., "Nyne Hotels")',
      },
    },
    {
      name: 'managedByTranslations',
      type: 'group',
      label: 'Managed By Translations',
      admin: {
        description: 'Translations for the management company',
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
      name: 'facilities',
      type: 'array',
      label: 'Facilities',
      labels: {
        singular: 'Facility',
        plural: 'Facilities',
      },
      admin: {
        initCollapsed: false,
        description:
          'List of facilities/amenities (e.g., "Free Wifi", "Restaurant", "Free parking")',
      },
      minRows: 0,
      fields: [
        {
          name: 'facility',
          type: 'text',
          required: true,
          admin: {
            description: 'Facility name (English)',
          },
        },
        {
          name: 'translations',
          type: 'group',
          label: 'Facility Translations',
          admin: {
            description: 'Translations for this facility',
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
      ],
    },
    {
      name: 'roomTypes',
      type: 'array',
      label: 'Room Types',
      labels: {
        singular: 'Room Type',
        plural: 'Room Types',
      },
      admin: {
        initCollapsed: false,
        description: 'Add different room types available at this accommodation',
      },
      minRows: 0,
      fields: [
        {
          name: 'roomName',
          type: 'text',
          required: true,
          admin: {
            description: 'Room type name (e.g., "Superior King Room") - English',
          },
        },
        {
          name: 'roomNameTranslations',
          type: 'group',
          label: 'Room Name Translations',
          admin: {
            description: 'Translations for the room name',
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
          name: 'roomDescription',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Room description (English)',
          },
        },
        {
          name: 'roomDescriptionTranslations',
          type: 'group',
          label: 'Room Description Translations',
          admin: {
            description: 'Translations for the room description',
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
          name: 'roomImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          hasMany: false,
          admin: {
            description: 'Room image',
          },
        },
        {
          name: 'roomSize',
          type: 'text',
          required: false,
          admin: {
            description: 'Room size (e.g., "21 m²")',
          },
        },
        {
          name: 'roomFeatures',
          type: 'array',
          label: 'Room Features',
          labels: {
            singular: 'Room Feature',
            plural: 'Room Features',
          },
          admin: {
            initCollapsed: false,
            description: 'List of room features/amenities',
          },
          minRows: 0,
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
              admin: {
                description: 'Feature name (English)',
              },
            },
            {
              name: 'translations',
              type: 'group',
              label: 'Feature Translations',
              admin: {
                description: 'Translations for this feature',
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
          ],
        },
      ],
    },
  ],
}
