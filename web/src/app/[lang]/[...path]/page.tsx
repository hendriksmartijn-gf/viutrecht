import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type {
  DISCIPLINE_QUERY_RESULT,
  PAGE_QUERY_RESULT,
  POST_QUERY_RESULT,
  PROGRAM_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "../../../../sanity.types";
import { Faqs } from "@/components/Faqs";
import { Heading } from "@/components/Heading";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { Sections } from "@/components/Sections";
import { DisciplinePage } from "@/components/DisciplinePage";
import { getDiscipline, getHome, getPage, getPost, getProgram, getRoutes, getSettings } from "@/sanity/fetch";
import { isLanguage, pathFor, resolvePath, ROUTE_PREFIXES, UI, type Language } from "@/sanity/i18n";
import {
  breadcrumbJsonLd,
  disciplineJsonLd,
  faqJsonLd,
  postJsonLd,
  programJsonLd,
  webPageJsonLd,
} from "@/sanity/jsonld";
import { buildMetadata } from "@/sanity/metadata";

type Params = PageProps<"/[lang]/[...path]">["params"];

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const routes = await getRoutes();
  const paths = routes
    .filter((r) => r._type !== "homePage" && r.language === params.lang && r.slug)
    .map((r) => ({ path: pathFor(r._type, r.language, r.slug).split("/").filter(Boolean).slice(params.lang === "nl" ? 0 : 1) }));
  // Cache Components needs at least one entry; the placeholder renders a 404.
  return paths.length ? paths : [{ path: ["_"] }];
}

async function load(params: Params) {
  const { lang, path } = await params;
  if (!isLanguage(lang)) return null;
  const route = resolvePath(lang, path);
  if (!route) return null;
  switch (route.type) {
    case "page": {
      const doc = await getPage(lang, route.slug);
      return doc ? ({ kind: "page", lang, doc } as const) : null;
    }
    case "discipline": {
      const doc = await getDiscipline(lang, route.slug);
      return doc ? ({ kind: "discipline", lang, doc } as const) : null;
    }
    case "program": {
      const doc = await getProgram(lang, route.slug);
      return doc ? ({ kind: "program", lang, doc } as const) : null;
    }
    case "post": {
      const doc = await getPost(lang, route.slug);
      return doc ? ({ kind: "post", lang, doc } as const) : null;
    }
  }
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[...path]">): Promise<Metadata> {
  const result = await load(params);
  if (!result) return {};
  const { lang, doc } = result;
  const base = { lang, slug: doc.slug, seo: doc.seo, translations: doc.translations };
  switch (result.kind) {
    case "page":
      return buildMetadata({ ...base, type: "page", title: result.doc.title, summary: result.doc.summary });
    case "discipline":
      return buildMetadata({ ...base, type: "discipline", title: result.doc.title, summary: result.doc.summary, image: result.doc.heroImage });
    case "program":
      return buildMetadata({ ...base, type: "program", title: result.doc.title, summary: result.doc.summary, image: result.doc.heroImage });
    case "post":
      return buildMetadata({
        ...base,
        type: "post",
        title: result.doc.title,
        summary: result.doc.summary,
        image: result.doc.heroImage,
        // Expired announcements stay reachable for old links but leave the index.
        noIndex: !result.doc.isCurrent,
        ogType: "article",
      });
  }
}

export default async function RoutePage({ params }: PageProps<"/[lang]/[...path]">) {
  const result = await load(params);
  if (!result) notFound();
  const [settings, routes] = await Promise.all([getSettings(result.lang), getRoutes()]);
  const overviews = Object.fromEntries(
    (Object.keys(ROUTE_PREFIXES) as (keyof typeof ROUTE_PREFIXES)[]).map((type) => [
      type,
      routes.some((r) => r._type === "page" && r.language === result.lang && r.slug === ROUTE_PREFIXES[type][result.lang]),
    ]),
  ) as Overviews;
  // Page-builder pages bring their own section layout; templated pages share one column.
  const column = "mx-auto w-full max-w-[1280px] px-6 md:px-12";
  // Motion sits inside the page so its effect runs after this page has hydrated.
  return (
    <>
      {renderKind()}
      <Motion />
    </>
  );

  function renderKind() {
    if (!result) return null;
    switch (result.kind) {
      case "page":
        return <PageView doc={result.doc} lang={result.lang} settings={settings} />;
      case "discipline":
        return <DisciplineView doc={result.doc} lang={result.lang} overviews={overviews} settings={settings} />;
      case "program":
        return (
          <div className={column}>
            <ProgramView doc={result.doc} lang={result.lang} overviews={overviews} settings={settings} />
          </div>
        );
      case "post":
        return (
          <div className={column}>
            <PostView doc={result.doc} lang={result.lang} overviews={overviews} />
          </div>
        );
    }
  }
}

type Overviews = Partial<Record<keyof typeof ROUTE_PREFIXES, boolean>>;

function crumbs(
  lang: Language,
  section: keyof typeof ROUTE_PREFIXES | null,
  current: { name: string; path: string },
  overviews: Overviews = {},
) {
  const t = UI[lang];
  const sectionName = { discipline: t.classes, program: t.courses, post: t.news };
  return breadcrumbJsonLd([
    { name: t.home, path: pathFor("homePage", lang) },
    // The section crumb points at the overview page that shares the prefix (e.g. /lessen),
    // but only once that page exists, so the breadcrumb never links to a 404.
    ...(section && overviews[section] ? [{ name: sectionName[section], path: pathFor("page", lang, ROUTE_PREFIXES[section][lang]) }] : []),
    current,
  ]);
}

function PageView({ doc, lang, settings }: { doc: NonNullable<PAGE_QUERY_RESULT>; lang: Language; settings: SETTINGS_QUERY_RESULT }) {
  const path = pathFor("page", lang, doc.slug);
  const startsWithHero = ["heroSection", "introSection"].includes(doc.sections?.[0]?._type ?? "");
  const faqs = doc.sections?.flatMap((s) => (s._type === "faqSection" ? (s.items ?? []) : []));
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ pageType: doc.pageType, title: doc.title ?? "", path, lang, description: doc.summary }),
          crumbs(lang, null, { name: doc.title ?? "", path }),
          faqJsonLd(faqs),
        ].filter(Boolean) as object[]}
      />
      {/* Pages without a hero still get exactly one H1. */}
      {!startsWithHero && <h1 className="mx-auto w-full max-w-[1280px] px-6 py-12 text-5xl font-bold tracking-[-0.04em] md:px-12">{doc.title}</h1>}
      <Sections sections={doc.sections} lang={lang} settings={settings} pageTitle={doc.title} />
      <RichText value={doc.body} />
    </>
  );
}

async function DisciplineView({ doc, lang, settings, overviews }: { doc: NonNullable<DISCIPLINE_QUERY_RESULT>; lang: Language; settings: SETTINGS_QUERY_RESULT; overviews: Overviews }) {
  const path = pathFor("discipline", lang, doc.slug);
  const home = await getHome(lang);
  const cta = home?.sections?.find((s) => s._type === "ctaSection");
  return (
    <>
      <JsonLd
        data={[disciplineJsonLd(doc, lang), crumbs(lang, "discipline", { name: doc.title ?? "", path }, overviews), faqJsonLd(doc.faqs)].filter(Boolean) as object[]}
      />
      <DisciplinePage
        doc={doc}
        lang={lang}
        settings={settings}
        cta={cta?._type === "ctaSection" ? cta : null}
        overviewPath={overviews.discipline ? pathFor("page", lang, ROUTE_PREFIXES.discipline[lang]) : null}
      />
    </>
  );
}

function ProgramView({ doc, lang, settings, overviews }: { doc: NonNullable<PROGRAM_QUERY_RESULT>; lang: Language; settings: SETTINGS_QUERY_RESULT; overviews: Overviews }) {
  const t = UI[lang];
  const path = pathFor("program", lang, doc.slug);
  const date = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const eur = (n?: number | null) =>
    n != null ? new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", { style: "currency", currency: "EUR" }).format(n) : null;
  return (
    <article>
      <JsonLd data={[programJsonLd(doc, lang, settings), crumbs(lang, "program", { name: doc.title ?? "", path }, overviews), faqJsonLd(doc.faqs)].filter(Boolean) as object[]} />
      <header className="py-12">
        <Heading value={doc.heading} as="h1" className="text-5xl font-semibold" />
        <p className="mt-4 max-w-xl">{doc.summary}</p>
        <dl className="mt-6 flex flex-wrap gap-6">
          {doc.startDate && (
            <div>
              <dt className="text-xs uppercase">{t.start}</dt>
              <dd>
                <time dateTime={doc.startDate}>{date(doc.startDate)}</time>
              </dd>
            </div>
          )}
          {doc.price?.regular != null && (
            <div>
              <dt className="text-xs uppercase">{t.price}</dt>
              <dd>{eur(doc.price.regular)}</dd>
            </div>
          )}
          {doc.price?.members != null && (
            <div>
              <dt className="text-xs uppercase">{t.memberPrice}</dt>
              <dd>{eur(doc.price.members)}</dd>
            </div>
          )}
          {doc.sessions?.map((s) => (
            <div key={s._key}>
              <dt className="text-xs uppercase">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        {doc.signupUrl && <a href={doc.signupUrl} className="mt-6 inline-block">{t.signUp}</a>}
      </header>
      <SanityImage image={doc.heroImage} width={1600} height={900} priority />
      {doc.includes?.length ? (
        <ul className="py-8">
          {doc.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <RichText value={doc.body} />
      {doc.faqs?.length ? (
        <section className="py-12">
          <h2 className="text-2xl font-semibold">{t.faq}</h2>
          <Faqs faqs={doc.faqs} />
        </section>
      ) : null}
    </article>
  );
}

function PostView({ doc, lang, overviews }: { doc: NonNullable<POST_QUERY_RESULT>; lang: Language; overviews: Overviews }) {
  const path = pathFor("post", lang, doc.slug);
  return (
    <article className="py-12">
      <JsonLd data={[postJsonLd(doc, lang), crumbs(lang, "post", { name: doc.title ?? "", path }, overviews)]} />
      <header>
        <h1 className="text-4xl font-semibold">{doc.title}</h1>
        <p className="mt-2 text-sm">
          {doc.publishedAt && (
            <time dateTime={doc.publishedAt}>
              {new Date(doc.publishedAt).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          )}
          {doc.author?.name && <> · {doc.author.name}</>}
        </p>
        <p className="mt-4 max-w-2xl text-lg">{doc.summary}</p>
      </header>
      <SanityImage image={doc.heroImage} width={1600} height={900} priority />
      <RichText value={doc.body} />
      {doc.program && (
        <p className="mt-8">
          <Link href={pathFor("program", doc.program.language, doc.program.slug)}>{doc.program.title} →</Link>
        </p>
      )}
    </article>
  );
}

