import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import CookieConsentBanner from "@/components/Cookie";
import OrganizationSchema from "@/components/scripts/OrganizationSchema";
import GoogleAnalytics from "@/components/scripts/GoogleAnalytics";
import { siteMetadata } from "@/config/siteMetadata";
import FacebookAppIdMeta from "@/components/FacebookAppIdMeta";


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
        <meta property="fb:app_id" content="1682995145732700" />
      </head>
      <body className={`${openSans.className} antialiased flex flex-col`}>
        <FacebookAppIdMeta/>
        <GoogleAnalytics/>
        <OrganizationSchema/>
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
