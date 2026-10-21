import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";
import { pathFor } from "@/sanity/i18n";
import { SanityImage } from "./SanityImage";

type InternalLinkMark = { reference?: { _type: string; language?: string; slug?: { current?: string } } };

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => <SanityImage image={value} width={1200} height={675} sizes="(min-width: 768px) 720px, 100vw" />,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} rel="noopener">
        {children}
      </a>
    ),
    internalLink: ({ value, children }) => {
      const ref = (value as InternalLinkMark)?.reference;
      return ref ? <Link href={pathFor(ref._type, ref.language, ref.slug?.current)}>{children}</Link> : <>{children}</>;
    },
  },
};

// Accepts generated block types (whose `children` is optional) as well as PortableTextBlock.
export function RichText({ value }: { value: readonly object[] | null | undefined }) {
  if (!value?.length) return null;
  return (
    <div className="prose">
      <PortableText value={value as PortableTextBlock[]} components={components} />
    </div>
  );
}
