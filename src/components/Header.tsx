import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import * as React from "react"

const navigation = [
  { name: "Menu", href: "#menu" },
  { name: "Philosophy", href: "#philosophy" },
  { name: "Order Online", href: "#order" },
]

export function Header({ currentPath = "/" }: { currentPath?: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
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
        <a
          href="/"
          className="text-lg tracking-tighter font-serif font-semibold text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
        >
          SPICE GRILL & BAR
        </a>

        <div className="hidden md:flex items-center space-x-8 text-xs font-bold font-serif tracking-wide text-zinc-800 dark:text-zinc-200">
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-brand-orange transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm px-1"
            >
              {link.name.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all group-hover:w-full" />
            </a>
          ))}
          <ModeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
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
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium font-serif text-zinc-900 dark:text-white hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
