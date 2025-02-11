import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MenuItem } from "@/types/menu"

interface MenuCardProps {
  item: MenuItem
  categoryName: string
  index: number
}

export function MenuCard({ item, categoryName, index }: MenuCardProps) {
  return (
    <Card key={`${categoryName}-${index}`} className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="font-serif text-xl">{item.name}</CardTitle>
          <span className="text-lg font-semibold text-brand-orange whitespace-nowrap">${item.price.toFixed(2)}</span>
        </div>
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm">{item.description}</p>
        </CardContent>
      )}
    </Card>
  )
}

