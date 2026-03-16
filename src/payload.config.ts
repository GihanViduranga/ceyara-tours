import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { gcsStorage } from '@payloadcms/storage-gcs'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AccommodationPages } from './collections/AccommodationPages'
import { Blog } from './collections/Blog'
import { DestinationPages } from './collections/DestinationPages'
import { Drivers } from './collections/Drivers'
import { ExperiencePages } from './collections/ExperiencePages'
import { Gallery } from './collections/Gallery'
import { Guides } from './collections/Guides'
import { Hotels } from './collections/Hotels'
import { ItineraryPages } from './collections/ItineraryPages'
import { TourRequest } from './collections/TourRequest'
import { Maldives } from './collections/Maldives'
import { Media as MediaCollection } from './collections/Media'
import { Testimonials } from './collections/Testimonials'
import { TripConfiguration } from './collections/TripConfiguration'
import { Users } from './collections/Users'
import { VehicleConfiguration } from './collections/VehicleConfiguration'
import { VisitingPlaces } from './collections/VisitingPlaces'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// GCS is active when the bucket name and at least one auth method is present.
// On Vercel, credentials come from environment variables — no key file needed.
// Locally, you can still use a key file by setting GCP_KEY_FILE.
const useGcsStorage = !!process.env.GCP_BUCKET_NAME && (
  !!process.env.GCP_SERVICE_ACCOUNT_KEY ||   // base64-encoded JSON (recommended for Vercel)
  !!process.env.GOOGLE_APPLICATION_CREDENTIALS // path to key file (local dev)
)

if (!useGcsStorage) {
  console.warn(
    '⚠️  GCS Storage is NOT active. Set GCP_BUCKET_NAME and GCP_SERVICE_ACCOUNT_KEY ' +
    '(base64-encoded service account JSON) to enable it.',
  )
}

// Build GCS credentials object from env vars so no file I/O is needed.
const getGcsOptions = () => {
  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    // Decode the base64 service-account JSON stored as an env var.
    const json = JSON.parse(
      Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'),
    )
    return {
      projectId: json.project_id ?? process.env.GCP_PROJECT_ID,
      credentials: json,
    }
  }
  // Fallback: use key file path (local dev only)
  return {
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  }
}

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Users,
    MediaCollection, // Media.ts now always has disableLocalStorage — see Media.ts
    ItineraryPages,
    AccommodationPages,
    DestinationPages,
    ExperiencePages,
    Gallery,
    Testimonials,
    Maldives,
    Blog,
    TripConfiguration,
    VehicleConfiguration,
    VisitingPlaces,
    Drivers,
    Guides,
    Hotels,
    TourRequest,
  ],
  plugins: [
    ...(useGcsStorage
      ? [
          gcsStorage({
            collections: {
              media: {
                disableLocalStorage: true, // Never write to local disk
                generateFileURL: ({ filename, collection }) => {
                  // Return a stable public URL for every file
                  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${filename}`
                },
              },
            },
            bucket: process.env.GCP_BUCKET_NAME!,
            options: getGcsOptions(),
          }),
        ]
      : []),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
  sharp,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/ceyara-tours',
  }),
})