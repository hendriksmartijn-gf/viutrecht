import {defineField, defineType} from 'sanity'

// Headings in the design pair a statement with an emphasised continuation:
// "Van beginner tot" + "doorgewinterde pro." The two parts render as one heading element.
export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Kop',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Label erboven',
      type: 'string',
      description: 'Klein label boven de kop, bijv. "Je eerste week". Het nummer ([ 01 ]) komt er automatisch voor.',
    }),
    defineField({name: 'text', title: 'Tekst', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'emphasis', title: 'Nadruk (vervolg)', type: 'string'}),
  ],
})
