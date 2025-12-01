"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Philosophy", href: "#philosophy" },
  { name: "Menu", href: "#menu" },
  { name: "Order Online", href: "#order" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        isScrolled
          ? "glass"
          : "bg-gradient-to-b from-white/50 to-transparent dark:from-black/50"
      )}
    >
      <nav className="container mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="#"
          className="text-lg tracking-tighter font-semibold text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          SPICE GRILL & BAR
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-wide text-zinc-800 dark:text-zinc-200">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors relative group"
            >
              {link.name.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all group-hover:w-full" />
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-900 dark:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col space-y-6 mt-8">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

