// Five placeholder news articles (NL) so the news pages have body while the real texts are
// written. Kept general on purpose: no invented members, quotes, numbers or authors. Every
// article is tagged "Voorbeeld" so they are easy to find and replace. Safe to run again (fixed
// ids). Run with:
//   npx sanity exec scripts/news-dummy.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

let n = 0
const key = () => `dummy${(n++).toString(36).padStart(4, '0')}`
const span = (text: string) => ({_key: key(), _type: 'span', marks: [], text})
const p = (text: string) => ({_key: key(), _type: 'block', style: 'normal', markDefs: [], children: [span(text)]})
const h2 = (text: string) => ({_key: key(), _type: 'block', style: 'h2', markDefs: [], children: [span(text)]})
const bullets = (items: string[]) =>
  items.map((text) => ({_key: key(), _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(text)]}))
const image = (asset: string, alt: string) => ({_key: key(), _type: 'imageWithAlt', asset: {_type: 'reference', _ref: asset}, alt})
const quote = (text: string, attribution: string) => ({_key: key(), _type: 'pullQuote', quote: text, attribution})
const stats = (items: [string, string][]) => ({_key: key(), _type: 'stats', items: items.map(([value, label]) => ({_key: key(), _type: 'stat', value, label}))})
const pair = (a: [string, string], b: [string, string]) => ({_key: key(), _type: 'imagePair', images: [image(...a), image(...b)]})
const cta = (heading: string, text: string, link: object) => ({_key: key(), _type: 'inlineCta', heading, text, link})
const internal = (label: string, ref: string, emoji: string) => ({_type: 'link', label, linkType: 'internal', internal: {_type: 'reference', _ref: ref}, emoji})
const trial = {_type: 'link', label: 'Boek je gratis proefweek', linkType: 'trial', emoji: '🎁'}

const IMG = {
  hero: 'image-e65397de64e3b5ad548a2b6536295a4537a334ac-2576x1717-jpg',
  barbell: 'image-830040bd38e6c518160506deaa6bb608fdb3b754-6653x4435-jpg',
  pushUp: 'image-bd3e109925e6c20c91a8c56a1c43bc3df85d7b08-5107x3405-jpg',
  crossfit: 'image-5bce30d27b91ae2208b27d936d6cf622a4eedf54-617x556-jpg',
  coaching: 'image-01265e965c4195852d45a83e630b33aba61abd06-617x556-jpg',
  strength: 'image-23d2116bfc02dc7e399da59cd42fb1c0d4e64d5d-617x556-jpg',
  oly: 'image-9a3dc2d1b564ef954011d16ee630701036c85262-617x556-jpg',
}
const DOC = {hyrox: 'MkFbgx2d3FIIITtLGVM30J', weightlifting: 'GPqPjmhHkD02bVdiKM6q4S', pricing: 'GPqPjmhHkD02bVdiKM6qBQ', crossfit: 'VCSQoNjbuXIZTOFTM91pPB'}

const posts = [
  {
    slug: 'tips-eerste-hyrox',
    postType: 'training',
    publishedAt: '2026-10-15T09:00:00Z',
    title: '5 tips voor je eerste Hyrox',
    titleEmphasis: 'zonder op te branden.',
    summary: 'Rennen, sleds en wall balls: zo bereid je je voor op je eerste race, en kom je met een glimlach over de finish.',
    heroImage: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: IMG.hero}, alt: 'Atleet springt over een barbell in de gym van VI Utrecht'},
    heroCaption: 'Foto: VI Utrecht',
    tags: ['Voorbeeld', 'Hyrox', 'Wedstrijden'],
    disciplines: ['hyrox'],
    body: [
      p('Je eerste Hyrox is spannend. Het goede nieuws: je hoeft geen marathonloper of powerlifter te zijn. Met een slim plan kom je er prima doorheen. Vijf tips om mee te beginnen.'),
      h2('Ken het format'),
      p('Een Hyrox-race is acht keer een kilometer rennen, telkens gevolgd door een functionele workout. Het format is overal ter wereld hetzelfde, dus je weet precies waar je voor traint.'),
      stats([['8', 'km hardlopen'], ['8', 'stations'], ['100', 'wall balls']]),
      h2('Train je rennen als je moe bent'),
      p('Het lastige van Hyrox is niet de kilometer zelf, maar rennen met benen die net een sled hebben geduwd. Oefen daarom runs direct na kracht- of conditiewerk, zodat je lichaam went aan dat gevoel.'),
      h2('Oefen elk station'),
      p('SkiErg, sled push en pull, burpee broad jumps, roeien, farmers carry, sandbag lunges en wall balls. Wie de bewegingen kent, verspilt op racedag geen energie aan techniek.'),
      quote('Ga niet te hard van start. De eerste kilometer voelt makkelijk, het laatste station niet.', 'Coach-tip'),
      h2('Pacing is alles'),
      p('Kies een tempo dat je acht keer vol kunt houden. Wie de eerste runs te snel loopt, betaalt dat terug bij de wall balls.'),
      h2('Rust en herstel'),
      p('Plan de week voor je race wat rustiger. Slaap goed, eet zoals je gewend bent en probeer op racedag niets nieuws: geen nieuwe schoenen, geen nieuwe gel.'),
      cta('Klaar voor je eerste Hyrox?', 'Train op het wedstrijdformat in onze Hyrox-lessen.', internal('Bekijk de Hyrox-les', DOC.hyrox, '🏃')),
    ],
  },
  {
    slug: 'eten-rond-je-training',
    postType: 'nutrition',
    publishedAt: '2026-10-08T09:00:00Z',
    title: 'Eten rond je training',
    titleEmphasis: 'zonder dieet.',
    summary: 'Geen dieet, wel een paar vuistregels die je energie geven voor elke workout en helpen bij je herstel.',
    heroImage: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: IMG.barbell}, alt: 'Atleet met een barbell op de schouders in de gym van VI Utrecht'},
    tags: ['Voorbeeld', 'Voeding', 'Herstel'],
    body: [
      p('Wat je eet, merk je in je training. Je hoeft niet alles af te wegen, maar met een paar simpele gewoontes train je met meer energie en herstel je sneller.'),
      h2('Voor je training'),
      p('Eet één tot drie uur van tevoren iets met koolhydraten en een beetje eiwit, zoals havermout met yoghurt of een boterham met ei. Train je vroeg in de ochtend, dan is een banaan vaak genoeg.'),
      h2('Na je training'),
      p('Na een zware sessie helpen eiwitten je spieren herstellen en vullen koolhydraten je energie weer aan. Een gewone maaltijd binnen een paar uur werkt prima.'),
      ...bullets(['Kwark of yoghurt met fruit', 'Rijst of aardappelen met kip, vis of bonen', 'Een volkoren wrap met ei en groente']),
      h2('Vergeet niet te drinken'),
      p('Begin je training goed gehydrateerd en neem een waterfles mee. Bij lange of warme sessies zweet je meer vocht uit dan je denkt.'),
      h2('Ritme boven perfectie'),
      p('Regelmaat werkt beter dan een streng schema. Dit zijn algemene vuistregels, geen persoonlijk voedingsadvies. Heb je specifieke doelen of klachten, ga dan langs bij een diëtist.'),
    ],
  },
  {
    slug: 'alles-uit-je-proefweek',
    postType: 'news',
    publishedAt: '2026-10-01T09:00:00Z',
    title: 'Zo haal je alles uit je proefweek',
    titleEmphasis: 'drie lessen, zeven dagen.',
    summary: 'Je eerste week bij VI is gratis. Zo kies je je lessen, weet je wat je meeneemt en beslis je daarna met een gerust hart.',
    heroImage: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: IMG.pushUp}, alt: 'Atleet doet een push-up naast een barbell in de gym van VI Utrecht'},
    tags: ['Voorbeeld', 'Starten'],
    body: [
      p('In je eerste week train je drie keer gratis mee. Genoeg om de coaches, de lessen en de sfeer te leren kennen. Zo haal je er het meeste uit.'),
      h2('Kies drie verschillende lessen'),
      p('Probeer bijvoorbeeld CrossFit, Hyrox en krachttraining. Zo merk je snel wat bij je past. Je boekt alles in de Sportbit-app.'),
      pair([IMG.crossfit, 'Groepsles CrossFit bij VI Utrecht'], [IMG.coaching, 'Een coach van VI Utrecht begeleidt een lid op de roeimachine']),
      h2('Wat neem je mee?'),
      ...bullets(['Sportkleding', 'Schone binnenschoenen', 'Een waterfles']),
      h2('Vertel je coach wat je wilt'),
      p('Nieuw, net terug na een blessure of juist op zoek naar een uitdaging? Zeg het aan het begin van de les. Elke workout wordt aangepast aan jouw niveau.'),
      h2('En daarna?'),
      p('Beviel het? Kies een lidmaatschap dat bij je week past. Niet? Ook prima.'),
      cta('Begin met je gratis proefweek', 'Drie lessen in zeven dagen, met een coach bij elke les.', trial),
    ],
  },
  {
    slug: 'wat-is-een-wod',
    postType: 'training',
    publishedAt: '2026-09-24T09:00:00Z',
    title: 'Wat is een WOD?',
    titleEmphasis: 'De CrossFit-woorden uitgelegd.',
    summary: 'WOD, AMRAP, EMOM, Rx: op het whiteboard staan veel afkortingen. Dit betekenen ze.',
    heroImage: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: IMG.hero}, alt: 'Atleet springt over een barbell in de gym van VI Utrecht'},
    tags: ['Voorbeeld', 'CrossFit', 'Beginners'],
    disciplines: ['crossfit'],
    body: [
      p('Wie voor het eerst een CrossFit-les volgt, kijkt vaak even verbaasd naar het whiteboard. Geen zorgen: met deze woorden kom je een heel eind.'),
      h2('WOD'),
      p('Workout Of the Day: de workout van vandaag. Elke dag een andere, zodat je lichaam scherp blijft.'),
      h2('AMRAP en EMOM'),
      p('Bij een AMRAP (As Many Rounds As Possible) doe je zoveel mogelijk rondes binnen een vaste tijd. Bij een EMOM (Every Minute On the Minute) begin je elke minuut aan een nieuwe set, en is de rest van de minuut je pauze.'),
      h2('For time'),
      p('Een vaste hoeveelheid werk, zo snel als je kunt. Je tijd is je score.'),
      h2('Rx en scaled'),
      p('Rx betekent: precies zoals voorgeschreven, met het aangegeven gewicht en de aangegeven bewegingen. Scaled is een aangepaste versie. Iedereen schaalt weleens, en je coach helpt je kiezen.'),
      cta('Zelf een WOD proberen?', 'In elke CrossFit-les legt je coach de workout uit.', internal('Bekijk de CrossFit-les', DOC.crossfit, '🤸')),
    ],
  },
  {
    slug: 'waarom-je-snatch-vastloopt',
    postType: 'training',
    publishedAt: '2026-09-17T09:00:00Z',
    title: 'Waarom je snatch vastloopt',
    titleEmphasis: 'en hoe je het oplost.',
    summary: 'De snatch is de meest technische lift die er is. Drie veelgemaakte fouten, en wat je eraan kunt doen.',
    heroImage: {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: IMG.barbell}, alt: 'Atleet met een barbell op de schouders in de gym van VI Utrecht'},
    tags: ['Voorbeeld', 'Gewichtheffen', 'Techniek'],
    disciplines: ['weightlifting'],
    body: [
      p('In één beweging de barbell van de grond tot boven je hoofd: de snatch vraagt kracht, snelheid en lenigheid tegelijk. Loopt je snatch vast, dan zit het vaak in een van deze drie dingen.'),
      h2('Te vroeg trekken met je armen'),
      p('Je armen zijn touwen, geen hijskraan. Laat de kracht uit je benen en heupen komen en houd je armen lang tot je volledig hebt gestrekt.'),
      h2('Niet volledig strekken'),
      p('Wie de heupen niet helemaal doorstrekt, verliest snelheid. Duw door de vloer tot je enkels, knieën en heupen gestrekt zijn, en pas dan ga je onder de stang.'),
      quote('Eerst techniek, dan de kilo’s.', 'Coach-tip'),
      h2('Niet onder de stang komen'),
      p('Veel lifters trekken de stang hoog en wachten tot hij omlaag komt. Snel onder de stang zakken is de helft van de lift. Oefen dat met een lege stang of een PVC-stok.'),
      pair([IMG.oly, 'Gewichtheffen bij VI Utrecht'], [IMG.strength, 'Krachttraining met een barbell bij VI Utrecht']),
      cta('Werken aan je snatch?', 'In de lessen gewichtheffen kijkt een coach naar elke herhaling.', internal('Bekijk gewichtheffen', DOC.weightlifting, '🏋️')),
    ],
  },
]

async function main() {
  const tx = client.transaction()
  // The articles differ in which optional fields they set, so they are typed loosely here.
  for (const {slug, ...post} of posts as {slug: string; [field: string]: unknown}[]) {
    tx.createOrReplace({_id: `post-${slug}-nl`, _type: 'post', language: 'nl', slug: {_type: 'slug', current: slug}, ...post})
  }
  await tx.commit()
  console.log('posts:', posts.map((p) => p.slug))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
