import Context from "@/auth/context/Context";
import Announcement from "@/components/shared/Announcement/Announcement";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import { Merriweather, Playfair_Display } from "next/font/google";
import "../globals.css";

// Headings font
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

// Body font
const merriweather = Merriweather({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

// ✅ Default metadata (Next.js 13+ feature)
export const metadata = {
  title: "snowfye | Your All-in-One E-commerce Solution",
  description:
    "snowfye is a complete e-commerce platform template where you can sell anything online. Fast, secure, and SEO-optimized.",
  keywords:
    "snowfye, e-commerce, online store, e-commerce template, shop, buy, sell",
  authors: [{ name: "snowfye" }],
  openGraph: {
    title: "snowfye | Your All-in-One E-commerce Solution",
    description:
      "Launch your online store with snowfye. Sell anything, anywhere with our complete e-commerce solution.",
    url: "https://snowfye.com",
    siteName: "snowfye",
    type: "website",
  },
  icons: {
    icon: "/src/app/favicon.ico",
  },
  metadataBase: new URL("https://snowfye.com"),
    verification: {
    google: "Qdu1Qos7QA4Mv_86CZirEzmydnrkejRU3I5YPfwNE-Q",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PKK6MJBG');`,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${merriweather.variable} antialiased min-h-screen flex flex-col`}
      > {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKK6MJBG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Context>
          <Announcement />
          <Navbar />

          {/* Main content */}
          <main className="flex-grow">{children}</main>
        </Context>

        <Footer />
      </body>
    </html>
  );
}
