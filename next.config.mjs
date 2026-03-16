import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
    ],
    // Cache optimized images for 60 seconds
    minimumCacheTTL: 60,
    // Add device sizes for better optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // If GCS images continue to timeout, you can disable optimization for them
    // by using unoptimized={true} prop on Image components with GCS URLs
    // or set unoptimized: true here to disable for all external images
  },

  // Payload CMS compatibility
  transpilePackages: ['payload', '@payloadcms/db-mongodb'],

  // Suppress MongoDB optional dependency warnings
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'bson-ext': false,
      kerberos: false,
      '@mongodb-js/zstd': false,
      snappy: false,
      'mongodb-client-encryption': false,
    }

    // Ensure only one React instance is used (fixes React 19 "Expected static flag was missing" error)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }
    }

    // Handle SVG imports as URLs
    config.module.rules.push({
      test: /\.svg$/,
      type: 'asset/resource',
    })

    // Handle video file imports
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
      type: 'asset/resource',
    })

    return config
  },
}

export default nextConfig
