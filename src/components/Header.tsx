import { Menu, Phone, ShoppingBag } from 'lucide-react';
import * as React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Menu', href: '#menu' },
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'FAQ', href: '/faq/' },
];

export function Header({ currentPath = '/' }: { currentPath?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHref = (href: string) => {
    if (href.startsWith('#') && currentPath !== '/') {
      return `/${href}`;
    }
    return href;
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent',
        isScrolled ? 'glass' : 'bg-gradient-to-b from-surface/50 to-transparent'
      )}
    >
      <nav className="container mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="/"
          className="text-lg tracking-tighter font-display font-semibold text-on-surface hover:text-primary-container transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2 rounded-sm"
        >
          SPICE GRILL & BAR
        </a>

        <div className="hidden md:flex items-center space-x-8 text-xs font-bold font-display tracking-wide text-on-surface-variant">
          {navigation.map((link) => (
            <a
              key={link.name}
              href={getHref(link.href)}
              className="hover:text-primary-container transition-colors relative group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2 rounded-sm px-1"
            >
              {link.name.toUpperCase()}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full" />
            </a>
          ))}

          <div className="flex items-center gap-4 border-l border-outline-variant pl-6 ml-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-on-surface-variant hover:text-primary-container hover:bg-surface-container font-display hidden lg:flex"
            >
              <a href="tel:+19282771292" aria-label="Call us">
                <Phone className="w-4 h-4 mr-2" />
                928-277-1292
              </a>
            </Button>

            <Button
              asChild
              className="bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-display tracking-wide shadow-md"
              size="sm"
            >
              <a
                href="https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                ORDER ONLINE
              </a>
            </Button>
          </div>

          <ModeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-on-surface">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-80 bg-surface border-l border-outline-variant"
            >
              <div className="flex flex-col space-y-6 mt-8">
                {navigation.map((link) => (
                  <a
                    key={link.name}
                    href={getHref(link.href)}
                    className="text-lg font-medium font-display text-on-surface hover:text-primary-container transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2 rounded-sm"
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
  );
}
