// Adds the reviews section ("Mensen die hun gym vonden.") to the NL homepage, between the
// lessons and the memberships as in the design, with every testimonial that has consent.
// Run with: npx sanity exec scripts/homepage-reviews.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})
const k = () => Math.random().toString(36).slice(2, 10)

async function main() {
  const home = await client.getDocument<{sections: {_type: string; _key: string}[]}>('homePage-nl')
  if (!home) throw new Error('homePage-nl not found')
  if (home.sections.some((s) => s._type === 'testimonialsSection')) {
    console.log('reviews section already on the homepage')
    return
  }
  const ids = await client.fetch<string[]>('*[_type == "testimonial" && consent == true && !(_id in path("drafts.**"))] | order(_createdAt asc)._id')
  const section = {
    _key: k(),
    _type: 'testimonialsSection',
    heading: {eyebrow: 'Community', text: 'Mensen die', emphasis: 'hun gym vonden.'},
    testimonials: ids.map((id) => ({_type: 'reference', _ref: id, _key: k()})),
    showRating: true,
  }
  const after = home.sections.find((s) => s._type === 'disciplinesSection')
  await client
    .patch('homePage-nl')
    .insert('after', after ? `sections[_key=="${after._key}"]` : 'sections[-1]', [section])
    .commit()
  console.log('added reviews section with', ids.length, 'testimonials')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
