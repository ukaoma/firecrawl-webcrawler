# Website Mapping Feature

The Website Map feature has been added to the Firecrawl Tools web application. This feature uses the Firecrawl `/map` API endpoint to find all URLs linked from a specified website and now includes intelligent ranking of URLs by importance.

## Features

- **Simple URL Input:** Enter any website URL to map all linked pages
- **Smart URL Ranking:** URLs are automatically ranked by importance and relevance
- **Real-time Progress:** Watch as the mapping process runs and URLs are discovered
- **Results Viewing:** View a list of all discovered URLs, prioritized by importance
- **Download Option:** Save the ranked list of URLs to a CSV file for further processing

## How to Use

1. **Access the Feature:** Click on the "Website Map" tab in the Firecrawl Tools application
2. **Enter a URL:** Input a complete URL (including https://) of the website you want to map
3. **Start Mapping:** Click the "Map Website" button to begin the process
4. **View Results:** Once complete, the discovered URLs will appear ranked by importance
5. **Download Data:** Click the "Download URLs" button to save the results as a CSV file with the header "URLs"

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

1. The system first fetches all URLs using the Firecrawl `/map` endpoint
2. Then it makes a second API call to analyze links found directly on the homepage
3. URLs are sorted into priority buckets based on their content and source
4. Within each priority level, URLs are sorted by path depth (shorter paths first)
5. The final sorted list shows the most important URLs at the top

## Technical Details

- Makes requests to both the Firecrawl `/map` and `/extract` endpoints
- Implements client-side ranking algorithms based on homepage content and URL patterns
- Results are displayed in priority order as they become available
- Gracefully handles API errors with fallbacks and clear user feedback
- URL lists can be downloaded in CSV format for easy integration with other tools

## Use Cases

- **SEO Analysis:** Discover all pages on a website for SEO auditing
- **Content Inventory:** Create a complete list of all content pages
- **Broken Link Checking:** Find all URLs to check for broken links
- **Site Migration:** Document all pages before migrating to a new platform
- **Security Scanning:** Generate URL lists for security testing

## Example

Mapping a simple website like `https://example.com` will return all linked pages, including internal links, external links, and resource links.

## Integration with ZIP Code Tools

This feature complements the existing ZIP code data extraction tools, providing a complete suite of Firecrawl API capabilities within a single web application.
