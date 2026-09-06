import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${cormorantGaramond.variable} ${plusJakartaSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
