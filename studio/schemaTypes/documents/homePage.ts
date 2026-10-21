import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {languageField} from '../../lib/fields'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Interne titel',
      type: 'string',
      group: 'content',
      initialValue: 'Homepage',
      hidden: true,
    }),
    defineField({
      name: 'sections',
      title: 'Secties',
      type: 'pageBuilder',
      group: 'content',
      validation: (rule) =>
        rule.custom((sections?: {_type: string}[]) =>
          sections?.[0]?._type === 'heroSection' ? true : 'Begin met een Hero: die bevat de H1',
        ),
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {language: 'language'},
    prepare: ({language}) => ({title: 'Homepage', subtitle: language?.toUpperCase()}),
  },
})
