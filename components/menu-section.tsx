"use client"

import menuData from "@/data/menu.json"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(menuData[0].category)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".menu-category")
      let current = ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        // Check if the section is roughly in the viewport (top 3rd)
        if (rect.top <= 200 && rect.bottom >= 200) {
          current = section.getAttribute("id") || ""
        }
      })

      if (current) {
        setActiveCategory(current)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 100 // Header height + padding
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="menu" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
            Culinary Selection
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">Crafted with care using traditional Punjabi recipes and the finest ingredients.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Sidebar Navigation (Sticky) */}
          <aside className="md:w-64 shrink-0 md:h-[calc(100vh-100px)] md:sticky md:top-24 w-full z-20">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-hidden gap-2 pb-4 md:pb-0 hide-scroll p-2 glass rounded-xl">
              {menuData.map((category) => (
                <button
                  key={category.category}
                  onClick={() => scrollToCategory(category.category)}
                  className={cn(
                    "whitespace-nowrap md:w-full text-sm font-medium text-left rounded-lg py-2.5 px-4 transition-all",
                    activeCategory === category.category
                      ? "bg-orange-600 text-white shadow-md dark:bg-orange-600 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  {category.category}
                </button>
              ))}
            </nav>
          </aside>

          {/* Menu Content */}
          <div className="flex-1 space-y-20">
            {menuData.map((category) => (
              <div key={category.category} id={category.category} className="menu-category space-y-8 scroll-mt-32">
                <h3 className="text-2xl font-medium text-orange-600 dark:text-orange-500 tracking-tight border-b border-orange-300 dark:border-orange-700 pb-4">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {category.items.map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
