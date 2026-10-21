import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

// The business itself: one source for the footer, contact blocks, LocalBusiness JSON-LD
// and the facts AI assistants quote (address, hours, prices). Keep it identical to the
// Google Business Profile.
export const settings = defineType({
  name: 'settings',
  title: 'Instellingen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'business', title: 'Bedrijf', default: true},
    {name: 'booking', title: 'Boeken'},
    {name: 'reputation', title: 'Reviews'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'siteName', title: 'Naam', type: 'string', group: 'business', initialValue: 'VI Utrecht', validation: (rule) => rule.required()}),
    defineField({name: 'siteUrl', title: 'Domein', type: 'url', group: 'business', initialValue: 'https://www.viutrecht.nl', validation: (rule) => rule.required()}),
    defineField({name: 'logo', type: 'image', group: 'business'}),
    defineField({name: 'description', title: 'Omschrijving van de gym', type: 'internationalizedArrayText', group: 'business', description: 'Eén alinea: wat VI is, voor wie, waar. Wordt gebruikt in structured data.'}),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'object',
      group: 'business',
      fields: [
        defineField({name: 'street', title: 'Straat + nummer', type: 'string', initialValue: 'Steenovenweg 1-A'}),
        defineField({name: 'postalCode', title: 'Postcode', type: 'string', initialValue: '3532 AE'}),
        defineField({name: 'city', title: 'Plaats', type: 'string', initialValue: 'Utrecht'}),
        defineField({name: 'country', title: 'Land (ISO)', type: 'string', initialValue: 'NL'}),
        defineField({name: 'directions', title: 'Hoe vind je ons?', type: 'internationalizedArrayString', description: 'Bijv. "Naast Douwe Egberts, zoek de paarse deur".'}),
      ],
    }),
    defineField({name: 'geo', title: 'Locatie op de kaart', type: 'geopoint', group: 'business'}),
    defineField({name: 'mapsUrl', title: 'Google Maps-link', type: 'url', group: 'business'}),
    defineField({name: 'email', title: 'E-mail', type: 'string', group: 'business', validation: (rule) => rule.email()}),
    defineField({name: 'phone', title: 'Telefoon', type: 'string', group: 'business', description: 'Internationaal formaat: +31 30 123 4567'}),
    defineField({
      name: 'openingHours',
      title: 'Openingstijden',
      type: 'array',
      group: 'business',
      of: [defineArrayMember({type: 'openingHours'})],
    }),
    defineField({
      name: 'facilities',
      title: 'Faciliteiten',
      type: 'internationalizedArrayText',
      group: 'business',
      description: 'Bijv. "Kleedkamers, douches, kluisjes en parkeren voor de deur".',
    }),
    defineField({
      name: 'socials',
      title: 'Social media',
      type: 'array',
      group: 'business',
      of: [defineArrayMember({type: 'url'})],
    }),
    defineField({name: 'loginUrl', title: 'Inloggen (Sportbit)', type: 'url', group: 'booking'}),
    defineField({name: 'trialUrl', title: 'Gratis proefweek (Sportbit)', type: 'url', group: 'booking', validation: (rule) => rule.required()}),
    defineField({name: 'scheduleUrl', title: 'Rooster (Sportbit)', type: 'url', group: 'booking'}),
    defineField({name: 'annualDiscountPercent', title: 'Korting jaarabonnement (%)', type: 'number', group: 'booking', validation: (rule) => rule.min(0).max(100)}),
    defineField({
      name: 'rating',
      title: 'Google-score',
      type: 'object',
      group: 'reputation',
      description:
        'Neem de score letterlijk over uit het Google-bedrijfsprofiel en werk hem regelmatig bij. Wordt alleen zichtbaar getoond, niet als review-markup: Google staat zelf-geplaatste review-sterren voor een eigen bedrijf niet toe.',
      options: {columns: 3},
      fields: [
        defineField({name: 'value', title: 'Score', type: 'number', validation: (rule) => rule.min(1).max(5).precision(1)}),
        defineField({name: 'count', title: 'Aantal reviews', type: 'number', validation: (rule) => rule.min(0).integer()}),
        defineField({name: 'checkedAt', title: 'Gecontroleerd op', type: 'date'}),
      ],
    }),
    defineField({name: 'reviewsUrl', title: 'Link naar alle reviews', type: 'url', group: 'reputation', description: 'Bijv. het Google-bedrijfsprofiel.'}),
    defineField({
      name: 'defaultSeoImage',
      title: 'Standaard share-afbeelding',
      type: 'image',
      group: 'seo',
      description: 'Voor pagina’s zonder eigen afbeelding. 1200×630.',
    }),
  ],
  preview: {prepare: () => ({title: 'Instellingen'})},
})
