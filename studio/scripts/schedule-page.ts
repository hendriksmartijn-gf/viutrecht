// Creates the NL rooster page (/rooster): an intro and the live Sportbit schedule, and links it
// from the main menu and the mega menu's quick links. Safe to run again (fixed ids and keys).
// Run with:
//   npx sanity exec scripts/schedule-page.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const ID = 'page-rooster-nl'
const link = (label: string, emoji?: string) => ({_type: 'link', label, linkType: 'internal', internal: {_type: 'reference', _ref: ID}, ...(emoji ? {emoji} : {})})

async function main() {
  // The page first: the menu links below reference it.
  await client.createOrReplace({
    _id: ID,
    _type: 'page',
    language: 'nl',
    title: 'Rooster',
    slug: {_type: 'slug', current: 'rooster'},
    pageType: 'schedule',
    summary: 'Het rooster van VI Utrecht: alle lessen van deze week, live uit Sportbit. Boek je plek in de app; je eerste week is gratis.',
    sections: [
      {
        _key: 'intro-rooster',
        _type: 'introSection',
        heading: {_type: 'sectionHeading', text: 'Ons rooster.', emphasis: 'Vind je les.'},
        intro: 'Alle lessen van deze week. Klik op een les voor de details en boek je plek in de Sportbit-app.',
        primaryCta: {_type: 'link', label: 'Boek je gratis proefweek', linkType: 'trial', emoji: '🎁'},
      },
      {_key: 'schedule', _type: 'scheduleSection'},
    ],
    seo: {
      _type: 'seo',
      title: 'Rooster CrossFit & Hyrox lessen Utrecht | VI Utrecht',
      description: 'Bekijk het rooster van VI Utrecht: CrossFit, Hyrox, gewichtheffen, kracht en Open Gym. Live bijgewerkt, boek je plek direct. Eerste week gratis.',
    },
  })

  // One insert per patch, so the two menus are separate patches in one transaction.
  await client
    .transaction()
    // Main menu: right after "Lessen", as on the current site.
    .patch('navigation-nl', (p) =>
      p.setIfMissing({header: []}).unset(['header[_key=="rooster"]']).insert('before', 'header[0]', [{_key: 'rooster', ...link('Rooster')}]),
    )
    .patch('navigation-nl', (p) =>
      p
        .setIfMissing({'classesMenu.quickLinks': []})
        .unset(['classesMenu.quickLinks[_key=="rooster"]'])
        .insert('after', 'classesMenu.quickLinks[_key=="trial"]', [
          {_key: 'rooster', _type: 'quickLink', link: link('Rooster', '🗓️'), description: 'Alle lestijden van deze week'},
        ]),
    )
    .commit()
  console.log('created', ID)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
