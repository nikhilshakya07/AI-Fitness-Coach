/**
 * Generate daily motivation quote prompt
 */
export function createQuotePrompt(): string {
  return `You are a motivational coach. Generate a daily inspirational fitness quote that will help users stay motivated on their fitness journey.

The quote should be:
1. Positive and uplifting
2. Relevant to fitness, health, or personal growth
3. Short and memorable (1-2 sentences max)
4. Original or a classic quote with your own twist

**Output Format:**
Return a valid JSON object with this structure:
{
  "quote": "The quote text here",
  "author": "Author name (optional, can be 'Anonymous' or leave empty)",
  "category": "motivation"
}

Valid categories: "motivation", "fitness", "wellness", or "perseverance"

Make sure the response is valid JSON only, no additional text.`;
}

