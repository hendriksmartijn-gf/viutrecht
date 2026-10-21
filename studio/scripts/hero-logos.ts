// Replaces the text trust items in the NL hero with the official logos. Run with:
//   npx sanity exec scripts/hero-logos.ts --with-user-token -- <hyrox logo> <crossfit logo>
// Use the white versions (SVG preferred) from the brands' own logo kits.
import {createReadStream} from 'node:fs'
import {basename} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-21'})
const [hyrox, crossfit] = process.argv.slice(-2)
if (!hyrox || !crossfit || hyrox.endsWith('.ts')) throw new Error('Pass the HYROX and CrossFit logo files')

const k = () => Math.random().toString(36).slice(2, 10)

async function logo(file: string, name: string) {
  const asset = await client.assets.upload('image', createReadStream(file), {filename: basename(file)})
  return {_key: k(), _type: 'trustLogo', name, logo: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}}
}

async function main() {
  const items = [await logo(hyrox, 'Officiële HYROX Gym'), await logo(crossfit, 'CrossFit Affiliate')]
  await client.patch('homePage-nl').set({'sections[_type=="heroSection"].trustItems': items}).commit()
  console.log('hero logos set')
}

// An unhandled rejection exits non-zero, which `sanity exec` reports.
main()
