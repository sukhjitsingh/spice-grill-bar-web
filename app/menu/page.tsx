import { MenuSection } from "@/components/menu-section"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMenuData } from "@/utils/menu"

export default function MenuPage() {
  const menuData = getMenuData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Our Menu</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our authentic Indian dishes, carefully prepared with traditional spices and fresh ingredients.
        </p>

        <Tabs defaultValue={menuData[0].category} className="w-full">
          <TabsList className="w-full justify-start mb-8 overflow-x-auto flex-row h-auto gap-2 bg-transparent md:flex-nowrap">
            {menuData.map((category) => (
              <TabsTrigger
                key={category.category}
                value={category.category}
                className="text-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white"
              >
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuData.map((category) => (
            <MenuSection key={category.category} category={category} />
          ))}
        </Tabs>
      </div>
    </div>
  )
}

