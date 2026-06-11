export interface FAQItem {
  question: string;
  answer: string;
  relatedLink?: {
    href: string;
    text: string;
  };
}
