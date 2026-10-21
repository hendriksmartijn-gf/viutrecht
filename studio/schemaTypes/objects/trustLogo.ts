import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

// An official partner or certification logo (e.g. HYROX, CrossFit Affiliate). Use the
// white version from the brand's own kit; it sits on the dark hero. Until a logo is uploaded the
// hero shows the name as text, so the slot can be prepared before the file is there.
export const trustLogo = defineType({
  name: 'trustLogo',
  title: 'Logo',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      description: 'Wordt de alt-tekst, bijv. "Officiële HYROX Gym".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Liefst SVG, in het wit. Zonder logo staat de naam er als tekst.',
      options: {accept: 'image/svg+xml,image/png,image/webp'},
      validation: (rule) => rule.required().warning('Upload het officiële logo; tot die tijd staat de naam er als tekst'),
    }),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})
