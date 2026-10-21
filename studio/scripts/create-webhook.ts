// Creates the publish webhook that revalidates the website. The secret must match
// SANITY_REVALIDATE_SECRET in Vercel and is passed in, never stored in code. Run with:
//   WEBHOOK_SECRET=... WEBHOOK_URL=https://<site>/api/revalidate \
//   npx sanity exec scripts/create-webhook.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: 'v2021-10-04'})
const {WEBHOOK_SECRET: secret, WEBHOOK_URL: url} = process.env
if (!secret || !url) throw new Error('Set WEBHOOK_SECRET and WEBHOOK_URL')

async function main() {
  const projectId = client.config().projectId
  const existing = await client.request<{id: string; url: string}[]>({url: `/hooks/projects/${projectId}`, useGlobalApi: true})
  if (existing.some((hook) => hook.url === url)) {
    console.log('webhook already exists for', url)
    return
  }
  const hook = await client.request<{id: string}>({
    url: `/hooks/projects/${projectId}`,
    method: 'POST',
    useGlobalApi: true,
    body: {
      type: 'document',
      name: 'Website revalideren',
      description: 'Ververst de website zodra content wordt gepubliceerd, gewijzigd of verwijderd.',
      url,
      dataset: 'production',
      httpMethod: 'POST',
      apiVersion: 'v2021-03-25',
      includeDrafts: false,
      // Published documents only; drafts never reach the website.
      rule: {on: ['create', 'update', 'delete'], filter: "!(_id in path('drafts.**'))", projection: '{_id, _type}'},
      secret,
    },
  })
  console.log('created webhook', hook.id)
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
