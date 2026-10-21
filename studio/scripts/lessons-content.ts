// Fills all nine NL lesson pages for the lesson design (Figma node 19:473).
// Copy comes from the current www.viutrecht.nl lesson pages; the Olympic weightlifting page
// follows the design copy. Run with:
//   npx sanity exec scripts/lessons-content.ts --with-user-token -- <asset dir>
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
const fact = (label: string, value: string) => ({_key: k(), _type: 'keyFact', label, value})
const item = (title: string, description?: string) => ({_key: k(), _type: 'essential', title, ...(description && {description})})
const i18n = (nl: string, en: string) => [
  {_key: k(), _type: 'internationalizedArrayStringValue', language: 'nl', value: nl},
  {_key: k(), _type: 'internationalizedArrayStringValue', language: 'en', value: en},
]

async function image(file: string, alt: string) {
  const asset = await client.assets.upload('image', createReadStream(join(assetDir!, file)), {filename: basename(file)})
  return {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: asset._id}, alt}
}

async function upsertFaq(question: string, answer: string, category: string) {
  const existing = await client.fetch<string | null>('*[_type == "faq" && language == "nl" && question == $q][0]._id', {q: question})
  if (existing) return existing
  return (await client.create({_type: 'faq', language: 'nl', question, answer: [block(answer)], category}))._id
}

const COACHES: [string, string, string, string[]][] = [
  ['Lilian van Wagensveld', 'Founder & Coach', 'Founder & Coach', ['crossfit']],
  ['Marloes Soetevent', 'Head Coach', 'Head Coach', ['crossfit']],
  ['Karien Timmerman', 'Coach gewichtheffen', 'Weightlifting Coach', ['weightlifting']],
  ['Phira Otten', 'Coach olympisch gewichtheffen', 'Olympic Weightlifting Coach', ['weightlifting']],
  ['Alejandro Ormanza', 'Coach CrossFit & gewichtheffen', 'CrossFit & Weightlifting Coach', ['crossfit', 'weightlifting']],
  ['Namki Song', 'Coach CrossFit & Hyrox', 'CrossFit & Hyrox Coach', ['crossfit', 'hyrox']],
  ['Octavio Curiel', 'Coach CrossFit & Hyrox', 'CrossFit & Hyrox Coach', ['crossfit', 'hyrox']],
  ['Amber Nolting', 'Coach CrossFit & Hyrox', 'CrossFit & Hyrox Coach', ['crossfit', 'hyrox']],
  ['Ilrish Kensenhuis', 'Coach kracht & Hyrox', 'Strength & Hyrox Coach', ['strength', 'hyrox']],
  ['Štěpán Musial', 'Coach kracht & Hyrox', 'Strength & Hyrox Coach', ['strength', 'hyrox']],
  ['Nicole Musial', 'Coach Hyrox', 'Hyrox Coach', ['hyrox']],
]

const WHAT_TO_BRING = ['Sportkleding', 'Schone binnenschoenen', 'Een waterfles']
const COACHED = fact('Coaching', 'Altijd')

async function main() {
  // Coaches as listed on the current "Over ons" page (names and roles only).
  for (const [i, [name, roleNl, roleEn, specialties]] of COACHES.entries()) {
    const existing = await client.fetch<string | null>('*[_type == "coach" && name == $name][0]._id', {name})
    if (!existing) await client.create({_type: 'coach', name, role: i18n(roleNl, roleEn), specialties, orderRank: i + 1})
  }

  // Shared FAQs, grounded in the homepage copy and the current FAQ.
  const credits = await upsertFaq('Hoeveel credits kost een les?', 'Eén. Elke les kost 1 credit; je abonnement bepaalt hoeveel credits je per maand hebt.', 'membership')
  const booking = await client.fetch<string>('*[_type == "faq" && language == "nl" && question == "Hoe boek ik een les?"][0]._id')
  const bring = await client.fetch<string>('*[_type == "faq" && language == "nl" && question == "Wat neem ik mee naar de les?"][0]._id')

  const [olyHero, olyBanner] = await Promise.all([
    image('oly-hero.png', 'Atleet in de squat-positie van een snatch bij VI Utrecht'),
    image('oly-banner.png', 'Atleet houdt de barbell boven het hoofd na een jerk'),
  ])

  const lessons = [
    {
      key: 'crossfit',
      emphasis: 'Meer dan een workout: een lifestyle.',
      summary:
        'CrossFit bij VI Utrecht combineert olympic lifting, cardio en gymnastics in workouts die elke dag anders zijn. Elke training wordt geschaald naar jouw niveau, van absolute beginner tot ervaren atleet.',
      seoTitle: 'CrossFit in Utrecht voor elk niveau | VI Utrecht',
      focusKeyword: 'crossfit utrecht',
      level: {from: 'beginner', to: 'pro'},
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'De sport', text: 'Elke dag anders.', emphasis: 'Altijd op jouw niveau.'},
        intro: 'Geen enkele training is hetzelfde, en dat is precies de bedoeling. Die variatie houdt je lichaam scherp en je motivatie hoog.',
        items: [
          item('Olympic lifting', 'Snatch en clean & jerk voor explosieve kracht.'),
          item('Cardio', 'Werk aan je uithoudingsvermogen en conditie.'),
          item('Gymnastics', 'Controle over je eigen lichaamsgewicht.'),
        ],
      },
      benefits: {
        heading: {eyebrow: 'Waarom CrossFit', text: 'Voor iedereen,', emphasis: 'hoe fit je ook start.'},
        items: ['Functionele kracht voor het dagelijks leven', 'Je conditie en uithoudingsvermogen verbeteren', 'Soepeler bewegen en blessures voorkomen', 'Trainen met een community die je motiveert'],
      },
      promise: {
        label: 'Niet zomaar een gym',
        quote: 'Onze coaches staan elke sessie naast je: voor een scherpe techniek, maximale veiligheid en de motivatie voor die extra rep.',
      },
      faqs: [
        ['Is CrossFit geschikt voor beginners?', 'Ja. CrossFit is er voor iedereen, van absolute beginners tot ervaren atleten. We schalen elke training naar jouw niveau, zodat je op je eigen tempo vooruitgaat.', 'classes'],
      ],
      related: ['advanced-crossfit', 'weightlifting', 'hyrox'],
    },
    {
      key: 'weightlifting',
      emphasis: 'De kunst van kracht, snelheid en precisie.',
      summary:
        'Olympisch gewichtheffen bij VI Utrecht draait om de Snatch en de Clean & Jerk, met een sterke focus op techniek, controle en explosieve kracht. Voor wie voor het eerst een barbell aanraakt én voor wie traint voor een wedstrijd.',
      seoTitle: 'Olympisch gewichtheffen in Utrecht | VI Utrecht',
      level: {from: 'beginner', to: 'pro'},
      durationMinutes: 60,
      maxGroupSize: 10,
      extraFacts: [COACHED],
      heroImage: olyHero,
      essentials: {
        heading: {eyebrow: 'De sport', text: 'Twee lifts.', emphasis: 'Eén complete atleet.'},
        intro: 'Deze lifts vragen een unieke mix van kracht, lenigheid, coördinatie en snelheid. Daarmee is gewichtheffen een van de meest complete vormen van atletisch vermogen.',
        image: olyBanner,
        items: [
          item('The Snatch', 'De barbell in één krachtige beweging van de grond tot boven je hoofd.'),
          item('The Clean & Jerk', 'De barbell naar je schouders (de clean) en daarna boven je hoofd (de jerk).'),
        ],
      },
      benefits: {
        heading: {eyebrow: 'Waarom gewichtheffen', text: 'Niet alleen voor atleten.', emphasis: 'Voor iedereen die wil…'},
        items: [
          'Explosieve kracht en snelheid verbeteren',
          'Mobiliteit, balans en lichaamscontrole vergroten',
          'De juiste barbelltechniek leren in een veilige, gestructureerde omgeving',
          'Mentale focus en discipline ontwikkelen',
          'Beter presteren in CrossFit, sport en het dagelijks leven',
        ],
      },
      lessonOutline: {
        heading: {eyebrow: 'Je eerste les', text: 'Dit gebeurt er in', emphasis: '60 minuten.'},
        blocks: [
          {_key: k(), _type: 'lessonBlock', title: 'Warming-up & mobiliteit', minutes: 10, description: 'Open je heupen, schouders en enkels zodat je goede posities haalt.'},
          {_key: k(), _type: 'lessonBlock', title: 'Techniek', minutes: 20, description: 'We knippen de lift op in delen, met een PVC-stok of lege barbell. De coach kijkt naar elke herhaling.'},
          {_key: k(), _type: 'lessonBlock', title: 'Tillen', minutes: 20, description: 'Bouw het gewicht op in je eigen tempo. Kwaliteit boven kilo’s.'},
          {_key: k(), _type: 'lessonBlock', title: 'Cool-down', minutes: 10, description: 'Rek, kom tot rust en noteer wat je tilde.'},
        ],
        whatToBring: ['Comfortabele sportkleding', 'Platte schoenen (liftschoenen mag)', 'Een waterfles', 'Nul ervaring. Echt.'],
      },
      promise: {
        label: 'Lift with purpose',
        quote: 'Eerst techniek. Je hoeft geen expert te zijn, kom gewoon klaar om te leren, te tillen en te groeien.',
      },
      faqHeading: {eyebrow: 'Vragen', text: 'Voor je', emphasis: 'eerste lift.'},
      faqs: [
        ['Heb ik ervaring nodig?', 'Nee. De lessen worden gegeven door ervaren trainers die eerst op techniek focussen, zodat je veilig, efficiënt en met vertrouwen tilt. Of je nu jaagt op een nieuw PR of gewoon beter wilt leren tillen.', 'classes'],
      ],
      ctaText: 'Probeer deze week een les gewichtheffen. Coach, barbell en krijt regelen wij. Jij neemt de nieuwsgierigheid mee.',
      related: ['strength', 'crossfit', 'hyrox'],
    },
    {
      key: 'hyrox',
      emphasis: 'De ultieme fitnessrace.',
      summary:
        'HYROX combineert hardlopen met functionele training: acht keer 1 km rennen, telkens gevolgd door een workout. Bij VI Utrecht train je op het wedstrijdformat, of je nu voor je eerste finish gaat of gewoon fitter wilt worden.',
      seoTitle: 'Hyrox training in Utrecht | VI Utrecht',
      focusKeyword: 'hyrox training utrecht',
      level: {from: 'beginner', to: 'pro'},
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'Het format', text: '8 × 1 km.', emphasis: 'Plus 8 workouts.'},
        intro: 'Het format is wereldwijd exact hetzelfde. Daardoor heb je altijd een duidelijk doel en zijn je resultaten meetbaar.',
        items: [item('1 km hardlopen', 'Elke ronde begint met een kilometer rennen.'), item('1 functionele workout', 'Daarna een workout, zoals sled, roeien of wall balls. En dat acht keer.')],
      },
      benefits: {
        heading: {eyebrow: 'Waarom Hyrox', text: 'Voor iedereen', emphasis: 'die bereid is te werken.'},
        items: ['Je conditie en uithoudingsvermogen maximaliseren', 'Full-body kracht opbouwen', 'Fitheid die je ook buiten de gym sterker maakt', 'Doorzettingsvermogen en focus versterken'],
      },
      promise: {
        label: 'Train met een missie',
        quote: 'Deskundige coaching, gestructureerde programmering en een sterke teamspirit: zo sta je met een voorsprong aan de start.',
      },
      faqs: [
        ['Moet ik meedoen aan een HYROX-race?', 'Nee. De trainingen zijn afgestemd op het wedstrijdformat, maar je kunt ook gewoon meetrainen voor je conditie.', 'classes'],
      ],
      related: ['crossfit', 'strength', 'open-gym'],
    },
    {
      key: 'strength',
      emphasis: 'De basis van elke vorm van fitheid.',
      summary:
        'Krachttraining bij VI Utrecht bouwt spierkracht en controle op met barbells, dumbbells, kettlebells en je eigen lichaamsgewicht. Met coaches die letten op techniek, een slim plan en structurele vooruitgang.',
      seoTitle: 'Krachttraining in Utrecht | VI Utrecht',
      focusKeyword: 'krachttraining utrecht',
      level: {from: 'beginner', to: 'pro'},
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'De aanpak', text: 'Slimme weerstand.', emphasis: 'Volledige controle.'},
        intro: 'Of je nu zware gewichten verplaatst of de techniek van een bodyweight-oefening perfectioneert: elke herhaling bouwt aan een sterkere versie van jezelf.',
      },
      benefits: {
        heading: {eyebrow: 'Waarom krachttraining', text: 'Krachttraining', emphasis: 'is voor iedereen.'},
        items: ['Spiermassa opbouwen', 'Sterke, stabiele gewrichten ontwikkelen', 'Je lichaam weerbaarder maken', 'Beter bewegen: houding, balans en coördinatie', 'Zelfvertrouwen door zichtbare vooruitgang'],
      },
      promise: {label: 'Kracht met intentie', quote: 'Geen ego. Geen shortcuts. Gewoon slimme, effectieve training op jouw niveau.'},
      faqs: [['Voor wie is krachttraining?', 'Voor iedereen. Of je nu sterker wilt worden voor CrossFit, een andere sport of je dagelijks leven: we bouwen samen aan een duurzaam fundament.', 'classes']],
      related: ['weightlifting', 'crossfit', 'personal-training'],
    },
    {
      key: 'open-gym',
      emphasis: 'Jouw tijd. Jouw training. Jouw ruimte.',
      summary:
        'Open Gym bij VI Utrecht geeft je toegang tot de hele gym buiten de groepslessen om. Volg je eigen programma, werk aan je skills of train wanneer het in je agenda past. Open Gym is inbegrepen bij alle lidmaatschappen.',
      seoTitle: 'Open Gym in Utrecht: vrij trainen | VI Utrecht',
      focusKeyword: 'open gym utrecht',
      essentials: {
        heading: {eyebrow: 'Voor wie', text: 'De ideale plek', emphasis: 'voor jouw plan.'},
        intro: 'Of je nu solo traint of met je trainingsbuddy: Open Gym biedt de ruimte en de tools om te groeien op jouw manier.',
        items: [
          item('Programma-volgers', 'Atleten die hun eigen schema afwerken.'),
          item('Skill-hunters', 'Leden die extra sessies inplannen om technieken te perfectioneren.'),
          item('Flexibiliteit-zoekers', 'Sporters die buiten de reguliere lestijden willen trainen.'),
          item('Doelgerichte lifters', 'Iedereen die toegang wil tot goede apparatuur in een gefocuste omgeving.'),
        ],
      },
      benefits: {
        heading: {eyebrow: 'Waarom Open Gym', text: 'Train vrij,', emphasis: 'train slim.'},
        items: ['Je eigen plan volgen, op jouw tempo', 'Skills perfectioneren: lifts, gymnastics, mobiliteit', 'Extra meters maken naast de groepslessen', 'Pieken voor CrossFit-, HYROX- of Oly-wedstrijden', 'Ruimte voor herstel en ondersteunend werk'],
      },
      promise: {label: 'Train vrij, train slim', quote: 'Progressie boek je niet alleen tijdens de les; soms zit de winst juist in de herhalingen die je alleen doet.'},
      faqs: [['Is Open Gym inbegrepen bij mijn lidmaatschap?', 'Ja. Open Gym is inbegrepen bij alle lidmaatschappen. De tijden staan in de app.', 'membership']],
      related: ['crossfit', 'strength', 'weightlifting'],
    },
    {
      key: 'personal-training',
      emphasis: 'De meest directe weg naar jouw doelen.',
      summary:
        'Personal training bij VI Utrecht is één-op-één training met een gecertificeerde coach: een plan op maat, op tijden die jou uitkomen. Voor wie veilig wil herstellen, de basis wil leren of zich wil voorbereiden op een wedstrijd.',
      seoTitle: 'Personal training in Utrecht | VI Utrecht',
      focusKeyword: 'personal training utrecht',
      essentials: {
        heading: {eyebrow: 'Voor wie', text: 'Maatwerk,', emphasis: 'voor jouw doel.'},
        intro: 'Jouw lichaam, jouw agenda en jouw doelen staan centraal. Of je nu voor het eerst een gym binnenstapt of je prestaties naar een volgend niveau wilt tillen.',
        items: [
          item('Blessurevrij trainen', 'Veilig herstellen of trainen met beperkingen.'),
          item('Fitheid & gewichtsverlies', 'Gericht werken aan een gezondere versie van jezelf.'),
          item('De basis leren', 'De technieken beheersen voordat je instroomt in de groepslessen.'),
          item('Pieken', 'Specifieke voorbereiding op een evenement of wedstrijd.'),
        ],
      },
      benefits: {
        heading: {eyebrow: 'Waarom personal training', text: 'Een coach', emphasis: 'aan jouw zijde.'},
        items: ['Een plan op maat van jouw doelen', '1-op-1 coaching op techniek en motivatie', 'Trainen wanneer het jou uitkomt', 'Meetbare progressie, en bijsturen waar nodig', 'Focus en vertrouwen in een omgeving waar je je thuis voelt'],
      },
      promise: {label: 'Jouw doelen, jouw coach', quote: 'Wij geloven niet in standaardoplossingen, maar in training die écht bij jou past. Eén sessie per keer.'},
      related: ['strength', 'pregnancy', 'postpartum'],
    },
    {
      key: 'advanced-crossfit',
      title: 'Advanced CrossFit',
      slug: 'advanced-crossfit',
      audienceLabel: 'Gevorderd',
      tagline: 'High-skill gymnastics, zware barbell cycling en wedstrijdtempo.',
      emphasis: 'Knal door naar het volgende niveau.',
      summary:
        'Advanced CrossFit bij VI Utrecht is voor atleten die de basis beheersen en hun skills, intensiteit en prestaties willen opschroeven, met geperiodiseerde programmering en een competitieve groep.',
      seoTitle: 'Advanced CrossFit in Utrecht | VI Utrecht',
      focusKeyword: 'advanced crossfit utrecht',
      level: {from: 'advanced', to: 'pro'},
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'De aanpak', text: 'Technisch. Strategisch.', emphasis: 'Prestatiegericht.'},
        intro: 'Je traint met een crew die net zo gedreven is als jij: een community die je pusht om sneller te bewegen, zwaarder te liften en elke dag beter te presteren.',
      },
      benefits: {
        heading: {eyebrow: 'Waarom advanced CrossFit', text: 'Voor atleten die', emphasis: 'verder willen.'},
        items: ['High-skill gymnastics: muscle-ups, handstand walks, pistols', 'Je olympic lifting verfijnen', 'Elite conditionering voor een grotere engine', 'Trainen op wedstrijdtempo, pacing en strategie', 'Een geperiodiseerd programma'],
      },
      promise: {label: 'Verbeter je skills', quote: 'Onze coaches leiden niet alleen trainingen, ze bouwen atleten. Je hebt de basis gelegd: nu is het tijd voor het volgende niveau.'},
      faqs: [['Voor wie is Advanced CrossFit?', 'Voor atleten die de basis van CrossFit onder de knie hebben en klaar zijn voor echte progressie in skills, kracht en conditie.', 'classes']],
      related: ['crossfit', 'weightlifting', 'open-gym'],
    },
    {
      key: 'pregnancy',
      title: 'Zwangerschap',
      slug: 'zwangerschap',
      audienceLabel: 'Aanstaande moeders',
      tagline: 'Veilig en sterk blijven tijdens je zwangerschap, met aangepaste workouts.',
      emphasis: 'Sterk. Ondersteund. Veilig.',
      summary:
        'Trainen tijdens je zwangerschap bij VI Utrecht: veilige, aangepaste workouts en deskundige coaching in elke fase. Lessen of personal training worden afgestemd op jouw trimester, je fitnessniveau en hoe je je die dag voelt.',
      seoTitle: 'Trainen tijdens je zwangerschap in Utrecht | VI Utrecht',
      focusKeyword: 'zwangerschapstraining utrecht',
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'De aanpak', text: 'Fitness die past', emphasis: 'bij dit hoofdstuk.'},
        intro: 'De focus ligt op veiligheid, functionaliteit en een goed gevoel in je eigen lichaam. Of je nu je fitnessreis voortzet of voor het eerst begint.',
      },
      benefits: {
        heading: {eyebrow: 'Waarom trainen tijdens je zwangerschap', text: 'Sterk blijven,', emphasis: 'voor jou en je baby.'},
        items: ['Kracht en houding behouden', 'Je doorbloeding verbeteren', 'Core en bekkenbodem ondersteunen', 'Meer energie en een betere stemming', 'Je voorbereiden op de bevalling en het herstel', 'Rugpijn en ongemakken verlichten'],
      },
      faqs: [['Hoe wordt de training aangepast aan mijn zwangerschap?', 'We stemmen de lessen of personal training af op jouw trimester, je fitnessniveau en hoe je je die dag voelt, met de focus op veiligheid en een goed gevoel.', 'classes']],
      related: ['postpartum', 'personal-training', 'strength'],
    },
    {
      key: 'postpartum',
      title: 'Postpartum',
      slug: 'postpartum',
      audienceLabel: 'Na je bevalling',
      tagline: 'Stap voor stap je kracht terugbouwen na je bevalling.',
      emphasis: 'Niet terugkaatsen, maar vooruitgaan.',
      summary:
        'Postpartum training bij VI Utrecht helpt je na je bevalling stap voor stap je kracht terug te bouwen, met aandacht voor core- en bekkenbodemherstel, diastase recti en ademhaling. In lessen of personal training, vanaf waar jij nu staat.',
      seoTitle: 'Postpartum training in Utrecht | VI Utrecht',
      focusKeyword: 'postpartum training utrecht',
      extraFacts: [COACHED],
      essentials: {
        heading: {eyebrow: 'De aanpak', text: 'Daar ben je', emphasis: 'weer.'},
        intro: 'Onze workouts richten zich op functie, controle en geleidelijke opbouw, met specifieke aandacht voor diastase recti, je bekkenbodem en een goede ademhaling.',
      },
      benefits: {
        heading: {eyebrow: 'Waarom postpartum training', text: 'Herstel vraagt tijd', emphasis: 'en slimme beweging.'},
        items: ['Core- en bekkenbodemherstel', 'Betere houding en mobiliteit', 'Vertrouwen om weer voluit te trainen', 'Langdurige klachten voorkomen'],
      },
      faqs: [['Wanneer kan ik na mijn bevalling beginnen?', 'Of je nu zes weken of zes maanden geleden bent bevallen: we beginnen waar jij nu staat. Twijfel je, overleg dan eerst met je verloskundige of huisarts.', 'classes']],
      related: ['pregnancy', 'personal-training', 'strength'],
    },
  ]

  const ids: Record<string, string> = {}
  const titles: Record<string, string> = {}
  for (const [i, l] of lessons.entries()) {
    const existing = await client.fetch<string | null>('*[_type == "discipline" && language == "nl" && key == $key][0]._id', {key: l.key})
    if (existing) ids[l.key] = existing
    else {
      ids[l.key] = (
        await client.create({
          _type: 'discipline',
          language: 'nl',
          key: l.key,
          title: l.title,
          slug: {_type: 'slug', current: l.slug},
          audienceLabel: l.audienceLabel,
          tagline: l.tagline,
          bookingType: 'class',
          orderRank: 7 + i - 6,
        })
      )._id
      console.log('created', l.key)
    }
  }

  for (const l of lessons) {
    const doc = await client.getDocument<{title?: string; cardImage?: unknown; heroImage?: unknown}>(ids[l.key])
    titles[l.key] = doc?.title ?? l.title ?? l.key
    const faqIds = [...(await Promise.all((l.faqs ?? []).map(([q, a, c]) => upsertFaq(q, a, c)))), booking, bring, credits]
    await client
      .patch(ids[l.key])
      .set({
        heading: {text: doc?.title, emphasis: l.emphasis},
        summary: l.summary,
        ...(l.focusKeyword && {focusKeyword: l.focusKeyword}),
        seo: {title: l.seoTitle},
        level: l.level,
        durationMinutes: l.durationMinutes,
        maxGroupSize: l.maxGroupSize,
        extraFacts: l.extraFacts ?? [],
        ...(l.heroImage ? {heroImage: l.heroImage} : doc?.cardImage && !doc.heroImage ? {heroImage: doc.cardImage} : {}),
        essentials: l.essentials,
        benefits: l.benefits,
        lessonOutline: l.lessonOutline ?? {whatToBring: WHAT_TO_BRING},
        promise: l.promise,
        faqHeading: l.faqHeading,
        faqs: faqIds.map(ref),
        ctaText: l.ctaText,
        related: l.related.map((key) => ref(ids[key])),
      })
      .commit()
    console.log('filled', l.key)
  }

  // Old URLs of the current site -> new Dutch URLs.
  const redirects: [string, string][] = [
    ['/nl/crossfit', '/lessen/crossfit'],
    ['/nl/hyrox', '/lessen/hyrox'],
    ['/nl/strength', '/lessen/krachttraining'],
    ['/nl/opengym', '/lessen/open-gym'],
    ['/nl/personaltraining', '/lessen/personal-training'],
    ['/nl/advancedcrossfit', '/lessen/advanced-crossfit'],
    ['/nl/pregnancy', '/lessen/zwangerschap'],
    ['/nl/postpartum', '/lessen/postpartum'],
    ['/nl/classes', '/lessen'],
    ['/nl/memberships', '/lidmaatschappen'],
  ]
  for (const [source, destination] of redirects) {
    const exists = await client.fetch<number>('count(*[_type == "redirect" && source == $source])', {source})
    if (!exists) await client.create({_type: 'redirect', source, destination, permanent: true, isEnabled: true})
  }

  // Header: the lessons dropdown replaces the plain "Lessen" link.
  const lessen = await client.fetch<string>('*[_type == "page" && language == "nl" && slug.current == "lessen"][0]._id')
  const nav = await client.getDocument<{header?: {internal?: {_ref?: string}}[]; footerColumns?: {title?: string}[]}>('navigation-nl')
  await client
    .patch('navigation-nl')
    .set({
      classesMenu: {label: 'Lessen', overview: {_type: 'reference', _ref: lessen}},
      header: (nav?.header ?? []).filter((link) => link.internal?._ref !== lessen),
      footerColumns: (nav?.footerColumns ?? []).map((column) =>
        column.title === 'Lessen'
          ? {...column, links: lessons.map((l) => ({_key: k(), _type: 'link', label: titles[l.key], linkType: 'internal', internal: {_type: 'reference', _ref: ids[l.key]}}))}
          : column,
      ),
    })
    .commit()
  console.log('navigation updated')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
