import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * AI crawlers we explicitly allow.
 *
 * `User-agent: *` already permits these — this block is **declarative, not
 * enforcing**. It exists because the stance is a deliberate business decision and
 * should be visible rather than implied:
 *
 *   - Retrieval bots (OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot,
 *     PerplexityBot, Perplexity-User) fetch a page to answer a live question and cite
 *     the source. For a lead-gen trade site these are the whole point — blocking them
 *     means we cannot be cited at all.
 *   - Training bots (GPTBot, CCBot, Google-Extended, Applebot-Extended) get no direct
 *     citation benefit, but there is nothing proprietary on this site to protect and
 *     no measurable cost at ~4 MB static behind Cloudflare.
 *
 * ⚠️ Cloudflare's managed robots.txt / AI Crawl Control can PREPEND rules at the edge
 * that override everything here — it disallowed all of these until at least 2026-08-17.
 * As of 2026-08-25 the live file matches this output exactly. Always verify against
 * `curl https://betonplus.co.il/robots.txt`, never against this source.
 */
const AI_CRAWLERS = [
  // Retrieval / citation — never block these.
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  // Training / grounding.
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

// Static /robots.txt — allow all crawling and point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
