import "./globals.css";

export const metadata = {
  title: "Bankai Agency — Revenue-Driven Marketing",
  description: "Full-service performance marketing agency. We build systems that generate leads, close deals, and scale. Google Ads, SEO, CRM, Analytics — every channel connected, every dollar tracked.",
  keywords: ["performance marketing", "digital agency", "Google Ads", "SEO", "CRM", "HubSpot", "lead generation", "marketing automation"],
  openGraph: {
    title: "Bankai Agency — Only for Those Who Play to Win",
    description: "Revenue-driven marketing for businesses that refuse to settle.",
    url: "https://bankai.agency",
    siteName: "Bankai Agency",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
