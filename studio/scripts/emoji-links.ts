// Sets the "Bekijk alle lessen" button on the NL homepage to 👀. Run with:
//   npx sanity exec scripts/emoji-links.ts --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})

async function main() {
  await client.patch('homePage-nl').set({'sections[_type=="disciplinesSection"].cta.emoji': '👀'}).commit()
  console.log('done')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
