"use client"

import { MenuSection } from "@/components/menu-section"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMenuData } from "@/utils/menu"

export default function MenuPage() {
  const menuData = getMenuData()

  const handleTabChange = (value: string) => {
    const content = document.getElementById(value);
    content?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 py-12">
      <div className="container mx-auto px-4 py-10">
        <div className="bg-transparent py-2 mb-4">
          <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Our Menu</h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our authentic Indian dishes, carefully prepared with traditional spices and fresh ingredients.
          </p>
        </div>

        <Tabs defaultValue={menuData[0].category} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="sticky top-[5rem] z-30 w-full justify-start overflow-x-auto flex-row h-auto gap-2 bg-white py-2 border-b md:flex-nowrap">
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
            <MenuSection key={category.category} category={category}/>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
