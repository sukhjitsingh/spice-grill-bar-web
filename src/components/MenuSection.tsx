import * as React from 'react';

import menuData from '@/data/menu.json';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  price: number;
  description: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const data = menuData as MenuCategory[];

export function MenuSection() {
  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const [activeCategory, setActiveCategory] = React.useState(toKebabCase(data[0].category));

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = document.querySelectorAll('.menu-category');
          const scrollPosition = window.scrollY + 250; // Offset for sticky headers

          let current = '';

          sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              current = section.getAttribute('id') || '';
            }
          });

          if (current) {
            setActiveCategory(current);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const offset = 220; // Header height + sticky section header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Manually set active immediately for better UX
      setActiveCategory(categoryId);
    }
  };

  return (
    <section id="menu" className="bg-surface-container-low py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="sticky top-14 z-30 bg-surface-container-low py-4 mb-10 transition-colors duration-500">
          <h2 className="text-heading-lg text-on-surface mb-4">Culinary Selection</h2>
          <p className="text-on-surface-variant">
            Crafted with care using traditional Punjabi recipes and the finest ingredients.
          </p>

          {/* Mobile Navigation (Sticky inside header) */}
          <div className="md:hidden mt-6 p-1.5 bg-surface-container rounded-xl">
            <nav className="flex overflow-x-auto gap-2 hide-scroll">
              {data.map((category) => {
                const categoryId = toKebabCase(category.category);
                return (
                  <button
                    key={categoryId}
                    onClick={() => scrollToCategory(categoryId)}
                    className={cn(
                      'whitespace-nowrap text-sm font-medium rounded-lg py-2 px-4 transition-all',
                      activeCategory === categoryId
                        ? 'bg-surface-container-high text-on-surface'
                        : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    )}
                  >
                    {category.category}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Sidebar Navigation (Sticky Desktop) */}
          <aside className="hidden md:block md:w-64 shrink-0 md:max-h-[calc(100vh-13rem)] h-fit md:sticky md:top-52 z-20 pt-2">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 pb-4 hide-scroll p-2 bg-surface-container-high rounded-xl max-h-full">
              {data.map((category) => {
                const categoryId = toKebabCase(category.category);
                return (
                  <button
                    key={categoryId}
                    onClick={() => scrollToCategory(categoryId)}
                    className={cn(
                      'whitespace-nowrap md:w-full text-sm font-medium font-display text-left rounded-lg py-2.5 px-4 transition-all',
                      activeCategory === categoryId
                        ? 'bg-primary-container text-on-primary-container shadow-md'
                        : 'text-on-surface hover:bg-surface-container'
                    )}
                  >
                    {category.category}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Menu Content */}
          <div className="flex-1 space-y-20">
            {data.map((category) => {
              const categoryId = toKebabCase(category.category);
              return (
                <div
                  key={categoryId}
                  id={categoryId}
                  className="menu-category space-y-8 scroll-mt-32"
                >
                  <h3 className="text-heading-md text-on-surface">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {category.items.map((item, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-heading-md text-on-surface group-hover:text-primary-container transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-heading-md text-primary-container">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-body-md text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
