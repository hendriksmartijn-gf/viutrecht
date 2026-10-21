import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {BoltIcon} from '@sanity/icons/Bolt'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {CommentIcon} from '@sanity/icons/Comment'
import {CreditCardIcon} from '@sanity/icons/CreditCard'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ImageIcon} from '@sanity/icons/Image'
import {OlistIcon} from '@sanity/icons/Olist'
import {RocketIcon} from '@sanity/icons/Rocket'
import {UsersIcon} from '@sanity/icons/Users'
import {DISCIPLINES, sameLanguage} from '../../lib/fields'

const heading = defineField({name: 'heading', title: 'Kop', type: 'sectionHeading'})
const intro = defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3})

const headingPreview = (fallback: string) => ({
  select: {title: 'heading.text', emphasis: 'heading.emphasis'},
  prepare: ({title, emphasis}: {title?: string; emphasis?: string}) => ({
    title: [title, emphasis].filter(Boolean).join(' ') || fallback,
    subtitle: fallback,
  }),
})

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Bovenregel', type: 'string'}),
    defineField({
      ...heading,
      description: 'Dit wordt de H1 van de pagina. Zet het hoofdzoekwoord erin, bijv. "CrossFit & Hyrox gym" + "in Utrecht."',
      validation: (rule) => rule.required(),
    }),
    intro,
    defineField({name: 'image', title: 'Afbeelding', type: 'imageWithAlt'}),
    defineField({name: 'primaryCta', title: 'Primaire knop', type: 'link'}),
    defineField({name: 'secondaryCta', title: 'Secundaire knop', type: 'link'}),
    defineField({
      name: 'trustItems',
      title: 'Vertrouwen',
      type: 'array',
      description: 'Officiële logo’s of korte, controleerbare feiten. De Google-score komt automatisch uit Instellingen.',
      of: [defineArrayMember({type: 'trustLogo'}), defineArrayMember({type: 'keyFact'})],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'showRating',
      title: 'Toon Google-score',
      type: 'boolean',
      description: 'Haalt de score uit Instellingen.',
      initialValue: true,
    }),
  ],
  preview: headingPreview('Hero'),
})

export const marqueeSection = defineType({
  name: 'marqueeSection',
  title: 'Lessen-band',
  type: 'object',
  icon: BoltIcon,
  description: 'Lopende band met de namen van alle lessen, in de volgorde van Lessen.',
  fields: [defineField({name: 'enabled', title: 'Tonen', type: 'boolean', initialValue: true, hidden: true})],
  preview: {prepare: () => ({title: 'Lessen-band'})},
})

export const disciplinesSection = defineType({
  name: 'disciplinesSection',
  title: 'Lessen-overzicht',
  type: 'object',
  icon: BoltIcon,
  fields: [
    heading,
    intro,
    defineField({
      name: 'disciplines',
      title: 'Lessen',
      type: 'array',
      description: 'Laat leeg om alle lessen te tonen.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'discipline'}], options: {filter: sameLanguage}})],
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'cta', title: 'Knop', type: 'link'}),
  ],
  preview: headingPreview('Lessen-overzicht'),
})

export const stepsSection = defineType({
  name: 'stepsSection',
  title: 'Stappen',
  type: 'object',
  icon: OlistIcon,
  fields: [
    heading,
    intro,
    defineField({
      name: 'steps',
      title: 'Stappen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Omschrijving', type: 'text', rows: 2}),
          ],
        }),
      ],
      validation: (rule) => rule.min(2).max(5),
    }),
    defineField({name: 'cta', title: 'Knop', type: 'link'}),
  ],
  preview: headingPreview('Stappen'),
})

export const scheduleSection = defineType({
  name: 'scheduleSection',
  title: 'Rooster (Sportbit)',
  type: 'object',
  icon: CalendarIcon,
  description: 'Het rooster komt live uit Sportbit en wordt niet in Sanity beheerd.',
  fields: [
    heading,
    defineField({
      name: 'discipline',
      title: 'Filter op les',
      type: 'string',
      options: {list: DISCIPLINES},
      description: 'Laat leeg voor alle lessen.',
    }),
  ],
  preview: headingPreview('Rooster'),
})

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Ervaringen',
  type: 'object',
  icon: CommentIcon,
  fields: [
    heading,
    defineField({
      name: 'testimonials',
      title: 'Ervaringen',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'showRating', title: 'Toon Google-score', type: 'boolean', initialValue: true}),
  ],
  preview: headingPreview('Ervaringen'),
})

export const pricingSection = defineType({
  name: 'pricingSection',
  title: 'Prijzen',
  type: 'object',
  icon: CreditCardIcon,
  fields: [
    heading,
    intro,
    defineField({
      name: 'memberships',
      title: 'Lidmaatschappen',
      type: 'array',
      description: 'Laat leeg om alle abonnementen te tonen.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'membership'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'footnote', title: 'Afsluitende zin', type: 'string', description: 'Bijv. "Nog twijfels? Je eerste week is gratis."'}),
    defineField({name: 'secondaryCta', title: 'Tekstlink', type: 'link'}),
    defineField({name: 'cta', title: 'Knop', type: 'link'}),
  ],
  preview: headingPreview('Prijzen'),
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'Veelgestelde vragen',
  type: 'object',
  icon: HelpCircleIcon,
  description: 'Vragen worden ook als FAQ structured data op de pagina gezet.',
  fields: [
    heading,
    defineField({
      name: 'faqs',
      title: 'Vragen',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}], options: {filter: sameLanguage}})],
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'showContactInfo', title: 'Toon adres & openingstijden', type: 'boolean', initialValue: true}),
    defineField({name: 'image', title: 'Foto', type: 'imageWithAlt', hidden: ({parent}) => !parent?.showContactInfo}),
    defineField({name: 'cta', title: 'Knop onder de vragen', type: 'link', description: 'Bijv. "Neem contact op".'}),
  ],
  preview: headingPreview('FAQ'),
})

export const coachesSection = defineType({
  name: 'coachesSection',
  title: 'Coaches',
  type: 'object',
  icon: UsersIcon,
  fields: [
    heading,
    intro,
    defineField({
      name: 'coaches',
      title: 'Coaches',
      type: 'array',
      description: 'Laat leeg om alle coaches te tonen.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'coach'}]})],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: headingPreview('Coaches'),
})

export const newsSection = defineType({
  name: 'newsSection',
  title: 'Laatste nieuws',
  type: 'object',
  icon: BulbOutlineIcon,
  description: 'Toont automatisch de nieuwste berichten in de taal van de pagina.',
  fields: [
    heading,
    defineField({name: 'limit', title: 'Aantal berichten', type: 'number', initialValue: 3, validation: (rule) => rule.min(1).max(12).integer()}),
    defineField({
      name: 'postType',
      title: 'Alleen dit soort',
      type: 'string',
      options: {list: [{title: 'Nieuws', value: 'news'}, {title: 'Events', value: 'event'}, {title: 'Wijzigingen', value: 'change'}, {title: 'Community', value: 'community'}]},
    }),
  ],
  preview: headingPreview('Laatste nieuws'),
})

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call-to-action',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({...heading, validation: (rule) => rule.required()}),
    intro,
    defineField({name: 'cta', title: 'Knop', type: 'link', validation: (rule) => rule.required()}),
    defineField({name: 'note', title: 'Kleine regel onder de knop', type: 'string', description: 'Bijv. "3 lessen · 7 dagen · alle niveaus".'}),
  ],
  preview: headingPreview('Call-to-action'),
})

export const textSection = defineType({
  name: 'textSection',
  title: 'Tekst',
  type: 'object',
  icon: BlockContentIcon,
  fields: [heading, defineField({name: 'body', title: 'Tekst', type: 'blockContent'})],
  preview: headingPreview('Tekst'),
})

export const sectionTypes = [
  heroSection,
  marqueeSection,
  disciplinesSection,
  stepsSection,
  scheduleSection,
  testimonialsSection,
  pricingSection,
  faqSection,
  coachesSection,
  newsSection,
  ctaSection,
  textSection,
]

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Secties',
  type: 'array',
  of: sectionTypes.map((section) => defineArrayMember({type: section.name})),
})
