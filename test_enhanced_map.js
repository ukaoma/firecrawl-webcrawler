/**
 * Test script for enhanced website mapping functionality
 * This script tests the async crawling capabilities with both polling and WebSocket methods
 */

// Import necessary modules
const { mapWebsiteAsync } = require('./enhanced_website_map');

// Test URL - use a small site for testing
const TEST_URL = 'https://example.com';

// Test options
const options = {
  useWebSocket: false, // We'll toggle this to test both methods
  limit: 10, // Limit to 10 URLs for testing
  allowBackwardLinks: true
};

// Simple progress logger
const logProgress = (progress) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${progress.phase}] ${progress.message}`);
  
  if (progress.urlCount !== undefined) {
    console.log(`  URLs found: ${progress.urlCount}`);
  }
  
  if (progress.progress !== undefined) {
    const progressBar = '█'.repeat(Math.floor(progress.progress / 5)) + 
                       '░'.repeat(20 - Math.floor(progress.progress / 5));
    console.log(`  Progress: [${progressBar}] ${progress.progress}%`);
  }
};

// Test with polling
async function testWithPolling() {
  console.log('\n===== TESTING ENHANCED WEBSITE MAPPING WITH POLLING =====\n');
  
  options.useWebSocket = false;
  
  try {
    console.log(`Starting crawl of ${TEST_URL} with polling...`);
    console.log(`Options: ${JSON.stringify(options)}`);
    
    const startTime = Date.now();
    const rankedUrls = await mapWebsiteAsync(TEST_URL, options, logProgress);
    const endTime = Date.now();
    
    console.log(`\nTest completed in ${(endTime - startTime) / 1000} seconds`);
    console.log(`Found ${rankedUrls.length} URLs:`);
    rankedUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    return rankedUrls;
  } catch (error) {
    console.error('Test failed:', error);
    return [];
  }
}

// Test with WebSocket
async function testWithWebSocket() {
  console.log('\n===== TESTING ENHANCED WEBSITE MAPPING WITH WEBSOCKET =====\n');
  
  options.useWebSocket = true;
  
  try {
    console.log(`Starting crawl of ${TEST_URL} with WebSocket...`);
    console.log(`Options: ${JSON.stringify(options)}`);
    
    const startTime = Date.now();
    const rankedUrls = await mapWebsiteAsync(TEST_URL, options, logProgress);
    const endTime = Date.now();
    
    console.log(`\nTest completed in ${(endTime - startTime) / 1000} seconds`);
    console.log(`Found ${rankedUrls.length} URLs:`);
    rankedUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
    return rankedUrls;
  } catch (error) {
    console.error('Test failed:', error);
    console.log('This is expected if running in a non-browser environment without WebSocket support');
    return [];
  }
}

// Compare results from both methods
async function compareResults() {
  console.log('\n===== COMPARING RESULTS =====\n');
  
  const pollingUrls = await testWithPolling();
  const websocketUrls = await testWithWebSocket();
  
  if (pollingUrls.length === 0 || websocketUrls.length === 0) {
    console.log('Cannot compare results because one or both tests failed.');
    return;
  }
  
  // Compare the number of URLs found
  console.log(`Polling found ${pollingUrls.length} URLs`);
  console.log(`WebSocket found ${websocketUrls.length} URLs`);
  
  // Compare the actual URLs found (might be in different order)
  const pollingSet = new Set(pollingUrls);
  const websocketSet = new Set(websocketUrls);
  
  const onlyInPolling = pollingUrls.filter(url => !websocketSet.has(url));
  const onlyInWebSocket = websocketUrls.filter(url => !pollingSet.has(url));
  
  console.log(`URLs found only in polling: ${onlyInPolling.length}`);
  if (onlyInPolling.length > 0) {
    console.log('  ' + onlyInPolling.join('\n  '));
  }
  
  console.log(`URLs found only in WebSocket: ${onlyInWebSocket.length}`);
  if (onlyInWebSocket.length > 0) {
    console.log('  ' + onlyInWebSocket.join('\n  '));
  }
  
  // Check for ranking consistency
  console.log('\nChecking ranking consistency...');
  const commonUrls = pollingUrls.filter(url => websocketSet.has(url));
  
  if (commonUrls.length > 0) {
    // Compare the ranking order of common URLs
    const rankingDifferences = commonUrls.filter(url => 
      pollingUrls.indexOf(url) !== websocketUrls.indexOf(url)
    );
    
    console.log(`URLs with different ranking: ${rankingDifferences.length}`);
    if (rankingDifferences.length > 0 && rankingDifferences.length < 5) {
      // Show detailed ranking differences for a few URLs
      rankingDifferences.forEach(url => {
        console.log(`  ${url}: Polling rank #${pollingUrls.indexOf(url) + 1}, WebSocket rank #${websocketUrls.indexOf(url) + 1}`);
      });
    }
  } else {
    console.log('No common URLs found to compare ranking.');
  }
}

// Run the tests
console.log('STARTING ENHANCED WEBSITE MAPPING TESTS');
console.log('=======================================');

// Run tests based on command line arguments
const args = process.argv.slice(2);

if (args.includes('--compare') || args.length === 0) {
  compareResults().catch(console.error);
} else if (args.includes('--polling')) {
  testWithPolling().catch(console.error);
} else if (args.includes('--websocket')) {
  testWithWebSocket().catch(console.error);
} else {
  console.log('Unknown argument. Use --compare, --polling, or --websocket');
}

// Export functions for potential use in other tests
module.exports = {
  testWithPolling,
  testWithWebSocket,
  compareResults
};
