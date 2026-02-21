import Context from "@/auth/context/Context";
import Announcement from "@/components/shared/Announcement/Announcement";
import Footer from "@/components/shared/Footer/Footer";
import MessengerChat from "@/components/shared/MessengerChat/MessengerChat";
import Navbar from "@/components/shared/Navbar/Navbar";
import TawkToScript from "@/components/shared/TawkToScript/TawkToScript";
import WhatsAppBubble from "@/components/shared/WhatsAppBubble/WhatsAppBubble";
import { Merriweather, Playfair_Display } from "next/font/google";
import Script from "next/script"; // Import Next.js Script
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
  title: "Snowfye | The Premium Lifestyle Shopping Destination of Bangladesh",
  description:
    "Welcome to Snowfye – where trust meets trend. We deliver a curated collection of premium lifestyle essentials to every corner of Bangladesh. 100% Authentic. Fast. Reliable. ",
  keywords:
    "snowfye, e-commerce, online store, e-commerce template, shop, buy, sell",
  authors: [{ name: "snowfye" }],
  openGraph: {
    title: "Snowfye | The Premium Lifestyle Shopping Destination of Bangladesh",
    description:
      "Welcome to Snowfye – where trust meets trend. We deliver a curated collection of premium lifestyle essentials to every corner of Bangladesh. 100% Authentic. Fast. Reliable. ",
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
      <body
        className={`${playfair.variable} ${merriweather.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager - Script Optimized */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PKK6MJBG');
          `}
        </Script>

        {/* GTM NoScript (For users with JS disabled) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKK6MJBG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Context>
          <Announcement />
          <Navbar />

          {/* Main content */}
          <main className="flex-grow">{children}</main>
        </Context>

        <Footer />
        <WhatsAppBubble />
        <MessengerChat />
        <TawkToScript />
      </body>
    </html>
  );
}