import { cases } from "./cases/data";

export default function sitemap() {
  const base = "https://bankai.agency";
  const locales = ["ru", "en"];

  const pages = [];

  // Home pages for each locale
  for (const locale of locales) {
    pages.push({
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "ru" ? 1 : 0.9,
    });
  }

  // Case pages for each locale
  for (const locale of locales) {
    for (const c of cases) {
      pages.push({
        url: `${base}/${locale}/cases/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return pages;
}
