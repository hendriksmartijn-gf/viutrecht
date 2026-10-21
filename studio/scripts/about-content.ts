// Builds the NL "Over ons" page from the design (Figma node 32:2) and adds coach portraits
// from the current www.viutrecht.nl. Run with:
//   npx sanity exec scripts/about-content.ts --with-user-token -- <asset dir>
import {createReadStream, existsSync} from 'node:fs'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})
const dir = process.argv.at(-1)
if (!dir || dir.endsWith('.ts')) throw new Error('Pass the asset directory as the last argument')

const k = () => Math.random().toString(36).slice(2, 10)
const upload = async (file: string, alt: string) => {
  const asset = await client.assets.upload('image', createReadStream(join(dir!, file)), {filename: file})
  return {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: asset._id}, alt}
}

// Order follows the design: the first four are shown first in the carousel.
const COACHES: [string, string, string][] = [
  ['Lilian van Wagensveld', 'lilian', 'Founder & Coach'],
  ['Octavio Curiel', 'octavio', 'CrossFit & Hyrox Coach'],
  ['Namki Song', 'namki', 'CrossFit & Hyrox Coach'],
  ['Ilrish Kensenhuis', 'ilrish', 'Strength & Hyrox Coach'],
  ['Marloes Soetevent', 'marloes', 'Head Coach'],
  ['Karien Timmerman', 'karien', 'Weightlifting Coach'],
  ['Phira Otten', 'phira', 'Olympic Weightlifting Coach'],
  ['Alejandro Ormanza', 'alejandro', 'CrossFit & Weightlifting Coach'],
  ['Amber Nolting', 'amber', 'CrossFit & Hyrox Coach'],
  ['Nicole Musial', 'nicole', 'Hyrox Coach'],
  ['Štěpán Musial', 'stepan', 'Strength & Hyrox Coach'],
]

async function main() {
  for (const [i, [name, file, role]] of COACHES.entries()) {
    const id = await client.fetch<string | null>('*[_type == "coach" && name == $name][0]._id', {name})
    if (!id) continue
    const ext = ['webp', 'jpg', 'png'].find((e) => existsSync(join(dir!, `${file}.${e}`)))
    const photo = ext ? await upload(`${file}.${ext}`, `${name}, ${role} bij VI Utrecht`) : undefined
    await client
      .patch(id)
      .set({
        orderRank: i + 1,
        role: [
          {_key: k(), _type: 'internationalizedArrayStringValue', language: 'nl', value: role},
          {_key: k(), _type: 'internationalizedArrayStringValue', language: 'en', value: role},
        ],
        ...(photo && {photo}),
      })
      .commit()
    console.log('coach', name, photo ? 'with photo' : 'no photo')
  }

  const banner = await upload('about-banner.png', 'Coach geeft uitleg aan een groep in de gym van VI Utrecht')
  const home = await client.getDocument<{sections?: {_type: string}[]}>('homePage-nl')
  const cta = home?.sections?.find((s) => s._type === 'ctaSection')

  const existing = await client.fetch<string | null>('*[_type == "page" && language == "nl" && slug.current == "over-ons"][0]._id')
  const page = {
    _type: 'page',
    language: 'nl',
    title: 'Over ons',
    slug: {_type: 'slug', current: 'over-ons'},
    pageType: 'about',
    summary:
      'VI Utrecht is een CrossFit- en Hyrox-gym in Utrecht met coaches die je echt kennen, een community die je meetrekt en workouts die je elke keer weer uitdagen.',
    seo: {title: 'Over VI Utrecht: onze gym, missie en coaches'},
    sections: [
      {
        _key: k(),
        _type: 'introSection',
        heading: {text: 'Welkom bij VI,', emphasis: 'jouw nieuwe favoriete gym.'},
        intro: 'Een CrossFit- en Hyrox-gym in Utrecht met coaches die je echt kennen, een community die je meetrekt en workouts die je elke keer weer uitdagen.',
        primaryCta: {_type: 'link', label: 'Boek je gratis proefweek', linkType: 'trial'},
        secondaryCta: {_type: 'link', label: 'Ontmoet de coaches', linkType: 'external', url: '/over-ons#coaches', emoji: '👋'},
        image: banner,
      },
      {
        _key: k(),
        _type: 'storySection',
        heading: {eyebrow: 'Ons verhaal', text: 'Begonnen als grap.', emphasis: 'Nu jouw tweede thuis.'},
        lead: 'Wat begon als een “we moeten onze eigen box openen”-grap tijdens een trainingsvakantie, is inmiddels officieel de groepschat ontgroeid.',
        body: 'Bij oprichter Lilian werd een zaadje geplant dat niet meer weg te denken was: wat als…? Een paar jaar, ontelbare trainingen en flink wat koffie-fueled brainstormsessies later was het zover: VI werd geboren.',
        card: {
          label: 'Waarom VI?',
          showLogo: true,
          title: 'Vires acquirit eundo.',
          subtitle: 'We verzamelen kracht terwijl we gaan.',
          text: 'VI is Latijn voor “kracht”. Je spreekt het uit als “Vy”, niet als “Vie”. Het is waar we voor staan: elke herhaling, elke ademteug en elke druppel zweet maakt je sterker. Fysiek, mentaal én emotioneel.',
        },
      },
      {
        _key: k(),
        _type: 'valuesSection',
        heading: {eyebrow: 'Waar we voor staan', text: 'Bij VI is onze missie simpel:', emphasis: 'we geven je jouw kracht weer terug.'},
        values: [
          ['Kracht is persoonlijk', 'Voor de één een glimmend nieuw PR op de back squat. Voor de ander de mentale reset om de rest van de dag te rocken. Of gewoon even stoom afblazen na werk.'],
          ['Iedereen is welkom', 'Nog nooit een halter aangeraakt of al jaren in de gym. 19 of 91 jaar jong. Fitness is voor iedereen, en wij zijn er om jouw tweede thuis te zijn.'],
          ['Serieus trainen, luchtig blijven', 'Het leven is al serieus genoeg. Verwacht slappe lach tussen de sets, coaches die je echt kennen en workouts die je elke keer uitdagen.'],
          ['Coaches zoals jij', 'Een bonte mix van competitieve atleten en ‘normale’ doeners die precies weten hoe lastig het is om sporten te combineren met werk en gezin.'],
        ].map(([title, description]) => ({_key: k(), _type: 'value', title, description})),
      },
      {_key: k(), _type: 'coachesSection', heading: {eyebrow: 'Het team', text: 'Onze coaches zijn hier', emphasis: 'om je te helpen.'}},
      {
        _key: k(),
        _type: 'statementSection',
        text: 'Dus, of je nu komt om keihard te liften, soepeler te bewegen of om je simpelweg sterker te voelen in je eigen vel:',
        closing: 'Welkom bij VI.',
      },
      ...(cta ? [{...cta, _key: k()}] : []),
    ],
  }
  const pageId = existing ? (await client.createOrReplace({...page, _id: existing}))._id : (await client.create(page))._id
  console.log('page over-ons', pageId)

  // Menu: Over ons after Lidmaatschappen; footer "VI" column too.
  const nav = await client.getDocument<{header?: {internal?: {_ref?: string}}[]; footerColumns?: {title?: string; links?: {internal?: {_ref?: string}}[]}[]}>('navigation-nl')
  const link = {_key: k(), _type: 'link', label: 'Over ons', linkType: 'internal', internal: {_type: 'reference', _ref: pageId}}
  const has = (links?: {internal?: {_ref?: string}}[]) => links?.some((l) => l.internal?._ref === pageId)
  await client
    .patch('navigation-nl')
    .set({
      header: has(nav?.header) ? nav?.header : [...(nav?.header ?? []), link],
      footerColumns: (nav?.footerColumns ?? []).map((c) => (c.title === 'VI' && !has(c.links) ? {...c, links: [...(c.links ?? []), {...link, _key: k()}]} : c)),
    })
    .commit()

  const redirect = await client.fetch<number>('count(*[_type == "redirect" && source == "/nl/aboutus"])')
  if (!redirect) await client.create({_type: 'redirect', source: '/nl/aboutus', destination: '/over-ons', permanent: true, isEnabled: true})
  console.log('navigation and redirect done')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
