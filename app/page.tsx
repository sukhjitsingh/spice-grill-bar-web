"use client"

import { Hero } from "@/components/hero"
import dynamic from "next/dynamic"

// Lazy load below-the-fold components to prioritize Hero LCP
const OurStorySection = dynamic(() => import("@/components/our-story-section").then(mod => ({ default: mod.OurStorySection })), {
  loading: () => <div className="py-24 text-center text-zinc-400">Loading story...</div>,
})

const MenuSection = dynamic(() => import("@/components/menu-section").then(mod => ({ default: mod.MenuSection })), {
  loading: () => <div className="py-24 text-center text-zinc-400">Loading menu...</div>,
})

const OrderSection = dynamic(() => import("@/components/order-section").then(mod => ({ default: mod.OrderSection })), {
  loading: () => <div className="py-24 text-center text-zinc-400">Loading order...</div>,
})

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