// Creates the NL Gymnastics lesson page, filled like the other lessons. VI confirmed (21 Oct 2026):
// 60-minute classes, max 10 people. Session structure and skills are general CrossFit-gymnastics
// practice, to be checked by the coaches. Also gives Advanced CrossFit the barbell photo, so
// Gymnastics can use the bodyweight (push-up) photo. Run with:
//   npx sanity exec scripts/gymnastics.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const ID = 'discipline-gymnastics-nl'
let n = 0
const key = () => `gym${(n++).toString(36).padStart(4, '0')}`
const ref = (_ref: string) => ({_key: key(), _type: 'reference', _ref})
const text = (value: string) => [
  {_key: key(), _type: 'block', style: 'normal', markDefs: [], children: [{_key: key(), _type: 'span', marks: [], text: value}]},
]
const image = (assetId: string, alt: string) => ({_type: 'imageWithAlt', asset: {_type: 'reference', _ref: assetId}, alt})

const PUSH_UP = 'image-bd3e109925e6c20c91a8c56a1c43bc3df85d7b08-5107x3405-jpg'
const BARBELL = 'image-830040bd38e6c518160506deaa6bb608fdb3b754-6653x4435-jpg'
const DOC = {
  crossfit: 'VCSQoNjbuXIZTOFTM91pPB',
  advanced: 'MkFbgx2d3FIIITtLGVPErp',
  strength: 'MkFbgx2d3FIIITtLGVM5Fl',
}
// Shared questions, as on the other lessons.
const FAQ = {book: 'GPqPjmhHkD02bVdiKM6ptc', bring: 'MkFbgx2d3FIIITtLGVA0GN', credits: 'VCSQoNjbuXIZTOFTM94y4R'}

async function main() {
  const tx = client.transaction()
  tx.createIfNotExists({
    _id: 'faq-gymnastics-pullup-nl',
    _type: 'faq',
    language: 'nl',
    category: 'classes',
    question: 'Moet ik al een pull-up kunnen?',
    answer: text('Nee. Je begint met progressies, zoals ring rows en pull-ups met een band, en bouwt van daaruit op naar je eerste strikte pull-up.'),
  })
  tx.createOrReplace({
    _id: ID,
    _type: 'discipline',
    language: 'nl',
    key: 'gymnastics',
    title: 'Gymnastics',
    slug: {_type: 'slug', current: 'gymnastics'},
    focusKeyword: 'gymnastics training utrecht',
    heading: {_type: 'sectionHeading', text: 'Gymnastics', emphasis: 'Word de baas over je eigen lichaam.'},
    summary:
      'Gymnastics bij VI Utrecht draait om kracht en controle met je eigen lichaamsgewicht: pull-ups, handstands, toes-to-bar en de stappen naar je eerste muscle-up. Elke skill bouw je op met progressies, op jouw niveau.',
    tagline: 'Pull-ups, handstands en ringen. Stap voor stap naar je eerste muscle-up.',
    emoji: '🙃',
    audienceLabel: 'Alle niveaus',
    heroImage: image(PUSH_UP, 'Atleet doet een push-up naast een barbell in de gym van VI Utrecht'),
    level: {from: 'beginner', to: 'pro'},
    durationMinutes: 60,
    maxGroupSize: 10,
    bookingType: 'class',
    extraFacts: [{_key: key(), _type: 'keyFact', label: 'Coaching', value: 'Altijd'}],
    essentials: {
      heading: {_type: 'sectionHeading', eyebrow: 'De sport', text: 'Je lichaam', emphasis: 'is je barbell.'},
      intro: 'Gymnastics vraagt kracht, mobiliteit en lichaamsbeheersing tegelijk. Elke skill heeft een eerste stap, en daar begin je.',
      items: [
        {_key: key(), _type: 'essential', title: 'Trekken & duwen', description: 'Pull-ups, dips en push-ups: de basis voor alles aan de rig en op de ringen.'},
        {_key: key(), _type: 'essential', title: 'Ondersteboven', description: 'Handstands, handstand push-ups en handstand walks, opgebouwd tegen de muur.'},
        {_key: key(), _type: 'essential', title: 'Core & controle', description: 'Hollow holds, toes-to-bar en kipping: een sterke core maakt elke beweging efficiënter.'},
      ],
    },
    benefits: {
      heading: {_type: 'sectionHeading', eyebrow: 'Waarom gymnastics', text: 'Sterker dan je denkt,', emphasis: 'met je eigen gewicht.'},
      items: [
        'Relatieve kracht: sterk ten opzichte van je eigen lichaamsgewicht',
        'Betere mobiliteit in schouders, heupen en polsen',
        'Lichaamsbeheersing en balans',
        'Snellere progressie in CrossFit-workouts',
        'Het gevoel van je eerste pull-up of handstand',
      ],
    },
    lessonOutline: {
      heading: {_type: 'sectionHeading', eyebrow: 'Je eerste les', text: 'Dit gebeurt er in', emphasis: '60 minuten.'},
      blocks: [
        {_key: key(), _type: 'lessonBlock', title: 'Warming-up & mobiliteit', minutes: 10, description: 'Polsen, schouders en heupen klaarmaken voor hangen, steunen en ondersteboven staan.'},
        {_key: key(), _type: 'lessonBlock', title: 'Skill', minutes: 20, description: 'De skill van de dag in progressies. Je coach zoekt de stap die bij jou past.'},
        {_key: key(), _type: 'lessonBlock', title: 'Kracht', minutes: 20, description: 'Strikt werk voor de spieren achter de skill, zoals strikte pull-ups of dips.'},
        {_key: key(), _type: 'lessonBlock', title: 'Core & cooling-down', minutes: 10, description: 'Core-oefeningen, rekken en rustig afbouwen.'},
      ],
      whatToBring: ['Sportkleding', 'Schone binnenschoenen', 'Een waterfles'],
    },
    promise: {label: 'Elke skill begint klein', quote: 'Niemand begint met een muscle-up. We zoeken jouw eerste stap en bouwen vanaf daar.'},
    faqs: [ref('faq-gymnastics-pullup-nl'), ref(FAQ.book), ref(FAQ.bring), ref(FAQ.credits)],
    related: [ref(DOC.crossfit), ref(DOC.advanced), ref(DOC.strength)],
    orderRank: 7.5,
    seo: {
      _type: 'seo',
      title: 'Gymnastics training in Utrecht | VI Utrecht',
      description: 'Leer pull-ups, handstands en je eerste muscle-up bij VI Utrecht. Lessen van 60 minuten, max 10 personen, altijd met coach. Probeer je eerste week gratis.',
    },
  })
  tx.patch(DOC.advanced, (p) =>
    p.set({
      heroImage: image(BARBELL, 'Atleet met een barbell op de schouders in de gym van VI Utrecht'),
      cardImage: image(BARBELL, 'Atleet met een barbell op de schouders in de gym van VI Utrecht'),
    }),
  )
  await tx.commit()
  console.log('created', ID)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
