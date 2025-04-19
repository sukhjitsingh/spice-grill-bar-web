import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Open_Sans, Playfair_Display } from "next/font/google";
import type React from "react"; // Import React
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

export const metadata = {
  title: "Spice Grill & Bar - Punjabi Cuisine",
  description: "Authentic Punjabi cuisine in a warm and inviting atmosphere",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${playfairDisplay.variable} `}>
      <body className="min-h-screen flex flex-col font-sans transition-all duration-300">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
