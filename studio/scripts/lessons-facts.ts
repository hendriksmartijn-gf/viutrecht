// Adds the facts VI confirmed (21 Oct 2026) to the NL lesson pages: 60-minute classes, maximum
// group sizes, how Open Gym and personal training work, the Advanced CrossFit entry level and
// Marloes as pre- and postnatal coach. Lesson pages change as drafts (on top of the drafts from
// lessons-fill.ts); the FAQ answers and Marloes' coach profile are published directly.
// Run with:
//   npx sanity exec scripts/lessons-facts.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21', perspective: 'raw'})

const MARLOES = 'VCSQoNjbuXIZTOFTM94un9'
let n = 0
const key = () => `fact${(n++).toString(36).padStart(4, '0')}`
const text = (value: string) => [
  {_key: key(), _type: 'block', style: 'normal', markDefs: [], children: [{_key: key(), _type: 'span', marks: [], text: value}]},
]
const block = (title: string, description: string) => ({_key: key(), _type: 'lessonBlock', title, description})
const fact = (label: string, value: string) => ({_key: key(), _type: 'keyFact', label, value})
const marloesLine = 'Je wordt begeleid door Marloes, opgeleid tot pre- en postnatale trainster via Girls Gone Strong.'

const lessons: Record<string, Record<string, unknown>> = {
  crossfit: {durationMinutes: 60, maxGroupSize: 10},
  hyrox: {durationMinutes: 60, maxGroupSize: 8},
  krachttraining: {durationMinutes: 60, maxGroupSize: 12},
  'advanced-crossfit': {durationMinutes: 60},
  'open-gym': {
    durationMinutes: 60,
    'lessonOutline.blocks[0]': block('Boek een uur', 'Je boekt een uur Open Gym in de Sportbit-app. In dat uur train je vrij.'),
  },
  'personal-training': {
    extraFacts: [fact('Prijs', 'Op maat')],
    'lessonOutline.heading.emphasis': 'drie stappen.',
    'lessonOutline.blocks': [
      block('Gewoon beginnen', 'Geen intake vooraf: je start meteen met trainen. Je coach stemt het onderweg af op jouw doelen.'),
      block('Trainen', '1-op-1, op momenten die jou uitkomen. Je coach let op elke herhaling.'),
      block('Bijsturen', 'We houden je voortgang bij en passen het plan aan waar nodig.'),
    ],
  },
  zwangerschap: {coaches: [{_key: key(), _type: 'reference', _ref: MARLOES}]},
  postpartum: {coaches: [{_key: key(), _type: 'reference', _ref: MARLOES}]},
}

async function main() {
  const docs = await client.fetch<{_id: string; slug: string; summary?: string; extraFacts?: unknown[]}[]>(
    `*[_type == "discipline" && language == "nl" && !(_id in path("drafts.**")) && slug.current in $slugs]{_id, "slug": slug.current, summary, extraFacts}`,
    {slugs: Object.keys(lessons)},
  )
  const tx = client.transaction()
  for (const doc of docs) {
    const draftId = `drafts.${doc._id}`
    const draft = (await client.getDocument(draftId)) ?? (await client.getDocument(doc._id))
    if (!draft) continue
    const {_rev, _createdAt, _updatedAt, ...content} = draft
    tx.createIfNotExists({...content, _id: draftId, _type: draft._type})
    const set = {...lessons[doc.slug]}
    // Pregnancy and postpartum: name the coach in the intro and the facts.
    if (doc.slug === 'zwangerschap' || doc.slug === 'postpartum') {
      const summary = (draft.summary as string | undefined) ?? ''
      if (!summary.includes('Girls Gone Strong')) set.summary = `${summary} ${marloesLine}`.trim()
      const facts = ((draft.extraFacts as {label?: string}[] | undefined) ?? []).filter((f) => f.label !== 'Coach')
      set.extraFacts = [...facts, fact('Coach', 'Marloes')]
    }
    tx.patch(draftId, (p) => p.set(set))
  }

  // Published directly: plain answers to questions VI answered.
  tx.patch('VCSQoNjbuXIZTOFTM951Lj', (p) =>
    p.set({
      answer: text(
        'Voor atleten die de basis van CrossFit onder de knie hebben. Je kunt de oefeningen zelfstandig uitvoeren, zonder veel uitleg. Schalen mag altijd, maar je bent zelf verantwoordelijk voor hoe je traint.',
      ),
    }),
  )
  tx.createIfNotExists({
    _id: 'faq-pt-price-nl',
    _type: 'faq',
    language: 'nl',
    question: 'Wat kost personal training?',
    category: 'membership',
    answer: text('Dat hangt af van je wensen en van de coach met wie je traint. Neem contact met ons op, dan maken we een voorstel.'),
  })
  tx.patch(MARLOES, (p) =>
    p
      .setIfMissing({certifications: [], specialties: []})
      .set({certifications: ['Girls Gone Strong – Pre- & Postnatal Coaching'], specialties: ['crossfit', 'pregnancy', 'postpartum']}),
  )
  await tx.commit()

  // The new price question goes at the top of the personal training FAQ (draft).
  const pt = docs.find((d) => d.slug === 'personal-training')
  if (pt) {
    await client
      .patch(`drafts.${pt._id}`)
      .setIfMissing({faqs: []})
      .unset(['faqs[_ref=="faq-pt-price-nl"]'])
      .insert('before', 'faqs[0]', [{_key: key(), _type: 'reference', _ref: 'faq-pt-price-nl'}])
      .commit()
  }
  console.log('updated:', docs.map((d) => d.slug))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
