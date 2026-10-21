import {defineArrayMember, defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons/Bolt'
import {DISCIPLINES, languageField, sameLanguage, slugField} from '../../lib/fields'
import {pathFor} from '../../lib/routes'

// A class type (CrossFit, HYROX, ...). Fixed template instead of a page builder: every
// discipline page answers the same questions, which keeps them consistent for search
// engines and for AI assistants comparing gyms.
export const discipline = defineType({
  name: 'discipline',
  title: 'Les',
  type: 'document',
  icon: BoltIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'facts', title: 'Kenmerken'},
    {name: 'lesson', title: 'De les'},
    {name: 'related', title: 'Koppelingen'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    languageField,
    defineField({
      name: 'key',
      title: 'Les-type',
      type: 'string',
      group: 'content',
      options: {list: DISCIPLINES},
      description: 'Koppelt de NL- en EN-versie en de coaches, abonnementen en reviews aan deze les.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Naam',
      type: 'string',
      group: 'content',
      description: 'Zoals mensen het zoeken: "Olympisch gewichtheffen", niet "Oly".',
      validation: (rule) => rule.required(),
    }),
    {...slugField, group: 'content'},
    defineField({
      name: 'focusKeyword',
      title: 'Hoofdzoekwoord',
      type: 'string',
      group: 'seo',
      description: 'Waar deze pagina op moet ranken, bijv. "olympisch gewichtheffen utrecht". Gebruik het in de H1, de meta title en de eerste alinea.',
    }),
    defineField({
      name: 'heading',
      title: 'H1',
      type: 'sectionHeading',
      group: 'content',
      description: 'Bijv. "Olympisch gewichtheffen" + "De kunst van kracht, snelheid en precisie."',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Samenvatting',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'Eén direct antwoord op "wat is dit en voor wie?" in 2–3 zinnen. Wordt gebruikt op lesoverzichten, als fallback voor de meta description en door AI-zoekmachines als antwoord.',
      validation: (rule) => [
        rule.required(),
        rule.max(320).warning('Houd het kort: dit is het antwoord, niet het verhaal'),
      ],
    }),
    defineField({
      name: 'tagline',
      title: 'Korte omschrijving voor kaarten',
      type: 'string',
      group: 'content',
      description: 'Eén zin voor lesoverzichten, bijv. "Snatch en clean & jerk. Eerst techniek, dan de kilo’s."',
      validation: (rule) => rule.max(110).warning('Kort houden: dit staat op een kaart'),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Staat in de knoppen naar deze les, bijv. 🏋️.',
      group: 'content',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'audienceLabel',
      title: 'Voor wie (label)',
      type: 'string',
      group: 'facts',
      description: 'Kort label op de kaart, bijv. "Alle niveaus", "Beginner → wedstrijd", "1-op-1".',
    }),
    defineField({name: 'heroImage', title: 'Hero-afbeelding', type: 'imageWithAlt', group: 'content', validation: (rule) => rule.required()}),
    defineField({name: 'cardImage', title: 'Afbeelding voor overzichten', type: 'imageWithAlt', group: 'content', description: 'Laat leeg om de hero-afbeelding te gebruiken.'}),

    // Facts: structured so they render as the key-facts row and feed JSON-LD.
    defineField({
      name: 'level',
      title: 'Niveau',
      type: 'object',
      group: 'facts',
      options: {columns: 2},
      fields: [
        defineField({
          name: 'from',
          title: 'Van',
          type: 'string',
          options: {list: ['beginner', 'intermediate', 'advanced', 'pro']},
        }),
        defineField({
          name: 'to',
          title: 'Tot',
          type: 'string',
          options: {list: ['beginner', 'intermediate', 'advanced', 'pro']},
        }),
      ],
    }),
    defineField({name: 'durationMinutes', title: 'Duur (minuten)', type: 'number', group: 'facts', validation: (rule) => rule.positive().integer()}),
    defineField({name: 'maxGroupSize', title: 'Max. groepsgrootte', type: 'number', group: 'facts', description: 'Leeg bij personal training of open gym.', validation: (rule) => rule.positive().integer()}),
    defineField({
      name: 'bookingType',
      title: 'Hoe boek je dit?',
      type: 'string',
      group: 'facts',
      initialValue: 'class',
      options: {
        list: [
          {title: 'Les via het rooster (credits)', value: 'class'},
          {title: 'Vrij trainen (open gym)', value: 'openAccess'},
          {title: 'Op afspraak (personal training)', value: 'appointment'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'extraFacts',
      title: 'Extra kenmerken',
      type: 'array',
      group: 'facts',
      of: [defineArrayMember({type: 'keyFact'})],
      validation: (rule) => rule.max(3),
    }),

    // Lesson content, in the order of the design.
    defineField({
      name: 'essentials',
      title: 'De kern',
      type: 'object',
      group: 'lesson',
      description: 'Waar draait deze les om? Bijv. "Twee lifts. Eén complete atleet." met de Snatch en de Clean & Jerk.',
      fields: [
        defineField({name: 'heading', title: 'Kop', type: 'sectionHeading'}),
        defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
        defineField({name: 'image', title: 'Afbeelding', type: 'imageWithAlt'}),
        defineField({
          name: 'items',
          title: 'Onderdelen',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'essential',
              fields: [
                defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 2}),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'benefits',
      title: 'Wat levert het op?',
      type: 'object',
      group: 'lesson',
      fields: [
        defineField({name: 'heading', title: 'Kop', type: 'sectionHeading'}),
        defineField({
          name: 'items',
          title: 'Voordelen',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          validation: (rule) => rule.max(6),
        }),
      ],
    }),
    defineField({
      name: 'lessonOutline',
      title: 'Zo ziet een les eruit',
      type: 'object',
      group: 'lesson',
      fields: [
        defineField({name: 'heading', title: 'Kop', type: 'sectionHeading'}),
        defineField({
          name: 'blocks',
          title: 'Onderdelen',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'lessonBlock',
              fields: [
                defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'minutes', title: 'Minuten', type: 'number', validation: (rule) => rule.positive().integer()}),
                defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 2}),
              ],
              preview: {
                select: {title: 'title', minutes: 'minutes'},
                prepare: ({title, minutes}) => ({title, subtitle: minutes ? `${minutes} min` : undefined}),
              },
            }),
          ],
        }),
        defineField({
          name: 'whatToBring',
          title: 'Wat neem je mee?',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
        }),
      ],
    }),
    defineField({
      name: 'promise',
      title: 'Belofte van de coach',
      type: 'object',
      group: 'lesson',
      description: 'Korte quote naast de lesopbouw, bijv. "Lift with purpose". Koppel alleen een coach als die de quote echt onderschrijft.',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3}),
        defineField({name: 'coach', title: 'Coach', type: 'reference', to: [{type: 'coach'}]}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Verdieping',
      type: 'blockContent',
      group: 'lesson',
      description: 'Optionele langere uitleg voor wie meer wil weten. Hier is ruimte voor de vragen die mensen echt zoeken.',
    }),

    // Relations
    defineField({
      name: 'coaches',
      title: 'Coaches',
      type: 'array',
      group: 'related',
      description: 'Laat leeg om automatisch de coaches met deze specialisatie te tonen.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'coach'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'testimonial',
      title: 'Uitgelichte ervaring',
      type: 'reference',
      group: 'related',
      to: [{type: 'testimonial'}],
    }),
    defineField({
      name: 'faqHeading',
      title: 'Kop boven de vragen',
      type: 'sectionHeading',
      group: 'related',
      description: 'Bijv. "Vragen" / "Voor je" / "eerste lift." Leeg = standaardkop.',
    }),
    defineField({
      name: 'faqs',
      title: 'Veelgestelde vragen',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}], options: {filter: sameLanguage}})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'related',
      title: 'Gerelateerde lessen',
      type: 'array',
      group: 'related',
      description: 'Voor interne links: welke lessen passen hier logisch bij?',
      of: [defineArrayMember({type: 'reference', to: [{type: 'discipline'}], options: {filter: sameLanguage}})],
      validation: (rule) => rule.unique().max(3),
    }),
    defineField({
      name: 'sportbitClassNames',
      title: 'Lesnamen in Sportbit',
      type: 'array',
      group: 'related',
      description: 'Exact zoals in Sportbit, zodat het rooster op deze pagina de juiste lessen toont.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'ctaText',
      title: 'Tekst bij de afsluitende call-to-action',
      type: 'text',
      rows: 2,
      group: 'related',
      description: 'Bijv. "Probeer deze week een les gewichtheffen. Coach, barbell en krijt regelen wij."',
    }),
    defineField({name: 'orderRank', title: 'Volgorde', type: 'number', group: 'related'}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Volgorde', name: 'order', by: [{field: 'orderRank', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language', media: 'heroImage'},
    prepare: ({title, slug, language, media}) => ({
      title,
      subtitle: pathFor('discipline', language, slug),
      media,
    }),
  },
})
