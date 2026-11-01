import menuData from '@/data/menu.json';
import type { MenuCategory, MenuItem } from '@/types/menu';

export const menu = menuData as MenuCategory[];

export interface MenuSectionGroup {
  section: string;
  tagline?: string;
  categories: MenuCategory[];
}

export const menuSections: MenuSectionGroup[] = menu.reduce<MenuSectionGroup[]>((groups, cat) => {
  const last = groups[groups.length - 1];
  if (last?.section === cat.section) last.categories.push(cat);
  else groups.push({ section: cat.section, tagline: cat.tagline, categories: [cat] });
  return groups;
}, []);

export const toAnchor = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const favorites: MenuItem[] = menu.flatMap((cat) => cat.items).filter((i) => i.favorite);

export function priceFor(name: string): number {
  const item = menu.flatMap((cat) => cat.items).find((i) => i.name === name);
  if (item) return item.price;

  throw new Error(
    `Menu item not found in src/data/menu.json: "${name}". ` +
      'If the item was renamed or removed, update the caller (likely a featured-dish list on a GEO page).'
  );
}

export function formatPrice(name: string): string {
  return priceFor(name).toFixed(2);
}
