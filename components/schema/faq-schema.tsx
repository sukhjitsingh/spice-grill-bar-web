import faqData from "@/data/faq.json";

export function FAQSchema() {
  return (
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": ${JSON.stringify(
        faqData.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        }))
      )}
        }
      `}
    </script>
  );
}

