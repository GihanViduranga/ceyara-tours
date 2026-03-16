import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'editor',
  },
  admin: {
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Alt text for the image (auto-generated from filename if not provided)',
      },
    },
    // publicUrl is now purely derived at read-time from the GCS plugin's generateFileURL.
    // We keep the field so existing documents are not broken, but we no longer write to it
    // manually — the GCS plugin sets `url` on every document automatically.
    {
      name: 'publicUrl',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Public URL of the image in Google Cloud Storage (set automatically)',
      },
    },
  ],
  upload: {
    // Never store uploads on local disk — required for Vercel / serverless.
    // The GCS plugin overrides the actual storage; this prevents Payload from
    // also attempting a local write which would silently fail on Vercel.
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Sync publicUrl from url (set by GCS plugin) so existing code that
        // reads publicUrl keeps working.
        if (data.url && typeof data.url === 'string') {
          data.publicUrl = data.url
        }

        // Auto-generate alt text from filename if not provided.
        if (!data.alt || (typeof data.alt === 'string' && data.alt.trim() === '')) {
          const source = data.filename || data.url
          if (source && typeof source === 'string') {
            data.alt =
              source
                .split('/')
                .pop()
                ?.replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Image'
          } else {
            data.alt = 'Image'
          }
        }

        return data
      },
    ],
    // afterChange hook removed — it caused an extra DB write on every upload
    // which could fail silently and create update loops. The GCS plugin's
    // generateFileURL in payload.config.ts now handles URL generation.
  },
}