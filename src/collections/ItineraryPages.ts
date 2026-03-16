import type { CollectionConfig } from 'payload'

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: unknown): boolean {
  if (typeof id !== 'string') return false
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Helper function to sanitize media references (remove URLs, keep only valid ObjectIds)
function sanitizeMediaReference(ref: unknown): string | null {
  if (!ref) return null
  if (typeof ref === 'string') {
    // If it's a URL, return null
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
      return null
    }
    // If it's a valid ObjectId, return it
    if (isValidObjectId(ref)) {
      return ref
    }
    // Otherwise, return null
    return null
  }
  // If it's already an object (populated), return the id
  if (typeof ref === 'object' && ref !== null && 'id' in ref && typeof ref.id === 'string') {
    return ref.id
  }
  return null
}

export const ItineraryPages: CollectionConfig = {
  slug: 'itinerary-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      const user = req.user as { role?: string } | null | undefined
      return user?.role === 'admin' || user?.role === 'editor'
    },
    update: ({ req }) => {
      const user = req.user as { role?: string } | null | undefined
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req }) => {
      const user = req.user as { role?: string } | null | undefined
      return user?.role === 'admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Sanitize image field
        if (data.image) {
          const sanitized = sanitizeMediaReference(data.image)
          if (!sanitized && data.image) {
            console.warn(`Invalid media reference in image field: ${data.image}. Setting to null.`)
          }
          data.image = sanitized
        }

        // Sanitize mainImage field
        if (data.mainImage) {
          const sanitized = sanitizeMediaReference(data.mainImage)
          if (!sanitized && data.mainImage) {
            console.warn(
              `Invalid media reference in mainImage field: ${data.mainImage}. Setting to null.`,
            )
          }
          data.mainImage = sanitized
        }

        // Sanitize itineraryDays images
        if (data.itineraryDays && Array.isArray(data.itineraryDays)) {
          data.itineraryDays = data.itineraryDays.map(
            (day: { images?: Array<{ image?: unknown }> }) => {
              if (day.images && Array.isArray(day.images)) {
                day.images = day.images
                  .map((img: { image?: unknown }) => {
                    if (img.image) {
                      const sanitized = sanitizeMediaReference(img.image)
                      if (!sanitized && img.image) {
                        console.warn(
                          `Invalid media reference in itinerary day image: ${img.image}. Removing.`,
                        )
                        return null
                      }
                      return sanitized ? { ...img, image: sanitized } : null
                    }
                    return img
                  })
                  .filter((img): img is { image?: unknown } => img !== null)
              }
              return day
            },
          )
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Sanitize image field
        if (doc.image) {
          const sanitized = sanitizeMediaReference(doc.image)
          if (!sanitized) {
            doc.image = null
          } else if (typeof doc.image === 'string' && sanitized !== doc.image) {
            doc.image = sanitized
          }
        }

        // Sanitize mainImage field
        if (doc.mainImage) {
          const sanitized = sanitizeMediaReference(doc.mainImage)
          if (!sanitized) {
            doc.mainImage = null
          } else if (typeof doc.mainImage === 'string' && sanitized !== doc.mainImage) {
            doc.mainImage = sanitized
          }
        }

        // Sanitize itineraryDays images
        if (doc.itineraryDays && Array.isArray(doc.itineraryDays)) {
          doc.itineraryDays = doc.itineraryDays.map(
            (day: { images?: Array<{ image?: unknown }> }) => {
              if (day.images && Array.isArray(day.images)) {
                day.images = day.images
                  .map((img: { image?: unknown }) => {
                    if (img.image) {
                      const sanitized = sanitizeMediaReference(img.image)
                      if (!sanitized) {
                        return null
                      }
                      return sanitized !== img.image ? { ...img, image: sanitized } : img
                    }
                    return img
                  })
                  .filter((img): img is { image?: unknown } => img !== null)
              }
              return day
            },
          )
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Adventure & Nature based Tours', value: 'adventure-nature-based-tours' },
        { label: 'Culture & Heritage Tours', value: 'culture-heritage-tours' },
        { label: 'Family Tours', value: 'family-tours' },
        { label: 'Luxury Bespoke Tours', value: 'luxury-bespoke-tours' },
        { label: 'North & East Coast Tours', value: 'north-east-coast-tours' },
        { label: 'Popular Tours', value: 'popular-tours' },
        { label: 'Purpose Built Tours', value: 'purpose-built-tours' },
        { label: 'Romantic Tours', value: 'romantic-tours' },
        { label: 'Special Transit Tours', value: 'special-transit-tours' },
        { label: 'Sports Based Tours', value: 'sports-based-tours' },
        { label: 'Sustainable Tours', value: 'sustainable-tours' },
        { label: 'Wellness Tours', value: 'wellness-tours' },
        { label: 'Wildlife Tours', value: 'wildlife-tours' },
      ],
      admin: {
        description: 'Select the itinerary category for this tour',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the tour (English - used as default)',
      },
    },
    {
      name: 'titleTranslations',
      type: 'group',
      label: 'Title Translations',
      admin: {
        description: 'Translations for the tour title',
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
        description: 'Small description for the tour card (English - used as default)',
      },
    },
    {
      name: 'descriptionTranslations',
      type: 'group',
      label: 'Description Translations',
      admin: {
        description: 'Translations for the tour description',
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
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Duration of the tour (e.g., "5 days", "3 days") - English',
      },
    },
    {
      name: 'durationTranslations',
      type: 'group',
      label: 'Duration Translations',
      admin: {
        description: 'Translations for the tour duration',
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
      admin: {
        description: 'Tour card image',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description:
          'Main hero image for the tour detail page (landscape orientation, not portrait)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug for navigation (e.g., "mountain-trekking-expedition")',
      },
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Full description shown on the tour detail page (English - used as default)',
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
      name: 'itineraryDays',
      type: 'array',
      label: 'Itinerary Days',
      admin: {
        initCollapsed: false,
        description: 'Add day-by-day itinerary for this tour',
      },
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          required: true,
          admin: {
            description: 'Day number (e.g., 1, 2, 3)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Day title (e.g., "BIA to Negombo") - English',
          },
        },
        {
          name: 'titleTranslations',
          type: 'group',
          label: 'Day Title Translations',
          admin: {
            description: 'Translations for the day title',
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
          name: 'activities',
          type: 'array',
          label: 'Activities',
          required: true,
          admin: {
            initCollapsed: false,
            description: 'Activities for this day (English)',
          },
          fields: [
            {
              name: 'activity',
              type: 'text',
              required: true,
              admin: {
                description: 'Activity description in English',
              },
            },
            {
              name: 'translations',
              type: 'group',
              label: 'Activity Translations',
              admin: {
                description: 'Translations for this activity',
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
          name: 'images',
          type: 'array',
          label: 'Day Images',
          required: false,
          admin: {
            initCollapsed: false,
            description: 'Images for this day (can add multiple)',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
