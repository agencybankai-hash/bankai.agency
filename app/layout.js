import "./globals.css";

export const metadata = {
  title: "Bankai Agency — AI-автоматизация и маркетинг полного цикла",
  description: "Строим системы, которые приносят выручку. AI-ядро бизнеса, маркетинг под ключ, Google Ads, SEO, CRM, аналитика.",
  keywords: ["AI автоматизация", "performance marketing", "digital agency", "Google Ads", "SEO", "CRM", "маркетинг полного цикла", "AI-ядро"],
  openGraph: {
    title: "Bankai Agency — Строим системы, которые приносят выручку",
    description: "AI-автоматизация, маркетинг полного цикла и digital-продукты для бизнеса.",
    url: "https://bankai.agency",
    siteName: "Bankai Agency",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#08080A" }}>
        {children}
      </body>
    </html>
  );
}
