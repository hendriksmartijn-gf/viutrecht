// Puts an intro (H1 + text + button) at the top of the NL overview pages that only showed their
// bare title: Lidmaatschappen, Lessen and Nieuws. The membership copy follows the current
// viutrecht.nl page; the 10% annual discount matches settings.annualDiscountPercent.
// Safe to run again: an existing intro on these pages is replaced. Run with:
//   npx sanity exec scripts/page-intros.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const trial = {_type: 'link', label: 'Boek je gratis proefweek', linkType: 'trial', emoji: '🎁'}
const intros: Record<string, {text: string; emphasis: string; intro: string; primaryCta?: object}> = {
  lidmaatschappen: {
    text: 'Kies het lidmaatschap',
    emphasis: 'dat bij jouw doelen past.',
    intro:
      'Onbeperkt trainen, twee keer per week of een plan voor een specifiek doel: er is een lidmaatschap dat bij jouw week past. Maandelijks betalen, transparante prijzen en geen verborgen kosten. Kies je een jaarabonnement, dan krijg je 10% korting.',
    primaryCta: trial,
  },
  lessen: {
    text: 'Van je eerste workout',
    emphasis: 'tot je eerste wedstrijd.',
    intro:
      'CrossFit, Hyrox, gewichtheffen, kracht, gymnastics en meer. Elke les duurt 60 minuten, in een kleine groep en altijd met een coach. Je eerste week is gratis.',
    primaryCta: trial,
  },
  nieuws: {
    text: 'Nieuws',
    emphasis: 'en updates.',
    intro: 'Events, roosterwijzigingen en wat er verder speelt bij VI Utrecht.',
  },
}

async function main() {
  const pages = await client.fetch<{_id: string; slug: string}[]>(
    `*[_type == "page" && language == "nl" && !(_id in path("drafts.**")) && slug.current in $slugs]{_id, "slug": slug.current}`,
    {slugs: Object.keys(intros)},
  )
  const tx = client.transaction()
  for (const page of pages) {
    const {text, emphasis, intro, primaryCta} = intros[page.slug]
    const section = {_key: `intro-${page.slug}`, _type: 'introSection', heading: {_type: 'sectionHeading', text, emphasis}, intro, ...(primaryCta ? {primaryCta} : {})}
    // Sanity applies unset before insert, so a rerun replaces the intro instead of doubling it.
    tx.patch(page._id, (p) =>
      p.setIfMissing({sections: []}).unset([`sections[_key=="intro-${page.slug}"]`]).insert('before', 'sections[0]', [section]),
    )
  }
  await tx.commit()
  console.log('intros:', pages.map((p) => p.slug))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
