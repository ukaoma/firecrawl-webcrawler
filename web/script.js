// Configuration
const API_KEY = "fc-4bd96b21a1fa459a9336127ab8974234";
const DEFAULT_BATCH_SIZE = 5;

// DOM Elements
const zipCodesInput = document.getElementById('zipCodesInput');
const csvFileInput = document.getElementById('csvFileInput');
const csvPreview = document.getElementById('csvPreview');
const csvPreviewTable = document.getElementById('csvPreviewTable');
const batchProcessingCheck = document.getElementById('batchProcessingCheck');
const processButton = document.getElementById('processButton');
const resultsSection = document.getElementById('resultsSection');
const progressBar = document.getElementById('progressBar');
const processingStatus = document.getElementById('processingStatus');
const resultsTableBody = document.getElementById('resultsTableBody');
const downloadButton = document.getElementById('downloadButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = loadingOverlay ? loadingOverlay.querySelector('p') : null;

// Map Feature DOM Elements
const websiteUrlInput = document.getElementById('websiteUrlInput');
const mapButton = document.getElementById('mapButton');
const mapResultsSection = document.getElementById('mapResultsSection');
const urlCount = document.getElementById('urlCount');
const downloadUrlsButton = document.getElementById('downloadUrlsButton');
const mapProgressBar = document.getElementById('mapProgressBar');
const mapStatus = document.getElementById('mapStatus');
const mapResults = document.getElementById('mapResults');

// Bulk Extract Feature DOM Elements
const bulkUrlsInput = document.getElementById('bulkUrlsInput');
const extractionPromptInput = document.getElementById('extractionPromptInput');
const processBulkUrlsButton = document.getElementById('processBulkUrlsButton');
const bulkResultsSection = document.getElementById('bulkResultsSection');
const bulkProgressBar = document.getElementById('bulkProgressBar');
const bulkStatus = document.getElementById('bulkStatus');
const bulkResultsTable = document.getElementById('bulkResultsTable');
const bulkResultsTableBody = document.getElementById('bulkResultsTableBody');
const downloadBulkResultsButton = document.getElementById('downloadBulkResultsButton');

// Global Progress Tracking Elements
const globalProgressBar = document.getElementById('globalProgressBar');
const globalProgressText = document.getElementById('globalProgressText');
const globalProgressPercentage = document.getElementById('globalProgressPercentage');
const globalStatusStats = document.getElementById('globalStatusStats');
const elapsedTime = document.getElementById('elapsedTime');
const estimatedTime = document.getElementById('estimatedTime');
const currentUrlProgressPercentage = document.getElementById('currentUrlProgressPercentage');

// Global Variables
let zipCodes = [];
let results = [];
let csvHeaders = [];
let processingComplete = false;
let currentBatchIndex = 0;
let totalBatches = 0;

// Bulk Extract Global Variables
let bulkResults = [];
let bulkExtractionComplete = false;
let extractionStartTime = null;
let processedUrlCount = 0;
let totalUrlsToProcess = 0;
let urlProcessingTimes = [];
let globalProgressTimer = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    processButton.addEventListener('click', processZipCodes);
    downloadButton.addEventListener('click', downloadResults);
    csvFileInput.addEventListener('change', handleCSVUpload);
    mapButton.addEventListener('click', processWebsiteMap);
    downloadUrlsButton.addEventListener('click', downloadMapResults);
    processBulkUrlsButton.addEventListener('click', processBulkUrls);
    downloadBulkResultsButton.addEventListener('click', downloadBulkResults);
    
    // Initialize Bootstrap tabs
    const tabElements = document.querySelectorAll('a[data-bs-toggle="tab"]');
    const zipCodeFooter = document.getElementById('zipCodeFooter');
    
    tabElements.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => {
                p.classList.remove('show');
                p.classList.remove('active');
            });
            
            tab.classList.add('active');
            const target = document.querySelector(tab.getAttribute('href'));
            target.classList.add('show');
            target.classList.add('active');
            
            // Show/hide ZIP code footer based on active tab
            if (tab.id === 'map-tab' || tab.id === 'bulk-extract-tab') {
                zipCodeFooter.classList.add('d-none');
            } else {
                zipCodeFooter.classList.remove('d-none');
            }
        });
    });
});

// Format time in a readable format
function formatTime(milliseconds) {
    if (milliseconds < 0) return "--";
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Start the global progress tracking
function startGlobalProgressTracking(totalUrls) {
    extractionStartTime = Date.now();
    totalUrlsToProcess = totalUrls;
    processedUrlCount = 0;
    urlProcessingTimes = [];
    
    // Reset UI
    globalProgressBar.style.width = '0%';
    globalProgressPercentage.textContent = '0%';
    globalStatusStats.textContent = `Processing 0 of ${totalUrls} URLs`;
    elapsedTime.textContent = 'Elapsed: 0s';
    estimatedTime.textContent = 'Est. remaining: --';
    
    // Start the timer to update elapsed time
    if (globalProgressTimer) {
        clearInterval(globalProgressTimer);
    }
    
    globalProgressTimer = setInterval(() => {
        if (!extractionStartTime) return;
        
        // Update elapsed time
        const elapsed = Date.now() - extractionStartTime;
        elapsedTime.textContent = `Elapsed: ${formatTime(elapsed)}`;
        
        // Calculate estimated remaining time if we have at least one URL processed
        if (processedUrlCount > 0 && urlProcessingTimes.length > 0) {
            // Calculate average time per URL
            const avgTimePerUrl = urlProcessingTimes.reduce((a, b) => a + b, 0) / urlProcessingTimes.length;
            
            // Estimate remaining time
            const remainingUrls = totalUrlsToProcess - processedUrlCount;
            const estimatedRemainingTime = avgTimePerUrl * remainingUrls;
            
            estimatedTime.textContent = `Est. remaining: ${formatTime(estimatedRemainingTime)}`;
        }
    }, 1000);
}

// Update global progress when a URL is processed
function updateGlobalProgress(success = true, processingTime = null) {
    if (!extractionStartTime) return;
    
    processedUrlCount++;
    
    // Record processing time for this URL
    if (processingTime) {
        urlProcessingTimes.push(processingTime);
    }
    
    // Calculate and update progress percentage
    const progressPercent = Math.round((processedUrlCount / totalUrlsToProcess) * 100);
    globalProgressBar.style.width = `${progressPercent}%`;
    globalProgressPercentage.textContent = `${progressPercent}%`;
    
    // Update status text
    globalStatusStats.textContent = `Processing ${processedUrlCount} of ${totalUrlsToProcess} URLs`;
    
    // Check if we're done
    if (processedUrlCount >= totalUrlsToProcess) {
        finishGlobalProgress();
    }
}

// End global progress tracking
function finishGlobalProgress() {
    if (globalProgressTimer) {
        clearInterval(globalProgressTimer);
        globalProgressTimer = null;
    }
    
    // Calculate final stats
    if (extractionStartTime) {
        const totalTime = Date.now() - extractionStartTime;
        elapsedTime.textContent = `Total time: ${formatTime(totalTime)}`;
        estimatedTime.textContent = `Avg. per URL: ${formatTime(totalTime / totalUrlsToProcess)}`;
        
        // Show success percentage
        const successCount = bulkResults.filter(r => r.status === 'success').length;
        const successRate = Math.round((successCount / totalUrlsToProcess) * 100);
        globalStatusStats.textContent = `Completed: ${successCount} of ${totalUrlsToProcess} URLs (${successRate}% success)`;
    }
    
    extractionStartTime = null;
}

// Process bulk URLs for extraction
async function processBulkUrls() {
    // Get URLs from input
    const urlsInput = bulkUrlsInput.value.trim();
    const extractionPrompt = extractionPromptInput.value.trim();
    
    if (!urlsInput || !extractionPrompt) {
        alert('Please enter both URLs and extraction parameters.');
        return;
    }
    
    // Parse URLs (split by commas or newlines)
    const urls = urlsInput.split(/[\n,]+/).map(url => url.trim()).filter(url => url !== '');
    
    if (urls.length === 0) {
        alert('No valid URLs found.');
        return;
    }
    
    // Show the results section
    bulkResultsSection.classList.remove('d-none');
    
    // Clear previous results
    bulkResultsTableBody.innerHTML = '';
    bulkProgressBar.style.width = '0%';
    bulkProgressBar.classList.add('progress-bar-animated');
    bulkStatus.textContent = 'Preparing extraction...';
    currentUrlProgressPercentage.textContent = '0%';
    
    // Reset global variables
    bulkResults = [];
    bulkExtractionComplete = false;
    
    // Show loading UI with extraction message
    if (loadingMessage) {
        loadingMessage.textContent = 'Extracting data from websites...';
    }
    loadingOverlay.classList.remove('d-none');
    
    // Start global progress tracking
    startGlobalProgressTracking(urls.length);
    
    try {
        // Process each URL sequentially
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const urlStartTime = Date.now();
            
            // Update UI to show which URL we're processing
            bulkStatus.textContent = `Processing URL ${i+1} of ${urls.length}: ${url}`;
            
            try {
                // Process this URL
                await processSingleBulkUrl(url, extractionPrompt, i+1, urls.length);
                
                // Calculate processing time for this URL
                const urlProcessingTime = Date.now() - urlStartTime;
                
                // Update global progress
                updateGlobalProgress(true, urlProcessingTime);
                
            } catch (error) {
                console.error(`Error processing URL ${url}:`, error);
                
                // Add error result to the table
                addBulkResult({
                    url: url,
                    data: {},
                    error: error.message,
                    status: 'error'
                });
                
                // Calculate processing time for this URL (even though it failed)
                const urlProcessingTime = Date.now() - urlStartTime;
                
                // Update global progress
                updateGlobalProgress(false, urlProcessingTime);
            }
            
            // Short delay between URLs to avoid rate limiting
            if (i < urls.length - 1) {
                await sleep(1000);
            }
        }
        
        // Processing complete
        bulkExtractionComplete = true;
        bulkProgressBar.style.width = '100%';
        bulkProgressBar.classList.remove('progress-bar-animated');
        bulkStatus.textContent = `Extraction complete. ${bulkResults.filter(r => r.status === 'success').length} of ${urls.length} URLs processed successfully.`;
        currentUrlProgressPercentage.textContent = '100%';
        
    } catch (error) {
        console.error('Error in bulk processing:', error);
        bulkStatus.textContent = `Error: ${error.message}`;
        bulkStatus.classList.add('text-danger');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}

// Process a single URL for bulk extraction
async function processSingleBulkUrl(url, prompt, currentIndex, totalUrls) {
    try {
        // Update progress for this URL
        bulkProgressBar.style.width = '10%';
        currentUrlProgressPercentage.textContent = '10%';
        
        // Call the Firecrawl API
        const extractionData = await extractDataFromUrl(url, prompt);
        
        // Update progress for this URL
        bulkProgressBar.style.width = '100%';
        currentUrlProgressPercentage.textContent = '100%';
        
        // Check if the extraction was successful
        if (extractionData && Object.keys(extractionData).length > 0) {
            // Process and display the extracted data
            addBulkResult({
                url: url,
                data: extractionData,
                status: 'success'
            });
            
            return true;
        } else {
            // No data extracted
            addBulkResult({
                url: url,
                data: {},
                error: 'No data extracted',
                status: 'error'
            });
            
            return false;
        }
    } catch (error) {
        console.error(`Error extracting data from ${url}:`, error);
        
        // Add error result to the table
        addBulkResult({
            url: url,
            data: {},
            error: error.message,
            status: 'error'
        });
        
        return false;
    }
}

// Extract data from a URL using the Firecrawl API
async function extractDataFromUrl(url, prompt) {
    console.log(`Extracting data from URL: ${url}`);
    console.log(`Using prompt: ${prompt}`);
    
    try {
        // Submit extraction job
        bulkStatus.textContent = `Submitting extraction job for ${url}...`;
        bulkProgressBar.style.width = '20%';
        currentUrlProgressPercentage.textContent = '20%';
        
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                urls: [url],
                prompt: prompt
            })
        });
        
        if (!jobSubmissionResponse.ok) {
            const errorText = await jobSubmissionResponse.text();
            throw new Error(`API job submission failed with status ${jobSubmissionResponse.status}: ${errorText}`);
        }
        
        const jobResponse = await jobSubmissionResponse.json();
        console.log('Job submission response:', JSON.stringify(jobResponse, null, 2));
        
        const jobId = jobResponse.id;
        if (!jobId) {
            throw new Error('No job ID returned from API');
        }
        
        // Poll for job completion
        bulkStatus.textContent = `Waiting for extraction to complete for ${url}...`;
        bulkProgressBar.style.width = '50%';
        currentUrlProgressPercentage.textContent = '50%';
        
        // Set up polling
        const MAX_POLLING_ATTEMPTS = 15;
        const POLLING_INTERVAL_MS = 2000;
        
        let attempts = 0;
        let jobComplete = false;
        let extractionResults = null;
        
        while (!jobComplete && attempts < MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS} for URL ${url}...`);
            
            // Update progress based on polling progress
            const pollingProgress = 50 + (attempts / MAX_POLLING_ATTEMPTS) * 40;
            bulkProgressBar.style.width = `${pollingProgress}%`;
            currentUrlProgressPercentage.textContent = `${Math.round(pollingProgress)}%`;
            
            bulkStatus.textContent = `Checking extraction status for ${url}... (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`;
            
            // Check job status
            let statusResult;
            try {
                const statusResponse = await fetch(`https://api.firecrawl.dev/v1/extract/${jobId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });
                
                if (!statusResponse.ok) {
                    await sleep(POLLING_INTERVAL_MS);
                    continue;
                }
                
                statusResult = await statusResponse.json();
            } catch (networkError) {
                console.error(`Network error during polling for ${url}:`, networkError);
                await sleep(POLLING_INTERVAL_MS);
                continue;
            }
            
            // Check if the job is complete
            if (statusResult.status === 'completed') {
                console.log(`Job completed successfully for ${url}!`);
                jobComplete = true;
                extractionResults = statusResult;
                break;
            } else if (statusResult.status === 'failed') {
                throw new Error('Job failed: ' + (statusResult.error || 'Unknown error'));
            } else {
                console.log(`Job status for ${url}: ${statusResult.status || 'unknown'}, waiting...`);
                await sleep(POLLING_INTERVAL_MS);
            }
        }
        
        if (!jobComplete) {
            throw new Error(`Job did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts`);
        }
        
        bulkStatus.textContent = `Extraction complete for ${url}. Processing results...`;
        bulkProgressBar.style.width = '90%';
        currentUrlProgressPercentage.textContent = '90%';
        
        // Get the extracted data
        let extractedData;
        
        if (extractionResults && extractionResults.data) {
            extractedData = extractionResults.data;
        } else {
            console.warn(`No data field in extraction results for ${url}:`, extractionResults);
            extractedData = {};
        }
        
        return extractedData;
    } catch (error) {
        console.error(`API request failed for ${url}:`, error);
        throw error;
    }
}

// Add a result to the bulk results table
function addBulkResult(result) {
    // Add to the results array
    bulkResults.push(result);
    
    // Create or update table headers based on the data
    updateBulkResultsTableHeaders(result.data);
    
    // Add a row to the table
    const row = document.createElement('tr');
    
    // Source URL cell
    const urlCell = document.createElement('td');
    urlCell.textContent = result.url;
    row.appendChild(urlCell);
    
    // Data cells - one for each property in the data
    const headers = getDataHeadersFromResults();
    headers.forEach(header => {
        if (header === 'URL') return; // Skip URL as it's already added
        
        const cell = document.createElement('td');
        
        if (result.status === 'error') {
            if (header === 'Status') {
                cell.textContent = 'Error';
                cell.classList.add('text-danger');
            } else if (header === 'Error') {
                cell.textContent = result.error || 'Unknown error';
                cell.classList.add('text-danger');
            } else {
                cell.textContent = '-';
            }
        } else {
            // Get the value from the nested structure if needed
            let value = getNestedValue(result.data, header);
            
            // Format the value for display
            if (value === undefined || value === null) {
                cell.textContent = '-';
            } else if (typeof value === 'object') {
                cell.textContent = JSON.stringify(value);
            } else {
                cell.textContent = value.toString();
            }
        }
        
        row.appendChild(cell);
    });
    
    // Add the row to the table
    bulkResultsTableBody.appendChild(row);
}

// Get nested value from an object using a path string
function getNestedValue(obj, path) {
    // Handle simple property names without dots
    if (!path.includes('.')) {
        return obj[path];
    }
    
    // Handle nested properties with dot notation
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return undefined;
        }
        current = current[part];
    }
    
    return current;
}

// Update the bulk results table headers based on the data
function updateBulkResultsTableHeaders(data) {
    // Get existing headers
    const existingHeaders = Array.from(bulkResultsTable.querySelector('thead tr')?.children || [])
        .map(th => th.textContent);
    
    // If headers already exist, no need to update
    if (existingHeaders.length > 0) return;
    
    // Create headers based on the first successful result's data
    const headers = ['URL', ...getPropertiesFromObject(data)];
    
    // If the result is an error, add status and error columns
    if (!headers.includes('Status')) {
        headers.push('Status');
    }
    if (!headers.includes('Error')) {
        headers.push('Error');
    }
    
    // Create the header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    // Add the header row to the table
    const thead = bulkResultsTable.querySelector('thead') || document.createElement('thead');
    thead.innerHTML = '';
    thead.appendChild(headerRow);
    
    if (!bulkResultsTable.contains(thead)) {
        bulkResultsTable.appendChild(thead);
    }
}

// Get properties from an object, including nested ones with dot notation
function getPropertiesFromObject(obj, prefix = '') {
    if (!obj || typeof obj !== 'object') return [];
    
    let properties = [];
    
    for (const key in obj) {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        properties.push(fullKey);
        
        // Only go one level deep with nested objects to keep the UI manageable
        if (value && typeof value === 'object' && !Array.isArray(value) && !prefix) {
            properties = properties.concat(getPropertiesFromObject(value, key));
        }
    }
    
    return properties;
}

// Get the current set of headers from all results
function getDataHeadersFromResults() {
    let headers = ['URL'];
    
    // Collect all unique property names from all successful results
    bulkResults.forEach(result => {
        if (result.status === 'success' && result.data) {
            headers = headers.concat(getPropertiesFromObject(result.data));
        }
    });
    
    // Add status and error columns
    if (!headers.includes('Status')) {
        headers.push('Status');
    }
    if (!headers.includes('Error')) {
        headers.push('Error');
    }
    
    // Remove duplicates
    return [...new Set(headers)];
}

// Download the bulk results as a CSV file
function downloadBulkResults() {
    if (bulkResults.length === 0) {
        alert('No results to download.');
        return;
    }
    
    // Get all headers
    const headers = getDataHeadersFromResults();
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add each result as a row
    bulkResults.forEach(result => {
        const row = headers.map(header => {
            // Handle URL column
            if (header === 'URL') {
                return `"${result.url.replace(/"/g, '""')}"`;
            }
            
            // Handle Status column
            if (header === 'Status') {
                return result.status === 'success' ? 'Success' : 'Error';
            }
            
            // Handle Error column
            if (header === 'Error') {
                return result.status === 'error' ? `"${(result.error || 'Unknown error').replace(/"/g, '""')}"` : '';
            }
            
            // Handle data columns
            if (result.status === 'success') {
                let value = getNestedValue(result.data, header);
                
                if (value === undefined || value === null) {
                    return '';
                } else if (typeof value === 'object') {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                } else {
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }
            } else {
                return '';
            }
        });
        
        csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_extraction_results.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fetch a website map using the API
async function fetchWebsiteMap(url) {
    console.log(`Fetching website map for: ${url}`);
    
    try {
        const response = await fetch('https://api.firecrawl.dev/v1/map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                url: url
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Website map response:', data);
        
        // Check if the data has a results property
        if (data && data.data) {
            return data.data;
        } else {
            return data;
        }
    } catch (error) {
        console.error('Error fetching website map:', error);
        throw error;
    }
}

// Fetch homepage links
async function fetchHomepageLinks(url) {
    console.log(`Fetching homepage links from: ${url}`);
    
    try {
        const response = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                urls: [url],
                prompt: "Extract all links from this homepage. Only include links to internal pages within the same domain.",
                schema: {
                    type: "object",
                    properties: {
                        links: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    }
                }
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        // Check if the data has a links property
        if (data && data.data && data.data.links) {
            return data.data.links;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching homepage links:', error);
        return [];
    }
}

// Process website mapping
async function processWebsiteMap() {
    // Get website URL
    const url = websiteUrlInput.value.trim();
    
    if (!url) {
        alert('Please enter a website URL to map.');
        return;
    }
    
    // Validate URL format
    try {
        new URL(url); // This will throw an error if the URL is invalid
    } catch (e) {
        alert('Please enter a valid URL (including http:// or https://)');
        return;
    }
    
    // Show the results section
    mapResultsSection.classList.remove('d-none');
    
    // Clear previous results
    mapResults.textContent = '';
    mapStatus.textContent = 'Starting website mapping...';
    mapProgressBar.style.width = '10%';
    mapProgressBar.classList.add('progress-bar-animated');
    urlCount.textContent = '0';
    
    // Show loading UI with website mapping message
    if (loadingMessage) {
        loadingMessage.textContent = 'Mapping website URLs...';
    }
    loadingOverlay.classList.remove('d-none');
    
    try {
        // Map the website
        mapStatus.textContent = 'Fetching all website URLs...';
        const mapData = await fetchWebsiteMap(url);
        console.log('Received map data:', mapData);
        
        // Update progress
        mapProgressBar.style.width = '50%';
        
        // Process the mapped URLs - check different possible response formats
        let allUrls = [];
        
        // Check various possible locations for URLs in the response
        if (mapData && mapData.links && Array.isArray(mapData.links)) {
            // Format from v1/extract: { links: [...] }
            allUrls = mapData.links;
        } else if (mapData && mapData.urls && Array.isArray(mapData.urls)) {
            // Possible format from v1/map: { urls: [...] }
            allUrls = mapData.urls;
        } else if (mapData && Array.isArray(mapData)) {
            // Possible format from v1/map: direct array of URLs
            allUrls = mapData;
        } else if (mapData && mapData.results && Array.isArray(mapData.results)) {
            // Another possible format: { results: [...] }
            allUrls = mapData.results;
        }
        
        if (allUrls.length > 0) {
            // Fetch homepage links for ranking
            mapStatus.textContent = 'Analyzing homepage links for ranking...';
            const homepageLinks = await fetchHomepageLinks(url);
            console.log('Homepage links:', homepageLinks);
            
            // Rank the URLs
            mapStatus.textContent = 'Ranking URLs by importance...';
            const rankedUrls = rankUrlsByImportance(allUrls, homepageLinks, url);
            
            // Display the results
            urlCount.textContent = rankedUrls.length.toString();
            
            // Format the URLs nicely, one per line
            const formattedUrls = rankedUrls.join('\n');
            mapResults.textContent = formattedUrls;
            
            // Complete the progress bar
            mapProgressBar.style.width = '100%';
            mapProgressBar.classList.remove('progress-bar-animated');
            mapStatus.textContent = `Mapping complete. Found ${rankedUrls.length} URLs, ranked by importance.`;
        } else {
            // No URLs found or unexpected response format
            // Try to find links in other places in the response
            if (mapData && mapData.success) {
                urlCount.textContent = "0";
                mapStatus.textContent = 'No URLs found in response. The website may not have any links or may be blocking crawlers.';
            } else {
                mapStatus.textContent = 'Unexpected response format received from API.';
            }
            
            console.error('Invalid map data format:', mapData);
            mapProgressBar.style.width = '100%';
            mapProgressBar.classList.remove('progress-bar-animated');
            mapResults.textContent = 'No URLs found.';
        }
    } catch (error) {
        console.error('Error mapping website:', error);
        mapStatus.textContent = `Error: ${error.message}`;
        mapStatus.classList.add('text-danger');
        mapProgressBar.style.width = '100%';
        mapProgressBar.classList.remove('progress-bar-animated');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}
