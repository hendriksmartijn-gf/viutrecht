// Builds the English site from the Dutch one. For every NL document (pages, lessons, FAQs, news,
// homepage, navigation) it writes an EN copy with:
//   - every text replaced from scripts/translations/en-*.json (NL text -> EN text),
//   - English slugs (below),
//   - references to other NL documents pointed at their EN counterparts,
// and links each pair in a translation.metadata document (language switch and hreflang).
// Shared documents (coaches, memberships, settings) get their EN field values instead.
// The script stops before writing anything if a text has no translation. Safe to run again:
// EN documents are replaced, ids are stable. Run from the studio folder with:
//   npx sanity exec scripts/translate-en.ts --with-user-token
import {readdirSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21', perspective: 'published'})

// NL slug -> EN slug. The overview pages must match ROUTE_PREFIXES.en (classes, news).
const SLUGS: Record<string, string> = {
  // pages
  lessen: 'classes',
  lidmaatschappen: 'memberships',
  'over-ons': 'about-us',
  nieuws: 'news',
  rooster: 'schedule',
  // lessons
  crossfit: 'crossfit',
  hyrox: 'hyrox',
  'olympisch-gewichtheffen': 'olympic-weightlifting',
  krachttraining: 'strength-training',
  'open-gym': 'open-gym',
  'personal-training': 'personal-training',
  'advanced-crossfit': 'advanced-crossfit',
  zwangerschap: 'pregnancy',
  postpartum: 'postpartum',
  gymnastics: 'gymnastics',
  // news
  'tips-eerste-hyrox': 'tips-first-hyrox',
  'eten-rond-je-training': 'eating-around-training',
  'alles-uit-je-proefweek': 'make-the-most-of-your-trial-week',
  'wat-is-een-wod': 'what-is-a-wod',
  'waarom-je-snatch-vastloopt': 'why-your-snatch-stalls',
}
// Relative links typed into URL fields.
const URLS: Record<string, string> = {'/over-ons#coaches': '/en/about-us#coaches'}
// Left out: the test post.
const SKIP = new Set(['c21d34d0-abc9-4339-b6d8-d2c78fcd947b'])
// Text fields (as found in the NL documents); everything else (keys, enums, urls, emoji) is copied.
const TEXT = new Set([
  'title', 'text', 'emphasis', 'eyebrow', 'intro', 'summary', 'tagline', 'audienceLabel', 'label', 'value', 'description',
  'quote', 'question', 'name', 'alt', 'heroCaption', 'items', 'footnote', 'announcement', 'footerText', 'footerBadges',
  'chips', 'ctaText', 'note', 'lead', 'closing', 'titleEmphasis', 'tags', 'focusKeyword', 'faqHeading', 'quickLinksTitle',
  'attribution', 'subtitle', 'heading', 'whatToBring', 'body',
])
const SINGLETONS: Record<string, string> = {homePage: 'homePage-en', navigation: 'navigation-en'}

// EN values for the shared documents' translatable fields.
const SHARED: Record<string, Record<string, string>> = {
  'VI Rise': {badge: 'Train 3–4× a week', tagline: 'Keep going with fourteen classes that build real strength.'},
  'VI Core': {tagline: 'Keep moving with nine classes a month.'},
  'VI Thrive': {badge: 'Lowest price per class', tagline: 'Train almost every day. The lowest price per class at VI.'},
  Strippenkaart: {badge: 'Flexible option', tagline: 'Stay flexible with a punch card'},
}

type Doc = {_id: string; _type: string; [key: string]: unknown}

const dictionary: Record<string, string> = Object.assign(
  {},
  ...readdirSync(join(process.cwd(), 'scripts/translations'))
    .filter((f) => f.startsWith('en-') && f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(process.cwd(), 'scripts/translations', f), 'utf8'))),
)

async function main() {
  const nl = (await client.fetch<Doc[]>(`*[language == "nl"]`)).filter((d) => !SKIP.has(d._id))
  const metadata = await client.fetch<{_id: string; translations: {language: string; value: {_ref: string}}[]}[]>(
    `*[_type == "translation.metadata"]{_id, translations[]{language, value}}`,
  )
  const existingEn = new Map<string, {en: string; meta: string}>()
  for (const m of metadata) {
    const nlRef = m.translations.find((t) => t.language === 'nl')?.value._ref
    const enRef = m.translations.find((t) => t.language === 'en')?.value._ref
    if (nlRef && enRef) existingEn.set(nlRef, {en: enRef, meta: m._id})
  }
  const enId = (doc: Doc) =>
    SINGLETONS[doc._type] ?? existingEn.get(doc._id)?.en ?? (doc._id.endsWith('-nl') ? doc._id.replace(/-nl$/, '-en') : `${doc._id}-en`)
  const idMap = new Map(nl.map((d) => [d._id, enId(d)]))

  const missing = new Set<string>()
  const translate = (value: unknown, field?: string): unknown => {
    if (Array.isArray(value)) return value.map((v) => translate(v, field))
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>
      if (obj._type === 'reference' || typeof obj._ref === 'string') {
        const ref = obj._ref as string
        return idMap.has(ref) ? {...obj, _ref: idMap.get(ref)} : obj
      }
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => {
          if (k === 'slug' && v && typeof v === 'object') {
            const current = (v as {current?: string}).current ?? ''
            if (!SLUGS[current]) missing.add(`slug: ${current}`)
            return [k, {...(v as object), current: SLUGS[current] ?? current}]
          }
          if (k === 'url' && typeof v === 'string') return [k, URLS[v] ?? v]
          if (k.startsWith('_') || ['asset', 'crop', 'hotspot'].includes(k)) return [k, v]
          return [k, translate(v, k)]
        }),
      )
    }
    if (typeof value === 'string' && field && TEXT.has(field) && value.trim()) {
      if (!(value in dictionary)) missing.add(value)
      return dictionary[value] ?? value
    }
    return value
  }

  const docs = nl.map((doc) => {
    const {_rev, _createdAt, _updatedAt, ...content} = doc as Doc & {_rev?: string; _createdAt?: string; _updatedAt?: string}
    return {...(translate(content) as Doc), _id: idMap.get(doc._id)!, _type: doc._type, language: 'en'}
  })
  if (missing.size) throw new Error(`No translation for:\n${[...missing].join('\n')}`)

  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc)
  // Pair each NL/EN document for the language switch and hreflang (not the fixed-id singletons).
  for (const doc of nl.filter((d) => !SINGLETONS[d._type])) {
    const ref = (language: string, id: string) => ({
      _key: language,
      _type: 'internationalizedArrayReferenceValue',
      language,
      value: {_type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: {type: doc._type}},
    })
    tx.createOrReplace({
      _id: existingEn.get(doc._id)?.meta ?? `translation-${doc._id}`,
      _type: 'translation.metadata',
      schemaTypes: [doc._type],
      translations: [ref('nl', doc._id), ref('en', idMap.get(doc._id)!)],
    })
  }
  // Shared documents: fill in the EN values of their translatable fields.
  const memberships = await client.fetch<{_id: string; name: string; badge?: {language: string}[]; tagline?: {language: string}[]}[]>(
    `*[_type == "membership"]{_id, name, badge, tagline}`,
  )
  for (const m of memberships) {
    const values = SHARED[m.name]
    if (!values) continue
    for (const [field, text] of Object.entries(values)) {
      const list = ((m as Record<string, unknown>)[field] as {language: string; _key?: string}[] | undefined) ?? []
      const others = list.filter((item) => item.language !== 'en')
      tx.patch(m._id, (p) => p.set({[field]: [...others, {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: text}]}))
    }
  }
  await tx.commit()
  console.log(`EN documents: ${docs.length}`)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
