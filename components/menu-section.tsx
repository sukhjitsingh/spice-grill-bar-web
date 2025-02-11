import type { MenuCategory } from "@/types/menu"
import { MenuCard } from "@/components/menu-card"
import { TabsContent } from "@/components/ui/tabs"

interface MenuSectionProps {
  category: MenuCategory
}

export function MenuSection({ category }: MenuSectionProps) {
  return (
    <TabsContent value={category.category}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.items.map((item, index) => (
          <MenuCard key={`${category.category}-${index}`} item={item} categoryName={category.category} index={index} />
        ))}
      </div>
    </TabsContent>
  )
}

