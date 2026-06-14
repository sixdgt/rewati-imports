import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DynamicFavicon from "./components/DynamicFavicon";
import { inter, playfair } from './fonts';

export const metadata: Metadata = {
  title: "Rewati Imports",
  description: "Your one-stop shop for high-quality imports and exceptional customer service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <DynamicFavicon />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
