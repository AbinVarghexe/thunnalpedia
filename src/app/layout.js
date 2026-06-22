import { Poppins, Manjari, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const manjari = Manjari({
  variable: "--font-manjari",
  subsets: ["malayalam", "latin"],
  weight: ["400", "700"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "THUNNAL | Premium Apparel Storefront",
  description: "Premium clothing brand integrated with Shopify storefront",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" }
    ],
    apple: "/favicon/apple-touch-icon.png"
  },
  manifest: "/favicon/site.webmanifest"
};

export const viewport = {
  themeColor: "#FFFFFF"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${manjari.variable} ${notoMalayalam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg-primary text-text-primary transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
