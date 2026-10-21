import {defineField, defineType} from 'sanity'

export const keyFact = defineType({
  name: 'keyFact',
  title: 'Kenmerk',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'value', title: 'Waarde', type: 'string', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'value', subtitle: 'label'}},
})
