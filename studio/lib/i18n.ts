// Single source of truth for the site's languages, shared by both i18n plugins and Structure.
export const LANGUAGES = [
  {id: 'nl', title: 'Nederlands'},
  {id: 'en', title: 'English'},
]

export const BASE_LANGUAGE = 'nl'

// Document-level translated types: each language is its own document with its own slug.
export const LOCALIZED_TYPES = ['homePage', 'navigation', 'page', 'discipline', 'program', 'post', 'faq']

// Types with their own URL; see lib/routes.ts for the path per type and language.
export const ROUTABLE_TYPES = ['page', 'discipline', 'program', 'post']

export const API_VERSION = '2026-10-21'
