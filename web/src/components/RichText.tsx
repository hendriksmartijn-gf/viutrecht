import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";
import { pathFor } from "@/sanity/i18n";
import { Button } from "./Button";
import type { LinkValue } from "./CtaLink";
import { SanityImage } from "./SanityImage";

type InternalLinkMark = { reference?: { _type: string; language?: string; slug?: { current?: string } } };
type Block = { _type?: string; style?: string; children?: { text?: string }[] };
type ImageValue = { _key?: string; asset?: unknown; alt?: string | null };

const blockText = (block: Block) => block.children?.map((c) => c.text ?? "").join("") ?? "";

// Anchor for a heading: "Week 1: de eerste muscle-ups" -> "week-1-de-eerste-muscle-ups".
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// The "In dit artikel" list: every H2 in the text.
export const tableOfContents = (value: readonly object[] | null | undefined) =>
  ((value ?? []) as Block[])
    .filter((b) => b._type === "block" && b.style === "h2" && blockText(b))
    .map((b) => ({ id: headingId(blockText(b)), title: blockText(b) }));

const shared: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <SanityImage image={value} width={1440} height={900} sizes="(min-width: 768px) 720px, 100vw" className="w-full rounded-[24px] object-cover" />
    ),
    pullQuote: ({ value }: { value: { quote?: string; attribution?: string } }) => (
      <figure className="flex flex-col gap-[18px] rounded-[32px] bg-lilac px-7 py-8 md:px-10 md:py-9">
        <blockquote className="font-serif text-[clamp(26px,2.4vw,34px)] leading-[1.15] tracking-[-0.015em] text-ink">“{value.quote}”</blockquote>
        {value.attribution && <figcaption className="font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-ink/55">{value.attribution}</figcaption>}
      </figure>
    ),
    imagePair: ({ value }: { value: { images?: ImageValue[] } }) => (
      <div className="grid gap-3 sm:grid-cols-2">
        {value.images?.map((image, i) => (
          <SanityImage key={image._key ?? i} image={image as never} width={708} height={600} sizes="(min-width: 768px) 354px, 100vw" className="h-[300px] w-full rounded-[24px] object-cover" />
        ))}
      </div>
    ),
    stats: ({ value }: { value: { items?: { _key: string; value?: string; label?: string }[] } }) => (
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.items?.map((stat) => (
          <div key={stat._key} className="flex flex-col-reverse gap-1 rounded-[24px] border border-ink/7 bg-white p-5">
            <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.03em] text-ink/55">{stat.label}</dt>
            <dd className="font-serif text-[56px] leading-none text-primary">{stat.value}</dd>
          </div>
        ))}
      </dl>
    ),
    inlineCta: ({ value }: { value: { heading?: string; text?: string; link?: LinkValue } }) => (
      <aside className="flex flex-col gap-5 rounded-[32px] bg-lavender py-7 pl-7 pr-6 text-white sm:flex-row sm:items-center sm:justify-between md:pl-8 md:pr-7">
        <div className="flex flex-col gap-1.5">
          <p className="text-[26px] font-bold leading-[normal] tracking-[-0.02em]">{value.heading}</p>
          {value.text && <p className="max-w-[380px] text-[15px] text-white/92">{value.text}</p>}
        </div>
        <Button link={value.link} variant="sun" />
      </aside>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} rel="noopener" className="font-medium text-primary underline underline-offset-2 hover:text-coral">
        {children}
      </a>
    ),
    internalLink: ({ value, children }) => {
      const ref = (value as InternalLinkMark)?.reference;
      return ref ? (
        <Link href={pathFor(ref._type, ref.language, ref.slug?.current)} className="font-medium text-primary underline underline-offset-2 hover:text-coral">
          {children}
        </Link>
      ) : (
        <>{children}</>
      );
    },
  },
};

// News articles: the design's type scale, with ids on the H2s for the table of contents.
const article: PortableTextComponents = {
  ...shared,
  block: {
    normal: ({ children }) => <p className="text-[17px] leading-[1.7] text-ink/82 md:text-[18px]">{children}</p>,
    h2: ({ children, value }) => (
      <h2 id={headingId(blockText(value as Block))} className="scroll-mt-28 pt-2 text-[clamp(28px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-0.03em]">
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.02em]">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-lavender pl-5 font-serif text-[26px] leading-[1.2] text-ink">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 pl-6 text-[17px] leading-[1.7] text-ink/82 marker:text-primary md:text-[18px]">{children}</ul>,
    number: ({ children }) => <ol className="flex list-decimal flex-col gap-2 pl-6 text-[17px] leading-[1.7] text-ink/82 marker:font-semibold marker:text-primary md:text-[18px]">{children}</ol>,
  },
};

// Accepts generated block types (whose `children` is optional) as well as PortableTextBlock.
export function RichText({ value, variant }: { value: readonly object[] | null | undefined; variant?: "article" }) {
  if (!value?.length) return null;
  if (variant === "article") {
    return (
      <div className="flex flex-col gap-7">
        <PortableText value={value as PortableTextBlock[]} components={article} />
      </div>
    );
  }
  return (
    <div className="prose">
      <PortableText value={value as PortableTextBlock[]} components={shared} />
    </div>
  );
}
