import menuData from '@/data/menu.json';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  popularity: number;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const menu = menuData as MenuCategory[];

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
