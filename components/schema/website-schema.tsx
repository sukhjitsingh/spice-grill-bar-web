import React from 'react';

export function WebSiteSchema() {
  return (
    <script type="application/ld+json">
      {`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.spicegrillbar.com",
  "name": "Spice Grill & Bar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.spicegrillbar.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
    </script>
  );
}