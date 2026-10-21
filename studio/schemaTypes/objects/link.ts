import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'
import {ROUTABLE_TYPES} from '../../lib/i18n'
import {sameLanguage} from '../../lib/fields'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'linkType',
      title: 'Type',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          {title: 'Pagina op de site', value: 'internal'},
          {title: 'Gratis proefweek (Sportbit)', value: 'trial'},
          {title: 'Externe URL', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'internal',
      title: 'Pagina',
      type: 'reference',
      to: [...ROUTABLE_TYPES, 'homePage'].map((type) => ({type})),
      options: {filter: sameLanguage},
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji in de knop',
      type: 'string',
      description: 'Optioneel. Leeg = automatisch: 🎁 voor de proefweek, 💬 voor contact, 👉 voor overige links.',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https', 'mailto', 'tel']}),
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {title: 'label', linkType: 'linkType', page: 'internal.title', url: 'url'},
    prepare: ({title, linkType, page, url}) => ({
      title,
      subtitle: linkType === 'trial' ? 'Gratis proefweek' : (page ?? url),
    }),
  },
})
