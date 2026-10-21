// Turns the two text facts under the NL hero ("Officiële HYROX Gym", "CrossFit Affiliate") into
// logo slots. Upload the official white logos in the Studio (Homepage → Hero → Vertrouwen); until
// then the hero shows the name as text. Run with:
//   npx sanity exec scripts/hero-logo-slots.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

async function main() {
  const hero = await client.fetch<{_key: string; trustItems?: {_key: string; _type: string}[]} | null>(
    `*[_id == "homePage-nl"][0].sections[_type == "heroSection"][0]{_key, trustItems}`,
  )
  if (!hero) throw new Error('No hero on homePage-nl')
  // Logos already in place (with or without file) stay; the text facts are replaced.
  const logos = (hero.trustItems ?? []).filter((item) => item._type === 'trustLogo')
  const slots = [
    {_key: 'logo-hyrox', _type: 'trustLogo', name: 'Officiële HYROX Gym'},
    {_key: 'logo-crossfit', _type: 'trustLogo', name: 'CrossFit Affiliate'},
  ].filter((slot) => !logos.some((logo) => logo._key === slot._key))
  await client
    .patch('homePage-nl')
    .set({[`sections[_key=="${hero._key}"].trustItems`]: [...logos, ...slots]})
    .commit()
  console.log('trust items:', [...logos, ...slots].map((i) => i._key))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
