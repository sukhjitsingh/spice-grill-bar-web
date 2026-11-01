import ratingData from '@/data/rating.json';

/**
 * Google's overall rating and total review count — the single source for the hero
 * badge and the Restaurant schema's aggregateRating. Refreshed monthly by
 * scripts/ingest-reviews.mjs; reviews.json is only a sample of reviews for the marquee.
 */
export interface Rating {
  ratingValue: number;
  reviewCount: number;
  source: string;
  asOf: string;
}

export const rating = ratingData as Rating;

/** Rounds the review count down to a stable "500+" style label so it doesn't change every month. */
export function reviewCountLabel(count: number): string {
  let step = 10;
  if (count >= 1000) step = 1000;
  else if (count >= 100) step = 100;
  const floored = Math.floor(count / step) * step;
  return floored > 0 ? `${floored.toLocaleString('en-US')}+` : String(count);
}
