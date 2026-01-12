import { FAQSection } from "@/components/faq-section"
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema"
import { FAQSchema } from "@/components/schema/faq-schema"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Frequently Asked Questions | Spice Grill & Bar Ash Fork, AZ",
  description: "Find answers to common questions about Spice Grill & Bar, including our Halal certification, hours, location on Route 66, and menu options.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-500 pt-32 pb-24">
      <FAQSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: "FAQ", item: "/faq" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-orange-700 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-zinc-900 dark:text-white mb-6">
            Frequently Asked <span className="text-orange-700 dark:text-orange-400">Questions</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            Everything you need to know about our authentic Punjabi cuisine, location on historic Route 66, and dining experience.
          </p>
        </div>

        <FAQSection />
      </div>
    </div>
  )
}
