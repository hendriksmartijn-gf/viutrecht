import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {MenuIcon} from '@sanity/icons/Menu'
import {API_VERSION, LANGUAGES} from './lib/i18n'

const SINGLETONS = ['settings']
const LOCALIZED_SINGLETONS = ['homePage', 'navigation']

// One fixed document per language, e.g. homePage-nl and homePage-en.
function localizedSingleton(S: StructureBuilder, type: string, title: string, icon: ComponentType) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items(
          LANGUAGES.map((language) =>
            S.listItem()
              .title(`${title} (${language.id.toUpperCase()})`)
              .icon(icon)
              .child(
                S.document()
                  .schemaType(type)
                  .documentId(`${type}-${language.id}`)
                  .initialValueTemplate(`${type}-${language.id}`)
                  .title(`${title} (${language.title})`),
              ),
          ),
        ),
    )
}

// Translated document types, split by language so editors see one version at a time.
function localizedList(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .title(title)
    .schemaType(type)
    .child(
      S.list()
        .title(title)
        .items(
          LANGUAGES.map((language) =>
            S.listItem()
              .title(language.title)
              .schemaType(type)
              .child(
                S.documentList()
                  .title(`${title} (${language.id.toUpperCase()})`)
                  .schemaType(type)
                  .apiVersion(API_VERSION)
                  .filter('_type == $type && language == $language')
                  .params({type, language: language.id})
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${language.id}`)]),
              ),
          ),
        ),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Instellingen')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('settings').title('Instellingen')),
      localizedSingleton(S, 'homePage', 'Homepage', HomeIcon),
      localizedSingleton(S, 'navigation', 'Navigatie', MenuIcon),
      S.divider(),
      localizedList(S, 'discipline', 'Lessen'),
      localizedList(S, 'program', 'Cursussen & events'),
      localizedList(S, 'post', 'Nieuws'),
      localizedList(S, 'page', "Pagina's"),
      localizedList(S, 'faq', 'Veelgestelde vragen'),
      S.divider(),
      S.documentTypeListItem('membership').title('Lidmaatschappen'),
      S.documentTypeListItem('coach').title('Coaches'),
      S.documentTypeListItem('testimonial').title('Ervaringen'),
      S.divider(),
      S.documentTypeListItem('redirect').title('Redirects'),
    ])

export {SINGLETONS, LOCALIZED_SINGLETONS}
