import { Crown, Leaf } from 'lucide-react';
import * as React from 'react';

import { menuSections, toAnchor } from '@/lib/menu';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/types/menu';

// Sections whose single category shares the section's name don't need a second heading level.
const groups = menuSections.map((group) => {
  const showCategoryHeadings =
    group.categories.length > 1 || group.categories[0].category !== group.section;
  const sectionId = toAnchor(group.section);
  return {
    ...group,
    showCategoryHeadings,
    // Avoid duplicate ids when the section and its first category share a name (e.g. Appetizers).
    sectionId: group.categories.some((c) => toAnchor(c.category) === sectionId)
      ? undefined
      : sectionId,
  };
});

const navTargets = groups.flatMap((group) =>
  group.categories.map((c) => ({
    id: toAnchor(c.category),
    label: c.category,
    group: group.section,
  }))
);

function ItemRow({ item, level }: { item: MenuItem; level: 'h3' | 'h4' }) {
  const Heading = level;
  return (
    <div className="group">
      <div className="flex justify-between items-baseline gap-4 mb-1">
        <Heading className="text-heading-md text-on-surface group-hover:text-primary-container transition-colors flex flex-wrap items-center gap-x-2">
          <span>{item.name}</span>
          {item.veg && (
            <span title="Vegetarian" className="inline-flex">
              <Leaf className="w-4 h-4 text-on-surface-variant" aria-hidden="true" />
              <span className="sr-only">(vegetarian)</span>
            </span>
          )}
          {item.favorite && (
            <span title="All-time favorite" className="inline-flex">
              <Crown className="w-4 h-4 text-primary-container" aria-hidden="true" />
              <span className="sr-only">(all-time favorite)</span>
            </span>
          )}
          {item.isNew && (
            <span className="text-label-sm uppercase bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </Heading>
        <span className="text-heading-md text-primary-container shrink-0">
          ${item.price.toFixed(2)}
        </span>
      </div>
      {item.description && (
        <p className="text-body-md text-on-surface-variant">{item.description}</p>
      )}
      {item.note && <p className="text-sm text-on-surface-variant mt-1 italic">{item.note}</p>}
    </div>
  );
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = React.useState(navTargets[0].id);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + 250; // Offset for sticky headers
        let current = '';
        document.querySelectorAll('.menu-category').forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + section.clientHeight) {
            current = section.getAttribute('id') || '';
          }
        });
        if (current) setActiveCategory(current);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep the active chip visible by scrolling only its nav container, never the page.
  React.useEffect(() => {
    document.querySelectorAll<HTMLElement>(`[data-nav="${activeCategory}"]`).forEach((el) => {
      const scroller = el.closest<HTMLElement>('[data-nav-scroller]');
      if (!scroller || !scroller.offsetParent) return;
      const elRect = el.getBoundingClientRect();
      const boxRect = scroller.getBoundingClientRect();
      scroller.scrollBy({
        left: elRect.left - boxRect.left - (boxRect.width - elRect.width) / 2,
        top: elRect.top - boxRect.top - (boxRect.height - elRect.height) / 2,
        behavior: 'smooth',
      });
    });
  }, [activeCategory]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (!element) return;
    const offset = window.innerWidth >= 768 ? 96 : 150; // Fixed header (+ sticky mobile chips)
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
    window.history.replaceState(null, '', `#${categoryId}`);
    setActiveCategory(categoryId);
  };

  return (
    <section
      id="full-menu"
      aria-label="Full menu"
      className="bg-surface-container-low pb-24 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile category chips */}
        <div className="md:hidden sticky top-14 z-30 bg-surface-container-low py-3 -mx-6 px-6 transition-colors duration-500">
          <nav aria-label="Menu categories" className="p-1.5 bg-surface-container rounded-xl">
            <div data-nav-scroller className="flex overflow-x-auto gap-2 hide-scroll">
              {navTargets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-nav={t.id}
                  onClick={() => scrollToCategory(t.id)}
                  aria-current={activeCategory === t.id ? 'true' : undefined}
                  className={cn(
                    'whitespace-nowrap text-sm font-medium rounded-lg py-2 px-4 transition-all',
                    activeCategory === t.id
                      ? 'bg-surface-container-high text-on-surface'
                      : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative pt-6 md:pt-0">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:w-64 shrink-0 h-fit md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] z-20">
            <nav
              aria-label="Menu categories"
              data-nav-scroller
              className="flex flex-col overflow-y-auto gap-1 p-2 bg-surface-container-high rounded-xl max-h-[calc(100vh-6rem)] hide-scroll"
            >
              {groups.map((group, i) => (
                <div
                  key={group.section}
                  className={cn(
                    'flex flex-col gap-1',
                    i > 0 && !group.showCategoryHeadings && 'mt-3'
                  )}
                >
                  {group.showCategoryHeadings && (
                    <p className="text-label-sm uppercase tracking-wider text-on-surface-variant px-4 pt-3 pb-1">
                      {group.section}
                    </p>
                  )}
                  {group.categories.map((c) => {
                    const id = toAnchor(c.category);
                    return (
                      <button
                        key={id}
                        type="button"
                        data-nav={id}
                        onClick={() => scrollToCategory(id)}
                        aria-current={activeCategory === id ? 'true' : undefined}
                        className={cn(
                          'w-full text-sm font-medium font-display text-left rounded-lg py-2.5 px-4 transition-all',
                          activeCategory === id
                            ? 'bg-primary-container text-on-primary-container shadow-md'
                            : 'text-on-surface hover:bg-surface-container'
                        )}
                      >
                        {c.category}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-surface-variant mb-10">
              <li className="flex items-center gap-2">
                <Leaf className="w-4 h-4" aria-hidden="true" /> Vegetarian
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary-container" aria-hidden="true" /> All-time
                favorite
              </li>
              <li className="flex items-center gap-2">
                <span className="text-label-sm uppercase bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full">
                  New
                </span>
                Just added
              </li>
            </ul>

            <div className="space-y-20">
              {groups.map((group) => (
                <div key={group.section} id={group.sectionId} className="scroll-mt-24 space-y-12">
                  <div>
                    <h2 className="text-heading-lg text-on-surface">{group.section}</h2>
                    {group.tagline && (
                      <p className="text-body-md text-on-surface-variant mt-2">{group.tagline}</p>
                    )}
                  </div>
                  {group.categories.map((cat) => (
                    <div
                      key={cat.category}
                      id={toAnchor(cat.category)}
                      className="menu-category space-y-8 scroll-mt-36 md:scroll-mt-24"
                    >
                      {group.showCategoryHeadings && (
                        <h3
                          className={cn(
                            'text-label-sm uppercase tracking-wider text-on-surface',
                            cat.category === group.section && 'sr-only'
                          )}
                        >
                          {cat.category}
                        </h3>
                      )}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                        {cat.items.map((item) => (
                          <ItemRow
                            key={item.name}
                            item={item}
                            level={group.showCategoryHeadings ? 'h4' : 'h3'}
                          />
                        ))}
                      </div>
                      {cat.note && (
                        <p className="text-sm text-on-surface-variant italic">{cat.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
