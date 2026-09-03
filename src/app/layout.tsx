import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScamLess • AI Anti-Scam Intelligence & Job Scam Detector",
  description: "Autonomous OSINT Phishing & Job Scam Investigator. Paste suspicious WhatsApp messages, offer letters, or voice notes to instantly detect fake internships and fee traps.",
  authors: [{ name: "Ahmed Hassan", url: "https://ahmed-hassan-portfoliosite.vercel.app/" }],
  creator: "Ahmed Hassan",
  publisher: "ScamLess Intelligence",
  metadataBase: new URL("https://naukrinigran.vercel.app"),
  keywords: [
    "ScamLess",
    "Phishing Detector",
    "WhatsApp Scam Scanner",
    "Job Scam Verification",
    "Anti-Scam OSINT",
    "Roman Urdu Scam Detector",
    "Pakistan Job Safety",
    "Ahmed Hassan"
  ],
  openGraph: {
    title: "ScamLess • Anti-Scam Intelligence Engine",
    description: "Autonomous Multi-Agent OSINT Phishing & Job Scam Investigator. Verify job offer letters, WhatsApp recruitment messages, and fee traps in real-time.",
    siteName: "ScamLess",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ScamLess • AI Anti-Scam Intelligence Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamLess • AI Anti-Scam Intelligence Engine",
    description: "Detect fake job offers, fee traps, and WhatsApp recruitment scams with autonomous OSINT verification.",
    images: ["/opengraph-image"],
    creator: "@ahmedhassan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  function getCookie(n) {
                    var m = document.cookie.match(new RegExp('(^| )' + n + '=([^;]+)'));
                    return m ? decodeURIComponent(m[2]) : null;
                  }
                  var mode = getCookie('app_mode') || localStorage.getItem('app_mode');
                  var palette = getCookie('app_palette') || localStorage.getItem('app_palette') || 'mono';
                  var isDark = mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-palette', palette);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
