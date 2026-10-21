import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

// Optional overrides: the frontend falls back to title/summary/heroImage when empty.
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Laat leeg om de titel te gebruiken. Max ~60 tekens, zoekwoord vooraan, eindig met "| VI Utrecht".',
      validation: (rule) =>
        rule.max(60).warning('Langer dan 60 tekens wordt vaak afgekapt in Google'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Laat leeg om de samenvatting te gebruiken. 120–160 tekens: wat krijg je, voor wie, en de actie.',
      validation: (rule) => [
        rule.max(160).warning('Langer dan 160 tekens wordt vaak afgekapt'),
        rule.min(70).warning('Korter dan 70 tekens benut de ruimte niet'),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Social share-afbeelding',
      type: 'image',
      description: 'Laat leeg om de hero-afbeelding te gebruiken. 1200×630.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Verbergen voor zoekmachines',
      type: 'boolean',
      description: 'Alleen voor bedankpagina’s, tijdelijke acties en dergelijke. Haalt de pagina ook uit de sitemap.',
      initialValue: false,
    }),
  ],
})
