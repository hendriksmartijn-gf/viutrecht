import {BASE_LANGUAGE} from './i18n'

// URL structure: Dutch at the root, English under /en.
//   /lidmaatschappen          /en/memberships
//   /lessen/crossfit          /en/classes/crossfit
//   /cursussen/hyrox-course   /en/courses/hyrox-course
//   /nieuws/nieuw-rooster     /en/news/new-schedule
// The web app must use the same map; keep the two in sync.
export const ROUTE_PREFIXES: Record<string, Record<string, string>> = {
  discipline: {nl: 'lessen', en: 'classes'},
  program: {nl: 'cursussen', en: 'courses'},
  post: {nl: 'nieuws', en: 'news'},
}

export function pathFor(type: string, language: string | undefined, slug?: string) {
  const parts = [
    language && language !== BASE_LANGUAGE ? language : undefined,
    type === 'homePage' ? undefined : ROUTE_PREFIXES[type]?.[language ?? BASE_LANGUAGE],
    type === 'homePage' ? undefined : slug,
  ].filter(Boolean)
  return `/${parts.join('/')}`
}
