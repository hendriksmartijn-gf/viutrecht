// Meta titles and descriptions for every NL page. Titles: keyword first, at most 60 characters,
// ending in "| VI Utrecht". Descriptions: 120–160 characters: what you get, for whom, and the
// next step. Only facts VI confirmed (60-minute classes, group sizes, first week free, prices).
// The script refuses to write anything outside those lengths. Run with:
//   npx sanity exec scripts/seo-meta.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const meta: Record<string, [title: string, description: string]> = {
  // Pages
  'homePage-nl': [
    'CrossFit & Hyrox gym in Utrecht | VI Utrecht',
    'CrossFit, Hyrox, gewichtheffen en kracht in Utrecht. Lessen van 60 minuten in kleine groepen, altijd met een coach. Je eerste week is gratis.',
  ],
  VCSQoNjbuXIZTOFTM91xO9: [
    'Lessen: CrossFit, Hyrox & kracht in Utrecht | VI Utrecht',
    'Alle lessen bij VI Utrecht: CrossFit, Hyrox, gewichtheffen, kracht, gymnastics en meer. 60 minuten, kleine groepen, altijd een coach. Eerste week gratis.',
  ],
  GPqPjmhHkD02bVdiKM6qBQ: [
    'Lidmaatschappen & prijzen CrossFit Utrecht | VI Utrecht',
    'Train bij VI Utrecht vanaf €99,50 per maand: 9, 14 of 29 lessen, Open Gym inbegrepen. Jaarabonnement 10% korting. Probeer eerst je eerste week gratis.',
  ],
  Fzd3At5unwgj4aCtpQrXDQ: [
    'Over ons: de gym, de coaches en de missie | VI Utrecht',
    'Maak kennis met VI Utrecht: een CrossFit- en Hyrox-gym met coaches die je echt kennen en een community die je meetrekt. Begin met een gratis proefweek.',
  ],
  '0d113392-7be2-4f6b-aa6e-7ca6ffe62e35': [
    'Nieuws, events en trainingstips | VI Utrecht',
    'Events, tips van de coaches, roosterwijzigingen en verhalen uit de box. Lees wat er speelt bij VI Utrecht, de CrossFit- en Hyrox-gym in Utrecht.',
  ],
  // Lessons
  VCSQoNjbuXIZTOFTM91pPB: [
    'CrossFit in Utrecht voor elk niveau | VI Utrecht',
    'CrossFit in Utrecht voor beginners én ervaren atleten. Lessen van 60 minuten, max 10 personen, altijd met een coach. Probeer je eerste week gratis.',
  ],
  MkFbgx2d3FIIITtLGVM30J: [
    'Hyrox training in Utrecht | VI Utrecht',
    'Train voor je eerste Hyrox in Utrecht: runs, sleds en wall balls op het wedstrijdformat. Lessen van 60 minuten, max 8 personen, met coach. Eerste week gratis.',
  ],
  GPqPjmhHkD02bVdiKM6q4S: [
    'Olympisch gewichtheffen in Utrecht | VI Utrecht',
    'Leer de snatch en de clean & jerk bij VI Utrecht. Techniek eerst, voor beginners én wedstrijdlifters. 60 minuten, max 10 personen. Probeer het gratis.',
  ],
  MkFbgx2d3FIIITtLGVM5Fl: [
    'Krachttraining in Utrecht | VI Utrecht',
    'Krachttraining in Utrecht met barbells, dumbbells en kettlebells. Een opbouwend plan, een coach die op je techniek let, max 12 personen. Eerste week gratis.',
  ],
  VCSQoNjbuXIZTOFTM91tT5: [
    'Open Gym in Utrecht: vrij trainen | VI Utrecht',
    'Vrij trainen in de hele box van VI Utrecht: boek een uur in de app en volg je eigen programma. Open Gym is inbegrepen bij elk lidmaatschap.',
  ],
  GPqPjmhHkD02bVdiKM9Cdw: [
    'Personal training in Utrecht | VI Utrecht',
    'Personal training in Utrecht: 1-op-1 met een coach, op tijden die jou uitkomen. Geen intake vooraf, je begint meteen. De prijs stemmen we af op je wensen.',
  ],
  MkFbgx2d3FIIITtLGVPErp: [
    'Advanced CrossFit in Utrecht | VI Utrecht',
    'Advanced CrossFit in Utrecht voor atleten die de basis beheersen: muscle-ups, barbell cycling en pacing. Lessen van 60 minuten met een geperiodiseerd programma.',
  ],
  MkFbgx2d3FIIITtLGVPFPd: [
    'Zwangerschapstraining in Utrecht | VI Utrecht',
    'Veilig en sterk trainen tijdens je zwangerschap, afgestemd op je trimester. Begeleid door Marloes, pre- en postnataal trainster via Girls Gone Strong.',
  ],
  MkFbgx2d3FIIITtLGVPFoz: [
    'Postpartum training in Utrecht | VI Utrecht',
    'Na je bevalling stap voor stap je kracht terugbouwen, met aandacht voor bekkenbodem, core en diastase. Begeleid door Marloes, pre- en postnataal trainster.',
  ],
  'discipline-gymnastics-nl': [
    'Gymnastics training in Utrecht | VI Utrecht',
    'Leer pull-ups, handstands en je eerste muscle-up bij VI Utrecht. Lessen van 60 minuten, max 10 personen, altijd met coach. Probeer je eerste week gratis.',
  ],
  // News (the placeholder articles; update these with the texts)
  'post-alles-uit-je-proefweek-nl': [
    'Zo haal je alles uit je proefweek | VI Utrecht',
    'Drie gratis lessen in je eerste week bij VI Utrecht. Zo kies je je lessen, weet je wat je meeneemt en beslis je daarna met een gerust hart.',
  ],
  'post-eten-rond-je-training-nl': [
    'Eten rond je training: vuistregels | VI Utrecht',
    'Wat eet je voor en na een workout? Simpele vuistregels voor meer energie en sneller herstel, zonder dieet. Tips uit de box van VI Utrecht.',
  ],
  'post-tips-eerste-hyrox-nl': [
    '5 tips voor je eerste Hyrox-race | VI Utrecht',
    'Je eerste Hyrox? Ken het format, train je runs als je moe bent, oefen elk station en pace slim. Vijf tips om sterk over de finish te komen.',
  ],
  'post-waarom-je-snatch-vastloopt-nl': [
    'Waarom je snatch vastloopt (en de oplossing) | VI Utrecht',
    'Drie veelgemaakte fouten in de snatch: te vroeg trekken, niet volledig strekken en niet onder de stang komen. Zo los je ze op, met tips uit de box.',
  ],
  'post-wat-is-een-wod-nl': [
    'Wat is een WOD? CrossFit-termen uitgelegd | VI Utrecht',
    'WOD, AMRAP, EMOM, For time, Rx en scaled: de woorden op het CrossFit-whiteboard uitgelegd. Handig voor je eerste les bij VI Utrecht.',
  ],
}

async function main() {
  const problems = Object.entries(meta).flatMap(([id, [title, description]]) => [
    ...(title.length > 60 ? [`${id}: title ${title.length} > 60`] : []),
    ...(!title.endsWith('| VI Utrecht') ? [`${id}: title without "| VI Utrecht"`] : []),
    ...(description.length < 120 || description.length > 160 ? [`${id}: description ${description.length} not 120–160`] : []),
  ])
  if (problems.length) throw new Error(`Fix these first:\n${problems.join('\n')}`)

  const tx = client.transaction()
  for (const [id, [title, description]] of Object.entries(meta)) {
    tx.patch(id, (p) => p.setIfMissing({seo: {_type: 'seo'}}).set({'seo.title': title, 'seo.description': description}))
  }
  await tx.commit()
  console.log(`updated ${Object.keys(meta).length} pages`)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
