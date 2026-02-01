import { cn } from "@/lib/utils"
import * as React from "react"
// @ts-ignore
import menuData from "@/data/menu.json"

export function MenuSection() {
  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  const [activeCategory, setActiveCategory] = React.useState(toKebabCase(menuData[0].category))

  React.useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = document.querySelectorAll(".menu-category")
          const scrollPosition = window.scrollY + 250 // Offset for sticky headers

          let current = ""

          sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY
            const sectionHeight = section.clientHeight

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              current = section.getAttribute("id") || ""
            }
          })

          if (current) {
            setActiveCategory(current)
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 220 // Header height + sticky section header + padding
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Manually set active immediately for better UX
      setActiveCategory(categoryId)
    }
  }

  return (
    <section id="menu" className="bg-zinc-50 dark:bg-zinc-950 py-24 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="sticky top-14 z-30 bg-zinc-50 dark:bg-zinc-950 py-4 mb-10 transition-colors duration-500">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
            Culinary Selection
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">Crafted with care using traditional Punjabi recipes and the finest ingredients.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Sidebar Navigation (Sticky) */}
          <aside className="md:w-64 shrink-0 md:max-h-[calc(100vh-13rem)] h-fit md:sticky md:top-52 w-full z-20 pt-2">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 pb-4 md:pb-0 hide-scroll p-2 glass rounded-xl max-h-full">
              {menuData.map((category: any) => {
                const categoryId = toKebabCase(category.category)
                return (
                  <button
                    key={categoryId}
                    onClick={() => scrollToCategory(categoryId)}
                    className={cn(
                      "whitespace-nowrap md:w-full text-sm font-medium font-serif text-left rounded-lg py-2.5 px-4 transition-all",
                      activeCategory === categoryId
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-white/10"
                    )}
                  >
                    {category.category}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Menu Content */}
          <div className="flex-1 space-y-20">
            {menuData.map((category: any) => {
              const categoryId = toKebabCase(category.category)
              return (
                <div key={categoryId} id={categoryId} className="menu-category space-y-8 scroll-mt-32">
                  <h3 className="text-2xl font-medium text-brand-orange tracking-tight border-b border-orange-300 dark:border-orange-700 pb-4">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {category.items.map((item: any, index: number) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-xl font-medium font-serif text-zinc-800 dark:text-zinc-200 group-hover:text-brand-orange transition-colors">
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
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
