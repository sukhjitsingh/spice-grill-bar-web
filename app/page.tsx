"use client"

import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { OrderSection } from "@/components/order-section"
import { OurStorySection } from "@/components/our-story-section"
import dynamic from "next/dynamic"

// Lazy load below-the-fold components for better initial page load
const ReviewsSection = dynamic(() => import("@/components/reviews-section").then(mod => ({ default: mod.ReviewsSection })), {
  loading: () => <div className="py-24 text-center text-zinc-400">Loading reviews...</div>,
})

const LocationSection = dynamic(() => import("@/components/location-section").then(mod => ({ default: mod.LocationSection })), {
  loading: () => <div className="py-24 text-center text-zinc-400">Loading map...</div>,
})

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <OurStorySection />
      <MenuSection />
      <OrderSection />
      <ReviewsSection />
      <LocationSection />
    </div>
  )
}