/**
 * Test script for Firecrawl API (with async job handling)
 * Updated to handle the asynchronous nature of the API
 */

import fetch from 'node-fetch';

// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const TEST_ZIP_CODES = ['02532', '99403', '99801'];
const CHECK_INTERVAL_MS = 3000; // 3 seconds between status checks
const MAX_RETRIES = 10; // Maximum number of polling attempts

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

// Main function - now handling the async workflow
async function testApiCall() {
  try {
    console.log('=== FIRECRAWL API ASYNC TEST ===');
    console.log(`Testing with ZIP codes: ${TEST_ZIP_CODES.join(', ')}`);
    
    // Create URLs
    const urls = TEST_ZIP_CODES.map(zip => `https://simplemaps.com/us-zips/${zip}`);
    console.log('URLs being queried:', urls);
    
    // Step 1: Submit the extraction job
    console.log('\n[STEP 1] Submitting extraction job...');
    const jobId = await submitExtractionJob(urls);
    
    if (!jobId) {
      console.error('Failed to get a valid job ID. Exiting.');
      return;
    }
    
    console.log(`Job submitted successfully! Job ID: ${jobId}`);
    
    // Step 2: Poll for job completion
    console.log('\n[STEP 2] Polling for job completion...');
    const extractionResults = await pollForResults(jobId);
    
    if (!extractionResults) {
      console.error('Failed to get extraction results after maximum retries. Exiting.');
      return;
    }
    
    // Step 3: Process the results
    console.log('\n[STEP 3] Processing extraction results...');
    processExtractionResults(extractionResults);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Function to submit the extraction job
async function submitExtractionJob(urls) {
  try {
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
    
    console.log(`Job submission response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error during job submission:', errorText);
      return null;
    }
    
    const jobResponse = await response.json();
    console.log('Job submission response:', JSON.stringify(jobResponse, null, 2));
    
    // Return the job ID
    return jobResponse.id || null;
  } catch (error) {
    console.error('Error submitting extraction job:', error);
    return null;
  }
}

// Function to poll for job results
async function pollForResults(jobId) {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    console.log(`Polling attempt ${retries + 1}/${MAX_RETRIES}...`);
    
    try {
      // Construct the status check URL
      const statusUrl = `https://api.firecrawl.dev/v1/extract/${jobId}`;
      
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      console.log(`Status check response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error checking job status: ${errorText}`);
        retries++;
        await sleep(CHECK_INTERVAL_MS);
        continue;
      }
      
      const statusResponse = await response.json();
      console.log('Status response:', JSON.stringify(statusResponse, null, 2));
      
      // Check if job is complete
      if (statusResponse.status === 'completed') {
        console.log('Job completed successfully!');
        return statusResponse;
      } else if (statusResponse.status === 'failed') {
        console.error('Job failed:', statusResponse.error || 'Unknown error');
        return null;
      } else {
        console.log(`Job status: ${statusResponse.status || 'unknown'}, waiting...`);
      }
    } catch (error) {
      console.error('Error polling for job status:', error);
    }
    
    retries++;
    await sleep(CHECK_INTERVAL_MS);
  }
  
  console.error(`Exceeded maximum retries (${MAX_RETRIES})`);
  return null;
}

// Function to process the extraction results
function processExtractionResults(results) {
  console.log('\n=== EXTRACTION RESULTS ===');
  console.log('Raw results:', JSON.stringify(results, null, 2));
  
  console.log('\n=== RESPONSE STRUCTURE ANALYSIS ===');
  analyzeResponseStructure(results);
  
  // Extract the data using our various approaches
  console.log('\n=== EXTRACTING DATA USING DIFFERENT APPROACHES ===');
  const extractedData = extractDataFromResults(results);
  
  if (extractedData.length > 0) {
    console.log('\nSuccessfully extracted data:');
    extractedData.forEach(item => {
      console.log(`  ZIP: ${item.zip_code}, Population: ${item.population}, Density: ${item.density}`);
    });
  } else {
    console.log('\nFailed to extract any data from the results!');
  }
}

// Helper function to extract data from results using multiple approaches
function extractDataFromResults(results) {
  let extractedData = [];
  
  // Check for data in the results
  if (results && results.data) {
    console.log('Found "data" property in results');
    
    // Check various possible structures
    if (Array.isArray(results.data)) {
      console.log(`"data" is an array with ${results.data.length} items`);
      
      results.data.forEach((item, i) => {
        if (item && item.zip_data && Array.isArray(item.zip_data)) {
          console.log(`Found zip_data array in item ${i} with ${item.zip_data.length} entries`);
          extractedData = extractedData.concat(item.zip_data);
        }
      });
    } else if (results.data.zip_data && Array.isArray(results.data.zip_data)) {
      console.log(`Found "zip_data" array in results.data with ${results.data.zip_data.length} entries`);
      extractedData = extractedData.concat(results.data.zip_data);
    }
  }
  
  // Check for direct zip_data array
  if (results && results.zip_data && Array.isArray(results.zip_data)) {
    console.log(`Found "zip_data" array directly in results with ${results.zip_data.length} entries`);
    extractedData = extractedData.concat(results.zip_data);
  }
  
  return extractedData;
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
      
      // Limit recursion depth for complex objects
      if (newPath.split('.').length <= 3) {
        analyzeResponseStructure(obj[key], newPath);
      } else {
        console.log(`${newPath}: [${typeof obj[key]}] (depth limit reached)`);
      }
    }
  }
}

// Utility function to sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testApiCall();
