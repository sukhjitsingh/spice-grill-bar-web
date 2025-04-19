export interface MenuItem {
  name: string
  description: string
  price: number
  imageUrl: string
  popularity: number
}

export interface MenuCategory {
  category: string
  items: MenuItem[]
}
export type MenuData = MenuCategory[]

