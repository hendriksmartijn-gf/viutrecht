import {defineArrayMember, defineField, defineType} from 'sanity'
import {CreditCardIcon} from '@sanity/icons/CreditCard'

// Price and credits live once, shared by both languages, so NL and EN can never
// show different prices. Values map to a schema.org Offer.
export const membership = defineType({
  name: 'membership',
  title: 'Lidmaatschap',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({name: 'name', title: 'Naam', type: 'string', description: 'Bijv. "VI Core".', validation: (rule) => rule.required()}),
    defineField({
      name: 'membershipType',
      title: 'Soort',
      type: 'string',
      initialValue: 'subscription',
      options: {
        list: [
          {title: 'Abonnement', value: 'subscription'},
          {title: 'Rittenkaart', value: 'punchCard'},
          {title: 'Drop-in', value: 'dropIn'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'price',
      title: 'Prijs (€, incl. btw)',
      type: 'number',
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'priceInterval',
      title: 'Per',
      type: 'string',
      initialValue: 'month',
      options: {
        list: [
          {title: 'Maand', value: 'month'},
          {title: 'Jaar', value: 'year'},
          {title: 'Eenmalig', value: 'once'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'object',
      options: {columns: 2},
      fields: [
        defineField({name: 'amount', title: 'Aantal', type: 'number', hidden: ({parent}) => parent?.unlimited}),
        defineField({name: 'unlimited', title: 'Onbeperkt', type: 'boolean', initialValue: false}),
        defineField({
          name: 'per',
          title: 'Per',
          type: 'string',
          initialValue: 'month',
          options: {list: [{title: 'Maand', value: 'month'}, {title: 'Totaal', value: 'total'}]},
        }),
      ],
    }),
    defineField({name: 'validityMonths', title: 'Geldigheid (maanden)', type: 'number', description: 'Voor rittenkaarten.', hidden: ({document}) => document?.membershipType !== 'punchCard'}),
    defineField({name: 'tagline', title: 'Korte omschrijving', type: 'internationalizedArrayString', description: 'Bijv. "Blijf on track met 9 sessies per maand".'}),
    defineField({
      name: 'access',
      title: 'Toegang tot',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Alle lessen', value: 'classes'},
          {title: 'Open Gym', value: 'openGym'},
          {title: 'Open Platform', value: 'openPlatform'},
        ],
      },
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Staat in de knop, bijv. 🙌, 🔥 of 🚀.',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'featured',
      title: 'Uitlichten',
      type: 'boolean',
      description: 'Geeft dit abonnement de opvallende kaart in de prijzentabel.',
      initialValue: false,
    }),
    defineField({name: 'badge', title: 'Label', type: 'internationalizedArrayString', description: 'Bijv. "Meest gekozen".'}),
    defineField({name: 'signupUrl', title: 'Aanmeldlink (Sportbit)', type: 'url', validation: (rule) => rule.required()}),
    defineField({name: 'orderRank', title: 'Volgorde', type: 'number'}),
  ],
  orderings: [{title: 'Volgorde', name: 'order', by: [{field: 'orderRank', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', price: 'price', interval: 'priceInterval'},
    prepare: ({title, price, interval}) => ({
      title,
      subtitle: price != null ? `€ ${price.toFixed(2).replace('.', ',')}${interval === 'once' ? '' : ` / ${interval === 'year' ? 'jaar' : 'maand'}`}` : undefined,
    }),
  },
})
