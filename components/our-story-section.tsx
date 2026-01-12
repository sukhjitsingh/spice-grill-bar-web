

export function OurStorySection() {
  return (
    <section id="philosophy" className="py-24 md:py-32 bg-white dark:bg-black relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white">
            What makes our story unique?
          </h2>
          <div className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed space-y-4">
            <p>
              Spice Grill & Bar is the premier destination for authentic Punjabi cuisine in Ash Fork, blending traditional tandoor cooking with modern culinary excellence.
            </p>
            <p>
              Located on historic Route 66, we offer a unique dining experience led by chefs with decades of expertise, ensuring every dish captures the true essence of India.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-8 mt-8">
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="block text-3xl font-bold text-orange-700 dark:text-orange-400 tracking-tight">25+</span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mt-2 block">Signature Spices</span>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="block text-3xl font-bold text-orange-700 dark:text-orange-400 tracking-tight">100%</span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mt-2 block">Halal Certified</span>
            </div>
          </div>
        </div>
        <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl">
          <img
            src="/GarlicNaan.webp"
            alt="Tandoori Preparation"
            className="w-full aspect-[4/5] object-cover rounded-2xl lg:grayscale lg:group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-zinc-900 dark:text-white font-semibold">How do we cook?</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">Clay oven cooking at 900°F</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="max-w-7xl mx-auto px-6 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-4">What is our mission?</h3>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            To serve authentic Punjabi Indian cuisine while providing an exceptional dining experience that celebrates the rich culinary heritage of Punjab.
          </p>
        </div>
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-4">What is our vision?</h3>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            To be the premier destination in Ash Fork for Punjabi cuisine, recognized for exceptional food, warm hospitality, and inviting atmosphere.
          </p>
        </div>
        <div className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-4">What are our core values?</h3>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            Quality, authenticity, and customer satisfaction are the heart of our service, from ingredient selection to your table.
          </p>
        </div>
      </div>
    </section>
  )
}
