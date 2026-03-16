// Comprehensive translation service with caching
const translationCache = new Map<string, string>()
const batchTranslationCache = new Map<string, Record<string, string>>()

// Language code mapping for API
const languageMap: Record<string, string> = {
  EN: 'en',
  DE: 'de',
  FR: 'fr',
  NL: 'nl',
  IT: 'it',
  ES: 'es',
  RU: 'ru',
}

const translateText = async (text: string, targetLang: string): Promise<string> => {
  const cacheKey = `${text}_${targetLang}`

  // Return cached translation if available
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  // Skip translation for English
  if (targetLang === 'EN') {
    translationCache.set(cacheKey, text)
    return text
  }

  try {
    const apiLang = languageMap[targetLang] || targetLang.toLowerCase()
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${apiLang}`,
    )

    if (response.ok) {
      const data = await response.json()
      const translated = data.responseData?.translatedText || text

      // Cache the translation
      translationCache.set(cacheKey, translated)
      return translated
    }
  } catch (error) {
    console.warn('Translation failed:', error)
  }

  // Fallback to original text
  translationCache.set(cacheKey, text)
  return text
}

// Batch translate multiple texts efficiently
export const translateBatch = async (texts: string[], targetLang: string): Promise<string[]> => {
  const batchKey = `${texts.join('|')}_${targetLang}`

  // Check batch cache first
  if (batchTranslationCache.has(batchKey)) {
    const cached = batchTranslationCache.get(batchKey)!
    return texts.map((text) => cached[text] || text)
  }

  // Skip translation for English
  if (targetLang === 'EN') {
    const result = texts.map((text) => {
      translationCache.set(`${text}_${targetLang}`, text)
      return text
    })
    return result
  }

  // Translate all texts in parallel
  const translatedTexts = await Promise.all(texts.map((text) => translateText(text, targetLang)))

  // Cache batch result
  const batchResult: Record<string, string> = {}
  texts.forEach((text, index) => {
    batchResult[text] = translatedTexts[index]
  })
  batchTranslationCache.set(batchKey, batchResult)

  return translatedTexts
}

// Translate all translation keys dynamically
export const translateAllKeys = async (
  translations: Record<string, string>,
  targetLang: string,
): Promise<Record<string, string>> => {
  const keys = Object.keys(translations)
  const values = Object.values(translations)

  const translatedValues = await translateBatch(values, targetLang)

  const result: Record<string, string> = {}
  keys.forEach((key, index) => {
    result[key] = translatedValues[index]
  })

  return result
}

// Legacy function for submenu items
export const translateSubmenuItems = async (
  submenus: Array<{ subItem: string; subHref: string }>,
  targetLang: string,
): Promise<Array<{ subItem: string; subHref: string }>> => {
  const texts = submenus.map((item) => item.subItem)
  const translatedTexts = await translateBatch(texts, targetLang)

  return submenus.map((item, index) => ({
    ...item,
    subItem: translatedTexts[index],
  }))
}
