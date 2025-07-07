import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductsProvider } from "@/context/ProductsContext";

const openSans = Open_Sans({
  weight: ["400","500","600","700","800"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Yevhenii",
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
        <Header/>
          <main className="flex-grow">
            <ProductsProvider>
              {children}
            </ProductsProvider >
          </main>
        <Footer/>
      </body>
    </html>
  );
}
