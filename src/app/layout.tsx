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
