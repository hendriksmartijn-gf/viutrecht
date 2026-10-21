// Fills the NL homepage and its referenced content to match the homepage design (Figma node 23:2).
// Copy comes from the design; facts (answers, hours, prices) from the current www.viutrecht.nl.
// Run with: npx sanity exec scripts/design-content.ts --with-user-token -- <asset dir>
import {createReadStream} from 'node:fs'
import {basename, join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})
const assetDir = process.argv.at(-1)
if (!assetDir || assetDir.endsWith('.ts')) throw new Error('Pass the asset directory as the last argument')

const k = () => Math.random().toString(36).slice(2, 10)
const block = (text: string) => ({
  _type: 'block',
  _key: k(),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: k(), text, marks: []}],
})
const ref = (id: string) => ({_type: 'reference', _ref: id, _key: k()})
const trial = (label: string) => ({_type: 'link', label, linkType: 'trial'})
const internal = (label: string, id: string) => ({_type: 'link', _key: k(), label, linkType: 'internal', internal: {_type: 'reference', _ref: id}})
const i18nValue = (type: 'String' | 'Text', language: string, value: string) => ({
  _key: k(),
  _type: `internationalizedArray${type}Value`,
  language,
  value,
})

async function image(file: string, alt: string) {
  const asset = await client.assets.upload('image', createReadStream(join(assetDir!, file)), {filename: basename(file)})
  return {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: asset._id}, alt}
}

const idOf = (query: string, params: Record<string, string> = {}) =>
  client.fetch<string | null>(`${query}[0]._id`, params)

async function main() {
  const [hero, gym] = await Promise.all([
    image('hero.png', 'Atleet tijdens een training in de gym van VI Utrecht'),
    image('photo-gym.png', 'De trainingsruimte van VI Utrecht'),
  ])

  // Disciplines (NL). Olympic weightlifting exists; the other five are created.
  const disciplines = [
    {
      key: 'crossfit',
      title: 'CrossFit',
      slug: 'crossfit',
      file: 'class-crossfit.png',
      alt: 'CrossFit-les bij VI Utrecht',
      audienceLabel: 'Alle niveaus',
      tagline: 'Kracht, gymnastics en conditie, in de groep met een coach. Elke WOD aangepast aan jou.',
      summary:
        'CrossFit bij VI Utrecht is een mix van kracht, gymnastiek en conditie in een groepsles met coach. Elke workout wordt aangepast aan jouw niveau, of je nu net begint of al jaren traint.',
    },
    {
      key: 'hyrox',
      title: 'Hyrox',
      slug: 'hyrox',
      file: 'class-hyrox.png',
      alt: 'Hyrox-training bij VI Utrecht',
      audienceLabel: 'Alle niveaus',
      tagline: 'Rennen, sled, roeien, wall balls. Train voor racedag, of gewoon voor je conditie.',
      summary:
        'Hyrox-training bij VI Utrecht combineert hardlopen met functionele onderdelen zoals sled, roeien en wall balls. Voor wie traint voor een Hyrox-race en voor wie gewoon fitter wil worden.',
    },
    {key: 'weightlifting', file: 'class-weightlifting.png', alt: 'Snatch tijdens een les Olympisch gewichtheffen', audienceLabel: 'Beginner → wedstrijd', tagline: 'Snatch en clean & jerk. Eerst techniek, dan de kilo’s.'},
    {
      key: 'strength',
      title: 'Krachttraining',
      slug: 'krachttraining',
      file: 'class-strength.png',
      alt: 'Krachttraining met een barbell bij VI Utrecht',
      audienceLabel: 'Alle niveaus',
      tagline: 'Barbells, dumbbells en een opbouwend programma dat je onwrikbaar sterk maakt.',
      summary:
        'Krachttraining bij VI Utrecht bouwt je fundament met barbells, dumbbells en een opbouwend programma, onder begeleiding van een coach.',
    },
    {
      key: 'open-gym',
      title: 'Open Gym',
      slug: 'open-gym',
      file: 'class-open-gym.png',
      alt: 'Vrij trainen tijdens Open Gym bij VI Utrecht',
      audienceLabel: 'Leden',
      tagline: 'Jouw ruimte, jouw tempo. Toegang tot al het materiaal.',
      summary:
        'Open Gym bij VI Utrecht is vrij trainen op vaste uren, met toegang tot al het materiaal. Voor leden die zelf aan hun skills, kracht of conditie willen werken.',
      bookingType: 'openAccess',
    },
    {
      key: 'personal-training',
      title: 'Personal training',
      slug: 'personal-training',
      file: 'class-personal-training.png',
      alt: 'Personal training met een coach bij VI Utrecht',
      audienceLabel: '1-op-1',
      tagline: 'Een plan op maat, flexibele tijden en een coach die achter je staat.',
      summary:
        'Personal training bij VI Utrecht is één-op-één training met een coach: een plan op maat, op tijden die jou uitkomen.',
      bookingType: 'appointment',
    },
  ]

  const disciplineIds: Record<string, string> = {}
  for (const [i, d] of disciplines.entries()) {
    const cardImage = await image(d.file, d.alt)
    const existing = await idOf('*[_type == "discipline" && language == "nl" && key == $key]', {key: d.key})
    if (existing) {
      await client.patch(existing).set({tagline: d.tagline, audienceLabel: d.audienceLabel, cardImage, orderRank: i + 1}).commit()
      disciplineIds[d.key] = existing
      console.log('updated discipline', d.key)
    } else {
      const created = await client.create({
        _type: 'discipline',
        language: 'nl',
        key: d.key,
        title: d.title,
        slug: {_type: 'slug', current: d.slug},
        heading: {text: d.title},
        summary: d.summary,
        tagline: d.tagline,
        audienceLabel: d.audienceLabel,
        bookingType: d.bookingType ?? 'class',
        cardImage,
        orderRank: i + 1,
      })
      disciplineIds[d.key] = created._id
      console.log('created discipline', d.key)
    }
  }

  // Memberships: copy from the design; the price per class is computed by the site.
  const memberships = [
    {name: 'VI Core', tagline: 'Blijf in beweging met negen lessen per maand.', featured: false},
    {name: 'VI Rise', tagline: 'Ga verder met veertien lessen die echte kracht opbouwen.', featured: true, badge: 'Train 3–4× per week'},
    {name: 'VI Thrive', tagline: 'Train bijna elke dag. De laagste prijs per les bij VI.', featured: false, badge: 'Laagste prijs per les'},
  ]
  for (const m of memberships) {
    const id = await idOf('*[_type == "membership" && name == $name]', {name: m.name})
    if (!id) continue
    const doc = await client.getDocument(id)
    const keep = (field: 'tagline' | 'badge', lang: string) =>
      ((doc?.[field] as {language: string}[] | undefined) ?? []).filter((v) => v.language !== lang)
    await client
      .patch(id)
      .set({
        featured: m.featured,
        tagline: [...keep('tagline', 'nl'), i18nValue('String', 'nl', m.tagline)],
        ...(m.badge && {badge: [...keep('badge', 'nl'), i18nValue('String', 'nl', m.badge)]}),
      })
      .commit()
    console.log('updated membership', m.name)
  }

  // FAQ (NL), in the design's order. Answers follow the current website.
  const faqs: [string, string, string, string?][] = [
    ['Kan ik mijn lidmaatschap pauzeren, upgraden of opzeggen?', 'Upgraden kan altijd. Voor downgraden, bevriezen of opzeggen geldt een opzegtermijn van één kalendermaand. Pauzeren kan voor minimaal een maand; kortere periodes zijn niet mogelijk.', 'membership'],
    ['Hoe boek ik een les?', 'Via de Sportbit-app. Daar reserveer je je plek, beheer je je boekingen en zie je het actuele rooster.', 'classes', 'Hoe boek ik lessen?'],
    ['Wat is jullie annuleringsbeleid?', 'Je annuleert kosteloos tot 2 uur voor een avondles en tot 12 uur voor een ochtendles. Annuleer je later of kom je niet, dan rekenen we de les. Zo blijven plekken vrij voor anderen.', 'classes'],
    ['Hebben jullie open gym?', 'Ja. Op vaste uren kun je vrij trainen aan je skills, kracht of conditie. De tijden staan in de app.', 'classes'],
    ['Wat neem ik mee naar de les?', 'Sportkleding, schone binnenschoenen en een waterfles. Wij zorgen voor de rest.', 'getting-started', 'Wat moet ik meenemen naar de les?'],
    ['Wat zijn de openingstijden?', 'Doordeweeks zijn we open van 07:00 tot 21:30. In het weekend vanaf 08:30 of 09:00 tot begin van de middag. Het exacte rooster staat in de app.', 'location'],
    ['Zijn er douches, lockers en kleedkamers?', 'Ja. Er zijn douches en kleedkamers, en kluisjes voor je spullen.', 'facilities'],
    ['Hoe kan ik betalen?', 'Online via iDEAL, kaart of SEPA. Bedrijven kunnen een factuur krijgen.', 'membership'],
    ['Waar vind ik jullie?', 'Op de Steenovenweg 1-A in Utrecht, direct naast Douwe Egberts. Zoek de paarse deur.', 'location'],
    ['Kan ik parkeren bij VI?', 'Ja, voor de deur. Van maandag tot en met vrijdag is parkeren betaald tussen 6:00 en 11:00; daarbuiten en in het weekend is het gratis.', 'location', 'Kan ik bij jullie met de auto parkeren?'],
  ]
  const faqIds: string[] = []
  for (const [question, answer, category, oldQuestion] of faqs) {
    const existing = await idOf('*[_type == "faq" && language == "nl" && question in [$q, $old]]', {q: question, old: oldQuestion ?? question})
    if (existing) {
      await client.patch(existing).set({question, answer: [block(answer)], category}).commit()
      faqIds.push(existing)
    } else {
      faqIds.push((await client.create({_type: 'faq', language: 'nl', question, answer: [block(answer)], category}))._id)
    }
  }
  console.log('faqs', faqIds.length)

  // Lessen overview page, so "Bekijk alle lessen" and the breadcrumb have a target.
  let lessenId = await idOf('*[_type == "page" && language == "nl" && slug.current == "lessen"]')
  if (!lessenId) {
    lessenId = (
      await client.create({
        _type: 'page',
        language: 'nl',
        title: 'Lessen',
        slug: {_type: 'slug', current: 'lessen'},
        pageType: 'collection',
        summary: 'Alle lessen bij VI Utrecht: CrossFit, Hyrox, Olympisch gewichtheffen, krachttraining, Open Gym en personal training. Voor elk niveau, met een coach.',
        sections: [{_key: k(), _type: 'disciplinesSection', heading: {eyebrow: 'Lessen', text: 'Van beginner tot', emphasis: 'doorgewinterde pro.'}}],
      })
    )._id
    console.log('created page lessen')
  }
  const membershipsPage = await idOf('*[_type == "page" && language == "nl" && slug.current == "lidmaatschappen"]')

  await client
    .patch('settings')
    .set({facilities: [i18nValue('Text', 'nl', 'Kleedkamers, douches, kluisjes en parkeren voor de deur.'), i18nValue('Text', 'en', 'Changing rooms, showers, lockers and parking at the door.')]})
    .commit()

  await client.createOrReplace({
    _id: 'navigation-nl',
    _type: 'navigation',
    language: 'nl',
    announcement: 'Je eerste week is gratis — 3 proeflessen',
    header: [internal('Lessen', lessenId), ...(membershipsPage ? [internal('Lidmaatschappen', membershipsPage)] : [])],
    headerCta: trial('Boek gratis week'),
    footerText: 'CrossFit & Hyrox gym in Utrecht. Lessen met coach voor elk niveau.',
    footerBadges: ['Officiële HYROX Gym', 'CrossFit Affiliate'],
    footerColumns: [
      {
        _key: k(),
        _type: 'footerColumn',
        title: 'Lessen',
        links: disciplines.map((d) => internal(d.title ?? 'Olympisch gewichtheffen', disciplineIds[d.key])),
      },
      {_key: k(), _type: 'footerColumn', title: 'VI', links: membershipsPage ? [internal('Lidmaatschappen', membershipsPage)] : []},
    ],
    slogan: {text: 'We gather strength', emphasis: 'as we go'},
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
        eyebrow: 'Je eerste week is gratis · 3 proeflessen',
        heading: {text: 'CrossFit & Hyrox gym', emphasis: 'in Utrecht.'},
        intro: 'Lessen met coach voor elk niveau, van je eerste workout tot je eerste race. Je eerste week is gratis.',
        image: hero,
        primaryCta: trial('Boek je gratis proefweek'),
        trustItems: [
          {_key: k(), _type: 'keyFact', label: 'HYROX Gym', value: 'Officiële'},
          {_key: k(), _type: 'keyFact', label: 'Affiliate', value: 'CrossFit'},
        ],
        showRating: true,
      },
      {_key: k(), _type: 'marqueeSection'},
      {
        _key: k(),
        _type: 'stepsSection',
        heading: {eyebrow: 'Je eerste week', text: 'Nooit eerder een barbell getild?', emphasis: 'Perfect.'},
        intro: 'Elke les heeft een coach en wordt aangepast aan jouw niveau. Boek drie gratis lessen, train mee met de groep en beslis daarna pas.',
        cta: trial('Boek je gratis proefweek'),
        steps: [
          {_key: k(), _type: 'step', title: 'Boek je gratis week', description: 'Kies drie lessen binnen zeven dagen. CrossFit, Hyrox, Krachttraining: wat jij wilt.'},
          {_key: k(), _type: 'step', title: 'Train met een coach', description: 'Een coach legt elke beweging uit en past de workout aan jou aan. Geen ervaring nodig.'},
          {_key: k(), _type: 'step', title: 'Kies je abonnement', description: 'Bevalt het? Kies een lidmaatschap dat bij je week past. Niet? Ook prima.'},
        ],
      },
      {
        _key: k(),
        _type: 'disciplinesSection',
        heading: {eyebrow: 'Lessen', text: 'Van beginner tot', emphasis: 'doorgewinterde pro.'},
        cta: internal('Bekijk alle lessen', lessenId),
      },
      {
        _key: k(),
        _type: 'pricingSection',
        heading: {eyebrow: 'Lidmaatschappen', text: 'Flexibel trainen.', emphasis: 'Geen gedoe.'},
        intro: '1 credit = 1 les. Elk abonnement geeft toegang tot alle lessen, Open Gym en Open Platform. Pauzeren, upgraden of opzeggen: zie de FAQ.',
        footnote: 'Nog twijfels? Je eerste week is gratis.',
        cta: trial('Boek gratis week'),
      },
      {
        _key: k(),
        _type: 'faqSection',
        heading: {eyebrow: 'Goed om te weten', text: 'Alles wat je', emphasis: 'moet weten.'},
        faqs: faqIds.map(ref),
        showContactInfo: true,
        image: gym,
        cta: {_type: 'link', label: 'Neem contact op', linkType: 'external', url: 'mailto:info@viutrecht.nl'},
      },
      {
        _key: k(),
        _type: 'ctaSection',
        heading: {text: 'Je eerste week', emphasis: 'trakteren wij.'},
        intro: 'Drie gratis lessen in zeven dagen. Leer de coaches kennen, train met de crew en beslis daarna.',
        cta: trial('Boek je gratis proefweek'),
        note: '3 lessen · 7 dagen · alle niveaus',
      },
    ],
  })
  console.log('updated homePage-nl and navigation-nl')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
