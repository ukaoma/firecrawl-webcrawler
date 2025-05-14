/**
 * Test script to verify the enhanced website map integration in Quilt UI
 */

console.log("=== ENHANCED MAP QUILT TEST SCRIPT RUNNING ===");

// Check for components after DOM is fully loaded
// Wait for full load of the page instead of just DOM content loaded
window.addEventListener('load', () => {
  console.log("Window load event fired in test script");
  // Wait longer for DOM manipulation to complete
  setTimeout(() => {
    console.log("Testing enhanced website map integration...");
    runEnhancedMapTests();
  }, 2000); // Longer delay to ensure all scripts are loaded and DOM is modified
});

/**
 * Run all tests for the enhanced website mapper
 */
function runEnhancedMapTests() {
  // Test 1: Check if enhanced website map module is available
  console.log("TEST 1: Checking if enhanced website map module is available...");
  if (window.enhancedWebsiteMap) {
    console.log("✅ SUCCESS: enhancedWebsiteMap module found!", Object.keys(window.enhancedWebsiteMap));
    // Check essential functions
    console.log("  - mapWebsiteAsync function exists:", typeof window.enhancedWebsiteMap.mapWebsiteAsync === 'function');
    console.log("  - rankUrlsByImportance function exists:", typeof window.enhancedWebsiteMap.rankUrlsByImportance === 'function');
  } else {
    console.error("❌ ERROR: enhancedWebsiteMap module not found!");
    console.log("This indicates the enhanced_website_map.js script is not loading properly");
  }

  // Test 2: Check if enhanced UI elements exist
  console.log("\nTEST 2: Checking if enhanced UI elements are present...");
  const uiElements = [
    { id: 'useEnhancedMode', name: 'Enhanced Mode Toggle' },
    { id: 'useWebSocket', name: 'WebSocket Toggle' },
    { id: 'allowBackwardLinks', name: 'Backward Links Toggle' },
    { id: 'fetchSitemap', name: 'Sitemap Toggle' },
    { id: 'fetchRobotsTxt', name: 'Robots.txt Toggle' },
    { id: 'jsRendering', name: 'JS Rendering Toggle' },
    { id: 'urlLimit', name: 'URL Limit Input' },
    { id: 'maxDepth', name: 'Max Depth Input' },
    { id: 'allowedDomains', name: 'Allowed Domains Input' },
    { id: 'showDiagnostics', name: 'Show Diagnostics Toggle' },
    { id: 'mapDiagnosticsContainer', name: 'Diagnostics Container' }
  ];
  
  let allElementsFound = true;
  uiElements.forEach(el => {
    const element = document.getElementById(el.id);
    const exists = !!element;
    console.log(`  - ${el.name} exists: ${exists ? '✅' : '❌'}`);
    if (!exists) allElementsFound = false;
  });
  
  if (allElementsFound) {
    console.log("✅ SUCCESS: All enhanced UI elements found!");
  } else {
    console.error("❌ ERROR: Some enhanced UI elements are missing!");
  }
  
  // Test 3: Check if diagnostics UI elements exist
  console.log("\nTEST 3: Checking diagnostics UI elements...");
  const diagElements = [
    { id: 'diagCrawlCount', name: 'Crawl Count' },
    { id: 'diagMapCount', name: 'Map Count' },
    { id: 'diagSitemapCount', name: 'Sitemap Count' },
    { id: 'diagHomepageCount', name: 'Homepage Count' },
    { id: 'diagRobotsTxtCount', name: 'Robots.txt Count' },
    { id: 'diagTotalUrls', name: 'Total URLs' },
    { id: 'diagSkippedUrls', name: 'Skipped URLs' },
    { id: 'diagExecutionTime', name: 'Execution Time' },
    { id: 'diagIssuesContainer', name: 'Issues Container' }
  ];
  
  let allDiagElementsFound = true;
  diagElements.forEach(el => {
    const element = document.getElementById(el.id);
    const exists = !!element;
    console.log(`  - ${el.name} exists: ${exists ? '✅' : '❌'}`);
    if (!exists) allDiagElementsFound = false;
  });
  
  if (allDiagElementsFound) {
    console.log("✅ SUCCESS: All diagnostics UI elements found!");
  } else {
    console.log("⚠️ WARNING: Some diagnostics UI elements are missing. They might be created dynamically.");
  }
  
  // Test 4: Test global progress UI
  console.log("\nTEST 4: Checking global progress UI elements...");
  const globalProgressContainer = document.getElementById('mapGlobalProgressContainer');
  if (globalProgressContainer) {
    console.log("✅ SUCCESS: Global progress container found!");
    const globalProgressElements = [
      { id: 'mapGlobalProgressBar', name: 'Global Progress Bar' },
      { id: 'mapGlobalStatusStats', name: 'Global Status Stats' },
      { id: 'mapGlobalProgressPercentage', name: 'Global Progress Percentage' },
      { id: 'mapElapsedTime', name: 'Elapsed Time' },
      { id: 'mapEstimatedTime', name: 'Estimated Time' },
      { id: 'mapCurrentProgress', name: 'Current Progress' }
    ];
    
    let allGlobalElementsFound = true;
    globalProgressElements.forEach(el => {
      const element = document.getElementById(el.id);
      const exists = !!element;
      console.log(`  - ${el.name} exists: ${exists ? '✅' : '❌'}`);
      if (!exists) allGlobalElementsFound = false;
    });
    
    if (allGlobalElementsFound) {
      console.log("✅ SUCCESS: All global progress UI elements found!");
    } else {
      console.log("⚠️ WARNING: Some global progress UI elements are missing.");
    }
  } else {
    console.error("❌ ERROR: Global progress container not found!");
  }
  
  // Test 5: Check integration with map button
  console.log("\nTEST 5: Checking map button integration...");
  const mapButton = document.getElementById('mapButton');
  if (mapButton) {
    console.log("✅ SUCCESS: Map button found!");
    console.log("  - Has onclick handler:", typeof mapButton.onclick === 'function');
  } else {
    console.error("❌ ERROR: Map button not found!");
  }
  
  // Test 6: Test mock data functionality
  console.log("\nTEST 6: Testing URL ranking function with sample data...");
  
  if (window.enhancedWebsiteMap && typeof window.enhancedWebsiteMap.rankUrlsByImportance === 'function') {
    const testUrls = [
      "https://example.com",
      "https://example.com/blog/post1",
      "https://example.com/about",
      "https://example.com/contact",
      "https://example.com/product/item1",
      "https://example.com/faq",
      "https://example.com/help/page1",
      "https://example.com/pricing"
    ];
    
    try {
      const homepageLinks = ["https://example.com/about", "https://example.com/pricing"];
      const rankedUrls = window.enhancedWebsiteMap.rankUrlsByImportance(testUrls, homepageLinks, "https://example.com");
      
      console.log("✅ SUCCESS: URL ranking function works!");
      console.log("  - Prioritized homepage:", rankedUrls[0] === "https://example.com");
      console.log("  - Prioritized homepage links:", rankedUrls.indexOf("https://example.com/about") < 3);
      console.log("  - Ranked result:", rankedUrls);
    } catch (error) {
      console.error("❌ ERROR: URL ranking function failed:", error);
    }
  } else {
    console.log("⚠️ SKIPPED: Cannot test URL ranking function as it's not available");
  }
  
  // Overall test result
  console.log("\n=== ENHANCED MAP QUILT TEST SUMMARY ===");
  if (window.enhancedWebsiteMap && allElementsFound) {
    console.log("✅ SUCCESS: Enhanced website map integration appears to be working correctly!");
    console.log("You can manually test the full functionality by entering a URL and clicking 'Map Website'");
  } else {
    console.error("❌ ERROR: Enhanced website map integration has issues. See details above.");
  }
}
