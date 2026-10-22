// Mirrors studio/lib/i18n.ts and studio/lib/routes.ts. Keep the two in sync.
export const LANGUAGES = ["nl", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const BASE_LANGUAGE: Language = "nl";

export const isLanguage = (value: string): value is Language =>
  (LANGUAGES as readonly string[]).includes(value);

export const HREFLANG: Record<Language, string> = { nl: "nl-NL", en: "en" };

// URL structure: Dutch at the root, English under /en.
export const ROUTE_PREFIXES = {
  discipline: { nl: "lessen", en: "classes" },
  program: { nl: "cursussen", en: "courses" },
  post: { nl: "nieuws", en: "news" },
} as const;

export type RoutableType = "homePage" | "page" | keyof typeof ROUTE_PREFIXES;

export function pathFor(
  type: string | null | undefined,
  language: string | null | undefined,
  slug?: string | null,
): string {
  const lang = language && isLanguage(language) ? language : BASE_LANGUAGE;
  const prefix =
    type && type in ROUTE_PREFIXES
      ? ROUTE_PREFIXES[type as keyof typeof ROUTE_PREFIXES][lang]
      : undefined;
  const parts = [
    lang === BASE_LANGUAGE ? undefined : lang,
    type === "homePage" ? undefined : prefix,
    type === "homePage" ? undefined : slug,
  ].filter(Boolean);
  return `/${parts.join("/")}`;
}

// Turns the catch-all segments after the language into the document to look up.
export function resolvePath(
  language: Language,
  segments: string[],
): { type: "page" | keyof typeof ROUTE_PREFIXES; slug: string } | null {
  if (segments.length === 1) return { type: "page", slug: segments[0] };
  if (segments.length !== 2) return null;
  const [prefix, slug] = segments;
  const match = (Object.keys(ROUTE_PREFIXES) as (keyof typeof ROUTE_PREFIXES)[]).find(
    (type) => ROUTE_PREFIXES[type][language] === prefix,
  );
  return match ? { type: match, slug } : null;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.viutrecht.nl").replace(/\/$/, "");

// Search engines may only index this site once it replaces the live one on www.viutrecht.nl.
// Until SITE_INDEXABLE=true, every deploy (vercel.app previews included) sends noindex, so it
// never competes with the current site for the same searches.
export const INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;

// Interface strings that are not content.
export const UI = {
  nl: {
    trial: "Boek een gratis proefweek",
    faq: "Veelgestelde vragen",
    perMonth: "per maand",
    perYear: "per jaar",
    once: "eenmalig",
    credits: "credits",
    unlimited: "Onbeperkt",
    readMore: "Lees meer",
    level: "Niveau",
    duration: "Duur",
    group: "Groep",
    minutes: "min",
    max: "max.",
    whatToBring: "Wat neem je mee?",
    home: "Home",
    classes: "Lessen",
    courses: "Cursussen",
    news: "Nieuws",
    schedule: "Bekijk het rooster",
    notFound: "Deze pagina bestaat niet (meer).",
    toHome: "Naar de homepage",
    rating: "op Google",
    reviews: "reviews",
    start: "Start",
    price: "Prijs",
    memberPrice: "Voor leden",
    signUp: "Schrijf je in",
    openingHours: "Openingstijden",
    address: "Adres",
    bookNow: "Boek nu",
    login: "Inloggen",
    mainMenu: "Hoofdmenu",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    viewAllClasses: "Bekijk alle lessen",
    step: "Stap",
    newsAll: "Alles",
    latestArticles: "Laatste artikelen",
    newestFirst: "Nieuwste eerst",
    loadMore: "Meer artikelen laden",
    shownOf: "{shown} van {total}",
    readStory: "Lees het verhaal",
    readOn: "Lees verder",
    minRead: "min lezen",
    newBadge: "Nieuw",
    noPosts: "Nog geen berichten. Kom snel terug.",
    newsFilters: "Filter op soort",
    inThisArticle: "In dit artikel",
    share: "Deel",
    copyLink: "Link",
    linkCopied: "Gekopieerd",
    shareMore: "Meer",
    tags: "Tags",
    moreFrom: "Meer",
    moreFromEmphasis: "uit de box.",
    allNews: "Alle nieuws",
    event: "Event",
    featured: "Uitgelicht",
    fromPerMonth: "Vanaf {price} per maand",
    contact: "Contact",
    viewClass: "Bekijk les",
    choose: "Kies",
    perClass: "per les",
    noSubscription: "Liever geen abonnement?",
    punchCard: "Strippenkaart",
    classUnit: "lessen",
    validFor: "geldig",
    months: "maanden",
    month: "maand",
    classesPerMonth: "lessen / maand",
    allClasses: "Alle lessen",
    openGym: "Open Gym",
    openPlatform: "Open Platform",
    routePlan: "Route plannen",
    facilities: "Faciliteiten",
    moreQuestions: "Nog een vraag?",
    googleScore: "Google-score",
    basedOn: "Op basis van",
    readReviews: "Lees alle reviews",
    memberSince: "lid sinds",
    today: "Vandaag bij VI",
    fullSchedule: "Volledig rooster",
    bookTrialClass: "Boek een gratis proefles",
    allTimes: "Alle tijden bekijken",
    tryIt: "Probeer het",
    firstClassFree: "Je eerste les is gratis.",
    goesWellWith: "Past goed bij",
    completePackage: "Train het",
    completePackageEmphasis: "complete pakket.",
    questions: "Vragen",
    faqText: "Veelgestelde",
    faqEmphasis: "vragen.",
    whatToBringLabel: "Wat neem je mee",
    maxGroup: "Max",
    breadcrumb: "Kruimelpad",
    previous: "Vorige",
    moreClasses: "Meer lessen bij VI",
    classesCount: "lessen",
    next: "Volgende",
  },
  en: {
    trial: "Book a free trial week",
    faq: "Frequently asked questions",
    perMonth: "per month",
    perYear: "per year",
    once: "one-off",
    credits: "credits",
    unlimited: "Unlimited",
    readMore: "Read more",
    level: "Level",
    duration: "Duration",
    group: "Group",
    minutes: "min",
    max: "max.",
    whatToBring: "What to bring",
    home: "Home",
    classes: "Classes",
    courses: "Courses",
    news: "News",
    schedule: "View the schedule",
    notFound: "This page doesn't exist (anymore).",
    toHome: "Go to the homepage",
    rating: "on Google",
    reviews: "reviews",
    start: "Starts",
    price: "Price",
    memberPrice: "For members",
    signUp: "Sign up",
    openingHours: "Opening hours",
    address: "Address",
    bookNow: "Book now",
    login: "Log in",
    mainMenu: "Main menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    viewAllClasses: "View all classes",
    step: "Step",
    newsAll: "All",
    latestArticles: "Latest articles",
    newestFirst: "Newest first",
    loadMore: "Load more articles",
    shownOf: "{shown} of {total}",
    readStory: "Read the story",
    readOn: "Read on",
    minRead: "min read",
    newBadge: "New",
    noPosts: "No posts yet. Check back soon.",
    newsFilters: "Filter by type",
    inThisArticle: "In this article",
    share: "Share",
    copyLink: "Link",
    linkCopied: "Copied",
    shareMore: "More",
    tags: "Tags",
    moreFrom: "More",
    moreFromEmphasis: "from the box.",
    allNews: "All news",
    event: "Event",
    featured: "Featured",
    fromPerMonth: "From {price} a month",
    contact: "Contact",
    viewClass: "View class",
    choose: "Choose",
    perClass: "per class",
    noSubscription: "Rather not subscribe?",
    punchCard: "Punch card",
    classUnit: "classes",
    validFor: "valid for",
    months: "months",
    month: "month",
    classesPerMonth: "classes / month",
    allClasses: "All classes",
    openGym: "Open Gym",
    openPlatform: "Open Platform",
    routePlan: "Get directions",
    facilities: "Facilities",
    moreQuestions: "Still have a question?",
    googleScore: "Google rating",
    basedOn: "Based on",
    readReviews: "Read all reviews",
    memberSince: "member since",
    today: "Today at VI",
    fullSchedule: "Full schedule",
    bookTrialClass: "Book a free trial class",
    allTimes: "See all times",
    tryIt: "Try it",
    firstClassFree: "Your first class is free.",
    goesWellWith: "Goes well with",
    completePackage: "Train the",
    completePackageEmphasis: "complete package.",
    questions: "Questions",
    faqText: "Frequently asked",
    faqEmphasis: "questions.",
    whatToBringLabel: "What to bring",
    maxGroup: "Max",
    breadcrumb: "Breadcrumb",
    previous: "Previous",
    moreClasses: "More classes at VI",
    classesCount: "classes",
    next: "Next",
  },
} satisfies Record<Language, Record<string, string>>;

// Labels for the kinds of posts (post.postType).
export const POST_TYPES: Record<Language, Record<string, string>> = {
  nl: { news: "Nieuws", event: "Events", change: "Rooster", community: "Community", training: "Training", nutrition: "Voeding" },
  en: { news: "News", event: "Events", change: "Schedule", community: "Community", training: "Training", nutrition: "Nutrition" },
};
