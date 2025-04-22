/**
 * Test script for verifying the extraction of servlet images
 * This script specifically tests the action sequence solution to ensure
 * all dynamically loaded servlet images are properly extracted
 */

const firecrawlJs = require('@mendable/firecrawl-js');
const { z } = require('zod');
const fs = require('fs');
const imageProcessor = require('./image_url_processor');

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";

// Test URLs known to have servlet images
const testUrls = [
  // The specific URL where we've identified issues with servlet image extraction
  "https://rainpos.my.site.com/s/article/Having-Trouble-Centering-an-Image-Here-s-How",
  // Additional test URLs with servlet images
  "https://rainpos.my.site.com/products/sample-product",
  "https://rainpos.my.site.com/category/sample-category"
];

// Initialize the Firecrawl app
const app = new firecrawlJs.default({apiKey: API_KEY});

// Define the schema for extracting data including image URLs
const schema = z.object({
  extracted_data: z.object({
    page_title: z.string(),
    description: z.string().optional(),
    // Specifically ask for image extraction
    images: z.array(z.object({
      url: z.string(),
      alt_text: z.string().optional()
    })).optional()
  })
});

async function testImageExtraction() {
  console.log("Testing image extraction with action sequence");
  console.log("Target URLs:", testUrls);
  
  try {
    // Define the sequence of actions specifically designed to 
    // ensure all dynamic content and images are loaded, especially Aura components
    const actions = [
      { type: "wait", milliseconds: 3000 },     // Initial wait for page to load
      { type: "scroll", y: 800 },               // First scroll to trigger lazy loading
      { type: "wait", milliseconds: 1500 },     // Wait after first scroll
      { type: "scroll", y: 1600 },              // Second scroll for more content
      { type: "wait", milliseconds: 1500 },     // Wait after second scroll
      // Wait for elements with data-aura-rendered-by attributes which contain servlet images
      { type: "waitForSelector", selector: 'img[src^="/servlet/rtaImage"]', timeout: 5000 },
      { type: "wait", milliseconds: 1000 },     // Brief wait after selector found
      { type: "scrape" }                        // Perform the actual scraping
    ];
    
    console.log("Using the following action sequence:", 
      JSON.stringify(actions.map(a => a.type).join(' → ')));
    
    // Extract with action sequence
    console.log("\nExtracting with action sequence...");
    const resultWithActions = await app.extract(
      testUrls, 
      {
        prompt: "Extract the page title, description, and ALL images from this page. For any images from rainpos.my.site.com, only extract images with URLs in the format /servlet/rtaImage?eid=...&feoid=...&refid=... and avoid using direct image paths like /images/... as they require login and are not publicly accessible. IMPORTANT: Wait for all dynamic content to fully load on the page, including images that may load after initial page rendering.",
        schema,
        actions: actions  // Include our action sequence
      }
    );
    
    // Process and clean up image URLs
    const processedResult = imageProcessor.processExtractionResult(resultWithActions);
    
    // Save the result to a JSON file
    fs.writeFileSync('image_extraction_test_results.json', JSON.stringify({
      with_actions: processedResult
    }, null, 2));
    
    // Extract without waitForSelector for comparison
    console.log("\nExtracting without waitForSelector for comparison...");
    // Create a version of actions without the waitForSelector
    const basicActions = [
      { type: "wait", milliseconds: 3000 },
      { type: "scroll", y: 800 },
      { type: "wait", milliseconds: 1500 },
      { type: "scroll", y: 1600 },
      { type: "wait", milliseconds: 1500 },
      { type: "wait", milliseconds: 3000 },     // Longer wait to compensate for no waitForSelector
      { type: "scrape" }
    ];
    
    const resultWithoutActions = await app.extract(
      testUrls, 
      {
        prompt: "Extract the page title, description, and ALL images from this page. For any images from rainpos.my.site.com, only extract images with URLs in the format /servlet/rtaImage?eid=...&feoid=...&refid=... and avoid using direct image paths like /images/... as they require login and are not publicly accessible. IMPORTANT: Look for images within elements that have data-aura-rendered-by attributes, as these often contain servlet images.",
        schema,
        actions: basicActions  // Use basic actions without waitForSelector
      }
    );
    
    // Process and clean up image URLs for the comparison result
    const processedComparisonResult = imageProcessor.processExtractionResult(resultWithoutActions);
    
    // Add the comparison result to our JSON file
    const finalResults = {
      with_actions: processedResult,
      without_actions: processedComparisonResult
    };
    
    fs.writeFileSync('image_extraction_test_results.json', JSON.stringify(finalResults, null, 2));
    console.log("\nResults saved to image_extraction_test_results.json");
    
    // Count and compare the extracted images
    let withActionsImageCount = 0;
    let withoutActionsImageCount = 0;
    
    if (processedResult && processedResult.extracted_data) {
      processedResult.extracted_data.forEach(page => {
        if (page.images && Array.isArray(page.images)) {
          withActionsImageCount += page.images.length;
          console.log(`WITH actions - URL: ${page.page_url || 'unknown'} - Found ${page.images.length} images`);
          
          // Log the first few image URLs
          page.images.slice(0, 3).forEach((img, i) => {
            console.log(`  Image ${i+1}: ${img.url.substring(0, 100)}${img.url.length > 100 ? '...' : ''}`);
          });
        }
      });
    }
    
    if (processedComparisonResult && processedComparisonResult.extracted_data) {
      processedComparisonResult.extracted_data.forEach(page => {
        if (page.images && Array.isArray(page.images)) {
          withoutActionsImageCount += page.images.length;
          console.log(`WITHOUT actions - URL: ${page.page_url || 'unknown'} - Found ${page.images.length} images`);
          
          // Log the first few image URLs
          page.images.slice(0, 3).forEach((img, i) => {
            console.log(`  Image ${i+1}: ${img.url.substring(0, 100)}${img.url.length > 100 ? '...' : ''}`);
          });
        }
      });
    }
    
    console.log("\nSummary:");
    console.log(`Total images found WITH action sequence: ${withActionsImageCount}`);
    console.log(`Total images found WITHOUT action sequence: ${withoutActionsImageCount}`);
    console.log(`Difference: ${withActionsImageCount - withoutActionsImageCount} additional images found with action sequence`);
    
  } catch (error) {
    console.error("Error during image extraction test:", error);
  }
}

// Run the test
testImageExtraction();
