// Touches the settings document (no content change) and reports the webhook's latest
// delivery attempts. Run with: npx sanity exec scripts/webhook-check.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: 'v2021-10-04'})
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  const projectId = client.config().projectId
  const hooks = await client.request<{id: string; name: string}[]>({url: `/hooks/projects/${projectId}`, useGlobalApi: true})
  const hook = hooks.find((h) => h.name === 'Website revalideren')
  if (!hook) throw new Error('Webhook not found')
  const current = await client.fetch<number | null>('*[_id == "settings"][0].annualDiscountPercent')
  await client.patch('settings').set({annualDiscountPercent: current ?? 10}).commit()
  await sleep(15000)
  const attempts = await client.request<{createdAt: string; resultCode: number; isFailure: boolean; failureReason?: string}[]>({
    url: `/hooks/projects/${projectId}/${hook.id}/attempts`,
    useGlobalApi: true,
  })
  console.log(JSON.stringify(attempts.slice(0, 3).map(({createdAt, resultCode, isFailure, failureReason}) => ({createdAt, resultCode, isFailure, failureReason}))))
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
