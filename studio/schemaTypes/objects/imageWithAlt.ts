import {defineField, defineType} from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Afbeelding',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt-tekst',
      type: 'string',
      description: 'Beschrijf wat er gebeurt, bijv. "Atleet doet een snatch in de gym van VI Utrecht".',
      validation: (rule) => rule.required().warning('Alt-tekst helpt toegankelijkheid en image search'),
    }),
  ],
})
