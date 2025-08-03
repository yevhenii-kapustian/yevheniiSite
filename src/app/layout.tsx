import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import CookieConsentBanner from "@/components/Cookie";
import Script from "next/script";

const openSans = Open_Sans({
  weight: ["400","500","600","700","800"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Yevhenii Fit",
  description: "Transform your body and mind with our science-backed fitness programs tailored to your goals. Start today!",
  metadataBase: new URL("https://www.yevheniifit.com"),
  openGraph: {
    title: "Yevhenii Fit",
    description: "Transform your body and mind with our science-backed fitness programs tailored to your goals. Start today!",
    url: "https://www.yevheniifit.com",
    siteName: "Yevhenii Fit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yevhenii Fit - Fitness Programs & Coaching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yevhenii Fit",
    description: "Transform your body and mind with our science-backed fitness programs tailored to your goals. Start today!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": 500,
      "max-image-preview": "large",
      "max-video-preview": 1,
    },
  },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.className} antialiased flex flex-col`}
      >
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

        <Header/>
          <main className="flex-grow">
            <ProductsProvider>
              {children}
              <CookieConsentBanner/>
            </ProductsProvider >
          </main>
        <Footer/>
      </body>
    </html>
  );
}
