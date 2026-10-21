import { toPlainText, type PortableTextBlock } from "next-sanity";
import type {
  DISCIPLINE_QUERY_RESULT,
  POST_QUERY_RESULT,
  PROGRAM_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "../../sanity.types";
import { urlFor } from "./image";
import { absoluteUrl, HREFLANG, pathFor, SITE_URL, type Language } from "./i18n";

// Structured data is built from the same fields that render the page, so what machines
// read can't drift from what visitors see. No self-serving review/rating markup: Google
// doesn't allow it for a business's own site.

type Settings = NonNullable<SETTINGS_QUERY_RESULT>;

export const GYM_ID = `${SITE_URL}/#gym`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const imageUrl = (image: Parameters<typeof urlFor>[0] | null | undefined) =>
  image && typeof image === "object" && "asset" in image && image.asset
    ? urlFor(image).width(1200).height(630).fit("crop").url()
    : undefined;

function postalAddress(settings: Settings) {
  const a = settings.address;
  if (!a?.street) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: a.street,
    postalCode: a.postalCode ?? undefined,
    addressLocality: a.city ?? undefined,
    addressCountry: a.country ?? "NL",
  };
}

function offer(m: Settings["memberships"][number], lang: Language) {
  const interval = m.priceInterval === "year" ? "ANN" : m.priceInterval === "month" ? "MON" : undefined;
  return {
    "@type": "Offer",
    name: m.name,
    description: m.tagline ?? undefined,
    url: m.signupUrl ?? undefined,
    priceCurrency: "EUR",
    price: m.price,
    ...(interval && {
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: m.price,
        priceCurrency: "EUR",
        unitCode: interval,
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: interval },
      },
    }),
    // A punch card: the number of classes and how long it stays valid.
    ...(m.membershipType === "punchCard" && m.credits?.amount && { eligibleQuantity: { "@type": "QuantitativeValue", value: m.credits.amount } }),
    ...(m.membershipType === "punchCard" && m.validityMonths && { eligibleDuration: { "@type": "QuantitativeValue", value: m.validityMonths, unitCode: "MON" } }),
    availability: "https://schema.org/InStock",
    inLanguage: HREFLANG[lang],
  };
}

export function organizationJsonLd(settings: SETTINGS_QUERY_RESULT, lang: Language) {
  if (!settings) return null;
  return [
    {
      "@context": "https://schema.org",
      "@type": ["SportsActivityLocation", "ExerciseGym"],
      "@id": GYM_ID,
      name: settings.siteName ?? "VI Utrecht",
      url: absoluteUrl(pathFor("homePage", lang)),
      description: settings.description ?? undefined,
      logo: imageUrl(settings.logo),
      image: imageUrl(settings.defaultSeoImage) ?? imageUrl(settings.logo),
      email: settings.email ?? undefined,
      telephone: settings.phone ?? undefined,
      address: postalAddress(settings),
      geo: settings.geo?.lat
        ? { "@type": "GeoCoordinates", latitude: settings.geo.lat, longitude: settings.geo.lng }
        : undefined,
      hasMap: settings.mapsUrl ?? undefined,
      sameAs: settings.socials?.length ? settings.socials : undefined,
      openingHoursSpecification: settings.openingHours?.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
      hasOfferCatalog: settings.memberships.length
        ? {
            "@type": "OfferCatalog",
            name: lang === "nl" ? "Lidmaatschappen" : "Memberships",
            itemListElement: settings.memberships.map((m) => offer(m, lang)),
          }
        : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: settings.siteName ?? "VI Utrecht",
      inLanguage: ["nl-NL", "en"],
      publisher: { "@id": GYM_ID },
    },
  ];
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type Faq = { question?: string | null; answer?: readonly object[] | null };

export function faqJsonLd(faqs: (Faq | null)[] | null | undefined) {
  const items = (faqs ?? []).filter((f): f is Faq => Boolean(f?.question && f.answer?.length));
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: toPlainText((f.answer ?? []) as PortableTextBlock[]) },
    })),
  };
}

export function disciplineJsonLd(d: NonNullable<DISCIPLINE_QUERY_RESULT>, lang: Language) {
  const url = absoluteUrl(pathFor("discipline", lang, d.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: d.title,
    serviceType: d.title,
    description: d.summary ?? undefined,
    url,
    image: imageUrl(d.heroImage),
    inLanguage: HREFLANG[lang],
    provider: { "@id": GYM_ID },
    areaServed: { "@type": "City", name: "Utrecht" },
    audience: d.level?.from
      ? { "@type": "PeopleAudience", audienceType: [d.level.from, d.level.to].filter(Boolean).join(" – ") }
      : undefined,
  };
}

export function programJsonLd(p: NonNullable<PROGRAM_QUERY_RESULT>, lang: Language, settings: SETTINGS_QUERY_RESULT) {
  const url = absoluteUrl(pathFor("program", lang, p.slug));
  return {
    "@context": "https://schema.org",
    "@type": p.programType === "event" ? "SportsEvent" : "EducationEvent",
    name: p.title,
    description: p.summary ?? undefined,
    url,
    image: imageUrl(p.heroImage),
    inLanguage: HREFLANG[lang],
    startDate: p.startDate ?? undefined,
    endDate: p.endDate ?? undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    maximumAttendeeCapacity: p.participants?.max ?? undefined,
    location: {
      "@type": "Place",
      "@id": GYM_ID,
      name: settings?.siteName ?? "VI Utrecht",
      address: settings ? postalAddress(settings) : undefined,
    },
    organizer: { "@id": GYM_ID },
    offers:
      p.price?.regular != null
        ? {
            "@type": "Offer",
            price: p.price.regular,
            priceCurrency: "EUR",
            url: p.signupUrl ?? url,
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };
}

export function postJsonLd(p: NonNullable<POST_QUERY_RESULT>, lang: Language) {
  const url = absoluteUrl(pathFor("post", lang, p.slug));
  return {
    "@context": "https://schema.org",
    "@type": p.postType === "news" || p.postType === "change" ? "NewsArticle" : "BlogPosting",
    headline: p.title,
    description: p.summary ?? undefined,
    url,
    mainEntityOfPage: url,
    image: imageUrl(p.heroImage),
    inLanguage: HREFLANG[lang],
    datePublished: p.publishedAt ?? undefined,
    dateModified: p._updatedAt,
    expires: p.relevantUntil ?? undefined,
    author: p.author
      ? { "@type": "Person", name: p.author.name, jobTitle: p.author.role ?? undefined }
      : { "@id": GYM_ID },
    publisher: { "@id": GYM_ID },
  };
}

const PAGE_TYPES: Record<string, string> = {
  about: "AboutPage",
  contact: "ContactPage",
  collection: "CollectionPage",
  blog: "CollectionPage",
};

export function webPageJsonLd(opts: { pageType?: string | null; title: string; path: string; lang: Language; description?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": PAGE_TYPES[opts.pageType ?? ""] ?? "WebPage",
    name: opts.title,
    url: absoluteUrl(opts.path),
    description: opts.description ?? undefined,
    inLanguage: HREFLANG[opts.lang],
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": GYM_ID },
  };
}
