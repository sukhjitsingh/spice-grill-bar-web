"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <header className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Background Image with dynamic overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/HomePageBackground.webp"
          alt="Authentic Punjabi cuisine restaurant interior"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover opacity-40 dark:opacity-40 scale-105 animation-paused"
        />
        {/* Gradient Overlay: White for light mode, Black for dark mode */}
        {/* Gradient Overlay: White for light mode, Black for dark mode, with Orange hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-black dark:via-black/40 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl px-6">
        <span className="inline-block py-1 px-3 rounded-full border border-zinc-200 dark:border-white/20 bg-white/50 dark:bg-white/5 text-xs font-semibold tracking-wider text-orange-700 dark:text-orange-300 mb-6 backdrop-blur-md">
          EST. 2024
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-zinc-900 dark:text-white leading-tight mb-6">
          The Soul of{" "}
          <span className="text-orange-700 dark:text-orange-400">Punjab</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          Where the rich traditions of Punjabi cooking meet the history of Route 66 right here in Ash Fork, AZ.
          <br />
          Authentic spices, clay oven cooking, and modern elegance.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="w-full md:w-auto px-8 py-6 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-200/50 dark:shadow-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Link href="#order">Order Online</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full md:w-auto px-8 py-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Link href="#menu">
              View Menu{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
