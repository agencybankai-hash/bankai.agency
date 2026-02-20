export const metadata = {
  title: "AI-Ядро Бизнеса — Автоматизация операционки на базе ИИ",
  description:
    "Внедряем AI-агентов, которые берут на себя рутину, аналитику и часть решений. Управляемый бизнес без раздутого штата.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AiCoreLayout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        body {
          background: #0A0A0F !important;
          color: #E8E6F0 !important;
          font-family: 'Manrope', sans-serif !important;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
        }
        ::selection {
          background: #6EE7B7;
          color: #0A0A0F;
        }
      `}</style>
      {children}
    </>
  );
}
