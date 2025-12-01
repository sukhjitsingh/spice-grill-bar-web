"use client"

import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { OrderSection } from "@/components/order-section"
import { OurStorySection } from "@/components/our-story-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <OurStorySection />
      <MenuSection />
      <OrderSection />
    </div>
  )
}