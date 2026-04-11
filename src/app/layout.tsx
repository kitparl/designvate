import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MobileCTA from "@/components/MobileCTA";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const content = getContent();

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <Navbar />
        <main className="flex-1 pb-14 md:pb-0">{children}</main>
        <Footer />
        <FloatingCTA />
        <MobileCTA />
      </body>
    </html>
  );
}
