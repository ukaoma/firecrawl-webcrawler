# Servlet Image Extraction Solution

This document describes the solution implemented to address the inconsistent extraction of servlet images in the Firecrawl webcrawler.

## Problem Summary

Images served through servlets (with URLs in the format `/servlet/rtaImage?eid=...&feoid=...&refid=...`) were being inconsistently extracted, sometimes appearing in results and sometimes not. This suggested a timing or DOM readiness issue rather than a fundamental limitation of Firecrawl.

## Solution Implemented

The solution leverages Firecrawl's **actions** parameter to explicitly control browser behavior during extraction, ensuring all dynamic content (including images) is fully loaded before scraping.

### Key Components of the Solution

1. **Action Sequence Implementation**
   - A carefully timed sequence of wait, scroll, and scrape actions
   - Multiple scrolling operations to trigger lazy-loaded images
   - Strategic waiting periods between actions to ensure content loading completes

2. **Implementation Across Scripts**
   - Updated all extraction scripts with the action sequence
   - Customized wait times for each script based on its purpose
   - Added detailed logging of action sequences

3. **Testing Capability**
   - Created a dedicated test script to verify the effectiveness of the solution
   - Comparative testing with and without action sequences

## Action Sequence Details

The enhanced action sequence specifically targets servlet images in Aura components with this pattern:

```javascript
const actions = [
  { type: "wait", milliseconds: 3000 },     // Initial wait for page to load
  { type: "scroll", y: 800 },               // First scroll to trigger lazy loading
  { type: "wait", milliseconds: 1500 },     // Wait after first scroll
  { type: "scroll", y: 1600 },              // Second scroll to load more content
  { type: "wait", milliseconds: 1500 },     // Wait after second scroll
  { type: "scroll", y: 2400 },              // Third scroll to ensure all content is loaded
  { type: "wait", milliseconds: 1000 },     // Brief wait after scrolling
  
  // Wait for servlet images loaded in Aura components
  { type: "waitForSelector", selector: 'img[src^="/servlet/rtaImage"]', timeout: 5000 },
  
  { type: "wait", milliseconds: 1000 },     // Brief wait after images are found
  { type: "scrape" }                        // Perform the actual scraping
];
```

## How It Works

1. **Initial Loading** - The first wait allows the page to initialize and begin loading resources
2. **Lazy Loading Trigger** - Strategic scrolling operations ensure all lazy-loaded content becomes visible
3. **Loading Completion** - Wait periods between scrolls allow time for network requests to complete
4. **Aura Component Targeting** - The `waitForSelector` action explicitly waits for servlet images to be loaded in the DOM
   - Targets images with URLs starting with `/servlet/rtaImage` 
   - Waits up to the specified timeout (5000-7000ms depending on the script)
   - Only proceeds to scraping after these specific images are found
5. **Final Stabilization** - A brief wait after finding servlet images ensures everything is fully rendered
6. **Extraction** - The explicit scrape action captures the fully-loaded page content

## Aura Component Image Handling

This solution specifically addresses images loaded within Aura components, which have these characteristics:

- They appear within HTML elements having `data-aura-rendered-by` attributes
- Their DOM injection happens after initial page render
- They use the servlet URL format: `/servlet/rtaImage?eid=...&feoid=...&refid=...`
- Example found in HTML: `<img src="/servlet/rtaImage?eid=ka04W000001EvYs&feoid=00N4W00000MYwUM&refid=0EM4W000003WJKk" alt="ci 2.jpg">`

The `waitForSelector` approach guarantees that extraction only happens after these dynamically loaded images are present in the DOM.

## Scripts Updated

The following scripts have been updated to use the action sequence:

- `sample_extract.js` - Basic example implementation
- `firecrawl_extractor.js` - Main extraction script
- `zip_extractor_robust.js` - Enhanced extraction with better logging

## Testing

A dedicated test script (`test_image_extraction.js`) is provided to verify the effectiveness of the solution:

```
node test_image_extraction.js
```

This script:
- Performs extractions with and without the action sequence
- Counts and compares the number of images extracted in each case
- Logs detailed results and saves them to a JSON file

## Configuration Options

The action sequence can be fine-tuned based on specific requirements:

- **Selector Specificity**: The selector `img[src^="/servlet/rtaImage"]` can be made more or less specific:
  - More specific: `p[data-aura-rendered-by] img[src^="/servlet/rtaImage"]` to target only images in paragraphs with Aura attributes
  - Less specific: Just using a longer timeout with wait/scroll actions if the selector approach fails

- **Timeout Values**: Adjust the `timeout` parameter in the `waitForSelector` action:
  - Increase for slower connections or complex pages (up to 10000ms)
  - Decrease for faster response time on simpler pages (as low as 3000ms)

- **Wait Times**: Adjust the `milliseconds` values in the wait actions:
  - For slower connections, increase the values
  - For faster connections, decrease to improve extraction speed

- **Scroll Depths**: For pages with different content distributions:
  - Adjust the `y` values in scroll actions to ensure all relevant content is visible
  - Add additional scroll actions for extremely long pages

## Expected Outcome

This enhanced solution should dramatically improve the consistency of servlet image extraction from Aura components by:

1. Explicitly waiting for the target images to appear in the DOM
2. Not proceeding with scraping until servlet images are confirmed to be loaded
3. Providing a more intelligent approach than simple timed waits
4. Handling the specific case of dynamically rendered Aura components

If you encounter a case where the waitForSelector approach times out (no servlet images were found), it could indicate one of two things:

1. The page doesn't contain any servlet images in the format we're looking for
2. The page requires authentication or other user interaction to display servlet images

In either case, the extraction will proceed after the timeout, but may not include servlet images.
