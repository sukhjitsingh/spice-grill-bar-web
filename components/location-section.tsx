"use client"

import { GoogleMapsEmbed } from "@next/third-parties/google"

export function LocationSection() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
            Find Us on Historic Route 66
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Located in the heart of Ash Fork, AZ. The perfect pitstop for hungry travelers heading to the Grand Canyon or riding historic Route 66.
            <br />
            <span className="text-orange-700 dark:text-orange-400 font-medium">Biker and Family Friendly!</span>
          </p>
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
