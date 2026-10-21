import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {DISCIPLINES, languageField, sameLanguage, slugField} from '../../lib/fields'
import {pathFor} from '../../lib/routes'

// Time-bound offers with a start date and own price, like the HYROX course or a workshop.
// Modelled as structured data so they can be marked up as Event/Course with an Offer.
export const program = defineType({
  name: 'program',
  title: 'Cursus of event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'practical', title: 'Praktisch'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({name: 'title', title: 'Naam', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    {...slugField, group: 'content'},
    defineField({
      name: 'programType',
      title: 'Soort',
      type: 'string',
      group: 'content',
      initialValue: 'course',
      options: {
        list: [
          {title: 'Cursus (meerdere sessies)', value: 'course'},
          {title: 'Event (één dag)', value: 'event'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({name: 'discipline', title: 'Les-type', type: 'string', group: 'content', options: {list: DISCIPLINES}}),
    defineField({name: 'heading', title: 'H1', type: 'sectionHeading', group: 'content', validation: (rule) => rule.required()}),
    defineField({
      name: 'summary',
      title: 'Samenvatting',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Wat is het, voor wie, wanneer en wat kost het: in 2–3 zinnen.',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({name: 'heroImage', title: 'Hero-afbeelding', type: 'imageWithAlt', group: 'content'}),
    defineField({name: 'body', title: 'Tekst', type: 'blockContent', group: 'content'}),
    defineField({
      name: 'includes',
      title: 'Wat zit erin?',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({name: 'startDate', title: 'Startdatum', type: 'datetime', group: 'practical', validation: (rule) => rule.required()}),
    defineField({
      name: 'endDate',
      title: 'Einddatum',
      type: 'datetime',
      group: 'practical',
      validation: (rule) =>
        rule.custom((end, {document}) =>
          end && document?.startDate && end < (document.startDate as string) ? 'Einddatum ligt vóór de startdatum' : true,
        ),
    }),
    defineField({
      name: 'sessions',
      title: 'Vaste trainingsmomenten',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({type: 'keyFact'})],
      description: 'Bijv. label "Donderdag", waarde "18:30".',
    }),
    defineField({name: 'sessionCount', title: 'Aantal sessies', type: 'number', group: 'practical', validation: (rule) => rule.positive().integer()}),
    defineField({
      name: 'participants',
      title: 'Deelnemers',
      type: 'object',
      group: 'practical',
      options: {columns: 2},
      fields: [
        defineField({name: 'min', title: 'Minimum', type: 'number'}),
        defineField({name: 'max', title: 'Maximum', type: 'number'}),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Prijs',
      type: 'object',
      group: 'practical',
      options: {columns: 2},
      fields: [
        defineField({name: 'regular', title: 'Prijs (€)', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({name: 'members', title: 'Prijs voor leden (€)', type: 'number', validation: (rule) => rule.min(0)}),
      ],
    }),
    defineField({name: 'signupUrl', title: 'Inschrijflink', type: 'url', group: 'practical'}),
    defineField({
      name: 'faqs',
      title: 'Veelgestelde vragen',
      type: 'array',
      group: 'practical',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}], options: {filter: sameLanguage}})],
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Startdatum', name: 'start', by: [{field: 'startDate', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', slug: 'slug.current', start: 'startDate', language: 'language', media: 'heroImage'},
    prepare: ({title, slug, start, language, media}) => ({
      title,
      subtitle: [pathFor('program', language, slug), start && new Date(start).toLocaleDateString('nl-NL')].filter(Boolean).join(' · '),
      media,
    }),
  },
})
