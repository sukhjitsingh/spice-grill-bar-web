
export function WebSiteSchema() {
  return (
    <script type="application/ld+json">
      {`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.spicegrillbar66.com",
  "name": "Spice Grill & Bar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.spicegrillbar66.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
    </script>
  );
}