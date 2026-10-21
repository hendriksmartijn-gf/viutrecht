import {defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons/Clock'

const DAYS = [
  {title: 'Maandag', value: 'Monday'},
  {title: 'Dinsdag', value: 'Tuesday'},
  {title: 'Woensdag', value: 'Wednesday'},
  {title: 'Donderdag', value: 'Thursday'},
  {title: 'Vrijdag', value: 'Friday'},
  {title: 'Zaterdag', value: 'Saturday'},
  {title: 'Zondag', value: 'Sunday'},
]

// Values follow schema.org OpeningHoursSpecification so they map 1:1 to JSON-LD.
export const openingHours = defineType({
  name: 'openingHours',
  title: 'Openingstijden',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'days',
      title: 'Dagen',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: DAYS},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'opens', title: 'Open', type: 'string', validation: (rule) => rule.required().custom((v) => !v || /^([01]\d|2[0-3]):[0-5]\d$/.test(v) || 'Gebruik HH:MM')}),
    defineField({name: 'closes', title: 'Dicht', type: 'string', validation: (rule) => rule.required().custom((v) => !v || /^([01]\d|2[0-3]):[0-5]\d$/.test(v) || 'Gebruik HH:MM')}),
  ],
  preview: {
    select: {days: 'days', opens: 'opens', closes: 'closes'},
    prepare: ({days, opens, closes}) => ({
      title: (days ?? []).map((d: string) => DAYS.find((x) => x.value === d)?.title.slice(0, 2)).join(', '),
      subtitle: `${opens ?? '?'} – ${closes ?? '?'}`,
    }),
  },
})
