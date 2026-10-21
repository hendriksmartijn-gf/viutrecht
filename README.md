# VI Utrecht

Website van VI Utrecht (CrossFit & Hyrox gym), gebouwd met Next.js en Sanity.

| Map | Wat | Live |
|---|---|---|
| `web/` | Next.js-frontend | https://vi-utrecht.vercel.app (Vercel, team Goldfizh) |
| `studio/` | Sanity Studio (los, niet in de site ingebouwd) | https://vi-utrecht.sanity.studio |

Sanity-project `uctw6cnz`, dataset `production`.

## Lokaal draaien

```bash
cd studio && npm install && npm run dev   # http://localhost:3333
cd web && npm install && npm run dev      # http://localhost:3000
```

`web/.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=uctw6cnz
NEXT_PUBLIC_SANITY_DATASET=production
```

Na een wijziging in het schema of in een GROQ-query: `cd studio && npm run typegen` (schrijft `web/sanity.types.ts`).

## Hoe de site in elkaar zit

- **URL's:** Nederlands op de root, Engels onder `/en`. Lessen onder `/lessen/…` (`/en/classes/…`), cursussen onder `/cursussen/…`, nieuws onder `/nieuws/…`. Het voorvoegsel per type en taal staat in `web/src/sanity/i18n.ts` en `studio/lib/routes.ts`; houd die twee gelijk.
- **SEO:** metadata met canonical en hreflang, sitemap, robots en JSON-LD (gym, lessen, events, nieuws, FAQ) komen uit dezelfde Sanity-velden als de pagina.
- **Cache:** content wordt gecachet en ververst zodra er in Sanity gepubliceerd wordt, via de webhook naar `/api/revalidate`.
- **Redirects:** beheerd in Sanity (type Redirect) en ingelezen bij elke build.
- **Animaties:** GSAP, aangestuurd via data-attributen; zie `web/src/components/Motion.tsx`. Staat uit bij "minder beweging".

## Omgevingsvariabelen (Vercel)

| Variabele | Doel |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Sanity-project |
| `SANITY_REVALIDATE_SECRET` | Controleert de handtekening van de Sanity-webhook |
| `SITE_INDEXABLE` | Pas op `true` zetten bij livegang op www.viutrecht.nl. Zonder deze variabele stuurt elke deploy `noindex` |

## Scripts (`studio/scripts`)

Uitvoeren met `cd studio && npx sanity exec scripts/<naam>.ts --with-user-token`.

- `seed.ts`, `design-content.ts`, `lessons-content.ts`, `emoji.ts`: startcontent van de huidige site en de designs
- `create-webhook.ts`, `webhook-check.ts`: publish-webhook aanmaken en testen
- `hero-logos.ts`: officiële logo's in de hero plaatsen

## Livegang (nog te doen)

1. Redirects voor de oude Engelse URL's (de huidige site heeft Engels op de root) aanmaken in Sanity.
2. Domein www.viutrecht.nl koppelen in Vercel, `SITE_INDEXABLE=true` zetten en opnieuw deployen.
3. Webhook-URL omzetten naar het nieuwe domein (`create-webhook.ts`).
