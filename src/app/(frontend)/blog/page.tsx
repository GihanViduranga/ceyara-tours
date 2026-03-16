'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import './styles.css'

interface Translations {
  de?: string
  fr?: string
  nl?: string
  it?: string
  es?: string
  ru?: string
}

interface BlogPost {
  id: string
  title: string
  titleTranslations?: Translations
  author: string
  publishedDate: string
  excerpt: string
  excerptTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  order?: number
}

function getTranslatedValue(
  value: string,
  translations?: Translations,
  language: string = 'EN',
): string {
  if (!translations || language === 'EN') return value

  const langMap: Record<string, keyof Translations> = {
    DE: 'de',
    FR: 'fr',
    NL: 'nl',
    IT: 'it',
    ES: 'es',
    RU: 'ru',
  }

  const translationKey = langMap[language]
  if (translationKey && translations[translationKey]) {
    return translations[translationKey] || value
  }

  return value
}

function getImageUrl(image?: { url?: string; filename?: string }): string {
  if (!image) return '/api/placeholder/400/300'
  if (image.url) return image.url
  if (image.filename) return `/api/media/file/${image.filename}`
  return '/api/placeholder/400/300'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const { t, language } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog?sort=-publishedDate&depth=2`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-title">{t('blog.title')}</h1>
        </div>
      </section>

      <section className="blog-posts-section">
        <div className="container">
          {loading ? (
            <div className="blog-loading">
              <p>{t('blog.loading')}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <p>{t('blog.noPosts')}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-card-image">
                    <Image
                      src={getImageUrl(post.image)}
                      alt={getTranslatedValue(post.title, post.titleTranslations, language)}
                      width={400}
                      height={300}
                      className="blog-card-img"
                    />
                  </div>
                  <div className="blog-card-content">
                    <h2 className="blog-card-title">
                      {getTranslatedValue(post.title, post.titleTranslations, language)}
                    </h2>
                    <div className="blog-card-meta">
                      <span className="blog-card-author">
                        {t('blog.by')} {post.author}
                      </span>
                      <span className="blog-card-separator">|</span>
                      <span className="blog-card-date">{formatDate(post.publishedDate)}</span>
                    </div>
                    <p className="blog-card-excerpt">
                      {getTranslatedValue(post.excerpt, post.excerptTranslations, language)}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="blog-card-readmore">
                      {t('blog.readMore')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
