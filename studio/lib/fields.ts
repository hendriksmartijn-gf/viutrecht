import {defineField, type ReferenceFilterResolver, type SlugValidationContext} from 'sanity'
import {API_VERSION, LANGUAGES} from './i18n'

// Required by @sanity/document-internationalization; set by the plugin, never by editors.
export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

// Only offer references in the same language as the current document.
export const sameLanguage: ReferenceFilterResolver = ({document}) => ({
  filter: 'language == $language',
  params: {language: document?.language},
})

// Slugs must be unique per type and language: each type has its own URL prefix
// (see lib/routes.ts), so /crossfit and /lessen/crossfit can coexist.
export async function isUniqueRoute(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document) return true
  const id = document._id.replace(/^drafts\./, '')
  const client = getClient({apiVersion: API_VERSION})
  return client.fetch<boolean>(
    `!defined(*[
      !(_id in [$draft, $published]) &&
      _type == $type &&
      slug.current == $slug &&
      language == $language
    ][0]._id)`,
    {
      draft: `drafts.${id}`,
      published: id,
      type: document._type,
      slug,
      language: document.language ?? null,
    },
  )
}

export const slugField = defineField({
  name: 'slug',
  title: 'URL-slug',
  type: 'slug',
  description:
    'Kort, in de taal van de pagina, met het zoekwoord erin. Bijv. "lidmaatschappen" (NL) en "memberships" (EN). Het voorvoegsel (/lessen, /en) komt er automatisch voor.',
  options: {source: 'title', maxLength: 60, isUnique: isUniqueRoute},
  validation: (rule) =>
    rule.required().custom((value) => {
      if (!value?.current) return true
      // /en is the English root; a page with that slug would shadow it.
      if (LANGUAGES.some((language) => language.id === value.current)) return 'Deze slug is gereserveerd voor een taal'
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || 'Alleen kleine letters, cijfers en streepjes'
    }),
})

// Language-neutral key that ties a discipline's NL and EN documents together and lets
// language-neutral docs (coach, membership, testimonial) point at a discipline.
export const DISCIPLINES = [
  {title: 'CrossFit', value: 'crossfit'},
  {title: 'Advanced CrossFit', value: 'advanced-crossfit'},
  {title: 'HYROX', value: 'hyrox'},
  {title: 'Olympisch gewichtheffen', value: 'weightlifting'},
  {title: 'Krachttraining', value: 'strength'},
  {title: 'Open Gym', value: 'open-gym'},
  {title: 'Personal Training', value: 'personal-training'},
  {title: 'Zwangerschap', value: 'pregnancy'},
  {title: 'Postpartum', value: 'postpartum'},
]
