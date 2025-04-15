/**
 * Test script to validate the Firecrawl API response format
 * This script makes a direct API call for a small batch of ZIP codes
 * and logs the detailed response structure.
 */

// Node-fetch v3 is ESM only, so we need to use dynamic import
// or convert the file to use ES modules
const fetchModule = import('node-fetch').then(module => module.default);

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const TEST_ZIP_CODES = ['02532', '99403', '99801']; // Testing with known working ZIP codes from user feedback

// Schema definition
const schema = {
  type: "object",
  properties: {
    zip_data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          zip_code: { type: "string" },
          population: { type: "number" },
          density: { type: "number" }
        },
        required: ["zip_code", "population", "density"]
      }
    }
  },
  required: ["zip_data"]
};

// Extract prompt
const prompt = "Extract the population and density from the specific URLs / Zip codes I provide you with.";

// Main function
async function testApiCall() {
  try {
    console.log('=== FIRECRAWL API TEST ===');
    console.log(`Testing with ZIP codes: ${TEST_ZIP_CODES.join(', ')}`);
    
    // Create URLs
    const urls = TEST_ZIP_CODES.map(zip => `https://simplemaps.com/us-zips/${zip}`);
    console.log('URLs being queried:', urls);
    
    // Make API request
    console.log('\nMaking API request...');
    const response = await fetch('https://api.firecrawl.dev/v1/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        urls: urls,
        prompt: prompt,
        schema: schema
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
    
    // Print response structure details
    console.log('\n=== RESPONSE STRUCTURE ANALYSIS ===');
    analyzeResponseStructure(jsonResponse);
    
    // Try to extract data using our different approaches
    console.log('\n=== EXTRACTING DATA USING DIFFERENT APPROACHES ===');
    extractDataMultipleWays(jsonResponse);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Analyze response structure recursively
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
      }
    }
    
    // Show first item in detail if it's an object
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      analyzeResponseStructure(obj[0], `${path}[0]`);
    }
  } else {
    console.log(`${path || 'root'}: Object with keys: ${Object.keys(obj).join(', ')}`);
    
    // Analyze each property
    for (const key of Object.keys(obj)) {
      analyzeResponseStructure(obj[key], path ? `${path}.${key}` : key);
    }
  }
}

// Try to extract data using different approaches
function extractDataMultipleWays(response) {
  let extractedData = [];
  
  // Approach 1: Direct array
  if (Array.isArray(response)) {
    console.log('Approach 1 (Direct array): Response is an array');
    response.forEach((item, i) => {
      if (item && item.zip_data && Array.isArray(item.zip_data)) {
        console.log(`  Found zip_data array in item ${i} with ${item.zip_data.length} entries`);
        extractedData = extractedData.concat(item.zip_data);
      }
    });
  }
  
  // Approach 2: data -> array
  if (response && response.data && Array.isArray(response.data)) {
    console.log('Approach 2 (data -> array): Response has data array');
    response.data.forEach((item, i) => {
      if (item && item.zip_data && Array.isArray(item.zip_data)) {
        console.log(`  Found zip_data array in data[${i}] with ${item.zip_data.length} entries`);
        extractedData = extractedData.concat(item.zip_data);
      }
    });
  }
  
  // Approach 3: data -> zip_data -> array
  if (response && response.data && response.data.zip_data && Array.isArray(response.data.zip_data)) {
    console.log('Approach 3 (data -> zip_data -> array): Response has data.zip_data array');
    console.log(`  Found zip_data array with ${response.data.zip_data.length} entries`);
    extractedData = extractedData.concat(response.data.zip_data);
  }
  
  // Approach 4: zip_data -> array
  if (response && response.zip_data && Array.isArray(response.zip_data)) {
    console.log('Approach 4 (zip_data -> array): Response has zip_data array');
    console.log(`  Found zip_data array with ${response.zip_data.length} entries`);
    extractedData = extractedData.concat(response.zip_data);
  }
  
  // Check if we got data
  if (extractedData.length > 0) {
    console.log('\nSuccessfully extracted data:');
    extractedData.forEach(item => {
      console.log(`  ZIP: ${item.zip_code}, Population: ${item.population}, Density: ${item.density}`);
    });
  } else {
    console.log('\nFailed to extract any data with our approaches!');
  }
}

// Run the test
testApiCall();
