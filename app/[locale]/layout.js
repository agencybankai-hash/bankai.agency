import { getDictionary, locales } from "../i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: locale === "ru"
      ? ["AI автоматизация", "performance marketing", "digital agency", "Google Ads", "SEO", "CRM", "маркетинг полного цикла", "AI-ядро"]
      : ["AI automation", "performance marketing", "digital agency", "Google Ads", "SEO", "CRM", "full-cycle marketing"],
    metadataBase: new URL("https://bankai.agency"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ru: "/ru",
        en: "/en",
      },
    },
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: `https://bankai.agency/${locale}`,
      siteName: "Bankai Agency",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.twitterTitle,
      description: t.meta.twitterDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FAF8F5" }}>
        {children}
      </body>
    </html>
  );
}
