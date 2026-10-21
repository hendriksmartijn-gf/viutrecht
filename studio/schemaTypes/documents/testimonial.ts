import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'
import {DISCIPLINES} from '../../lib/fields'

// Real member quotes, kept in the language they were given in. Never translate or edit
// the meaning of a quote.
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Ervaring',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
    defineField({
      name: 'quoteLanguage',
      title: 'Taal van de quote',
      type: 'string',
      initialValue: 'nl',
      options: {list: [{title: 'Nederlands', value: 'nl'}, {title: 'English', value: 'en'}], layout: 'radio', direction: 'horizontal'},
    }),
    defineField({name: 'authorName', title: 'Naam', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'photo', title: 'Foto', type: 'imageWithAlt'}),
    defineField({name: 'memberSince', title: 'Lid sinds (jaar)', type: 'number', validation: (rule) => rule.min(2015).max(2100)}),
    defineField({name: 'discipline', title: 'Traint vooral', type: 'string', options: {list: DISCIPLINES}}),
    defineField({
      name: 'source',
      title: 'Bron',
      type: 'string',
      options: {list: [{title: 'Google review', value: 'google'}, {title: 'Instagram', value: 'instagram'}, {title: 'Rechtstreeks', value: 'direct'}]},
    }),
    defineField({
      name: 'consent',
      title: 'Toestemming voor publicatie',
      type: 'boolean',
      description: 'Alleen publiceren met toestemming van het lid (AVG).',
      initialValue: false,
      validation: (rule) => rule.custom((v) => v === true || 'Zonder toestemming niet publiceren'),
    }),
  ],
  preview: {
    select: {title: 'authorName', subtitle: 'quote'},
  },
})
