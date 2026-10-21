import {blockContent} from './objects/blockContent'
import {imageWithAlt} from './objects/imageWithAlt'
import {keyFact} from './objects/keyFact'
import {link} from './objects/link'
import {openingHours} from './objects/openingHours'
import {sectionHeading} from './objects/sectionHeading'
import {trustLogo} from './objects/trustLogo'
import {seo} from './objects/seo'
import {pageBuilder, sectionTypes} from './sections'
import {coach} from './documents/coach'
import {discipline} from './documents/discipline'
import {faq} from './documents/faq'
import {homePage} from './documents/homePage'
import {membership} from './documents/membership'
import {navigation} from './documents/navigation'
import {page} from './documents/page'
import {post} from './documents/post'
import {program} from './documents/program'
import {redirect} from './documents/redirect'
import {settings} from './documents/settings'
import {testimonial} from './documents/testimonial'

export const schemaTypes = [
  // Documents
  settings,
  navigation,
  homePage,
  page,
  discipline,
  program,
  post,
  faq,
  coach,
  membership,
  testimonial,
  redirect,
  // Objects
  seo,
  link,
  sectionHeading,
  blockContent,
  imageWithAlt,
  keyFact,
  trustLogo,
  openingHours,
  pageBuilder,
  ...sectionTypes,
]
