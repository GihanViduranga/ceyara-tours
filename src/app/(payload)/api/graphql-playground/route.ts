import { NextRequest } from 'next/server'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  return new Response('GraphQL Playground', { status: 200 })
}
