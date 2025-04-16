// Test script for URL ranking functionality
const fs = require('fs');

// Mock URLs for testing
const allUrls = [
    'https://example.com/',
    'https://example.com/pricing',
    'https://example.com/product',
    'https://example.com/features',
    'https://example.com/blog',
    'https://example.com/blog/article1',
    'https://example.com/blog/article2',
    'https://example.com/docs',
    'https://example.com/docs/api',
    'https://example.com/contact',
    'https://example.com/about',
    'https://example.com/terms',
    'https://example.com/privacy',
    'https://example.com/faq',
    'https://example.com/support',
    'https://example.com/resources'
];

// Mock homepage links
const homepageLinks = [
    'https://example.com/pricing',
    'https://example.com/product',
    'https://example.com/features',
    'https://example.com/contact',
    'https://example.com/about'
];

// Duplicate the ranking function from script.js
function rankUrlsByImportance(allUrls, homepageLinks, baseUrl) {
    // Helper function to get domain from URL
    const getDomain = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return "";
        }
    };
    
    // Get the base domain for comparison
    const baseDomain = getDomain(baseUrl);
    
    // Cleanup and normalize homepage links
    const normalizedHomepageLinks = homepageLinks.map(link => {
        // Handle relative URLs
        try {
            return new URL(link, baseUrl).href;
        } catch (e) {
            return link;
        }
    }).filter(link => {
        // Keep only links to the same domain
        return getDomain(link) === baseDomain || getDomain(link) === "";
    });
    
    // Create priority buckets
    const highPriority = [];   // Homepage links
    const mediumPriority = []; // Other important pages
    const lowPriority = [];    // Blog, resources, docs, etc.
    
    // Define patterns for low priority content
    const lowPriorityPatterns = [
        /blog/i, 
        /article/i, 
        /resource/i, 
        /doc(?:umentation)?/i,
        /support/i,
        /help/i,
        /faq/i,
        /case-stud(?:y|ies)/i,
        /tutorial/i,
        /knowledge/i,
        /press/i,
        /news/i,
        /archive/i,
        /changelog/i,
        /legal/i,
        /privacy/i,
        /terms/i
    ];
    
    // Define patterns for high/medium priority pages
    const highPriorityPatterns = [
        /pricing/i,
        /product/i,
        /feature/i,
        /service/i,
        /about/i,
        /contact/i,
        /demo/i,
        /trial/i,
        /signup/i,
        /register/i,
        /login/i
    ];
    
    // First pass: always put the homepage at the top
    const homepage = allUrls.find(url => {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname === "/" || urlObj.pathname === "";
        } catch (e) {
            return false;
        }
    });
    
    if (homepage) {
        highPriority.push(homepage);
    }
    
    // Process each URL
    allUrls.forEach(url => {
        // Skip if this is the homepage (already processed)
        if (url === homepage) {
            return;
        }
        
        // Check if URL is in homepage links (high priority)
        if (normalizedHomepageLinks.some(link => link === url)) {
            highPriority.push(url);
        }
        // Check if URL matches low priority patterns
        else if (lowPriorityPatterns.some(pattern => pattern.test(url))) {
            lowPriority.push(url);
        }
        // Check if URL matches high priority patterns
        else if (highPriorityPatterns.some(pattern => pattern.test(url))) {
            highPriority.push(url);
        }
        // Everything else is medium priority
        else {
            mediumPriority.push(url);
        }
    });
    
    // Sort each bucket by path depth (shorter paths ranked higher)
    const sortByPathDepth = (a, b) => {
        try {
            const aDepth = new URL(a).pathname.split('/').filter(Boolean).length;
            const bDepth = new URL(b).pathname.split('/').filter(Boolean).length;
            return aDepth - bDepth;
        } catch (e) {
            return 0;
        }
    };
    
    highPriority.sort(sortByPathDepth);
    mediumPriority.sort(sortByPathDepth);
    lowPriority.sort(sortByPathDepth);
    
    // Combine the priority buckets
    return [...highPriority, ...mediumPriority, ...lowPriority];
}

// Run the test
console.log("Testing URL ranking functionality...\n");

const baseUrl = 'https://example.com';
console.log("Base URL:", baseUrl);
console.log("Total URLs:", allUrls.length);
console.log("Homepage Links:", homepageLinks.length);

console.log("\nRanking URLs...");
const rankedUrls = rankUrlsByImportance(allUrls, homepageLinks, baseUrl);

console.log("\nRanked URLs in order of importance:");
rankedUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
});

// Write results to a file for verification
const output = {
    original: allUrls,
    homepageLinks: homepageLinks,
    ranked: rankedUrls
};

fs.writeFileSync('ranking_test_results.json', JSON.stringify(output, null, 2));
console.log("\nResults saved to ranking_test_results.json");

// Analyze results
const highPriorityCount = rankedUrls.filter(url => 
    url === baseUrl + '/' || 
    homepageLinks.includes(url) || 
    /pricing|product|features|contact|about/i.test(url)
).length;

const lowPriorityCount = rankedUrls.filter(url => 
    /blog|docs|terms|privacy|faq|support|resources/i.test(url)
).length;

console.log("\nAnalysis:");
console.log(`High Priority URLs: ${highPriorityCount}`);
console.log(`Low Priority URLs: ${lowPriorityCount}`);
console.log(`Medium Priority URLs: ${rankedUrls.length - highPriorityCount - lowPriorityCount}`);

// Validate that homepage is first
if (rankedUrls[0] === baseUrl + '/') {
    console.log("\n✅ Test passed: Homepage is ranked first");
} else {
    console.log("\n❌ Test failed: Homepage should be ranked first");
}

// Validate that blog/docs are ranked lower
const highPriorityUrls = rankedUrls.slice(0, Math.floor(rankedUrls.length / 3));
const containsLowPriorityInTop = highPriorityUrls.some(url => 
    /blog|docs/i.test(url)
);

if (!containsLowPriorityInTop) {
    console.log("✅ Test passed: No blog/docs URLs in top third of results");
} else {
    console.log("❌ Test failed: Found blog/docs URLs in top third of results");
}

// Validate that homepage links are ranked higher
const homepageLinkPositions = homepageLinks.map(link => rankedUrls.indexOf(link));
const avgHomepageLinkPosition = homepageLinkPositions.reduce((sum, pos) => sum + pos, 0) / homepageLinkPositions.length;

if (avgHomepageLinkPosition < rankedUrls.length / 2) {
    console.log("✅ Test passed: Homepage links are ranked higher on average");
} else {
    console.log("❌ Test failed: Homepage links should be ranked higher");
}

console.log("\nTest completed.");
