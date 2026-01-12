export function MenuSchema() {
  return (
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "Menu",
          "name": "Spice Grill & Bar Menu",
          "mainEntityOfPage": "https://spicegrillbar66.com/#menu",
          "hasMenuSection": [
            {
              "@type": "MenuSection",
              "name": "Popular Dishes",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Fish Pakora",
                  "description": "Marinated fish fried in our chickpea batter.",
                  "offers": {
                    "@type": "Offer",
                    "price": "10.99",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Butter Chicken",
                  "description": "Rich butter-cream, tomatoes, onion sauce cooked with chicken thighs.",
                  "offers": {
                    "@type": "Offer",
                    "price": "15.99",
                    "priceCurrency": "USD"
                  },
                  "suitableForDiet": ["https://schema.org/HalalDiet"]
                },
                {
                  "@type": "MenuItem",
                  "name": "Shahi Paneer",
                  "description": "Chunks of cottage cheese in a savory rich buttery cream sauce.",
                  "offers": {
                    "@type": "Offer",
                    "price": "15.99",
                    "priceCurrency": "USD"
                  },
                  "suitableForDiet": ["https://schema.org/VegetarianDiet"]
                },
                {
                  "@type": "MenuItem",
                  "name": "Goat Curry",
                  "description": "Goat cooked in our traditional curry sauce.",
                  "offers": {
                    "@type": "Offer",
                    "price": "16.49",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "MenuItem",
                  "name": "Samosa (2 pcs)",
                  "description": "Indian pastry stuffed with potatoes & peas.",
                  "offers": {
                    "@type": "Offer",
                    "price": "4.99",
                    "priceCurrency": "USD"
                  },
                  "suitableForDiet": ["https://schema.org/VegetarianDiet"]
                },
                {
                  "@type": "MenuItem",
                  "name": "Garlic Naan",
                  "description": "Drizzled with butter and garlic on top",
                  "offers": {
                    "@type": "Offer",
                    "price": "3.99",
                    "priceCurrency": "USD"
                  },
                  "suitableForDiet": ["https://schema.org/VegetarianDiet"]
                }
              ]
            }
          ]
        }
      `}
    </script>
  );
}
