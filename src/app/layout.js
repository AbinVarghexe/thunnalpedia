import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "THUNNAL | Premium Apparel Storefront",
  description: "Premium clothing brand integrated with Shopify storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg-primary text-text-primary transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
