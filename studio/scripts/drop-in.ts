// Adds the Sportbit drop-in planner as a text link under the NL pricing blocks (homepage and
// /lidmaatschappen), as a quick link in the mega menu and as the last item of the main menu.
// Safe to run again: every link is replaced, not added twice. Run with:
//   npx sanity exec scripts/drop-in.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const URL = 'https://viutrecht.sportbitapp.nl/web/nl/dropinplanner/'
const link = (label: string) => ({_type: 'link', label, linkType: 'external', url: URL, emoji: '🧳'})

async function main() {
  const docs = await client.fetch<{_id: string; keys: string[]}[]>(
    `*[language == "nl" && !(_id in path("drafts.**")) && count(sections[_type == "pricingSection"]) > 0]{_id, "keys": sections[_type == "pricingSection"]._key}`,
  )
  const tx = client.transaction()
  for (const doc of docs) {
    for (const key of doc.keys) {
      tx.patch(doc._id, (p) => p.set({[`sections[_key=="${key}"].secondaryCta`]: link('Even in Utrecht? Drop-in →')}))
    }
  }
  tx.patch('navigation-nl', (p) =>
    p
      .setIfMissing({'classesMenu.quickLinks': []})
      .unset(['classesMenu.quickLinks[_key=="dropin"]'])
      .insert('after', 'classesMenu.quickLinks[-1]', [
        {_key: 'dropin', _type: 'quickLink', link: link('Drop-in'), description: 'Even in Utrecht? Train een dag mee'},
      ]),
  )
  // The main menu shows no emoji, so this one goes without.
  tx.patch('navigation-nl', (p) =>
    p
      .setIfMissing({header: []})
      .unset(['header[_key=="dropin"]'])
      .insert('after', 'header[-1]', [{_key: 'dropin', _type: 'link', label: 'Drop-in', linkType: 'external', url: URL}]),
  )
  await tx.commit()
  console.log('done', docs.map((d) => d._id))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
