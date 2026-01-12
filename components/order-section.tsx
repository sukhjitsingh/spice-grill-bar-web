

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export function OrderSection() {
  return (
    <section id="order" className="py-32 bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-500 flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop')] opacity-10 dark:opacity-20 bg-cover bg-center" />

      {/* Glassmorphism Container */}
      <div className="relative z-10 max-w-xl mx-auto px-6 w-full">
        <div className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
            Bring it Home
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 font-medium">
            Authentic flavors available for <span className="text-orange-700 dark:text-orange-300">Pickup</span> & <span className="text-orange-700 dark:text-orange-300">Curbside</span>.
          </p>

          <div className="space-y-6">
            <Button
              asChild
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-medium py-7 text-lg rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <a href="https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave">
                Start Order <ShoppingBag className="w-5 h-5 ml-2 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </Button>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium tracking-wide opacity-80">
              Powered by our secure online ordering partner.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
