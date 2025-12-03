"use client"

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
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13038.40741076786!2d-112.50159762887398!3d35.216385091554024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8732a987857c6279%3A0x45dddef778f25a37!2sSpice%20Grill%20%26%20Bar!5e0!3m2!1sen!2sus!4v1764613184526!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "1rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map showing Spice Grill & Bar location"
            className="w-full h-[400px] md:h-[500px] rounded-xl grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  )
}
