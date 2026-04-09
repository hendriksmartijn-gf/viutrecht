import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title,
  hero,
  body,
  seo
}`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(PAGE_QUERY, { slug }, { next: { revalidate: 60 } })
  if (!page) return {}
  return {
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription ?? undefined,
  }
}

export default async function PageRoute({ params }: Props) {
  const { slug } = await params
  const page = await client.fetch(PAGE_QUERY, { slug }, { next: { revalidate: 60 } })

  if (!page) notFound()

  const heroImageUrl = page.hero?.image
    ? urlFor(page.hero.image).width(1400).height(600).url()
    : null

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a0e1a]">
        {heroImageUrl ? (
          <div className="relative h-[50vh] min-h-[320px]">
            <img
              src={heroImageUrl}
              alt={page.hero?.heading ?? page.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
            <div className="relative flex items-end h-full mx-auto max-w-4xl px-6 pb-12">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                  {page.hero?.heading ?? page.title}
                </h1>
                {page.hero?.subheading && (
                  <p className="mt-4 text-lg text-[#8b94a8] max-w-xl">{page.hero.subheading}</p>
                )}
                {page.hero?.ctaLabel && page.hero?.ctaUrl && (
                  <a
                    href={page.hero.ctaUrl}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8c7df8] px-8 py-3 text-sm font-bold text-white hover:bg-[#bab1fa] transition-colors"
                  >
                    {page.hero.ctaLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden py-24 px-6">
            <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#8c7df8]/10 blur-[120px]" />
            <div className="relative mx-auto max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                {page.hero?.heading ?? page.title}
              </h1>
              {page.hero?.subheading && (
                <p className="mt-4 text-lg text-[#8b94a8] max-w-xl">{page.hero.subheading}</p>
              )}
              {page.hero?.ctaLabel && page.hero?.ctaUrl && (
                <a
                  href={page.hero.ctaUrl}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8c7df8] px-8 py-3 text-sm font-bold text-white hover:bg-[#bab1fa] transition-colors"
                >
                  {page.hero.ctaLabel}
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* BODY */}
      {Array.isArray(page.body) && page.body.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-[#8b94a8] prose-p:leading-relaxed
            prose-a:text-[#8c7df8] prose-a:no-underline hover:prose-a:text-[#bab1fa]
            prose-strong:text-white
            prose-img:rounded-2xl">
            <PortableText
              value={page.body}
              components={{
                types: {
                  image: ({ value }) => {
                    const url = urlFor(value).width(800).url()
                    return (
                      <img
                        src={url}
                        alt={value.alt ?? ''}
                        className="rounded-2xl w-full"
                      />
                    )
                  },
                },
              }}
            />
          </div>
        </section>
      )}
    </>
  )
}
