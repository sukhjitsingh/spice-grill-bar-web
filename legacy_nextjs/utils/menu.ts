import type { MenuData } from "@/types/menu"
import menuData from "@/data/menu.json"

export function getMenuData(): MenuData {
  return menuData as MenuData
}

