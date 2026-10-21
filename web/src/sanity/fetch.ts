import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import type { Language } from "./i18n";
import {
  DISCIPLINE_QUERY,
  HOME_QUERY,
  NAVIGATION_QUERY,
  PAGE_QUERY,
  POST_QUERY,
  PROGRAM_QUERY,
  ROUTES_QUERY,
  SETTINGS_QUERY,
} from "./queries";

// All Sanity reads go through these cached helpers. Content is prerendered and
// refreshed hourly, or immediately when the revalidate webhook fires the "sanity" tag.

export async function getSettings(lang: Language) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(SETTINGS_QUERY, { lang });
}

export async function getNavigation(lang: Language) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(NAVIGATION_QUERY, { lang });
}

export async function getHome(lang: Language) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(HOME_QUERY, { lang });
}

export async function getPage(lang: Language, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(PAGE_QUERY, { lang, slug });
}

export async function getDiscipline(lang: Language, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(DISCIPLINE_QUERY, { lang, slug });
}

export async function getProgram(lang: Language, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(PROGRAM_QUERY, { lang, slug });
}

export async function getPost(lang: Language, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(POST_QUERY, { lang, slug });
}

export async function getRoutes() {
  "use cache";
  cacheLife("hours");
  cacheTag("sanity");
  return client.fetch(ROUTES_QUERY);
}
