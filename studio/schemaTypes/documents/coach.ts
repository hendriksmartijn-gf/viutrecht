import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
import {DISCIPLINES} from '../../lib/fields'

// One document per person, translated per field: name and photo never differ by language.
// Certifications are what make coaching expertise verifiable (for people and for search).
export const coach = defineType({
  name: 'coach',
  title: 'Coach',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', title: 'Naam', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'photo', title: 'Foto', type: 'imageWithAlt'}),
    defineField({name: 'role', title: 'Rol', type: 'internationalizedArrayString', description: 'Bijv. "Head Coach", "Weightlifting Coach".'}),
    defineField({name: 'bio', title: 'Bio', type: 'internationalizedArrayText'}),
    defineField({
      name: 'specialties',
      title: 'Specialisaties',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {list: DISCIPLINES},
    }),
    defineField({
      name: 'certifications',
      title: 'Certificeringen',
      type: 'array',
      description: 'Bijv. "CrossFit Level 2 Trainer", "HYROX Master Trainer", "KNGB Trainer B".',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
    defineField({name: 'orderRank', title: 'Volgorde', type: 'number'}),
  ],
  orderings: [{title: 'Volgorde', name: 'order', by: [{field: 'orderRank', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', role: 'role', media: 'photo'},
    prepare: ({title, role, media}) => ({
      title,
      subtitle: role?.find((r: {language?: string}) => r.language === 'nl')?.value,
      media,
    }),
  },
})
