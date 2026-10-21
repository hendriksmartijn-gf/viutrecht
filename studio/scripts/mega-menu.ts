// Fills the NL mega menu's quick links and featured card with what exists today (trial week,
// memberships, about page). The schedule, drop-in and events links follow once those exist.
// Run with:
//   npx sanity exec scripts/mega-menu.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

async function main() {
  const pages = await client.fetch<{_id: string; pageType: string}[]>(
    `*[_type == "page" && language == "nl" && pageType in ["pricing", "about"] && !(_id in path("drafts.**"))]{_id, pageType}`,
  )
  const page = (type: string) => pages.find((p) => p.pageType === type)?._id
  const internal = (id: string | undefined) => (id ? {_type: 'reference', _ref: id} : undefined)

  await client
    .patch('navigation-nl')
    .set({
      'classesMenu.quickLinksTitle': 'Starten bij VI',
      'classesMenu.quickLinks': [
        {_key: 'trial', _type: 'quickLink', link: {_type: 'link', label: 'Gratis proefweek', linkType: 'trial', emoji: '🎁'}, description: '3 lessen in 7 dagen'},
        // No description: the menu shows the lowest monthly price, derived from the memberships.
        {_key: 'pricing', _type: 'quickLink', link: {_type: 'link', label: 'Lidmaatschappen', linkType: 'internal', internal: internal(page('pricing')), emoji: '💳'}},
        {_key: 'about', _type: 'quickLink', link: {_type: 'link', label: 'Over ons', linkType: 'internal', internal: internal(page('about')), emoji: '👋'}, description: 'De gym, de coaches en onze missie'},
      ],
      'classesMenu.promo': {
        chips: ['Proefweek', 'Gratis'],
        heading: {_type: 'sectionHeading', text: 'Je eerste week', emphasis: 'trakteren wij.'},
        text: 'Drie lessen, zeven dagen, alle niveaus.',
        link: {_type: 'link', label: 'Boek je gratis proefweek', linkType: 'trial', emoji: '🎁'},
      },
    })
    .commit()
  console.log('done', pages)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
