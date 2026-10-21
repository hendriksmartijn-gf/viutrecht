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
      description: 'Megamenu in de header: alle lessen (in de volgorde van Lessen), snelle links en een uitgelichte kaart.',
      fields: [
        defineField({name: 'label', type: 'string', description: 'Bijv. "Lessen".'}),
        defineField({name: 'overview', title: 'Overzichtspagina', type: 'reference', to: [{type: 'page'}]}),
        defineField({name: 'quickLinksTitle', title: 'Titel snelle links', type: 'string', description: 'Bijv. "Starten bij VI".'}),
        defineField({
          name: 'quickLinks',
          title: 'Snelle links',
          type: 'array',
          description: 'Middelste kolom. De emoji van de link staat in het vakje ervoor.',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'quickLink',
              fields: [
                defineField({name: 'link', type: 'link', validation: (rule) => rule.required()}),
                defineField({
                  name: 'description',
                  title: 'Toelichting',
                  type: 'string',
                  description: 'Bijv. "3 lessen in 7 dagen". Leeg bij de prijzenpagina: dan staat er automatisch "Vanaf €… per maand".',
                }),
              ],
              preview: {select: {title: 'link.label', subtitle: 'description'}},
            }),
          ],
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: 'promo',
          title: 'Uitgelichte kaart',
          type: 'object',
          description: 'Paarse kaart rechts, bijv. de gratis proefweek.',
          fields: [
            defineField({name: 'chips', title: 'Labels', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.max(2)}),
            defineField({name: 'heading', title: 'Kop', type: 'sectionHeading'}),
            defineField({name: 'text', title: 'Tekst', type: 'string'}),
            defineField({name: 'link', type: 'link'}),
          ],
        }),
        defineField({
          name: 'eventsLink',
          title: 'Link naar alle evenementen',
          type: 'link',
          description: 'Onder de uitgelichte kaarten. Het eerstvolgende event (of het nieuwste bericht met foto) verschijnt vanzelf.',
        }),
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
