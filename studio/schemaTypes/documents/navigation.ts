import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'
import {languageField} from '../../lib/fields'

const linkList = (name: string, title: string) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'link'})]})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigatie',
  type: 'document',
  icon: MenuIcon,
  fields: [
    languageField,
    defineField({name: 'announcement', title: 'Aankondigingsbalk', type: 'string', description: 'Bijv. "Je eerste week 3x gratis".'}),
    defineField({
      name: 'classesMenu',
      title: 'Lessenmenu',
      type: 'object',
      description: 'Uitklapmenu in de header met alle lessen, in de volgorde van Lessen.',
      fields: [
        defineField({name: 'label', type: 'string', description: 'Bijv. "Lessen".'}),
        defineField({name: 'overview', title: 'Overzichtspagina', type: 'reference', to: [{type: 'page'}]}),
      ],
    }),
    linkList('header', 'Hoofdmenu'),
    defineField({name: 'headerCta', title: 'Knop in de header', type: 'link'}),
    defineField({
      name: 'footerColumns',
      title: 'Footer-kolommen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [defineField({name: 'title', type: 'string'}), linkList('links', 'Links')],
        }),
      ],
    }),
    linkList('legal', 'Juridische links'),
    defineField({name: 'footerText', title: 'Korte tekst in de footer', type: 'text', rows: 2}),
    defineField({
      name: 'footerBadges',
      title: 'Keurmerken in de footer',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Bijv. "Officiële HYROX Gym", "CrossFit Affiliate".',
    }),
    defineField({name: 'slogan', title: 'Slogan onderaan', type: 'sectionHeading'}),
  ],
  preview: {
    select: {language: 'language'},
    prepare: ({language}) => ({title: 'Navigatie', subtitle: language?.toUpperCase()}),
  },
})
