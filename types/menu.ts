export interface MenuItem {
  name: string
  description?: string
  price: number
  image?: string
}

export interface MenuCategory {
  category: string
  items: MenuItem[]
}

export type MenuData = MenuCategory[]

