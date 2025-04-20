export function RestaurantSchema() {
  return (
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Spice Grill & Bar",
          "url": "https://www.spicegrillbar.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "33 Lewis Ave",
            "addressLocality": "Ash Fork",
            "addressRegion": "AZ",
            "postalCode": "86320",
            "addressCountry": "US"
          },
          "telephone": "(928) 277-1292",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "http://schema.org/Monday",
                "http://schema.org/Tuesday",
                "http://schema.org/Wednesday",
                "http://schema.org/Thursday",
                "http://schema.org/Friday",
              ],
              "opens": "07:00",
              "closes": "22:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "http://schema.org/Saturday",
                "http://schema.org/Sunday"
              ],
              "opens": "07:00",
              "closes": "22:00"
            }
          ],
          "servesCuisine": "Punjabi",
          "priceRange": "$$",
          "image": "/HomePageBackground.jpg",
          "menu": "/menu"
        }
      `}
    </script>
  );
}