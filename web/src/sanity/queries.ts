import { defineQuery } from "next-sanity";

// Fragments. Localized docs are filtered by `language`; language-neutral docs
// (coach, membership, settings) read their field-level translations with $lang.

const LINK = /* groq */ `{
  label,
  linkType,
  url,
  emoji,
  "internal": internal->{_type, language, "slug": slug.current, emoji, pageType}
}`;

const IMAGE = /* groq */ `{
  asset,
  hotspot,
  crop,
  alt,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

const DISCIPLINE_CARD = /* groq */ `{
  _id,
  _type,
  language,
  key,
  title,
  "slug": slug.current,
  summary,
  tagline,
  audienceLabel,
  emoji,
  "image": coalesce(cardImage, heroImage)${IMAGE}
}`;

// Resolve internal link annotations so the frontend can build paths.
const BODY = /* groq */ `[]{
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {"reference": reference->{_type, language, slug}}
  }
}`;

const FAQ = /* groq */ `{_id, question, answer}`;

const COACH = /* groq */ `{
  _id,
  name,
  "role": coalesce(role[language == $lang][0].value, role[language == "nl"][0].value),
  "bio": coalesce(bio[language == $lang][0].value, bio[language == "nl"][0].value),
  specialties,
  certifications,
  instagram,
  photo${IMAGE}
}`;

const MEMBERSHIP = /* groq */ `{
  _id,
  name,
  membershipType,
  price,
  priceInterval,
  credits,
  validityMonths,
  access,
  signupUrl,
  featured,
  emoji,
  "tagline": coalesce(tagline[language == $lang][0].value, tagline[language == "nl"][0].value),
  "badge": coalesce(badge[language == $lang][0].value, badge[language == "nl"][0].value)
}`;

const TESTIMONIAL = /* groq */ `{_id, quote, quoteLanguage, authorName, memberSince, discipline, photo${IMAGE}}`;

const POST_CARD = /* groq */ `{
  _id,
  _type,
  language,
  title,
  "slug": slug.current,
  postType,
  publishedAt,
  summary,
  heroImage${IMAGE}
}`;

// Temporary announcements drop out of lists and the sitemap after their date.
const POST_IS_CURRENT = /* groq */ `(!defined(relevantUntil) || relevantUntil >= string::split(string(now()), "T")[0])`;

const SECTIONS = /* groq */ `sections[]{
  _key,
  _type,
  heading,
  intro,
  _type == "heroSection" => {eyebrow, showRating, trustItems[]{_key, _type, label, value, name, "logo": logo.asset->{url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}}, image${IMAGE}, primaryCta${LINK}, secondaryCta${LINK}},
  _type == "introSection" => {primaryCta${LINK}, secondaryCta${LINK}, image${IMAGE}},
  _type == "storySection" => {lead, body, card},
  _type == "valuesSection" => {values[]{_key, title, description}},
  _type == "statementSection" => {text, closing},
  _type == "marqueeSection" => {"items": *[_type == "discipline" && language == $lang] | order(orderRank asc){_id, title}},
  _type == "disciplinesSection" => {
    cta${LINK},
    "items": select(
      count(disciplines) > 0 => disciplines[]->${DISCIPLINE_CARD},
      *[_type == "discipline" && language == $lang] | order(orderRank asc)${DISCIPLINE_CARD}
    )
  },
  _type == "stepsSection" => {steps[]{_key, title, description}, cta${LINK}},
  _type == "scheduleSection" => {discipline},
  _type == "testimonialsSection" => {showRating, "items": testimonials[]->${TESTIMONIAL}},
  _type == "pricingSection" => {
    "items": select(
      count(memberships) > 0 => memberships[]->${MEMBERSHIP},
      *[_type == "membership" && coalesce(membershipType, "subscription") == "subscription"] | order(orderRank asc)${MEMBERSHIP}
    ),
    "punchCard": coalesce(punchCard->${MEMBERSHIP}, *[_type == "membership" && membershipType == "punchCard"] | order(orderRank asc)[0]${MEMBERSHIP}),
    footnote,
    secondaryCta${LINK},
    cta${LINK}
  },
  _type == "faqSection" => {showContactInfo, image${IMAGE}, cta${LINK}, "items": faqs[]->${FAQ}},
  _type == "coachesSection" => {
    "items": select(
      count(coaches) > 0 => coaches[]->${COACH},
      *[_type == "coach"] | order(orderRank asc)${COACH}
    )
  },
  _type == "newsSection" => {
    "items": *[
      _type == "post" && language == $lang && defined(slug.current) && ${POST_IS_CURRENT} &&
      (!defined(^.postType) || postType == ^.postType)
    ] | order(publishedAt desc)[0...12]${POST_CARD},
    limit
  },
  _type == "ctaSection" => {cta${LINK}, note},
  _type == "textSection" => {"body": body${BODY}}
}`;

const TRANSLATIONS = /* groq */ `"translations": *[_type == "translation.metadata" && references(^._id)][0].translations[].value->{
  _type,
  language,
  "slug": slug.current
}`;

// Queries

export const SETTINGS_QUERY = defineQuery(`*[_type == "settings" && _id == "settings"][0]{
  siteName,
  siteUrl,
  logo,
  "description": coalesce(description[language == $lang][0].value, description[language == "nl"][0].value),
  address{street, postalCode, city, country, "directions": coalesce(directions[language == $lang][0].value, directions[language == "nl"][0].value)},
  geo,
  mapsUrl,
  email,
  phone,
  openingHours[]{days, opens, closes},
  socials,
  "facilities": coalesce(facilities[language == $lang][0].value, facilities[language == "nl"][0].value),
  loginUrl,
  reviewsUrl,
  trialUrl,
  scheduleUrl,
  annualDiscountPercent,
  rating,
  defaultSeoImage,
  "memberships": *[_type == "membership"] | order(orderRank asc)${MEMBERSHIP}
}`);

// The mega menu's featured card: the next course or event with a photo, else the newest current
// post with one.
export const NAVIGATION_QUERY = defineQuery(`*[_type == "navigation" && _id == "navigation-" + $lang][0]{
  announcement,
  classesMenu{
    label,
    "overview": overview->{_type, language, "slug": slug.current},
    "items": *[_type == "discipline" && language == $lang && defined(slug.current)] | order(orderRank asc){
      _id, _type, language, title, emoji, "slug": slug.current, tagline, audienceLabel, "image": coalesce(cardImage, heroImage)${IMAGE}
    },
    quickLinksTitle,
    quickLinks[]{_key, link${LINK}, description},
    promo{chips, heading, text, link${LINK}},
    eventsLink${LINK},
    "nextEvent": *[_type == "program" && language == $lang && defined(slug.current) && defined(heroImage.asset) && startDate >= now()] | order(startDate asc)[0]{
        _id, _type, language, title, "slug": slug.current, summary, "image": heroImage${IMAGE}
    },
    "latestPost": *[_type == "post" && language == $lang && defined(slug.current) && defined(heroImage.asset) && ${POST_IS_CURRENT}] | order(publishedAt desc)[0]{
        _id, _type, language, title, "slug": slug.current, summary, "image": heroImage${IMAGE}
    }
  },
  header[]${LINK},
  headerCta${LINK},
  footerColumns[]{_key, title, links[]${LINK}},
  legal[]${LINK},
  footerText,
  footerBadges,
  slogan
}`);

export const HOME_QUERY = defineQuery(`*[_type == "homePage" && _id == "homePage-" + $lang][0]{
  _id,
  _type,
  _updatedAt,
  language,
  seo,
  ${SECTIONS}
}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && language == $lang && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  language,
  title,
  "slug": slug.current,
  pageType,
  summary,
  "body": body${BODY},
  seo,
  ${SECTIONS},
  ${TRANSLATIONS}
}`);

export const DISCIPLINE_QUERY = defineQuery(`*[_type == "discipline" && language == $lang && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  language,
  key,
  title,
  "slug": slug.current,
  heading,
  summary,
  heroImage${IMAGE},
  level,
  durationMinutes,
  maxGroupSize,
  bookingType,
  extraFacts[]{_key, label, value},
  essentials{heading, intro, image${IMAGE}, items[]{_key, title, description}},
  benefits,
  lessonOutline,
  "body": body${BODY},
  "coaches": select(
    count(coaches) > 0 => coaches[]->${COACH},
    *[_type == "coach" && ^.key in specialties] | order(orderRank asc)${COACH}
  ),
  "testimonial": testimonial->${TESTIMONIAL},
  "faqs": faqs[]->${FAQ},
  "related": related[]->${DISCIPLINE_CARD},
  promise{label, quote, "coach": coach->${COACH}},
  faqHeading,
  ctaText,
  "news": *[_type == "post" && language == $lang && ^.key in disciplines && ${POST_IS_CURRENT}] | order(publishedAt desc)[0...3]${POST_CARD},
  sportbitClassNames,
  seo,
  ${TRANSLATIONS}
}`);

export const PROGRAM_QUERY = defineQuery(`*[_type == "program" && language == $lang && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  language,
  title,
  "slug": slug.current,
  programType,
  discipline,
  heading,
  summary,
  heroImage${IMAGE},
  "body": body${BODY},
  includes,
  startDate,
  endDate,
  sessions[]{_key, label, value},
  sessionCount,
  participants,
  price,
  signupUrl,
  "faqs": faqs[]->${FAQ},
  seo,
  ${TRANSLATIONS}
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && language == $lang && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  language,
  title,
  "slug": slug.current,
  postType,
  publishedAt,
  relevantUntil,
  "isCurrent": ${POST_IS_CURRENT},
  summary,
  heroImage${IMAGE},
  "body": body${BODY},
  "author": author->${COACH},
  "program": program->{_type, language, title, "slug": slug.current, startDate},
  seo,
  ${TRANSLATIONS}
}`);

// Every routable document, for generateStaticParams and the sitemap.
export const ROUTES_QUERY = defineQuery(`*[
  _type in ["homePage", "page", "discipline", "program", "post"] &&
  defined(language) &&
  (_type == "homePage" || defined(slug.current)) &&
  !(_id in path("drafts.**"))
]{
  _id,
  _type,
  _updatedAt,
  language,
  "slug": slug.current,
  "noIndex": seo.noIndex == true || (_type == "post" && !${POST_IS_CURRENT}),
  ${TRANSLATIONS}
}`);

export const REDIRECTS_QUERY = defineQuery(`*[_type == "redirect" && isEnabled == true && defined(source) && defined(destination)]{
  source,
  destination,
  permanent
}`);
