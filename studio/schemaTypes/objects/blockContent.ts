import {defineArrayMember, defineField, defineType} from 'sanity'
import {ROUTABLE_TYPES} from '../../lib/i18n'
import {sameLanguage} from '../../lib/fields'

// No H1: the page title is the only H1, so editors can't break the heading outline.
// Besides text and images, editors can drop in a pull quote, a pair of photos, a row of figures
// and a call to action (rendered by components/RichText.tsx).
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Tekst',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normaal', value: 'normal'},
        {title: 'Kop 2', value: 'h2'},
        {title: 'Kop 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        annotations: [
          defineArrayMember({
            name: 'internalLink',
            title: 'Interne link',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                to: ROUTABLE_TYPES.map((type) => ({type})),
                options: {filter: sameLanguage},
              }),
            ],
          }),
          defineArrayMember({
            name: 'link',
            title: 'Externe link',
            type: 'object',
            fields: [defineField({name: 'href', type: 'url'})],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (rule) => rule.required().warning('Beschrijf wat er op de foto gebeurt'),
        }),
      ],
    }),
    defineArrayMember({
      name: 'pullQuote',
      title: 'Uitgelichte quote',
      type: 'object',
      fields: [
        defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (rule) => rule.required()}),
        defineField({name: 'attribution', title: 'Van wie', type: 'string', description: 'Bijv. "Lid sinds 2024" of de naam van een coach.'}),
      ],
      preview: {select: {title: 'quote', subtitle: 'attribution'}},
    }),
    defineArrayMember({
      name: 'imagePair',
      title: 'Twee foto’s naast elkaar',
      type: 'object',
      fields: [
        defineField({
          name: 'images',
          title: 'Foto’s',
          type: 'array',
          of: [defineArrayMember({type: 'imageWithAlt'})],
          validation: (rule) => rule.length(2),
        }),
      ],
      preview: {select: {media: 'images.0'}, prepare: ({media}) => ({title: 'Twee foto’s', media})},
    }),
    defineArrayMember({
      name: 'stats',
      title: 'Cijfers',
      type: 'object',
      fields: [
        defineField({
          name: 'items',
          title: 'Cijfers',
          type: 'array',
          validation: (rule) => rule.min(2).max(4),
          of: [
            defineArrayMember({
              type: 'object',
              name: 'stat',
              fields: [
                defineField({name: 'value', title: 'Getal', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'value', subtitle: 'label'}},
            }),
          ],
        }),
      ],
      preview: {select: {a: 'items.0.value', b: 'items.0.label'}, prepare: ({a, b}) => ({title: 'Cijfers', subtitle: [a, b].filter(Boolean).join(' ')})},
    }),
    defineArrayMember({
      name: 'inlineCta',
      title: 'Call to action',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Kop', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'text', title: 'Tekst', type: 'string'}),
        defineField({name: 'link', title: 'Knop', type: 'link', validation: (rule) => rule.required()}),
      ],
      preview: {select: {title: 'heading', subtitle: 'text'}},
    }),
  ],
})
