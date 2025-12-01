"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black py-16 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="#" className="text-lg tracking-tighter font-semibold text-zinc-900 dark:text-white block mb-6">
            SPICE GRILL & BAR
          </Link>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Elevating Punjabi cuisine with modern techniques and a commitment to authentic flavors.
          </p>
        </div>

        <div>
          <h4 className="text-zinc-900 dark:text-white text-xs font-semibold tracking-wider uppercase mb-4">
            Visit Us
          </h4>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Spice+Grill+%26+Bar+33+Lewis+Ave+Ash+Fork+AZ+86320"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 text-sm leading-relaxed hover:text-zinc-900 dark:hover:text-white transition-colors block"
          >
            33 Lewis Ave.
            <br />
            Ash Fork, AZ 86320
          </a>
          <a
            href="tel:9282771292"
            className="text-zinc-500 text-sm mt-4 hover:text-zinc-900 dark:hover:text-white transition-colors block"
          >
            (928) 277-1292
          </a>
        </div>

        <div>
          <h4 className="text-zinc-900 dark:text-white text-xs font-semibold tracking-wider uppercase mb-4">Hours</h4>
          <ul className="text-zinc-500 text-sm space-y-2">
            <li className="flex justify-between">
              <span>Mon - Thurs</span> <span className="text-zinc-400">8AM - 9PM</span>
            </li>
            <li className="flex justify-between">
              <span>Fri - Sun</span> <span className="text-zinc-400">8AM - 10PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 dark:text-zinc-600">
        <p>© 2024 Spice Grill & Bar. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Instagram
          </Link>
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Facebook
          </Link>
          <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
