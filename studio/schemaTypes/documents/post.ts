import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {DISCIPLINES, languageField, sameLanguage, slugField} from '../../lib/fields'
import {pathFor} from '../../lib/routes'

// News and announcements. An event post announces; the bookable details (date, price,
// sign-up) live on the linked program, so they are maintained in one place.
export const post = defineType({
  name: 'post',
  title: 'Nieuwsbericht',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'related', title: 'Koppelingen'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({name: 'title', title: 'Titel', type: 'string', group: 'content', validation: (rule) => rule.required().max(90)}),
    defineField({
      name: 'titleEmphasis',
      title: 'Schuine afsluiter van de kop',
      type: 'string',
      group: 'content',
      description: 'Optioneel. Staat in de kop van het artikel achter de titel, schuin en paars, bijv. "één box vol PR’s."',
    }),
    {...slugField, group: 'content'},
    defineField({
      name: 'postType',
      title: 'Soort',
      type: 'string',
      group: 'content',
      initialValue: 'news',
      options: {
        list: [
          {title: 'Nieuws', value: 'news'},
          {title: 'Event-aankondiging', value: 'event'},
          {title: 'Wijziging (rooster, tijden, prijzen)', value: 'change'},
          {title: 'Community / ledenverhaal', value: 'community'},
          {title: 'Training & tips', value: 'training'},
          {title: 'Voeding', value: 'nutrition'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relevantUntil',
      title: 'Relevant tot',
      type: 'date',
      group: 'content',
      description:
        'Voor tijdelijke berichten (feestdagen, tijdelijke roosterwijziging). Daarna verdwijnt het bericht uit overzichten en de sitemap, zodat Google en AI-assistenten geen verouderde info blijven tonen.',
      hidden: ({document}) => document?.postType === 'community',
    }),
    defineField({
      name: 'summary',
      title: 'Samenvatting',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Wat verandert er, voor wie, en vanaf wanneer? In 1–2 zinnen. Gebruikt in overzichten en als meta description.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({name: 'heroImage', title: 'Afbeelding', type: 'imageWithAlt', group: 'content'}),
    defineField({name: 'heroCaption', title: 'Bijschrift bij de foto', type: 'string', group: 'content', description: 'Bijv. "Foto: Open 26.3 bij VI".'}),
    defineField({
      name: 'body',
      title: 'Tekst',
      type: 'blockContent',
      group: 'content',
      description: 'Elke "Kop 2" komt in de inhoudsopgave naast het artikel.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),

    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      group: 'related',
      to: [{type: 'coach'}],
      description: 'Een echte afzender geeft het bericht gezicht en betrouwbaarheid.',
    }),
    defineField({
      name: 'program',
      title: 'Gekoppelde cursus of event',
      type: 'reference',
      group: 'related',
      to: [{type: 'program'}],
      options: {filter: sameLanguage},
      hidden: ({document}) => document?.postType !== 'event',
    }),
    defineField({
      name: 'disciplines',
      title: 'Over welke lessen gaat het?',
      type: 'array',
      group: 'related',
      description: 'Toont het bericht ook op die lespagina’s.',
      of: [defineArrayMember({type: 'string'})],
      options: {list: DISCIPLINES},
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Nieuwste eerst', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language', date: 'publishedAt', media: 'heroImage'},
    prepare: ({title, slug, language, date, media}) => ({
      title,
      subtitle: [date && new Date(date).toLocaleDateString('nl-NL'), pathFor('post', language, slug)].filter(Boolean).join(' · '),
      media,
    }),
  },
})

