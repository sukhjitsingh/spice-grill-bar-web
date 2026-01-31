"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

import faqData from "@/data/faq.json"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqData.map((faq, index) => (
        <div
          key={index}
          className="glass-card rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 transition-all duration-300"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-t-2xl"
          >
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white leading-tight">
              {faq.question}
            </h3>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-orange-600 dark:text-orange-400 transition-transform duration-300 shrink-0",
                openIndex === index ? "rotate-180" : ""
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
