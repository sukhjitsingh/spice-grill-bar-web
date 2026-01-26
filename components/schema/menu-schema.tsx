import menuData from "@/data/menu.json";

export function MenuSchema() {
  return (
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "Menu",
          "name": "Spice Grill & Bar Menu",
          "mainEntityOfPage": "https://spicegrillbar66.com/#menu",
          "hasMenuSection": ${JSON.stringify(
        menuData.map((category) => ({
          "@type": "MenuSection",
          "name": category.category,
          "hasMenuItem": category.items.map((item) => ({
            "@type": "MenuItem",
            "name": item.name,
            "description": item.description,
            "offers": {
              "@type": "Offer",
              "price": item.price.toString(),
              "priceCurrency": "USD",
            },
            ...(item.imageUrl ? { "image": item.imageUrl } : {}),
          })),
        }))
      )}
        }
      `}
    </script>
  );
}

