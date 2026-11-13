export interface MenuItem {
  name: string;
  description: string;
  price: number;
  /** Leaf (vegetarian) or dot (non-veg) on the print menu; omitted where the print menu shows neither. */
  veg?: boolean;
  favorite?: boolean;
  isNew?: boolean;
  note?: string;
  /** Filename of a photo in `src/assets/menu/`; requires `imageAlt`. */
  image?: string;
  imageAlt?: string;
}

export interface MenuItemImage {
  alt: string;
  thumb: { src: string; srcSet: string; width: number; height: number };
  full: { src: string; width: number; height: number };
}

/** Keyed by the item's `image` filename. */
export type MenuImageMap = Record<string, MenuItemImage>;

export interface MenuCategory {
  category: string;
  /** Print-menu page the category belongs to; consecutive categories with the same section render together. */
  section: string;
  tagline?: string;
  note?: string;
  isNew?: boolean;
  items: MenuItem[];
}
