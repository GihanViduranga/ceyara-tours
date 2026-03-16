'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import logoImage from '../assest/images/Ceyara Tours Logo.png'
import { useLanguage } from '../contexts/LanguageContext'
import styles from './Navigation.module.css'

interface SubmenuItem {
  subItem: string
  subHref: string
}

interface NavigationItem {
  parentMenu: string
  submenu: SubmenuItem[]
}

export default function Navigation() {
  const { language, setLanguage, languages, t, td } = useLanguage()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [submenuMap, setSubmenuMap] = useState<Record<string, SubmenuItem[]>>({})

  const whatsappNumber = '+94772465884'

  // Main menu items with translations (Plan Your Trip is parent with dropdown: Tailor Made Tour, Plan Your Trip)
  const mainMenuItems = [
    { name: t('nav.planYourTrip'), href: '/plan-your-trip' },
    { name: t('nav.itineraries'), href: '/itineraries' },
    { name: t('nav.dayTours'), href: '/day-tours' },
    { name: t('nav.accommodation'), href: '/accommodation' },
    { name: t('nav.discoverSriLanka'), href: '/discover-sri-lanka' },
    { name: t('nav.ourStory'), href: '/our-story' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.registration'), href: '/registration' },
  ]

  // Check if a menu item has submenus
  const hasSubmenus = (href: string) => {
    const key = href.replace('/', '')
    return submenuMap[key] && submenuMap[key].length > 0
  }

  useEffect(() => {
    const fetchSubmenus = async () => {
      try {
        const response = await fetch('/api/navigation?where[parentMenu][exists]=true')
        if (response.ok) {
          const result = await response.json()
          const data = result.docs || []

          // Create a map of parent menu to submenus
          const submenuMapData: Record<string, SubmenuItem[]> = {}
          data.forEach((item: NavigationItem) => {
            if (item.parentMenu && item.submenu) {
              submenuMapData[item.parentMenu] = item.submenu
            }
          })
          setSubmenuMap(submenuMapData)
        }
      } catch (error) {
        console.error('Failed to fetch submenus:', error)
      }
    }
    fetchSubmenus()
  }, [])

  // No external translation calls; dynamic strings are translated via td() at render-time

  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const handleMobileSubmenuToggle = (itemName: string) => {
    // Always keep menu open when toggling submenu
    setMobileMenuOpen(true)

    // Store current scroll position to prevent auto-scroll
    const navMenu = document.querySelector(`.${styles.navMenu}.${styles.mobileOpen}`) as HTMLElement
    const currentScrollTop = navMenu ? navMenu.scrollTop : 0

    const newSubmenuState = mobileSubmenuOpen === itemName ? null : itemName
    setMobileSubmenuOpen(newSubmenuState)

    // Prevent any scrolling that might hide menu items
    if (newSubmenuState && navMenu) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        // Restore scroll position to prevent auto-scroll
        if (navMenu) {
          navMenu.scrollTop = currentScrollTop
        }
      })
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
    setMobileSubmenuOpen(null)
  }

  const handleMobileLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    // Close mobile menu after language selection on mobile size
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      handleMobileMenuClose()
    }
  }

  return (
    <nav className={styles.navigation}>
      {/* Main Navigation */}
      <div className={styles.navMain}>
        <div className="container">
          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Top Bar with Language and Contact */}
          <div className={styles.navTopBar}>
            <div className={styles.logoLeft}>
              <div className={styles.languageSelector}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={styles.langSelect}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.logoRight}>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                className={styles.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.phoneIcon}>📞</span> {whatsappNumber}
              </a>
              <div className={styles.navButtons}>
                <Link href="/enquiry" className={styles.enquiryButton}>
                  {t('nav.enquireNow')}
                </Link>
                <Link href="/plan-your-trip" className={styles.planTripButton}>
                  {t('nav.planYourTrip')}
                </Link>
              </div>
            </div>
          </div>

          {/* Navbar section with Logo and Menu */}
          <div className={styles.navBarSection}>
            {/* Logo on the left side - separate from menu */}
            <Link href="/" className={styles.navLogo}>
              <div className={styles.logoContainer}>
                <Image
                  src={logoImage}
                  alt="Ceyara Tours Logo"
                  width={90}
                  height={90}
                  className={styles.logoImage}
                />
              </div>
            </Link>

            {/* Menu Items */}
            <div
              className={`${styles.navMenu} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
              onClick={(e) => {
                // Prevent menu from closing when clicking inside
                e.stopPropagation()
              }}
            >
              {/* Mobile Menu Header */}
              <div className={styles.mobileMenuHeader}>
                <div className={styles.mobileLanguageSelector}>
                  <select
                    value={language}
                    onChange={handleMobileLanguageChange}
                    className={styles.mobileLangSelect}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  className={styles.mobileWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMobileMenuClose}
                >
                  <span className={styles.phoneIcon}>📞</span> {whatsappNumber}
                </a>
                <Link
                  href="/enquiry"
                  className={styles.mobileEnquiryButton}
                  onClick={handleMobileMenuClose}
                >
                  {t('nav.enquireNow')}
                </Link>
                <Link
                  href="/plan-your-trip"
                  className={styles.mobilePlanTripButton}
                  onClick={handleMobileMenuClose}
                >
                  {t('nav.planYourTrip')}
                </Link>
              </div>

              <div className={styles.mobileMenuItems}>
                {mainMenuItems.map((item) => {
                  const hasSubmenu = hasSubmenus(item.href)
                  return (
                    <div
                      key={item.name}
                      className={styles.navItem}
                      onMouseEnter={() =>
                        !mobileMenuOpen && hasSubmenu && handleMouseEnter(item.name)
                      }
                      onMouseLeave={() => !mobileMenuOpen && handleMouseLeave()}
                      onClick={(e) => {
                        // Prevent menu from closing when clicking on nav-item
                        if (mobileMenuOpen) {
                          e.stopPropagation()
                        }
                      }}
                    >
                      <div className={styles.navLinkWrapper}>
                        {hasSubmenu ? (
                          <>
                            <Link
                              href={item.href}
                              className={styles.navLink}
                              onClick={() => {
                                // Always allow navigation when clicking the link
                                if (mobileMenuOpen) {
                                  handleMobileMenuClose()
                                } else {
                                  handleMouseLeave()
                                }
                              }}
                              onMouseEnter={() => {
                                if (!mobileMenuOpen && hasSubmenu) {
                                  handleMouseEnter(item.name)
                                }
                              }}
                              style={{ flex: 1 }}
                            >
                              {item.name}
                            </Link>
                            {mobileMenuOpen && (
                              <button
                                className={styles.mobileSubmenuToggle}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleMobileSubmenuToggle(item.name)
                                }}
                                type="button"
                                aria-label="Toggle submenu"
                              >
                                <span
                                  className={`${styles.dropdownArrow} ${mobileSubmenuOpen === item.name ? styles.open : ''}`}
                                >
                                  ▼
                                </span>
                              </button>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className={styles.navLink}
                            onClick={() => {
                              handleMobileMenuClose()
                            }}
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                      {hasSubmenu && (
                        <div
                          className={`${styles.submenu} ${
                            (
                              mobileMenuOpen
                                ? mobileSubmenuOpen === item.name
                                : activeDropdown === item.name
                            )
                              ? styles.active
                              : ''
                          }`}
                          onClick={(e) => {
                            // Prevent clicks in submenu from affecting menu
                            e.stopPropagation()
                          }}
                        >
                          {submenuMap[item.href.replace('/', '')]?.map(
                            (subMenuItem: SubmenuItem, index: number) => {
                              // Default routing for Discover Sri Lanka submenu items
                              let href = subMenuItem.subHref || '#'
                              const parentKey = item.href.replace('/', '')

                              // Plan Your Trip dropdown: use nav translation keys for labels
                              let subLabel = td(subMenuItem.subItem)
                              if (parentKey === 'plan-your-trip') {
                                if (href === '/tailor-made-tours') subLabel = t('nav.tailorMadeTours')
                                else if (href === '/plan-your-trip') subLabel = t('nav.planYourTrip')
                              }

                              // Fix Discover Sri Lanka submenu routes
                              if (parentKey === 'discover-sri-lanka') {
                                const subItemLower = subMenuItem.subItem.toLowerCase()
                                const hrefLower = href.toLowerCase()

                                // Check if href points to wrong location (like /Destinations or /Experiences)
                                if (
                                  href === '/Destinations' ||
                                  href === '/destinations' ||
                                  hrefLower === '/destinations'
                                ) {
                                  href = '/discover-sri-lanka/destinations'
                                } else if (
                                  href === '/Experiences' ||
                                  href === '/experiences' ||
                                  hrefLower === '/experiences'
                                ) {
                                  href = '/discover-sri-lanka/experiences'
                                }
                                // If subHref is empty or '#', try to generate default routes from subItem text
                                else if (!href || href === '#') {
                                  if (subItemLower.includes('destination')) {
                                    href = '/discover-sri-lanka/destinations'
                                  } else if (subItemLower.includes('experience')) {
                                    href = '/discover-sri-lanka/experiences'
                                  }
                                }
                                // If href doesn't contain 'discover-sri-lanka', fix it
                                else if (
                                  !href.includes('discover-sri-lanka') &&
                                  !href.startsWith('http')
                                ) {
                                  if (
                                    subItemLower.includes('destination') ||
                                    hrefLower.includes('destination')
                                  ) {
                                    href = '/discover-sri-lanka/destinations'
                                  } else if (
                                    subItemLower.includes('experience') ||
                                    hrefLower.includes('experience')
                                  ) {
                                    href = '/discover-sri-lanka/experiences'
                                  }
                                }
                              }

                              // Ensure href starts with '/' if it's a relative path
                              if (
                                href &&
                                href !== '#' &&
                                !href.startsWith('/') &&
                                !href.startsWith('http')
                              ) {
                                href = '/' + href
                              }

                              return (
                                <Link
                                  key={index}
                                  href={href}
                                  className={styles.submenuLink}
                                  onClick={handleMobileMenuClose}
                                >
                                  {subLabel}
                                </Link>
                              )
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
