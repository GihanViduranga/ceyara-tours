'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'

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
  content: string
  contentTranslations?: Translations
  slug: string
  image?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
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

function getTranslatedContent(
  content: string,
  translations?: Translations,
  language: string = 'EN',
): string {
  if (!translations || language === 'EN') return content

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
    return translations[translationKey] || content
  }

  return content
}

function getImageUrl(image?: { url?: string; filename?: string }): string {
  if (!image) return '/api/placeholder/800/400'
  if (image.url) return image.url
  if (image.filename) return `/api/media/file/${image.filename}`
  return '/api/placeholder/800/400'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function renderContent(content: string): React.ReactNode {
  if (!content) return null

  // Split content by double newlines to create paragraphs
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0)

  return (
    <div className="blog-content">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="blog-content-paragraph">
          {paragraph.split('\n').map((line, lineIndex, lines) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, language } = useLanguage()
  const [slug, setSlug] = useState<string>('')
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/blog?where[slug][equals]=${slug}&limit=1&depth=2`)
        if (response.ok) {
          const data = await response.json()
          if (data.docs && data.docs.length > 0) {
            setPost(data.docs[0])
          } else {
            setError(t('common.postNotFound'))
          }
        } else {
          setError(t('common.failedToLoadPost'))
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setError(t('common.failedToLoadPost'))
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-loading">
          <p>{t('blog.detailLoading')}</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-detail-page">
        <section className="blog-detail-content">
          <div className="container">
            <div className="blog-detail-error">
              <h2>{t('blog.detailNotFound')}</h2>
              <p>{error || t('blog.detailNotFoundDesc')}</p>
              <Link href="/blog" className="blog-btn-primary">
                {t('blog.backToBlog')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const translatedContent = getTranslatedContent(post.content, post.contentTranslations, language)

  return (
    <div className="blog-detail-page">
      <section className="blog-detail-header">
        <div className="container">
          <h1 className="blog-detail-title">
            {getTranslatedValue(post.title, post.titleTranslations, language)}
          </h1>
          <div className="blog-detail-meta">
            <span className="blog-detail-author">
              {t('blog.by')} {post.author}
            </span>
            <span className="blog-detail-separator">|</span>
            <span className="blog-detail-date">{formatDate(post.publishedDate)}</span>
          </div>
        </div>
      </section>

      <section className="blog-detail-image">
        <div className="container">
          <div className="blog-detail-image-wrapper">
            <Image
              src={getImageUrl(post.image)}
              alt={getTranslatedValue(post.title, post.titleTranslations, language)}
              width={1200}
              height={600}
              className="blog-detail-img"
              priority
            />
          </div>
        </div>
      </section>

      <section className="blog-detail-content">
        <div className="container">
          <div className="blog-detail-article">{renderContent(translatedContent)}</div>
        </div>
      </section>
    </div>
  )
}
