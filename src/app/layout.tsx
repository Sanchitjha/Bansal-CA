import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Configure Google Fonts with next/font/google
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-google",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-google",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Amit Bansal & Associates | Premium Tax, Accounting & Compliance Services",
  description: "A&A provides sophisticated corporate taxation, bookkeeping, GST compliance, payroll taxes, and business advisory services for growing enterprises.",
  keywords: ["accounting firm", "tax filing", "GST registration", "bookkeeping services", "US payroll taxes", "1099 filings", "company incorporation", "Amit Bansal", "tax advisor"],
  authors: [{ name: "Amit Bansal & Associates" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${plusJakartaSans.variable}`}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
