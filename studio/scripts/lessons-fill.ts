// Fills the remaining content of the NL lesson pages (lesson outline, approach cards, promise and
// missing photos) as DRAFTS, so everything can be reviewed in the Studio before publishing.
// VI-specific facts come from www.viutrecht.nl; the session structures and health guidance are
// general practice (HYROX.com, CrossFit.com, NHS, KNOV) and should be checked by the coaches.
// Minute splits assume 60-minute classes, like the CrossFit and weightlifting pages.
// Run with:
//   npx sanity exec scripts/lessons-fill.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

let n = 0
const key = () => `fill${(n++).toString(36).padStart(4, '0')}`
const heading = (eyebrow: string, text: string, emphasis: string) => ({_type: 'sectionHeading', eyebrow, text, emphasis})
const block = (title: string, description: string, minutes?: number) => ({_key: key(), _type: 'lessonBlock', title, description, ...(minutes ? {minutes} : {})})
const essential = (title: string, description: string) => ({_key: key(), _type: 'essential', title, description})
const image = (ref: string, alt: string) => ({_type: 'imageWithAlt', asset: {_type: 'reference', _ref: ref}, alt})

const IMG = {
  pushUp: 'image-bd3e109925e6c20c91a8c56a1c43bc3df85d7b08-5107x3405-jpg',
  gym: 'image-c186f792f47235f78b0cd2da054b03b1b9264938-477x636-jpg',
  coaching: 'image-01265e965c4195852d45a83e630b33aba61abd06-617x556-jpg',
}
const firstClass = (minutes: string) => heading('Je eerste les', 'Dit gebeurt er in', minutes)

// Only fields set here change; everything else on the page stays as it is.
const updates: Record<string, Record<string, unknown>> = {
  hyrox: {
    'lessonOutline.heading': firstClass('60 minuten.'),
    'lessonOutline.blocks': [
      block('Warming-up', 'Rustig inlopen en mobiliseren: heupen, enkels en schouders klaar voor rennen en duwen.', 10),
      block('Techniek & stations', 'We oefenen de stations uit de race, zoals sled push, wall balls en burpee broad jumps. Efficiënt bewegen scheelt op racedag minuten.', 15),
      block('Workout', 'Rennen en stations door elkaar, net als in de wedstrijd. Je coach helpt je met pacing en schaalt afstanden en gewichten naar jouw niveau.', 30),
      block('Cooling-down', 'Uitlopen, rekken en je tijden noteren.', 5),
    ],
  },
  krachttraining: {
    'essentials.intro': 'Kracht bouw je niet met willekeurige workouts, maar met een plan. Elke sessie bouwt voort op de vorige, met techniek als fundament.',
    'essentials.items': [
      essential('Techniek eerst', 'Je leert squat, deadlift en press stap voor stap, met een coach die meekijkt.'),
      essential('Progressief opbouwen', 'Het gewicht gaat omhoog als je techniek het toelaat. Zo blijf je vooruitgaan, zonder blessures.'),
      essential('Ondersteunend werk', 'Dumbbells, kettlebells en je eigen lichaamsgewicht maken je zwakke plekken sterk.'),
    ],
    'lessonOutline.heading': firstClass('60 minuten.'),
    'lessonOutline.blocks': [
      block('Warming-up & mobiliteit', 'Je lichaam en gewrichten klaarmaken voor zwaar werk.', 10),
      block('Techniek', 'Opbouwsets met licht gewicht, met aandacht voor houding en uitvoering.', 10),
      block('Krachtblok', 'De hoofdlift van de dag, in sets en herhalingen uit het programma. Noteer je gewichten, dan weet je volgende keer waar je staat.', 30),
      block('Accessoires & cool-down', 'Ondersteunende oefeningen met dumbbells of kettlebells, en daarna rustig afbouwen.', 10),
    ],
  },
  'open-gym': {
    'lessonOutline.heading': heading('Zo werkt het', 'Open Gym in', 'drie stappen.'),
    'lessonOutline.blocks': [
      block('Boek je plek', 'Open Gym heeft vaste uren. Je vindt ze in de Sportbit-app en boekt daar ook je plek.'),
      block('Neem je plan mee', 'Je eigen programma, een skill waar je aan wilt werken of extra conditie. Weet je wat je gaat doen, dan haal je het meeste uit je tijd.'),
      block('Train in je eigen tempo', 'Je gebruikt de hele box en al het materiaal. Laat je plek netjes achter voor de volgende.'),
    ],
  },
  'personal-training': {
    'lessonOutline.heading': heading('Zo werkt het', 'Personal training in', 'vier stappen.'),
    'lessonOutline.blocks': [
      block('Kennismaking', 'We bespreken je doelen, je trainingsachtergrond en eventuele blessures.'),
      block('Plan op maat', 'Je coach maakt een plan dat past bij jouw doel en jouw agenda.'),
      block('Trainen', '1-op-1, op momenten die jou uitkomen. Je coach let op elke herhaling.'),
      block('Bijsturen', 'We houden je voortgang bij en passen het plan aan waar nodig.'),
    ],
  },
  'advanced-crossfit': {
    heroImage: image(IMG.pushUp, 'Atleet doet een push-up naast een barbell in de gym van VI Utrecht'),
    cardImage: image(IMG.pushUp, 'Atleet doet een push-up naast een barbell in de gym van VI Utrecht'),
    'essentials.intro': 'Je beheerst de basis. Nu draait het om de details die het verschil maken.',
    'essentials.items': [
      essential('High-skill gymnastics', 'Muscle-ups, handstand walks en pistols, opgebouwd in progressies.'),
      essential('Barbell cycling', 'Olympic lifts sneller en efficiënter, ook als je moe bent.'),
      essential('Engine & pacing', 'Je energiesystemen trainen en leren wanneer je versnelt en wanneer je doseert.'),
    ],
    'lessonOutline.heading': heading('De les', 'Dit gebeurt er in', '60 minuten.'),
    'lessonOutline.blocks': [
      block('Warming-up', 'Gericht opwarmen voor de skills en lifts van de dag.', 10),
      block('Skill', 'Gymnastics- of liftingprogressies met directe feedback van je coach.', 15),
      block('Kracht', 'Zwaarder werk uit het geperiodiseerde programma.', 10),
      block('Workout', 'Op wedstrijdtempo, met een plan voor je pacing.', 20),
      block('Cooling-down', 'Afbouwen, rekken en je score noteren.', 5),
    ],
  },
  zwangerschap: {
    heroImage: image(IMG.gym, 'De gym van VI Utrecht van bovenaf, met leden die trainen'),
    cardImage: image(IMG.gym, 'De gym van VI Utrecht van bovenaf, met leden die trainen'),
    'essentials.intro': 'Je traint mee in de lessen of 1-op-1, met aanpassingen die meebewegen met je zwangerschap.',
    'essentials.items': [
      essential('Per trimester', 'Oefeningen, intensiteit en houdingen stemmen we af op de fase waarin je zit.'),
      essential('Luisteren naar je lichaam', 'Hoe je je vandaag voelt, bepaalt wat je vandaag doet. Een rustige dag is ook een goede training.'),
      essential('Core en bekkenbodem', 'Ademhaling, houding en een sterke basis, als voorbereiding op de bevalling en het herstel.'),
    ],
    'lessonOutline.heading': heading('Zo train je bij ons', 'Trainen tijdens je', 'zwangerschap.'),
    'lessonOutline.blocks': [
      block('Overleg vooraf', 'Bespreek met je verloskundige of arts dat je wilt (blijven) trainen, en vertel je coach hoe ver je bent.'),
      block('Aangepast meedoen', 'Je krijgt alternatieven voor oefeningen die niet meer prettig of verstandig zijn, zoals springen of lang op je rug liggen.'),
      block('Rustig opbouwen', 'Train je nog niet? Dan begin je licht en bouw je geleidelijk op.'),
      block('Stoppen mag altijd', 'Duizelig, pijn, bloedverlies of iets dat niet goed voelt? Stop en neem contact op met je verloskundige.'),
    ],
    promise: {
      label: 'Sterk door elke fase',
      quote: 'Zwanger zijn betekent niet stoppen, maar slimmer trainen. Wij passen elke oefening aan, jij bepaalt het tempo.',
    },
  },
  postpartum: {
    heroImage: image(IMG.coaching, 'Een coach van VI Utrecht begeleidt een lid op de roeimachine'),
    cardImage: image(IMG.coaching, 'Een coach van VI Utrecht begeleidt een lid op de roeimachine'),
    'essentials.intro': 'Na je bevalling begin je niet waar je gebleven was, maar waar je nu staat. Daar bouwen we samen vanaf.',
    'essentials.items': [
      essential('Ademhaling & bekkenbodem', 'De basis van je herstel: goed ademen en je bekkenbodem weer leren aanspannen en ontspannen.'),
      essential('Core & diastase', 'Gerichte oefeningen voor je buikspieren, met aandacht voor het herstel van diastase recti.'),
      essential('Geleidelijk opbouwen', 'Van rustige kracht naar zwaardere en explosievere oefeningen, pas als je lichaam er klaar voor is.'),
    ],
    'lessonOutline.heading': heading('Zo train je bij ons', 'Terug naar sterk,', 'stap voor stap.'),
    'lessonOutline.blocks': [
      block('Eerst je nacontrole', 'Bespreek met je verloskundige, huisarts of bekkenfysiotherapeut wanneer je weer kunt beginnen. Vaak is dat na de nacontrole rond zes weken.'),
      block('Een plan voor nu', 'Je coach stemt de training af op hoe je bevalling ging en hoe je herstel verloopt.'),
      block('Rustig opbouwen', 'Hardlopen en springen komen later, vaak pas na zo’n twaalf weken en alleen zonder klachten zoals urineverlies of een zwaar gevoel.'),
      block('Samen bijsturen', 'Je houdt contact met je coach en past aan waar nodig.'),
    ],
    promise: {
      label: 'Herstel eerst',
      quote: 'Herstel is geen wedstrijd. We bouwen je kracht terug in het tempo dat jouw lichaam aangeeft.',
    },
  },
}

async function main() {
  const docs = await client.fetch<{_id: string; slug: string}[]>(
    `*[_type == "discipline" && language == "nl" && !(_id in path("drafts.**")) && slug.current in $slugs]{_id, "slug": slug.current}`,
    {slugs: Object.keys(updates)},
  )
  const tx = client.transaction()
  for (const {_id, slug} of docs) {
    const published = await client.getDocument(_id)
    if (!published) continue
    // A draft starts as a copy of the published page, then gets the new content on top.
    const {_rev, _createdAt, _updatedAt, ...content} = published
    tx.createIfNotExists({...content, _id: `drafts.${_id}`, _type: published._type})
    tx.patch(`drafts.${_id}`, (p) => p.setIfMissing({essentials: {}, lessonOutline: {}}).set(updates[slug]))
  }
  await tx.commit()
  console.log('drafts:', docs.map((d) => d.slug))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
