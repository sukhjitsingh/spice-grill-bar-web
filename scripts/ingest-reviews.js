
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Gemini SDK
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

// Initialize SDK
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System instruction for role/context
const systemInstruction = `You are a data extraction specialist for Spice Grill & Bar, a Punjabi restaurant in Ash Fork, AZ.

Your task is to extract customer reviews from raw scraped text data from Google Maps and Yelp business pages.

Guidelines:
- Extract ONLY genuine customer reviews (ignore navigation text, ads, business info)
- Prioritize recent, detailed reviews with 4-5 star ratings
- Clean up whitespace and formatting in review text
- Convert relative dates ("2 weeks ago") to absolute dates based on the provided current date
- If a source is blocked or empty, extract from the available source only
- Return valid JSON as specified`;

// Google Maps URL might be less bot-aggressive than Search
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/Spice+Grill+%26+Bar+Ash+Fork';
const YELP_URL = 'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork?osq=spice+grill+and+bar#reviews';

async function scrapeGoogle(page) {
  console.log('Navigating to Google Maps...');
  await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
  });
  
  await page.goto(GOOGLE_MAPS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('Google Title:', await page.title());
  
  // Try to find the "Reviews" tab button on Maps
  try {
      // Maps often has a "Reviews" tab with aria-label or text
      const reviewButton = await page.$('button[aria-label*="Reviews"]');
      if (reviewButton) {
          console.log("Found Reviews tab, clicking...");
          await reviewButton.click();
          await new Promise(r => setTimeout(r, 3000));
      } else {
          console.log("Reviews tab not explicitly found, scrolling pane...");
      }
  } catch (e) {}

  // Scroll the side pane (usually role="main" or aria-label="Results")
  await page.mouse.wheel(0, 3000);
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.evaluate(() => document.body.innerText);
  console.log(`Captured ${content.length} characters from Google.`);
  return content;
}

async function scrapeYelp(page) {
  console.log('Navigating to Yelp...');
  await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.google.com/'
  });
  
  // Navigate to Yelp
  await page.goto(YELP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Yelp Title:', await page.title());
  
  // Wait explicitly
  await new Promise(r => setTimeout(r, 5000));

  const content = await page.evaluate(() => document.body.innerText);
  console.log(`Captured ${content.length} characters from Yelp.`);
  
  // Save debug file
  fs.writeFileSync('yelp_raw.txt', content);

  return content;
}

async function processWithGemini(googleText, yelpText, googleSuccess, yelpSuccess) {
    console.log('Sending data to Gemini 2.5 Flash...');
    
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Build prompt with only successful sources (saves tokens)
    let sourceData = '';
    if (googleSuccess) {
        sourceData += `# Google Data\n${googleText.substring(0, 50000)}\n\n`;
    }
    if (yelpSuccess) {
        sourceData += `# Yelp Data\n${yelpText.substring(0, 50000)}\n\n`;
    }

    const prompt = `
Data is in raw text format from web scraping.
Current date: ${today}

Task: Extract up to 4 reviews from each available source.

${sourceData}
Extract reviews with these fields:
- id: unique identifier (e.g. "google-1", "yelp-1")
- author: reviewer's name
- rating: numeric 1-5
- text: the review text
- source: "Google" or "Yelp"
- date: formatted date string
`;

    // Use Gemini's native JSON response mode
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { 
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            reviews: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  author: { type: "string" },
                  rating: { type: "number" },
                  text: { type: "string" },
                  source: { type: "string" },
                  date: { type: "string" }
                },
                required: ["id", "author", "rating", "text", "source", "date"]
              }
            }
          },
          required: ["reviews"]
        }
      },
    });

    // Parse JSON directly - Gemini returns valid JSON in JSON mode
    const result = JSON.parse(response.text);
    return result.reviews || result;
}

// Minimum characters threshold to consider a scrape successful
const MIN_SCRAPE_CHARS = 500;

(async () => {
    const outputPath = path.join(__dirname, '../data/reviews.json');
    
    // Load existing reviews for fallback
    let existingReviews = [];
    try {
        if (fs.existsSync(outputPath)) {
            existingReviews = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
            console.log(`Loaded ${existingReviews.length} existing reviews.`);
        }
    } catch (e) {
        console.warn('Could not load existing reviews:', e.message);
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--window-size=1920,1080',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    // Set a real user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

    try {
        console.log('Scraping Google...');
        const googleText = await scrapeGoogle(page);
        const googleSuccess = googleText.length >= MIN_SCRAPE_CHARS;
        console.log(`Google scrape ${googleSuccess ? 'SUCCESS' : 'FAILED'} (${googleText.length} chars)`);
        
        console.log('Scraping Yelp...');
        const yelpText = await scrapeYelp(page);
        const yelpSuccess = yelpText.length >= MIN_SCRAPE_CHARS;
        console.log(`Yelp scrape ${yelpSuccess ? 'SUCCESS' : 'FAILED'} (${yelpText.length} chars)`);
        
        // Only proceed with Gemini if at least one source succeeded
        if (!googleSuccess && !yelpSuccess) {
            console.log('Both sources failed to scrape. Keeping existing reviews.');
            return;
        }
        
        console.log("Sending data to Gemini (only successful sources)...");
        const newReviews = await processWithGemini(googleText, yelpText, googleSuccess, yelpSuccess);
        console.log(`Gemini extracted ${newReviews.length} reviews.`);
        
        // Separate new reviews by source
        const newGoogleReviews = newReviews.filter(r => r.source === 'Google');
        const newYelpReviews = newReviews.filter(r => r.source === 'Yelp');
        
        // Keep existing reviews from sources that failed to scrape
        const existingGoogleReviews = existingReviews.filter(r => r.source === 'Google');
        const existingYelpReviews = existingReviews.filter(r => r.source === 'Yelp');
        
        // Merge: use new data for successful scrapes, keep existing for failed ones
        const finalReviews = [
            ...(googleSuccess ? newGoogleReviews : existingGoogleReviews),
            ...(yelpSuccess ? newYelpReviews : existingYelpReviews)
        ];
        
        console.log(`Final review count: ${finalReviews.length} (Google: ${googleSuccess ? newGoogleReviews.length : existingGoogleReviews.length + ' [preserved]'}, Yelp: ${yelpSuccess ? newYelpReviews.length : existingYelpReviews.length + ' [preserved]'})`);
        
        fs.writeFileSync(outputPath, JSON.stringify(finalReviews, null, 2));
        console.log(`Saved to ${outputPath}`);
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
})();
