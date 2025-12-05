"use client"

import { GoogleMapsEmbed } from "@next/third-parties/google"

export function LocationSection() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
            Find Us
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">Visit us in the heart of Ash Fork.</p>
        </div>

        <div className="glass-card p-2 rounded-2xl overflow-hidden shadow-xl">
          <div className="w-full h-[400px] md:h-[500px] rounded-xl grayscale-[0.2] hover:grayscale-0 transition-all duration-500 overflow-hidden [&>div[data-ntpc='GoogleMapsEmbed']]:!h-full [&>div[data-ntpc='GoogleMapsEmbed']]:!w-full">
            <GoogleMapsEmbed
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              mode="place"
              q="Spice Grill & Bar, Ash Fork, AZ"
              style="border:0; width:100%; height:100%;"
              allowfullscreen={true}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
