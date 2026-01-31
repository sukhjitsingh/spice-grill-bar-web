"use client"

import { Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black py-16 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link
            href="#"
            className="text-lg tracking-tighter font-semibold text-zinc-900 dark:text-white block mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm w-fit"
          >
            SPICE GRILL & BAR
          </Link>
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed max-w-xs">
            Elevating Punjabi cuisine with modern techniques and a commitment to authentic flavors.
          </p>
        </div>

        <div>
          <p className="text-zinc-900 dark:text-white text-xs font-semibold tracking-wider uppercase mb-4">
            Visit Us
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Spice+Grill+%26+Bar+33+Lewis+Ave+Ash+Fork+AZ+86320"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed hover:text-zinc-900 dark:hover:text-white transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm flex items-start gap-3"
            aria-label="Get directions to Spice Grill & Bar at 33 Lewis Ave, Ash Fork, AZ 86320"
          >
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              33 Lewis Ave.
              <br />
              Ash Fork, AZ 86320
            </span>
          </a>
          <a
            href="tel:9282771292"
            className="text-zinc-600 dark:text-zinc-300 text-sm mt-4 hover:text-zinc-900 dark:hover:text-white transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm w-fit flex items-center gap-3"
            aria-label="Call us at (928) 277-1292"
          >
            <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
            (928) 277-1292
          </a>
        </div>

        <div>
          <p className="text-zinc-900 dark:text-white text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" aria-hidden="true" />
            Hours
          </p>
          <ul className="text-zinc-600 dark:text-zinc-300 text-sm space-y-2">
            <li className="flex justify-between">
              <span>Mon - Thurs</span> <span className="text-zinc-700 dark:text-zinc-300">8AM - 9PM</span>
            </li>
            <li className="flex justify-between">
              <span>Fri - Sun</span> <span className="text-zinc-700 dark:text-zinc-300">8AM - 10PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 dark:text-zinc-400">
        <p>© 2024 Spice Grill & Bar. All rights reserved.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a
            href="https://www.instagram.com/panjabi_dhaba_sgb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61566349169122"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
            aria-label="Follow us on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <Link
            href="/faq"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
          >
            FAQ
          </Link>
          <Link
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
