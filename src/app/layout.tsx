import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import CookieConsentBanner from "@/components/Cookie";
import GoogleAnalytics from "@/components/scripts/GoogleAnalytics";
import { siteMetadata } from "@/config/siteMetadata";
import Head from "next/head";


const openSans = Open_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Yevhenii Fit - Online Coaching & Fitness Programs",
              url: "https://www.yevheniifit.com",
              logo: "https://www.yevheniifit.com/og-image.png",
              sameAs: ["https://www.instagram.com/_ev_ge_niii_/"],
            }),
          }}
        />
      </head>
      <body className={`${openSans.className} antialiased flex flex-col`}>
        <GoogleAnalytics/>
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
