"use client";

import reviewsData from "@/data/reviews.json";
import { Quote, Star } from "lucide-react";

// Define interface matching our JSON
interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: "Google" | "Yelp";
  date: string;
  avatar?: string;
}

export const ReviewsSection = () => {
  // We duplicate the reviews to ensure the marquee loop is seamless
  const reviews: Review[] = [...reviewsData, ...reviewsData, ...reviewsData] as Review[];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          What Our <span className="text-orange-700 dark:text-orange-400">Guests Say</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We love hearing from our community. Here are some of the latest reviews from Google and Yelp.
        </p>
      </div>

      {/* Marquee Container - CSS animation with hover pause */}
      <div className="relative w-full overflow-hidden group/marquee">
        {/* Gradient Masks for edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        {/* CSS Keyframes for marquee - pauses on hover */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
          }
          .group\\/marquee:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>

        <div className="flex animate-marquee">
          {reviews.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="w-[340px] md:w-[380px] h-[280px] flex-shrink-0 mx-3 relative group">
      {/* Card with fixed height - improved contrast for both modes */}
      <div className="h-full p-6 rounded-2xl relative overflow-hidden flex flex-col
                      bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl
                      border border-zinc-200 dark:border-white/10
                      shadow-lg shadow-zinc-200/50 dark:shadow-black/20
                      hover:border-orange-500/50 dark:hover:border-orange-500/40 
                      hover:shadow-xl hover:shadow-orange-500/10
                      transition-all duration-300">

        {/* Decorative quote icon - positioned behind content with proper z-index */}
        <Quote className="absolute top-5 right-5 w-12 h-12 text-orange-500/15 dark:text-orange-500/10 
                          group-hover:text-orange-500/25 dark:group-hover:text-orange-500/20 
                          transition-colors duration-300 rotate-180"
          aria-hidden="true" />

        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-yellow-500/0 
                        group-hover:from-orange-500/5 group-hover:to-yellow-500/5 
                        transition-all duration-500 pointer-events-none rounded-2xl" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            {/* Avatar with gradient border and glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full blur-md opacity-40" />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 
                              flex items-center justify-center text-white font-bold text-lg shadow-lg
                              border-2 border-white/30 dark:border-white/20">
                {review.author.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                {review.author}
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{review.date}</span>
            </div>
          </div>

          {/* Source Badge - improved contrast */}
          <div className={`text-xs px-2.5 py-1.5 rounded-full font-semibold flex-shrink-0 relative z-20
            ${review.source === 'Google'
              ? 'bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300'
              : 'bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300'}`}>
            {review.source}
          </div>
        </div>

        {/* Stars - improved visibility */}
        <div className="flex gap-1 mb-4 relative z-10">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating
                ? "fill-orange-500 text-orange-500"
                : "text-zinc-300 dark:text-zinc-600"}`}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only">{review.rating} out of 5 stars</span>
        </div>

        {/* Text - Fixed height with improved contrast */}
        <div className="flex-1 relative z-10 overflow-hidden">
          <p className="text-zinc-700 dark:text-zinc-200 text-sm leading-relaxed line-clamp-4">
            &ldquo;{review.text}&rdquo;
          </p>
        </div>

        {/* Bottom fade - theme-aware gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 
                        bg-gradient-to-t from-white/90 dark:from-zinc-900/90 to-transparent 
                        pointer-events-none rounded-b-2xl" />
      </div>
    </div>
  );
};
