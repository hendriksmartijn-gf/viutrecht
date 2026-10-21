// Publishes every NL lesson draft: the draft replaces the published page and is then removed,
// the same as the Publish button in the Studio. Run with:
//   npx sanity exec scripts/publish-lessons.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21', perspective: 'raw'})

async function main() {
  const drafts = await client.fetch<Record<string, unknown>[]>(`*[_type == "discipline" && language == "nl" && _id in path("drafts.**")]`)
  const tx = client.transaction()
  for (const draft of drafts) {
    const {_rev, _createdAt, _updatedAt, ...content} = draft
    const id = (draft._id as string).replace(/^drafts\./, '')
    tx.createOrReplace({...content, _id: id, _type: draft._type as string})
    tx.delete(draft._id as string)
  }
  await tx.commit()
  console.log('published:', drafts.map((d) => (d.slug as {current?: string})?.current))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
