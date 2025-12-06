import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RestaurantSchema } from "@/components/schema/restaurant-schema";
import { WebSiteSchema } from "@/components/schema/website-schema";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Playfair_Display } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL('https://spicegrillbar66.com'),
  title: "Spice Grill & Bar | Best Indian & Punjabi Food in Ash Fork, AZ (Route 66)",
  description: "Authentic Punjabi cuisine on historic Route 66 in Ash Fork, AZ. The perfect pit stop for Grand Canyon travelers and riders. Enjoy fresh naan, curry, and tandoori specials. Dine-in & Takeout.",
  openGraph: {
    title: "Spice Grill & Bar | Authentic Punjabi Cuisine on Route 66 & the perfect pit stop for Grand Canyon travelers and riders.",
    description: "Best Indian food in Ash Fork, AZ. Biker-friendly stop on Route 66 near the Grand Canyon. Try our famous butter chicken and garlic naan.",
    url: 'https://spicegrillbar66.com',
    siteName: 'Spice Grill & Bar',
    locale: 'en_US',
    type: 'website',
  },
  keywords: ["Indian Restaurant Ash Fork", "Punjabi Food Route 66", "Best Indian Food AZ", "Spice Grill and Bar", "Ash Fork Dining", "Route 66 Restaurants", "Grand Canyon Food Stop", "Biker Friendly Restaurant AZ"],
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <RestaurantSchema />
            <WebSiteSchema />
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-Y5QJYGQBL6" />
    </html>
  )
}
