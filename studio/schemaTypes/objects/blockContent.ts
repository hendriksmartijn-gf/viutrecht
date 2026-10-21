import {defineArrayMember, defineField, defineType} from 'sanity'
import {ROUTABLE_TYPES} from '../../lib/i18n'
import {sameLanguage} from '../../lib/fields'

// No H1: the page title is the only H1, so editors can't break the heading outline.
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
  ],
})
