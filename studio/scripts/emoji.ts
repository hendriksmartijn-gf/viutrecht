// Seeds the button emoji for memberships and lessons. Run with:
//   npx sanity exec scripts/emoji.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

const MEMBERSHIPS: Record<string, string> = {'VI Core': '🙌', 'VI Rise': '🔥', 'VI Thrive': '🚀'}
const DISCIPLINES: Record<string, string> = {
  crossfit: '🤸',
  hyrox: '🏃',
  weightlifting: '🏋️',
  strength: '💪',
  'open-gym': '🔓',
  'personal-training': '🤝',
  'advanced-crossfit': '⚡',
  pregnancy: '🤰',
  postpartum: '🌱',
}

async function main() {
  const tx = client.transaction()
  for (const m of await client.fetch<{_id: string; name: string}[]>('*[_type == "membership"]{_id, name}')) {
    if (MEMBERSHIPS[m.name]) tx.patch(m._id, {set: {emoji: MEMBERSHIPS[m.name]}})
  }
  for (const d of await client.fetch<{_id: string; key: string}[]>('*[_type == "discipline"]{_id, key}')) {
    if (DISCIPLINES[d.key]) tx.patch(d._id, {set: {emoji: DISCIPLINES[d.key]}})
  }
  const result = await tx.commit()
  console.log('patched', result.results.length)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
