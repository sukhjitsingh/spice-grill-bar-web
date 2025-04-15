import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { MenuItem } from "@/types/menu";
import Image from "next/image";

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
        {item.description && (
          <p className="text-gray-600 text-sm mt-2">{item.description}</p>
        )}
      </CardHeader>
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg mt-4">
        <Image
          src={item.image || "/placeholder.svg?height=300&width=400"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
    </Card>
  );
}

