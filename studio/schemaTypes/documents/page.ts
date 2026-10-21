import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {languageField, slugField} from '../../lib/fields'
import {pathFor} from '../../lib/routes'

export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({name: 'title', title: 'Titel', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    {...slugField, group: 'content'},
    defineField({
      name: 'pageType',
      title: 'Soort pagina',
      type: 'string',
      group: 'content',
      description: 'Bepaalt de structured data (bijv. AboutPage, ContactPage).',
      initialValue: 'standard',
      options: {
        list: [
          {title: 'Standaard', value: 'standard'},
          {title: 'Over ons', value: 'about'},
          {title: 'Lidmaatschappen', value: 'pricing'},
          {title: 'Lessen-overzicht', value: 'collection'},
          {title: 'Rooster', value: 'schedule'},
          {title: 'Nieuwsoverzicht', value: 'blog'},
          {title: 'Contact', value: 'contact'},
          {title: 'Juridisch (privacy, voorwaarden)', value: 'legal'},
        ],
      },
    }),
    defineField({name: 'summary', title: 'Samenvatting', type: 'text', rows: 3, group: 'content', description: 'Fallback voor de meta description.'}),
    defineField({
      name: 'sections',
      title: 'Secties',
      type: 'pageBuilder',
      group: 'content',
      hidden: ({document}) => document?.pageType === 'legal',
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
      type: 'blockContent',
      group: 'content',
      hidden: ({document}) => document?.pageType !== 'legal',
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language'},
    prepare: ({title, slug, language}) => ({title, subtitle: pathFor('page', language, slug)}),
  },
})
