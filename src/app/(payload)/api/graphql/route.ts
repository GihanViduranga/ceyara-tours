import { NextRequest } from 'next/server'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  return new Response('GraphQL endpoint', { status: 200 })
}

export async function OPTIONS(request: NextRequest) {
  return new Response('GraphQL endpoint', { status: 200 })
}
