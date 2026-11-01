export interface MenuItem {
  name: string;
  description: string;
  price: number;
  /** Leaf (vegetarian) or dot (non-veg) on the print menu; omitted where the print menu shows neither. */
  veg?: boolean;
  favorite?: boolean;
  isNew?: boolean;
  note?: string;
}

export interface MenuCategory {
  category: string;
  /** Print-menu page the category belongs to; consecutive categories with the same section render together. */
  section: string;
  tagline?: string;
  note?: string;
  items: MenuItem[];
}
