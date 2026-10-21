// Starter content taken from the current www.viutrecht.nl. Run with:
// cd studio && npx sanity exec scripts/seed.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})
const k = () => Math.random().toString(36).slice(2, 10)

const block = (text: string, style = 'normal') => ({
  _type: 'block',
  _key: k(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: k(), text, marks: []}],
})
const ref = (id: string) => ({_type: 'reference', _ref: id, _key: k()})
const trial = (label: string) => ({_type: 'link', label, linkType: 'trial'})
const i18n = (type: 'String' | 'Text', nl: string, en: string) => [
  {_key: k(), _type: `internationalizedArray${type}Value`, language: 'nl', value: nl},
  {_key: k(), _type: `internationalizedArray${type}Value`, language: 'en', value: en},
]

async function create<T extends {_type: string}>(doc: T) {
  const created = await client.create(doc)
  console.log('created', doc._type, created._id)
  return created._id
}

async function main() {
  const existing = await client.fetch<number>('count(*[_type in ["discipline", "membership", "faq"]])')
  if (existing > 0) throw new Error('Dataset already has content; not seeding.')

  await client.createOrReplace({
    _id: 'settings',
    _type: 'settings',
    siteName: 'VI Utrecht',
    siteUrl: 'https://www.viutrecht.nl',
    description: i18n(
      'Text',
      'VI Utrecht is een gym voor CrossFit, HYROX, Olympisch gewichtheffen en krachttraining in Utrecht. Lessen met begeleiding voor ieder niveau, van je eerste training tot je eerste race.',
      'VI Utrecht is a gym for CrossFit, HYROX, Olympic weightlifting and strength training in Utrecht. Coached classes for every level, from your first session to your first race.',
    ),
    address: {
      street: 'Steenovenweg 1-A',
      postalCode: '3532 AE',
      city: 'Utrecht',
      country: 'NL',
      directions: i18n('String', 'Direct naast Douwe Egberts. Zoek de paarse deur.', 'Right next to Douwe Egberts. Look for the purple door.'),
    },
    geo: {_type: 'geopoint', lat: 52.096249, lng: 5.083179},
    mapsUrl: 'https://maps.app.goo.gl/TTn1hEGAVaP9xP528',
    email: 'info@viutrecht.nl',
    openingHours: [
      {_key: k(), _type: 'openingHours', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '21:30'},
    ],
    socials: ['https://www.instagram.com/vi.utrecht/'],
    trialUrl: 'https://viutrecht.sportbitapp.nl/web/nl/proeflesplanner/kalender',
    annualDiscountPercent: 10,
  })

  const memberships = [
    {name: 'VI Core', price: 99.5, amount: 9, nl: 'Blijf on track met 9 sessies per maand', en: 'Stay on track with 9 sessions a month', a: 21},
    {name: 'VI Rise', price: 119.5, amount: 14, nl: 'Verleg je grenzen met 14 sessies per maand', en: 'Push your limits with 14 sessions a month', a: 19},
    {name: 'VI Thrive', price: 139.5, amount: 29, nl: 'Elke dag het maximale uit jezelf', en: 'Get the most out of yourself, every day', a: 17},
  ]
  for (const [i, m] of memberships.entries()) {
    await create({
      _type: 'membership',
      name: m.name,
      membershipType: 'subscription',
      price: m.price,
      priceInterval: 'month',
      credits: {amount: m.amount, unlimited: false, per: 'month'},
      tagline: i18n('String', m.nl, m.en),
      access: ['classes', 'openGym', 'openPlatform'],
      signupUrl: `https://viutrecht.sportbitapp.nl/web/nl/registreren/lidmaatschap?a=${m.a}`,
      orderRank: i,
    })
  }

  const faqNl = [
    ['Hoe boek ik lessen?', 'Via de Sportbit-app. Daar reserveer je je plek, beheer je je boekingen en zie je het actuele rooster.', 'classes'],
    ['Wat moet ik meenemen naar de les?', 'Sportkleding, schone binnenschoenen en een waterfles. Wij zorgen voor de rest.', 'getting-started'],
    ['Kan ik bij jullie met de auto parkeren?', 'Ja, voor de deur. Van maandag tot en met vrijdag is parkeren betaald tussen 6:00 en 11:00; daarbuiten en in het weekend is het gratis.', 'location'],
    ['Hoe kan ik betalen?', 'Online via iDEAL, kaart of SEPA. Bedrijven kunnen een factuur krijgen.', 'membership'],
  ]
  const faqIds: string[] = []
  for (const [question, answer, category] of faqNl) {
    faqIds.push(await create({_type: 'faq', language: 'nl', question, answer: [block(answer)], category}))
  }

  const disciplineFields = {
    key: 'weightlifting',
    level: {from: 'beginner', to: 'pro'},
    durationMinutes: 60,
    maxGroupSize: 10,
    bookingType: 'class',
    orderRank: 3,
  }
  const oly = {
    nl: await create({
      _type: 'discipline',
      language: 'nl',
      ...disciplineFields,
      title: 'Olympisch gewichtheffen',
      slug: {_type: 'slug', current: 'olympisch-gewichtheffen'},
      focusKeyword: 'olympisch gewichtheffen utrecht',
      heading: {text: 'Olympisch gewichtheffen', emphasis: 'De kunst van kracht, snelheid en precisie.'},
      summary:
        'Olympisch gewichtheffen bij VI Utrecht draait om de Snatch en de Clean & Jerk, met een sterke focus op techniek, controle en explosieve kracht. Voor wie voor het eerst een barbell aanraakt én voor wie traint voor een wedstrijd.',
      essentials: {
        heading: {text: 'Twee lifts.', emphasis: 'Eén complete atleet.'},
        intro: 'Deze lifts vragen om een unieke mix van kracht, lenigheid, coördinatie en snelheid.',
        items: [
          {_key: k(), title: 'De Snatch', description: 'De halter in één vloeiende, explosieve beweging van de grond tot boven je hoofd.'},
          {_key: k(), title: 'De Clean & Jerk', description: 'De halter naar je schouders (clean) en daarna krachtig boven je hoofd (jerk).'},
        ],
      },
      benefits: {
        heading: {text: 'Niet alleen voor atleten.', emphasis: 'Voor iedereen die wil…'},
        items: [
          'Explosieve kracht en snelheid verbeteren',
          'Mobiliteit, balans en lichaamscontrole vergroten',
          'De juiste barbelltechniek leren in een veilige omgeving',
          'Mentale focus en discipline ontwikkelen',
          'Beter presteren in CrossFit, sport en het dagelijks leven',
        ],
      },
      faqs: faqIds.slice(0, 2).map(ref),
    }),
    en: await create({
      _type: 'discipline',
      language: 'en',
      ...disciplineFields,
      title: 'Olympic weightlifting',
      slug: {_type: 'slug', current: 'olympic-weightlifting'},
      focusKeyword: 'olympic weightlifting utrecht',
      heading: {text: 'Olympic weightlifting', emphasis: 'The art of strength, speed and precision.'},
      summary:
        'Olympic weightlifting at VI Utrecht is built around the Snatch and the Clean & Jerk, with a strong focus on technique, control and explosive power. For first-timers and competitive lifters alike.',
    }),
  }
  await create({
    _type: 'translation.metadata',
    schemaTypes: ['discipline'],
    translations: (['nl', 'en'] as const).map((language) => ({
      _key: language,
      _type: 'internationalizedArrayReferenceValue',
      language,
      value: {_type: 'reference', _ref: oly[language], _weak: true, _strengthenOnPublish: {type: 'discipline'}},
    })),
  })

  const pages = {
    nl: await create({
      _type: 'page',
      language: 'nl',
      title: 'Lidmaatschappen',
      slug: {_type: 'slug', current: 'lidmaatschappen'},
      pageType: 'pricing',
      summary: 'Kies het lidmaatschap dat bij je doelen past: maandelijks opzegbaar, transparante prijzen en je eerste week gratis.',
      sections: [
        {_key: k(), _type: 'pricingSection', heading: {text: 'Flexibel trainen.', emphasis: 'Geen gedoe.'}},
        {_key: k(), _type: 'faqSection', heading: {text: 'Alles wat je', emphasis: 'moet weten.'}, faqs: faqIds.slice(2).map(ref), showContactInfo: true},
      ],
    }),
    en: await create({
      _type: 'page',
      language: 'en',
      title: 'Memberships',
      slug: {_type: 'slug', current: 'memberships'},
      pageType: 'pricing',
      summary: 'Pick the membership that fits your goals: monthly, transparent pricing and your first week free.',
      sections: [{_key: k(), _type: 'pricingSection', heading: {text: 'Train flexibly.', emphasis: 'No hassle.'}}],
    }),
  }
  await create({
    _type: 'translation.metadata',
    schemaTypes: ['page'],
    translations: (['nl', 'en'] as const).map((language) => ({
      _key: language,
      _type: 'internationalizedArrayReferenceValue',
      language,
      value: {_type: 'reference', _ref: pages[language], _weak: true, _strengthenOnPublish: {type: 'page'}},
    })),
  })

  await client.createOrReplace({
    _id: 'homePage-nl',
    _type: 'homePage',
    language: 'nl',
    title: 'Homepage',
    sections: [
      {
        _key: k(),
        _type: 'heroSection',
        eyebrow: 'Je eerste week is gratis',
        heading: {text: 'CrossFit & Hyrox gym', emphasis: 'in Utrecht.'},
        intro: 'Lessen met begeleiding voor ieder niveau, van je eerste training tot je eerste race. Je eerste week is gratis.',
        primaryCta: trial('Boek je gratis proefweek'),
        showRating: true,
      },
      {_key: k(), _type: 'disciplinesSection', heading: {text: 'Van beginner tot', emphasis: 'doorgewinterde pro.'}},
      {_key: k(), _type: 'pricingSection', heading: {text: 'Flexibel trainen.', emphasis: 'Geen gedoe.'}},
      {_key: k(), _type: 'faqSection', heading: {text: 'Alles wat je', emphasis: 'moet weten.'}, faqs: faqIds.map(ref), showContactInfo: true},
      {_key: k(), _type: 'ctaSection', heading: {text: 'Je eerste week', emphasis: 'trakteren wij.'}, cta: trial('Boek je gratis proefweek')},
    ],
  })
  await client.createOrReplace({
    _id: 'homePage-en',
    _type: 'homePage',
    language: 'en',
    title: 'Homepage',
    sections: [
      {
        _key: k(),
        _type: 'heroSection',
        heading: {text: 'CrossFit & Hyrox gym', emphasis: 'in Utrecht.'},
        intro: 'Coached classes for every level, from your first session to your first race. Your first week is free.',
        primaryCta: trial('Book your free trial week'),
      },
      {_key: k(), _type: 'disciplinesSection', heading: {text: 'From beginner to', emphasis: 'seasoned pro.'}},
    ],
  })
  await client.createOrReplace({
    _id: 'navigation-nl',
    _type: 'navigation',
    language: 'nl',
    announcement: 'Ontdek VI: 3 gratis proeflessen in je eerste week!',
    header: [
      {_key: k(), _type: 'link', label: 'Olympisch gewichtheffen', linkType: 'internal', internal: {_type: 'reference', _ref: oly.nl}},
      {_key: k(), _type: 'link', label: 'Lidmaatschappen', linkType: 'internal', internal: {_type: 'reference', _ref: pages.nl}},
    ],
    headerCta: trial('Boek gratis week'),
  })
  await create({
    _type: 'redirect',
    source: '/nl/olympicweightlifting',
    destination: '/lessen/olympisch-gewichtheffen',
    permanent: true,
    isEnabled: true,
  })
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
