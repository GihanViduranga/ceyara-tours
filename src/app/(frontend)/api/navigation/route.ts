import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    // This is a placeholder - in a real implementation, you would fetch from Payload CMS
    const navigationData = {
      docs: [
        {
          parentMenu: 'plan-your-trip',
          submenu: [
            { subItem: 'Tailor Made Tour', subHref: '/tailor-made-tours' },
            { subItem: 'Plan Your Trip', subHref: '/plan-your-trip' },
          ],
        },
        {
          parentMenu: 'itineraries',
          submenu: [
            {
              subItem: 'Adventure & Nature based Tours',
              subHref: '/itineraries/adventure-nature-based-tours',
            },
            { subItem: 'Culture & Heritage Tours', subHref: '/itineraries/culture-heritage-tours' },
            { subItem: 'Family Tours', subHref: '/itineraries/family-tours' },
            { subItem: 'Luxury Bespoke Tours', subHref: '/itineraries/luxury-bespoke-tours' },
            { subItem: 'North & East Coast Tours', subHref: '/itineraries/north-east-coast-tours' },
            { subItem: 'Popular Tours', subHref: '/itineraries/popular-tours' },
            { subItem: 'Purpose Built Tours', subHref: '/itineraries/purpose-built-tours' },
            { subItem: 'Romantic Tours', subHref: '/itineraries/romantic-tours' },
            { subItem: 'Special Transit Tours', subHref: '/itineraries/special-transit-tours' },
            { subItem: 'Sports Based Tours', subHref: '/itineraries/sports-based-tours' },
            { subItem: 'Sustainable Tours', subHref: '/itineraries/sustainable-tours' },
            { subItem: 'Wellness Tours', subHref: '/itineraries/wellness-tours' },
            { subItem: 'Wildlife Tours', subHref: '/itineraries/wildlife-tours' },
          ],
        },
        {
          parentMenu: 'day-tours',
          submenu: [
            { subItem: 'Anuradhapura Day Tour', subHref: '/day-tours/anuradhapura-day-tour' },
            { subItem: 'Belihuloya Day Tour', subHref: '/day-tours/belihuloya-day-tour' },
            { subItem: 'Day Tour of Colombo', subHref: '/day-tours/colombo-day-tour' },
            { subItem: 'Galle Day Tour', subHref: '/day-tours/galle-day-tour' },
            {
              subItem: 'Geoffrey Bawa Works in Sri Lanka',
              subHref: '/day-tours/geoffrey-bawa-works',
            },
            {
              subItem: 'Hot Air Ballooning Day Tour',
              subHref: '/day-tours/hot-air-ballooning-day-tour',
            },
            { subItem: 'Kandy Day Tour', subHref: '/day-tours/kandy-day-tour' },
            {
              subItem: 'Kithulgala White Water Rafting',
              subHref: '/day-tours/kithulgala-white-water-rafting',
            },
            { subItem: 'Little England Day Tour', subHref: '/day-tours/little-england-day-tour' },
            {
              subItem: 'Negombo Lagoon Fishing Day Tour',
              subHref: '/day-tours/negombo-lagoon-fishing-day-tour',
            },
            { subItem: 'Polonnaruwa Day Tour', subHref: '/day-tours/polonnaruwa-day-tour' },
            {
              subItem: 'Sigiriya & Dambulla Day Tour',
              subHref: '/day-tours/sigiriya-dambulla-day-tour',
            },
            { subItem: 'Sinharaja Day Tour', subHref: '/day-tours/sinharaja-day-tour' },
            {
              subItem: 'Udawalawe National Park Day Tour',
              subHref: '/day-tours/udawalawe-national-park-day-tour',
            },
            { subItem: 'Whale Watching Day Tour', subHref: '/day-tours/whale-watching-day-tour' },
            {
              subItem: 'Wilpattu National Park Day Tour',
              subHref: '/day-tours/wilpattu-national-park-day-tour',
            },
            {
              subItem: 'Yala National Park Day Tour',
              subHref: '/day-tours/yala-national-park-day-tour',
            },
          ],
        },
        {
          parentMenu: 'discover-sri-lanka',
          submenu: [
            { subItem: 'Destinations', subHref: '/Destinations' },
            { subItem: 'Experiences', subHref: '/Experiences' },
          ],
        },
        {
          parentMenu: 'our-story',
          submenu: [
            { subItem: 'About', subHref: '/our-story' },
            { subItem: 'Our Team', subHref: '/our-story/our-team' },
          ],
        },
      ],
    }

    return NextResponse.json(navigationData)
  } catch (error) {
    console.error('Navigation API error:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 })
  }
}
