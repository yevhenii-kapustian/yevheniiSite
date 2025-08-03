import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import CookieConsentBanner from "@/components/Cookie";
import Script from "next/script";

const openSans = Open_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yevhenii Fit - Online Coaching & Fitness Programs",
  description:
    "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
  metadataBase: new URL("https://www.yevheniifit.com"),
  openGraph: {
    title: "Yevhenii Fit - Online Coaching & Fitness Programs",
    description:
      "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
    url: "https://www.yevheniifit.com",
    siteName: "Yevhenii Fit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.yevheniifit.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yevhenii Fit - Online Coaching Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yevhenii Fit - Online Coaching & Fitness Programs",
    description:
      "Transform your body and mind with expert coaching, personalized workouts, and meal plans. Join Yevhenii Fit and start your transformation today!",
    images: ["https://www.yevheniifit.com/og-image.png"],
  },
  icons: {
    icon: "https://www.yevheniifit.com/favicon.ico",
    apple: "https://www.yevheniifit.com/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  other: {
    "fb:app_id": "1682995145732700",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased flex flex-col`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2ZT3WQLMKV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2ZT3WQLMKV');
          `}
        </Script>

        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Yevhenii Fit",
              url: "https://www.yevheniifit.com",
              logo: "https://www.yevheniifit.com/og-image.png",
              sameAs: [
                "https://www.instagram.com/_ev_ge_niii_/",
              ],
            }),
          }}
        />

        <Header />
        <main className="flex-grow">
          <ProductsProvider>
            {children}
            <CookieConsentBanner />
          </ProductsProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
