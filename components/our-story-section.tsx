"use client"

export function OurStorySection() {
  return (
    <section id="philosophy" className="py-24 md:py-32 bg-white dark:bg-black relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white">
            Our Story.
          </h2>
          <div className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed space-y-4">
            <p>
              Welcome to Spice Grill & Bar, your premier Indian restaurant in Ash Fork, where traditional Indian flavors
              meet modern culinary excellence.
            </p>
            <p>
              Our chefs bring decades of experience, ensuring that each dish captures the
              essence of authentic Indian cooking while adding their own creative touch to present a unique dining experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-8 mt-8">
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="block text-3xl font-bold text-orange-600 dark:text-orange-500 tracking-tight">25+</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-widest mt-2 block">Signature Spices</span>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="block text-3xl font-bold text-orange-600 dark:text-orange-500 tracking-tight">100%</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-widest mt-2 block">Halal Certified</span>
            </div>
          </div>
        </div>
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl">
          <img
            src="/GarlicNaan.jpg"
            alt="Tandoori Preparation"
            className="w-full aspect-[4/5] object-cover rounded-2xl lg:grayscale lg:group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-zinc-900 dark:text-white font-semibold">Traditional Tandoor</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">Clay oven cooking at 900°F</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="max-w-7xl mx-auto px-6 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-500 mb-4">Our Mission</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            To serve authentic Punjabi Indian cuisine while providing an exceptional dining experience that celebrates the rich culinary heritage of Punjab.
          </p>
        </div>
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-500 mb-4">Our Vision</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            To be the premier destination in Ash Fork for Punjabi cuisine, known for our exceptional food, warm hospitality, and inviting atmosphere.
          </p>
        </div>
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-500 mb-4">Our Values</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Quality, authenticity, and customer satisfaction are at the heart of everything we do at our Indian Restaurant, from ingredient selection to service delivery.
          </p>
        </div>
      </div>
    </section>
  )
}
