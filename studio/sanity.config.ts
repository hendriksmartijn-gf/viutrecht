import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {LOCALIZED_SINGLETONS, SINGLETONS, structure} from './structure'
import {BASE_LANGUAGE, LANGUAGES, LOCALIZED_TYPES} from './lib/i18n'

const FIXED_ID_TYPES = [...SINGLETONS, ...LOCALIZED_SINGLETONS]

export default defineConfig({
  name: 'default',
  title: 'VI Utrecht',

  projectId: 'uctw6cnz',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      // Singletons get their translations through fixed IDs in Structure instead.
      schemaTypes: LOCALIZED_TYPES.filter((type) => !LOCALIZED_SINGLETONS.includes(type)),
    }),
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: [BASE_LANGUAGE],
      fieldTypes: ['string', 'text'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // A language-preset template per localized singleton, used by Structure.
    templates: (prev) => [
      ...prev,
      ...LOCALIZED_SINGLETONS.flatMap((schemaType) =>
        LANGUAGES.map((language) => ({
          id: `${schemaType}-${language.id}`,
          title: `${schemaType} (${language.id})`,
          schemaType,
          value: {language: language.id},
        })),
      ),
    ],
  },

  document: {
    // Only allow creating localized docs with a language set, and never create singletons
    // from the global "New document" menu.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type !== 'global') return prev
      return prev.filter(
        (item) =>
          !LOCALIZED_TYPES.includes(item.templateId) &&
          !FIXED_ID_TYPES.some((type) => item.templateId.startsWith(type)),
      )
    },
    actions: (prev, {schemaType}) =>
      FIXED_ID_TYPES.includes(schemaType)
        ? prev.filter(({action}) => action && !['duplicate', 'delete', 'unpublish'].includes(action))
        : prev,
  },
})
