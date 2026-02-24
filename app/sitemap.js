import { cases } from "./cases/data";

export default function sitemap() {
  const base = "https://bankai.agency";
  const caseUrls = cases.map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...caseUrls,
  ];
}
