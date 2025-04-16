/**
 * Test script specifically for the Firecrawl Map API
 * This will help us understand the exact response format
 */

import fetch from 'node-fetch';

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const TEST_URL = "https://example.com";

// Main function
async function testMapApi() {
  try {
    console.log('=== FIRECRAWL MAP API TEST ===');
    console.log(`Testing with URL: ${TEST_URL}`);
    
    // Make the API request
    console.log('\nMaking API request...');
    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        url: TEST_URL
      })
    });
    
    // Check response status
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }
    
    // Parse JSON response
    const jsonResponse = await response.json();
    console.log('\n=== RAW API RESPONSE ===');
    console.log(JSON.stringify(jsonResponse, null, 2));
    
    // Analyze the structure of the response
    console.log('\n=== RESPONSE STRUCTURE ANALYSIS ===');
    analyzeResponseStructure(jsonResponse);
    
    // Check if we can find URLs in the response
    console.log('\n=== CHECKING FOR URLS ===');
    findUrlsInResponse(jsonResponse);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Utility function to analyze response structure
function analyzeResponseStructure(obj, path = '') {
  if (obj === null) {
    console.log(`${path || 'root'}: null`);
    return;
  }
  
  if (typeof obj !== 'object') {
    console.log(`${path || 'root'}: ${typeof obj} = ${obj}`);
    return;
  }
  
  if (Array.isArray(obj)) {
    console.log(`${path || 'root'}: Array with ${obj.length} items`);
    if (obj.length > 0) {
      console.log(`  First item type: ${typeof obj[0]}`);
      if (typeof obj[0] === 'object' && obj[0] !== null) {
        console.log(`  First item keys: ${Object.keys(obj[0]).join(', ')}`);
      } else {
        console.log(`  First item value: ${obj[0]}`);
      }
      
      // Show first item in detail if it's an object
      if (typeof obj[0] === 'object' && obj[0] !== null) {
        analyzeResponseStructure(obj[0], `${path}[0]`);
      }
    }
  } else {
    console.log(`${path || 'root'}: Object with keys: ${Object.keys(obj).join(', ')}`);
    
    // Analyze each property
    for (const key of Object.keys(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      analyzeResponseStructure(obj[key], newPath);
    }
  }
}

// Check all possible ways URLs might be in the response
function findUrlsInResponse(response) {
  // Try to find urls in common locations
  const possibleLocations = [
    // Direct properties
    response.urls,
    response.data,
    response.results,
    
    // Nested properties
    response.data?.urls,
    response.results?.urls,
    response.data?.results,
    response.data?.links
  ];
  
  console.log('Checking possible URL locations:');
  
  possibleLocations.forEach((location, index) => {
    if (location !== undefined) {
      console.log(`Found potential URLs in location ${index}:`);
      console.log(Array.isArray(location) ? `Array with ${location.length} items` : location);
      
      if (Array.isArray(location) && location.length > 0) {
        console.log('First 3 URLs:');
        location.slice(0, 3).forEach(url => console.log(`  ${url}`));
      }
    }
  });
  
  // Look for ANY array in the response that might contain URLs
  console.log('\nSearching for any arrays in the response:');
  searchForArrays(response);
}

// Recursively search for arrays that might contain URLs
function searchForArrays(obj, path = '') {
  if (!obj || typeof obj !== 'object') return;
  
  if (Array.isArray(obj)) {
    console.log(`Found array at ${path || 'root'} with ${obj.length} items`);
    
    // Check if this array contains strings that look like URLs
    if (obj.length > 0 && typeof obj[0] === 'string') {
      const urlLikeItems = obj.filter(item => 
        typeof item === 'string' && 
        (item.startsWith('http') || item.includes('://')));
      
      if (urlLikeItems.length > 0) {
        console.log(`Array at ${path || 'root'} contains ${urlLikeItems.length} URL-like strings!`);
        console.log('First 3 URL-like items:');
        urlLikeItems.slice(0, 3).forEach(url => console.log(`  ${url}`));
      }
    }
    
    // Check if array items are objects that might contain URLs
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      obj.slice(0, 3).forEach((item, index) => {
        searchForArrays(item, `${path}[${index}]`);
      });
    }
  } else {
    // Check each property of the object
    for (const key of Object.keys(obj)) {
      const newPath = path ? `${path}.${key}` : key;
      searchForArrays(obj[key], newPath);
    }
  }
}

// Run the test
testMapApi();
