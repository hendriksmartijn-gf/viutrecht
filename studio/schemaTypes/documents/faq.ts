import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {languageField} from '../../lib/fields'

// One question per document, so the same answer can appear on the homepage and
// on several class pages while being maintained in one place.
export const faq = defineType({
  name: 'faq',
  title: 'Veelgestelde vraag',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    languageField,
    defineField({
      name: 'question',
      title: 'Vraag',
      type: 'string',
      description: 'Formuleer de vraag zoals iemand hem zou typen of hardop stellen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Antwoord',
      type: 'array',
      description: 'Begin met het directe antwoord (ja/nee, het bedrag, de tijd) en geef daarna pas de uitleg.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normaal', value: 'normal'}],
          lists: [{title: 'Opsomming', value: 'bullet'}],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          {title: 'Lidmaatschap & betalen', value: 'membership'},
          {title: 'Lessen & boeken', value: 'classes'},
          {title: 'Faciliteiten', value: 'facilities'},
          {title: 'Locatie & bereikbaarheid', value: 'location'},
          {title: 'Starten', value: 'getting-started'},
        ],
      },
    }),
  ],
  preview: {
    select: {title: 'question', language: 'language', category: 'category'},
    prepare: ({title, language, category}) => ({
      title,
      subtitle: [language?.toUpperCase(), category].filter(Boolean).join(' · '),
    }),
  },
})
