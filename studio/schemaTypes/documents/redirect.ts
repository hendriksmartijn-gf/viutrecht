import {defineField, defineType, type SanityDocumentLike} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

function isValidPath(value: string | undefined) {
  if (!value) return 'Verplicht'
  if (!value.startsWith('/')) return 'Moet beginnen met /'
  if (/[^a-zA-Z0-9\-_/:.]/.test(value)) return 'Ongeldige tekens'
  return true
}

// Needed at launch: the current site serves English at the root and Dutch under /nl/
// with English slugs. Every old URL must 301 to its new address, e.g.
// /nl/olympicweightlifting -> /lessen/olympisch-gewichtheffen
// /olympicweightlifting    -> /en/classes/olympic-weightlifting
export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  validation: (rule) =>
    rule.custom((doc: SanityDocumentLike | undefined) =>
      doc?.source && doc.source === doc.destination ? 'Bron en bestemming zijn gelijk' : true,
    ),
  fields: [
    defineField({name: 'source', title: 'Van', type: 'string', description: 'Bijv. /nl/olympicweightlifting', validation: (rule) => rule.required().custom(isValidPath)}),
    defineField({name: 'destination', title: 'Naar', type: 'string', description: 'Bijv. /lessen/olympisch-gewichtheffen', validation: (rule) => rule.required()}),
    defineField({name: 'permanent', title: 'Permanent (301)', type: 'boolean', initialValue: true}),
    defineField({name: 'isEnabled', title: 'Actief', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {source: 'source', destination: 'destination', permanent: 'permanent'},
    prepare: ({source, destination, permanent}) => ({title: `${source} → ${destination}`, subtitle: permanent ? '301' : '302'}),
  },
})
