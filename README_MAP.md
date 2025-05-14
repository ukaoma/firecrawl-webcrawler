# Website Mapping Feature

The Website Map feature has been added to the Firecrawl Tools web application. This feature uses the Firecrawl APIs to find all URLs linked from a specified website and includes intelligent ranking of URLs by importance.

## Features

- **Simple URL Input:** Enter any website URL to map all linked pages
- **Enhanced Async Crawling:** Option to use Firecrawl's more powerful async crawling for large sites
- **Smart URL Ranking:** URLs are automatically ranked by importance and relevance
- **Real-time Progress:** Watch as the mapping process runs and URLs are discovered
- **Results Viewing:** View a list of all discovered URLs, prioritized by importance
- **Download Option:** Save the ranked list of URLs to a CSV file for further processing
- **WebSocket Support:** Real-time updates via WebSocket for instant URL discovery feedback

## How to Use

1. **Access the Feature:** Click on the "Website Map" tab in the Firecrawl Tools application
2. **Enter a URL:** Input a complete URL (including https://) of the website you want to map
3. **Enable Enhanced Mode:** For large sites, the enhanced async crawling option is recommended
4. **Configure Options:**
   - **WebSocket:** Enable real-time updates (requires modern browser)
   - **URL Limit:** Set a maximum number of URLs to discover (0 = no limit)
   - **Allow Backward Links:** Enable to crawl the entire site rather than just children of the input URL
   - **Allowed Domains:** Optionally restrict crawling to specific domains
5. **Start Mapping:** Click the "Map Website" button to begin the process
6. **View Results:** Once complete, the discovered URLs will appear ranked by importance
7. **Download Data:** Click the "Download URLs" button to save the results as a CSV file with the header "URLs"

## URL Ranking System

The mapping feature now includes an intelligent URL ranking system that prioritizes URLs based on several factors:

### Priority Levels

URLs are organized into three priority levels:

1. **High Priority**
   - The website homepage (always at the top)
   - URLs directly linked from the homepage
   - URLs containing important keywords like "pricing", "product", "features", "services", "about", "contact", "demo"

2. **Medium Priority**
   - Standard content pages that don't fall into high or low priority categories
   - URLs with shorter paths are prioritized over those with deeper paths

3. **Low Priority**
   - Blog posts, articles, documentation, and resource pages
   - URLs containing keywords like "blog", "docs", "support", "faq", "news", "help", "resources", etc.

### How It Works

1. The system fetches URLs using either:
   - The Firecrawl `/map` endpoint (standard mode)
   - The Firecrawl `/crawl` endpoint with async processing (enhanced mode)
2. It also makes a second API call to analyze links found directly on the homepage
3. URLs are sorted into priority buckets based on their content and source
4. Within each priority level, URLs are sorted by path depth (shorter paths first)
5. The final sorted list shows the most important URLs at the top

## Technical Details

- **Standard Mode:** Uses the Firecrawl `/map` and `/extract` endpoints
- **Enhanced Mode:** Uses the Firecrawl `/crawl` endpoint with async processing
- **Real-time Updates:** WebSocket support for immediate feedback during crawling
- **Large Site Support:** Handles pagination and chunking of results
- **Advanced Options:** Control crawl behavior with limits and domain filtering
- **Robust Error Handling:** Fallbacks between WebSocket and polling for reliability
- **Client-side Ranking:** Implements intelligent URL ranking algorithms
- **CSV Export:** URL lists can be downloaded in CSV format for easy integration with other tools

## Use Cases

- **SEO Analysis:** Discover all pages on a website for SEO auditing
- **Content Inventory:** Create a complete list of all content pages
- **Broken Link Checking:** Find all URLs to check for broken links
- **Site Migration:** Document all pages before migrating to a new platform
- **Security Scanning:** Generate URL lists for security testing
- **Large Site Mapping:** Map websites with hundreds or thousands of pages using async crawling

## Async Crawling Advantages

For large websites, the enhanced async crawling mode offers several advantages:

- **Complete URL Discovery:** Recursively discovers all pages, even on large sites
- **Progressive Results:** See URLs as they're discovered, rather than waiting for completion
- **Real-time Updates:** WebSocket support shows progress in real-time
- **Pagination Handling:** Automatically handles large result sets through chunking
- **Better Coverage:** Finds deeply nested pages that might be missed by the standard mode
- **Configurable Limits:** Control the depth and breadth of the crawl

## Example

Mapping a simple website like `https://example.com` will return all linked pages, including internal links, external links, and resource links. For larger sites with hundreds or thousands of pages, the enhanced async crawling mode ensures complete URL discovery.

## Integration with ZIP Code Tools

This feature complements the existing ZIP code data extraction tools, providing a complete suite of Firecrawl API capabilities within a single web application.
