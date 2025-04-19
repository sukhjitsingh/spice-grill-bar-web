"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState} from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  // { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname();
  return (
    <header className="bg-[#f5f5dc] shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Image src="/SpiceGrillBarLogo.png" alt="Spice Grill & Bar Logo" width={40} height={40} />
            <Link href="/" className="font-serif text-2xl text-brand-orange ml-2">
              Spice Grill & Bar
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-base font-medium text-gray-700 hover:text-brand-orange",
                  pathname === link.href && "text-brand-orange font-bold"
                )
                }
              >
                {link.name}
              </Link>
            ))}
            <Button className="bg-brand-orange hover:bg-brand-orange/90">Order Online</Button>
          </div>
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "text-base font-medium text-gray-700 hover:text-brand-orange",
                        pathname === link.href && "text-brand-orange font-bold"
                      )
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 w-full">Order Online</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

