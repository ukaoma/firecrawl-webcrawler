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

// Handle CSV file upload
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Use PapaParse to parse the CSV
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            csvHeaders = results.meta.fields;
            const zipCodeColumn = findZipCodeColumn(csvHeaders);
            
            if (!zipCodeColumn) {
                alert('Could not find a column containing zip/postal codes. Please make sure your CSV has a column named "Zip", "Zip Code", "Postal Code", or similar.');
                csvFileInput.value = '';
                return;
            }
            
            // Preview the CSV data
            createCSVPreview(results.data, csvHeaders);
            
            // Extract zip codes from the CSV
            zipCodes = results.data.map(row => row[zipCodeColumn].toString().trim());
            console.log(`Extracted ${zipCodes.length} ZIP codes from CSV`);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please check the file format.');
        }
    });
}

// Find the ZIP code column in the CSV
function findZipCodeColumn(headers) {
    const possibleNames = ['zip', 'zipcode', 'zip code', 'postal code', 'postalcode', 'zip/postal code'];
    
    for (const header of headers) {
        if (possibleNames.includes(header.toLowerCase())) {
            return header;
        }
    }
    
    // If no exact match, look for partial matches
    for (const header of headers) {
        for (const name of possibleNames) {
            if (header.toLowerCase().includes(name)) {
                return header;
            }
        }
    }
    
    return null;
}

// Create a preview of the CSV data
function createCSVPreview(data, headers) {
    // Clear previous preview
    csvPreviewTable.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    csvPreviewTable.appendChild(thead);
    
    // Create data rows (limit to 5 for preview)
    const tbody = document.createElement('tbody');
    data.slice(0, 5).forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    
    csvPreviewTable.appendChild(tbody);
    csvPreview.classList.remove('d-none');
}

// Process the ZIP codes
async function processZipCodes() {
    // Get ZIP codes from input if CSV wasn't uploaded
    if (zipCodes.length === 0) {
        const input = zipCodesInput.value.trim();
        if (!input) {
            alert('Please enter ZIP codes or upload a CSV file.');
            return;
        }
        
        // Parse ZIP codes from input (handles both comma-separated and line-separated)
        zipCodes = input.split(/[\n,]+/).map(code => code.trim()).filter(code => code !== '');
    }
    
    if (zipCodes.length === 0) {
        alert('No valid ZIP codes found.');
        return;
    }
    
    // Determine batch size
    const useBatching = batchProcessingCheck.checked;
    const batchSize = useBatching ? DEFAULT_BATCH_SIZE : zipCodes.length;
    
    // Prepare for processing
    results = [];
    processingComplete = false;
    currentBatchIndex = 0;
    
    // Calculate total batches
    totalBatches = Math.ceil(zipCodes.length / batchSize);
    
    // Initialize the results table
    initializeResultsTable();
    
    // Show loading UI with ZIP codes message
    if (loadingMessage) {
        loadingMessage.textContent = 'Processing ZIP codes...';
    }
    loadingOverlay.classList.remove('d-none');
    resultsSection.classList.remove('d-none');
    progressBar.style.width = '0%';
    progressBar.classList.add('progress-bar-animated');
    processingStatus.textContent = `Processing batch 1 of ${totalBatches}...`;
    
    try {
        // Process batches
        for (let i = 0; i < zipCodes.length; i += batchSize) {
            currentBatchIndex = Math.floor(i / batchSize) + 1;
            
            // Update progress
            const progress = (currentBatchIndex - 1) / totalBatches * 100;
            progressBar.style.width = `${progress}%`;
            processingStatus.textContent = `Processing batch ${currentBatchIndex} of ${totalBatches}...`;
            
            // Get the current batch
            const batch = zipCodes.slice(i, i + batchSize);
            
            // Mark as pending in the table
            batch.forEach(zipCode => {
                updateResultRow(zipCode, null, null, 'Pending...', 'status-pending');
            });
            
            // Process this batch
            await processBatch(batch);
            
            // If this is not the last batch, add a short delay to avoid rate limiting
            if (i + batchSize < zipCodes.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // Processing complete
        processingComplete = true;
        progressBar.style.width = '100%';
        progressBar.classList.remove('progress-bar-animated');
        processingStatus.textContent = `Processing complete. ${results.filter(r => r.status === 'success').length} of ${zipCodes.length} ZIP codes processed successfully.`;
        
    } catch (error) {
        console.error('Error processing ZIP codes:', error);
        processingStatus.textContent = `Error: ${error.message}`;
        processingStatus.classList.add('text-danger');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}

// Initialize the results table with all ZIP codes
function initializeResultsTable() {
    resultsTableBody.innerHTML = '';
    
    // Create a row for each ZIP code
    zipCodes.forEach(zipCode => {
        const row = document.createElement('tr');
        row.id = `row-${zipCode}`;
        
        row.innerHTML = `
            <td>${zipCode}</td>
            <td>-</td>
            <td>-</td>
            <td>Waiting...</td>
        `;
        
        resultsTableBody.appendChild(row);
    });
}

// Update a row in the results table
function updateResultRow(zipCode, population, density, statusText, statusClass) {
    const row = document.getElementById(`row-${zipCode}`);
    if (!row) return;
    
    // Update the row
    const cells = row.getElementsByTagName('td');
    if (population !== null) cells[1].textContent = population;
    if (density !== null) cells[2].textContent = density;
    
    cells[3].textContent = statusText;
    cells[3].className = statusClass || '';
    
    // Store the result
    const existingIndex = results.findIndex(r => r.zipCode === zipCode);
    const result = {
        zipCode,
        population: population !== null ? population : '-',
        density: density !== null ? density : '-',
        status: statusClass === 'status-success' ? 'success' : (statusClass === 'status-error' ? 'error' : 'pending')
    };
    
    if (existingIndex >= 0) {
        results[existingIndex] = result;
    } else {
        results.push(result);
    }
}

// Process a batch of ZIP codes
async function processBatch(batch) {
    try {
        // Construct URLs for the batch
        const urls = batch.map(zipCode => `https://simplemaps.com/us-zips/${zipCode}`);
        
        // Call the Firecrawl API
        const response = await fetchZipData(urls);
        console.log('Processing response:', response);
        
        // Handle array response format
        let extractedData = [];
        
        // Check for different possible response formats
        if (Array.isArray(response)) {
            // Format: [ { zip_data: [...] } ]
            response.forEach(item => {
                if (item && item.zip_data && Array.isArray(item.zip_data)) {
                    extractedData = extractedData.concat(item.zip_data);
                }
            });
        } else if (response && response.data && Array.isArray(response.data)) {
            // Format: { data: [ { zip_data: [...] } ] }
            response.data.forEach(item => {
                if (item && item.zip_data && Array.isArray(item.zip_data)) {
                    extractedData = extractedData.concat(item.zip_data);
                }
            });
        } else if (response && response.data && response.data.zip_data && Array.isArray(response.data.zip_data)) {
            // Format: { data: { zip_data: [...] } }
            extractedData = response.data.zip_data;
        } else if (response && response.zip_data && Array.isArray(response.zip_data)) {
            // Format: { zip_data: [...] }
            extractedData = response.zip_data;
        }
        
        console.log('Extracted data:', extractedData);
        
        if (extractedData.length > 0) {
            // Update the results for each ZIP code in this batch
            batch.forEach(zipCode => {
                // Find matching data in the extracted results (case insensitive)
                const data = extractedData.find(item => 
                    (item.zip_code && (
                        item.zip_code.toLowerCase() === zipCode.toLowerCase() || 
                        item.zip_code.replace(/^0+/, '').toLowerCase() === zipCode.replace(/^0+/, '').toLowerCase()
                    ))
                );
                
                if (data) {
                    updateResultRow(
                        zipCode, 
                        data.population, 
                        data.density, 
                        'Success', 
                        'status-success'
                    );
                } else {
                    updateResultRow(
                        zipCode, 
                        null, 
                        null, 
                        'No matching data found for this ZIP code', 
                        'status-error'
                    );
                }
            });
        } else {
            // No data was returned
            batch.forEach(zipCode => {
                updateResultRow(
                    zipCode, 
                    null, 
                    null, 
                    'API error: No extraction data returned', 
                    'status-error'
                );
            });
        }
    } catch (error) {
        console.error('Error in batch processing:', error);
        
        // Mark all ZIP codes in this batch as failed
        batch.forEach(zipCode => {
            updateResultRow(
                zipCode, 
                null, 
                null, 
                `Error: ${error.message}`, 
                'status-error'
            );
        });
    }
}

// Fetch data from the Firecrawl API (handles async job processing)
async function fetchZipData(urls) {
    // Construct the schema and prompt for extraction
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
    
    const prompt = "Extract the population and density from the specific URLs / Zip codes I provide you with.";
    
    console.log('Making API request to Firecrawl for URLs:', urls);
    
    try {
        // Step 1: Submit extraction job
        console.log('Step 1: Submitting extraction job...');
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
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
        
        // Step 2: Poll for job completion
        console.log(`Step 2: Polling for job completion (ID: ${jobId})...`);
        
        // Set up polling
        const MAX_POLLING_ATTEMPTS = 15;
        const POLLING_INTERVAL_MS = 2000;
        
        let attempts = 0;
        let jobComplete = false;
        let extractionResults = null;
        
        while (!jobComplete && attempts < MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}...`);
            
            // Update UI to show progress
            if (processingStatus) {
                processingStatus.textContent = `Checking job status... (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`;
            }
            
            // Check job status
            let statusResult;
            try {
                const statusUrl = `https://api.firecrawl.dev/v1/extract/${jobId}`;
                console.log(`Polling URL: ${statusUrl}`);
                
                const statusResponse = await fetch(statusUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });
                
                if (!statusResponse.ok) {
                    console.warn(`Status check failed with status ${statusResponse.status}. Retrying...`);
                    console.warn(`Response status: ${statusResponse.status}, statusText: ${statusResponse.statusText}`);
                    await sleep(POLLING_INTERVAL_MS);
                    continue;
                }
                
                const responseText = await statusResponse.text();
                console.log(`Raw polling response (attempt ${attempts}):`, responseText);
                
                try {
                    statusResult = JSON.parse(responseText);
                    console.log(`Polling attempt ${attempts} result:`, JSON.stringify(statusResult, null, 2));
                } catch (parseError) {
                    console.error(`JSON parse error on polling attempt ${attempts}:`, parseError);
                    console.error('Raw response that failed to parse:', responseText);
                    await sleep(POLLING_INTERVAL_MS);
                    continue;
                }
            } catch (networkError) {
                console.error(`Network error during polling attempt ${attempts}:`, networkError);
                await sleep(POLLING_INTERVAL_MS);
                continue;
            }
            
            // Check if the job is complete
            if (statusResult.status === 'completed') {
                console.log('Job completed successfully!');
                jobComplete = true;
                extractionResults = statusResult;
                break;
            } else if (statusResult.status === 'failed') {
                throw new Error('Job failed: ' + (statusResult.error || 'Unknown error'));
            } else {
                console.log(`Job status: ${statusResult.status || 'unknown'}, waiting...`);
                await sleep(POLLING_INTERVAL_MS);
            }
        }
        
        if (!jobComplete) {
            throw new Error(`Job did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts`);
        }
        
        // Step 3: Return the results
        console.log('Step 3: Processing extraction results...');
        return extractionResults;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Helper function for sleep/delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Download the results as a CSV file
function downloadResults() {
    if (results.length === 0) {
        alert('No results to download.');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Zip/Postal Code,Population,Density,Status\n';
    
    // Sort results by zip code
    const sortedResults = [...results].sort((a, b) => a.zipCode.localeCompare(b.zipCode));
    
    sortedResults.forEach(result => {
        // Make sure to handle any commas in the data
        const zipCode = `"${result.zipCode}"`;
        const population = result.population !== '-' ? result.population : '';
        const density = result.density !== '-' ? result.density : '';
        const status = `"${result.status}"`;
        
        csvContent += `${zipCode},${population},${density},${status}\n`;
    });
    
    console.log('Downloading CSV with content:', csvContent);
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'zip_code_data.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        
        // Process the mapped URLs - the API returns 'links' not 'urls'
        if (mapData && mapData.links && Array.isArray(mapData.links)) {
            const allUrls = mapData.links;
            
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

// Fetch homepage links using the /scrape endpoint
async function fetchHomepageLinks(url) {
    console.log(`Fetching homepage links from: ${url}`);
    
    try {
        // Use the extract endpoint with a specific schema for links
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
            console.warn(`Failed to fetch homepage links: ${errorText}`);
            // Return empty array rather than failing completely
            return [];
        }
        
        const jobResponse = await response.json();
        const jobId = jobResponse.id;
        
        if (!jobId) {
            console.warn('No job ID returned from API when fetching homepage links');
            return [];
        }
        
        // Set up polling for job completion
        const MAX_POLLING_ATTEMPTS = 10;
        const POLLING_INTERVAL_MS = 1500;
        
        let attempts = 0;
        let jobComplete = false;
        
        while (!jobComplete && attempts < MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.log(`Polling for homepage links job completion (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})...`);
            
            // Check job status
            const statusUrl = `https://api.firecrawl.dev/v1/extract/${jobId}`;
            const statusResponse = await fetch(statusUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });
            
            if (!statusResponse.ok) {
                console.warn(`Homepage links status check failed: ${statusResponse.status}`);
                await sleep(POLLING_INTERVAL_MS);
                continue;
            }
            
            const statusResult = await statusResponse.json();
            
            // Check if job is complete
            if (statusResult.status === 'completed') {
                console.log('Homepage links job completed!');
                jobComplete = true;
                
                // Try to extract the link data
                let homepageLinks = [];
                
                if (statusResult.data && statusResult.data.links && Array.isArray(statusResult.data.links)) {
                    homepageLinks = statusResult.data.links;
                } else if (statusResult.links && Array.isArray(statusResult.links)) {
                    homepageLinks = statusResult.links;
                }
                
                return homepageLinks;
            } else if (statusResult.status === 'failed') {
                console.warn('Homepage links job failed');
                return [];
            } else {
                await sleep(POLLING_INTERVAL_MS);
            }
        }
        
        if (!jobComplete) {
            console.warn(`Homepage links job did not complete after ${MAX_POLLING_ATTEMPTS} attempts`);
            return [];
        }
        
        return [];
    } catch (error) {
        console.error('Failed to fetch homepage links:', error);
        return [];
    }
}

// Rank URLs by importance based on homepage links and URL patterns
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

// Fetch website map data from the Firecrawl API
async function fetchWebsiteMap(url) {
    console.log(`Making API request to map website: ${url}`);
    
    try {
        // Make the API request to the map endpoint
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
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }
        
        const mapData = await response.json();
        console.log('Map API Response:', JSON.stringify(mapData, null, 2));
        
        return mapData;
    } catch (error) {
        console.error('Map API request failed:', error);
        throw error;
    }
}

// Find relevant subpages for a given website URL
async function findRelevantSubpages(baseUrl, maxSubpages = 10) {
    console.log(`Finding relevant subpages for: ${baseUrl}`);
    
    try {
        // Normalize the base URL to ensure it has a trailing slash if needed
        let baseUrlObj;
        try {
            baseUrlObj = new URL(baseUrl);
        } catch (e) {
            // If URL is invalid, try adding https:// prefix
            baseUrlObj = new URL(`https://${baseUrl}`);
        }
        
        const domain = baseUrlObj.hostname;
        
        // Map the website to get all URLs
        bulkStatus.textContent = `Mapping website: ${domain}...`;
        const mapData = await fetchWebsiteMap(baseUrl);
        
        if (!mapData || !mapData.links || !Array.isArray(mapData.links) || mapData.links.length === 0) {
            console.warn(`No links found for ${baseUrl}`);
            return [baseUrl]; // Return only the original URL if mapping fails
        }
        
        // Define patterns for pages likely to contain contact info
        const relevantPatterns = [
            /contact/i,
            /about/i,
            /location/i,
            /store/i,
            /hours/i,
            /info/i, 
            /faq/i,
            /help/i,
            /company/i,
            /overview/i,
            /team/i,
            /staff/i,
            /directory/i,
            /find-us/i,
            /reach-us/i,
            /get-in-touch/i
        ];
        
        // Filter to only include links from the same domain
        const domainLinks = mapData.links.filter(link => {
            try {
                const linkUrl = new URL(link);
                return linkUrl.hostname === domain;
            } catch (e) {
                // Handle relative URLs
                return true; // Assume relative URLs are part of the domain
            }
        });
        
        // Find relevant subpages based on URL patterns
        const relevantLinks = domainLinks.filter(link => {
            // Check if the URL path contains any of our relevant patterns
            return relevantPatterns.some(pattern => pattern.test(link));
        });
        
        console.log(`Found ${relevantLinks.length} relevant subpages for ${baseUrl}`);
        
        // Sort links by relevance (more specific paths first)
        relevantLinks.sort((a, b) => {
            // Calculate a relevance score for each link
            const scoreA = relevantPatterns.reduce((score, pattern) => {
                return score + (pattern.test(a) ? 1 : 0);
            }, 0);
            
            const scoreB = relevantPatterns.reduce((score, pattern) => {
                return score + (pattern.test(b) ? 1 : 0);
            }, 0);
            
            // Higher score first, then shorter URLs (less complex paths)
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            } else {
                return a.length - b.length;
            }
        });
        
        // API has a maximum limit of 10 URLs per request
        // Ensure we don't exceed this limit (original URL + subpages = 10 max)
        const maxAllowedSubpages = 9; // 9 subpages + 1 original URL = 10 total URLs
        const adjustedMaxSubpages = Math.min(maxSubpages, maxAllowedSubpages);
        
        // Get the top N most relevant links
        const topRelevantLinks = relevantLinks.slice(0, adjustedMaxSubpages);
        
        // Always include the original URL first
        return [baseUrl, ...topRelevantLinks];
    } catch (error) {
        console.error(`Error finding relevant subpages for ${baseUrl}:`, error);
        return [baseUrl]; // Return only the original URL on error
    }
}

// Process bulk URL extraction
async function processBulkUrls() {
    // Get URLs from the input field
    const input = bulkUrlsInput.value.trim();
    if (!input) {
        alert('Please enter website URLs to extract data from.');
        return;
    }
    
    // Parse URLs (comma-separated)
    const originalUrls = input.split(',').map(url => url.trim()).filter(url => url !== '');
    
    if (originalUrls.length === 0) {
        alert('No valid URLs found.');
        return;
    }
    
    // Check for URL limit
    if (originalUrls.length > 50) {
        alert('Please limit your request to a maximum of 50 URLs.');
        return;
    }
    
    // Get the extraction prompt
    const prompt = extractionPromptInput.value.trim();
    if (!prompt) {
        alert('Please enter an extraction prompt describing what data to extract.');
        return;
    }
    
    // Reset and prepare UI
    bulkResults = [];
    bulkExtractionComplete = false;
    
    // Initialize results for all original URLs with pending status
    originalUrls.forEach(url => {
        bulkResults.push({
            sourceUrl: url,
            status: 'pending',
            statusMessage: 'Waiting to process...'
        });
    });
    
    // Show loading UI
    if (loadingMessage) {
        loadingMessage.textContent = 'Extracting data from websites...';
    }
    loadingOverlay.classList.remove('d-none');
    bulkResultsSection.classList.remove('d-none');
    bulkProgressBar.style.width = '5%';
    bulkProgressBar.classList.add('progress-bar-animated');
    
    // Generate initial results table with pending status
    generateBulkResultsTable(bulkResults);
    bulkStatus.textContent = 'Preparing to process URLs...';
    
    try {
        // Process URLs sequentially one original URL at a time
        for (let i = 0; i < originalUrls.length; i++) {
            const originalUrl = originalUrls[i];
            
            // Calculate progress percentage
            const progressPercent = 5 + (i / originalUrls.length) * 90;
            bulkProgressBar.style.width = `${progressPercent}%`;
            
            // Update status in the table for this URL
            bulkResults[i].status = 'processing';
            bulkResults[i].statusMessage = 'Finding relevant pages...';
            updateBulkResultsTable(bulkResults);
            
            // Step 1: Find relevant subpages for this URL
            bulkStatus.textContent = `Finding relevant pages for ${originalUrl} (${i+1}/${originalUrls.length})...`;
            const relevantUrls = await findRelevantSubpages(originalUrl, 10); // Find up to 10 relevant subpages
            
            console.log(`Found ${relevantUrls.length} relevant URLs for ${originalUrl}:`);
            console.log(relevantUrls);
            
            // Update status for this URL
            bulkResults[i].status = 'processing';
            bulkResults[i].statusMessage = `Extracting data from ${relevantUrls.length} pages...`;
            updateBulkResultsTable(bulkResults);
            
            // Step 2: Process the expanded URL list for this original URL
            try {
                bulkStatus.textContent = `Extracting data for ${originalUrl} (${i+1}/${originalUrls.length})...`;
                
                // Create an API request with all relevant URLs for this original URL
                const extractionResponse = await fetchExtendedData(relevantUrls, prompt, originalUrl);
                console.log(`Extraction response for ${originalUrl}:`, extractionResponse);
                
                // Process the result for this original URL
                if (extractionResponse && extractionResponse.data) {
                    // Find the data relevant to this original URL
                    const dataFound = processUrlResult(extractionResponse.data, originalUrl, i);
                    
                    if (!dataFound) {
                        bulkResults[i].status = 'error';
                        bulkResults[i].statusMessage = 'No matching data found';
                    }
                } else {
                    // Mark URL as failed
                    bulkResults[i].status = 'error';
                    bulkResults[i].statusMessage = 'No data returned from API';
                }
            } catch (error) {
                console.error(`Error processing ${originalUrl}:`, error);
                // Mark URL as failed
                bulkResults[i].status = 'error';
                bulkResults[i].statusMessage = `Error: ${error.message}`;
            }
            
            // Update the table after processing
            updateBulkResultsTable(bulkResults);
            
            // Short delay between URLs to avoid rate limiting
            if (i < originalUrls.length - 1) {
                await sleep(1000);
            }
        }
        
        // Processing complete
        bulkExtractionComplete = true;
        bulkProgressBar.style.width = '100%';
        bulkProgressBar.classList.remove('progress-bar-animated');
        
        // Count successes and failures
        const successCount = bulkResults.filter(r => r.status === 'success').length;
        const errorCount = bulkResults.filter(r => r.status === 'error').length;
        
        bulkStatus.textContent = `Extraction complete. Successfully extracted data from ${successCount} of ${originalUrls.length} URLs.`;
        
        if (errorCount > 0) {
            bulkStatus.textContent += ` ${errorCount} URLs failed.`;
        }
    } catch (error) {
        console.error('Error processing bulk URLs:', error);
        bulkStatus.textContent = `Error: ${error.message}`;
        bulkStatus.classList.add('text-danger');
        bulkProgressBar.style.width = '100%';
        bulkProgressBar.classList.remove('progress-bar-animated');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}

// Process results from a batch of URLs
function processBatchResults(data, batchUrls, batchStartIndex) {
    // The API response could be in different formats:
    // 1. Array of objects, each corresponding to a URL
    // 2. Single object with nested data for all URLs
    // 3. Single object with properties that need to be mapped to each URL
    
    if (Array.isArray(data)) {
        // Format 1: Array of objects
        data.forEach((item, idx) => {
            if (idx < batchUrls.length) {
                const resultIndex = batchStartIndex + idx;
                if (resultIndex < bulkResults.length) {
                    // Check if there's source URL information in the data
                    let dataSourceUrl = batchUrls[idx]; // Default to the input URL
                    
                    // Look for source_url or similar fields in the data
                    for (const key of Object.keys(item)) {
                        if (/source.*url|data.*url|found.*url|crawled.*url/i.test(key) && typeof item[key] === 'string') {
                            dataSourceUrl = item[key];
                            break;
                        }
                    }
                    
                    // Add or update dataSourceUrl
                    bulkResults[resultIndex].dataSourceUrl = dataSourceUrl;
                    
                    // Merge the extracted data into the existing result object
                    Object.assign(bulkResults[resultIndex], item);
                    bulkResults[resultIndex].status = 'success';
                    bulkResults[resultIndex].statusMessage = 'Extracted successfully';
                }
            }
        });
    } else if (typeof data === 'object') {
        // Try to match data to URLs based on any identifiable information
        if (batchUrls.length === 1) {
            // If only one URL in the batch, assign all data to it
            
            // Look for source URL information in the data
            let dataSourceUrl = batchUrls[0]; // Default to the input URL
            
            // Check for source URL fields in the data
            for (const key of Object.keys(data)) {
                if (/source.*url|data.*url|found.*url|crawled.*url/i.test(key) && typeof data[key] === 'string') {
                    dataSourceUrl = data[key];
                    break;
                }
            }
            
            // Set the data source URL
            bulkResults[batchStartIndex].dataSourceUrl = dataSourceUrl;
            
            // Merge the data
            Object.assign(bulkResults[batchStartIndex], data);
            bulkResults[batchStartIndex].status = 'success';
            bulkResults[batchStartIndex].statusMessage = 'Extracted successfully';
        } else {
            // Look for URL-specific data in the object
            // This is a simplified approach - in real production code, 
            // we'd need more sophisticated matching logic
            let dataMatched = false;
            
            // Check if the data object has source-related fields that could map to URLs
            const urlMap = {};
            
            // Look for properties that might contain source URL information
            for (const key in data) {
                if (key.toLowerCase().includes('url') || 
                    key.toLowerCase().includes('source') || 
                    key.toLowerCase().includes('website')) {
                    
                    const sourceUrl = data[key];
                    // Try to find this URL in our batch
                    const matchIndex = batchUrls.findIndex(url => 
                        url === sourceUrl || url.includes(sourceUrl) || sourceUrl.includes(url));
                    
                    if (matchIndex >= 0) {
                        urlMap[batchUrls[matchIndex]] = {
                            data: data,
                            dataSourceUrl: sourceUrl // Use the actual source URL from the data
                        };
                        dataMatched = true;
                    }
                }
            }
            
            if (dataMatched) {
                // Update results based on the URL mapping we found
                batchUrls.forEach((url, idx) => {
                    const resultIndex = batchStartIndex + idx;
                    if (resultIndex < bulkResults.length) {
                        if (urlMap[url]) {
                            // Set the data source URL (where the data was found)
                            bulkResults[resultIndex].dataSourceUrl = urlMap[url].dataSourceUrl;
                            
                            // Merge the data
                            Object.assign(bulkResults[resultIndex], urlMap[url].data);
                            bulkResults[resultIndex].status = 'success';
                            bulkResults[resultIndex].statusMessage = 'Extracted successfully';
                        } else {
                            bulkResults[resultIndex].status = 'error';
                            bulkResults[resultIndex].statusMessage = 'No matching data found';
                        }
                    }
                });
            } else {
                // If we couldn't match, assume the data applies to the first URL
                bulkResults[batchStartIndex].dataSourceUrl = batchUrls[0]; // Use the input URL as source
                Object.assign(bulkResults[batchStartIndex], data);
                bulkResults[batchStartIndex].status = 'success';
                bulkResults[batchStartIndex].statusMessage = 'Extracted successfully';
                
                // Mark other URLs in batch as failed
                for (let i = 1; i < batchUrls.length; i++) {
                    const resultIndex = batchStartIndex + i;
                    if (resultIndex < bulkResults.length) {
                        bulkResults[resultIndex].status = 'error';
                        bulkResults[resultIndex].statusMessage = 'No data returned for this URL';
                    }
                }
            }
        }
    } else {
        // Unexpected response format
        batchUrls.forEach((url, idx) => {
            const resultIndex = batchStartIndex + idx;
            if (resultIndex < bulkResults.length) {
                bulkResults[resultIndex].status = 'error';
                bulkResults[resultIndex].statusMessage = 'Invalid response format from API';
            }
        });
    }
}

// Process extraction results and link them to source URLs
function processExtractionResults(data, sourceUrls) {
    // Handle different response formats
    let processedResults = [];
    
    // The response format can vary, so we handle different possibilities
    if (Array.isArray(data)) {
        // Format: [item1, item2, ...]
        // We need to match these up with our source URLs
        data.forEach((item, index) => {
            if (index < sourceUrls.length) {
                processedResults.push({
                    sourceUrl: sourceUrls[index],
                    ...item
                });
            }
        });
    } else if (typeof data === 'object') {
        // Format: { key1: value1, key2: value2, ... }
        // Single object response - likely from a single URL
        processedResults.push({
            sourceUrl: sourceUrls[0],
            ...data
        });
    }
    
    return processedResults;
}

// Generate the initial results table with all URLs
function generateBulkResultsTable(results) {
    // Clear existing table
    bulkResultsTable.innerHTML = '';
    
    if (results.length === 0) {
        bulkStatus.textContent = 'No URLs to process.';
        return;
    }
    
    // Determine columns from the results
    // Initially we just know sourceUrl, dataSourceUrl, status, statusMessage
    const initialColumns = ['Source URL', 'Data Source URL', 'Status'];
    
    // Get all unique data keys from the results to create columns
    const dataColumns = [...new Set(
        results.flatMap(result => Object.keys(result)
            .filter(key => !['sourceUrl', 'status', 'statusMessage'].includes(key))
        )
    )];
    
    const columns = [...initialColumns, ...dataColumns];
    
    // Create the header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    bulkResultsTable.appendChild(thead);
    
    // Create the table body
    const tbody = document.createElement('tbody');
    tbody.id = 'bulkResultsTableBody'; // Set id for later updates
    
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.id = `bulk-row-${index}`; // Set id for later updates
        
        // Add Source URL cell
        const urlCell = document.createElement('td');
        urlCell.textContent = result.sourceUrl;
        row.appendChild(urlCell);
        
        // Add Status cell
        const statusCell = document.createElement('td');
        statusCell.textContent = result.statusMessage || 'Pending...';
        
        // Apply appropriate CSS class based on status
        if (result.status === 'success') {
            statusCell.className = 'status-success';
        } else if (result.status === 'error') {
            statusCell.className = 'status-error';
        } else if (result.status === 'processing') {
            statusCell.className = 'status-processing';
        } else {
            statusCell.className = 'status-pending';
        }
        
        row.appendChild(statusCell);
        
        // Add placeholders for data columns
        dataColumns.forEach(column => {
            const td = document.createElement('td');
            if (result[column] !== undefined && result[column] !== null) {
                // Handle different data types appropriately
                if (typeof result[column] === 'object') {
                    td.textContent = JSON.stringify(result[column]);
                } else {
                    td.textContent = result[column].toString();
                }
            } else {
                td.textContent = '-';
            }
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    bulkResultsTable.appendChild(tbody);
}

// Update existing rows in the bulk results table without regenerating the whole table
function updateBulkResultsTable(results) {
    // If table doesn't exist yet, generate it
    if (!bulkResultsTable.querySelector('thead')) {
        generateBulkResultsTable(results);
        return;
    }
    
    // Get the current columns from the table header
    const headerCells = bulkResultsTable.querySelectorAll('thead th');
    const existingColumns = Array.from(headerCells).map(th => th.textContent);
    
    // Check if we need to update the columns (new data fields might have appeared)
    const dataColumns = [...new Set(
        results.flatMap(result => Object.keys(result)
            .filter(key => !['sourceUrl', 'status', 'statusMessage'].includes(key))
        )
    )];
    
    const expectedColumns = ['Source URL', 'Status', ...dataColumns];
    
    // If columns have changed, regenerate the entire table
    if (existingColumns.length !== expectedColumns.length || 
        !expectedColumns.every(col => existingColumns.includes(col))) {
        generateBulkResultsTable(results);
        return;
    }
    
    // If columns are the same, just update the existing rows
    results.forEach((result, index) => {
        const row = document.getElementById(`bulk-row-${index}`);
        if (!row) return; // Skip if row doesn't exist
        
        const cells = row.querySelectorAll('td');
        
    // Add Data Source URL cell if not present
    if (cells.length >= 2 && !result.dataSourceUrl && result.sourceUrl) {
        // Default to sourceUrl if dataSourceUrl is not set
        result.dataSourceUrl = result.sourceUrl;
    }
    
    // Update Data Source URL cell (second cell)
    if (cells.length >= 2) {
        cells[1].textContent = result.dataSourceUrl || result.sourceUrl || '-';
    }
    
    // Update Status cell (now the third cell)
    const statusCell = cells[2];
        statusCell.textContent = result.statusMessage || 'Pending...';
        
        // Update status classes
        statusCell.className = ''; // Clear existing classes
        if (result.status === 'success') {
            statusCell.className = 'status-success';
        } else if (result.status === 'error') {
            statusCell.className = 'status-error';
        } else if (result.status === 'processing') {
            statusCell.className = 'status-processing';
        } else {
            statusCell.className = 'status-pending';
        }
        
        // Update data cells
        dataColumns.forEach((column, colIndex) => {
            // Data cells start after Source URL and Status, so add 2
            const cellIndex = colIndex + 2;
            
            if (cellIndex < cells.length) {
                if (result[column] !== undefined && result[column] !== null) {
                    // Handle different data types appropriately
                    if (typeof result[column] === 'object') {
                        cells[cellIndex].textContent = JSON.stringify(result[column]);
                    } else {
                        cells[cellIndex].textContent = result[column].toString();
                    }
                } else {
                    cells[cellIndex].textContent = '-';
                }
            }
        });
    });
}

// Fetch data from multiple URLs using the Firecrawl API
async function fetchBulkData(urls, prompt) {
    console.log('Making bulk extraction request to Firecrawl for URLs:', urls);
    console.log('Using prompt:', prompt);
    
    try {
        // Step 1: Submit extraction job
        console.log('Step 1: Submitting bulk extraction job...');
        
        // Create the request body with debugging
        const requestBody = {
            urls: urls,
            prompt: prompt,
            enableWebSearch: true,  // Enable searching linked pages for data
            // Simplified - remove agent to test basic functionality
            timeout: 180           // Increase timeout to 3 minutes
            // No schema - we want Firecrawl to infer it from the prompt
        };
        
        console.log('REQUEST PAYLOAD:', JSON.stringify(requestBody, null, 2));
        
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
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
        
        // Step 2: Poll for job completion
        console.log(`Step 2: Polling for job completion (ID: ${jobId})...`);
        bulkStatus.textContent = 'Processing extraction request...';
        bulkProgressBar.style.width = '25%';
        
        const MAX_POLLING_ATTEMPTS = 20;
        const POLLING_INTERVAL_MS = 3000;
        const TOTAL_TIMEOUT_MS = 60000; // 60 second max timeout
        
        // Create a polling function that will check status repeatedly
        async function pollForCompletion() {
            let attempts = 0;
            
            while (attempts < MAX_POLLING_ATTEMPTS) {
                attempts++;
                console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}...`);
                
                // Update UI to show progress
                bulkStatus.textContent = `Checking job status... (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`;
                const progressPercent = 25 + (attempts / MAX_POLLING_ATTEMPTS) * 50;
                bulkProgressBar.style.width = `${progressPercent}%`;
                
                try {
                    // Check job status
                    const statusUrl = `https://api.firecrawl.dev/v1/extract/${jobId}`;
                    const statusResponse = await fetch(statusUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`
                        }
                    });
                    
                    if (!statusResponse.ok) {
                        console.warn(`Status check failed with status ${statusResponse.status}. Retrying...`);
                        await sleep(POLLING_INTERVAL_MS);
                        continue;
                    }
                    
                    const statusResult = await statusResponse.json();
                    console.log('Status check response:', JSON.stringify(statusResult, null, 2));
                    
                    // Check if the job is complete
                    if (statusResult.status === 'completed') {
                        console.log('Job completed successfully!');
                        return statusResult; // Return the results
                    } else if (statusResult.status === 'failed') {
                        throw new Error('Job failed: ' + (statusResult.error || 'Unknown error'));
                    } else {
                        console.log(`Job status: ${statusResult.status || 'unknown'}, waiting...`);
                        await sleep(POLLING_INTERVAL_MS);
                    }
                } catch (error) {
                    console.error('Error during polling:', error);
                    await sleep(POLLING_INTERVAL_MS);
                }
            }
            
            // If we get here, polling timed out
            throw new Error(`Job did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts`);
        }
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Job timed out after ${TOTAL_TIMEOUT_MS}ms total wait time`));
            }, TOTAL_TIMEOUT_MS);
        });
        
        // Race between the polling and timeout
        let extractionResults;
        try {
            extractionResults = await Promise.race([
                pollForCompletion(),
                timeoutPromise
            ]);
        } catch (error) {
            console.error('Polling error:', error);
            
            // If we time out, create a substitute response with error info
            if (error.message.includes('timed out')) {
                extractionResults = {
                    status: 'completed',
                    data: {
                        _timedOut: true,
                        _jobId: jobId,
                        _error: error.message,
                        _message: "Job processing took too long. Results may be incomplete."
                    }
                };
                console.warn('Using fallback results due to timeout:', extractionResults);
            } else {
                throw error; // Re-throw other errors
            }
        }
        
        // Step 3: Return the results
        bulkStatus.textContent = 'Processing extraction results...';
        bulkProgressBar.style.width = '85%';
        console.log('Step 3: Processing extraction results...');
        return extractionResults;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Download the bulk extraction results as a CSV file
function downloadBulkResults() {
    if (bulkResults.length === 0) {
        alert('No results to download.');
        return;
    }
    
    // Get important columns first, then all other data fields
    const dataKeys = [...new Set(bulkResults.flatMap(obj => Object.keys(obj)))];
    
    // Define column order with priority columns first
    const priorityColumns = ['sourceUrl', 'dataSourceUrl', 'status', 'statusMessage'];
    const otherColumns = dataKeys.filter(key => 
        !priorityColumns.includes(key) && 
        key !== 'sourceUrl' // sourceUrl will be handled separately with a readable header
    );
    
    // Build final columns array with readable names
    const columns = [
        { key: 'sourceUrl', header: 'Input URL' },
        { key: 'dataSourceUrl', header: 'Data Source URL' },
        ...otherColumns.filter(key => !['status', 'statusMessage'].includes(key))
            .map(key => ({ key, header: key.charAt(0).toUpperCase() + key.slice(1) }))
    ];
    
    // Create CSV header row
    let csvContent = columns.map(col => `"${col.header}"`).join(',') + '\n';
    
    // Add data rows
    bulkResults.forEach(result => {
        const rowData = [];
        
        // Process each column
        columns.forEach(column => {
            const key = column.key;
            let value = result[key];
            
            // Handle special case for dataSourceUrl if not present
            if (key === 'dataSourceUrl' && (value === undefined || value === null)) {
                value = result.sourceUrl; // Default to input URL if data source URL is not available
            }
            
            // Format the value for CSV
            if (value === undefined || value === null) {
                rowData.push('""'); // Empty quoted field
            } else if (typeof value === 'object') {
                // For object values, convert to JSON and quote
                rowData.push(`"${JSON.stringify(value).replace(/"/g, '""')}"`);
            } else {
                // For simple values, convert to string and quote
                const strValue = value.toString();
                // Double up quotes inside fields to escape them
                rowData.push(`"${strValue.replace(/"/g, '""')}"`);
            }
        });
        
        // Join all values with commas
        const row = rowData.join(',');
        
        csvContent += row + '\n';
    });
    
    console.log('Downloading CSV with content:', csvContent);
    
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

// Fetch data for an extended set of URLs related to one original URL
async function fetchExtendedData(allUrls, prompt, originalUrl) {
    console.log(`Making enhanced extraction request for ${originalUrl} with ${allUrls.length} URLs:`, allUrls);
    
    try {
        // Submit extraction job
        bulkStatus.textContent = `Submitting extraction job for ${originalUrl}...`;
        
        // Create the request body
        const requestBody = {
            urls: allUrls,
            prompt: prompt,
            enableWebSearch: false, // Not needed since we're explicitly providing the URLs to check
            timeout: 300           // 5 minute timeout for extended processing
        };
        
        console.log('EXTENDED REQUEST PAYLOAD:', JSON.stringify(requestBody, null, 2));
        
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!jobSubmissionResponse.ok) {
            const errorText = await jobSubmissionResponse.text();
            throw new Error(`API job submission failed with status ${jobSubmissionResponse.status}: ${errorText}`);
        }
        
        const jobResponse = await jobSubmissionResponse.json();
        console.log(`Job submission response for ${originalUrl}:`, JSON.stringify(jobResponse, null, 2));
        
        const jobId = jobResponse.id;
        if (!jobId) {
            throw new Error('No job ID returned from API');
        }
        
        // Poll for job completion
        console.log(`Polling for job completion (ID: ${jobId})...`);
        
        // Polling settings
        const MAX_POLLING_ATTEMPTS = 40; // 2 minutes at 3-second intervals
        const POLLING_INTERVAL_MS = 3000;
        const TOTAL_TIMEOUT_MS = 180000; // 3 minute overall timeout
        
        // Create a polling function
        async function pollForCompletion() {
            let attempts = 0;
            
            while (attempts < MAX_POLLING_ATTEMPTS) {
                attempts++;
                console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS} for ${originalUrl}...`);
                
                bulkStatus.textContent = `Processing ${originalUrl}... (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`;
                
                try {
                    // Check job status
                    const statusUrl = `https://api.firecrawl.dev/v1/extract/${jobId}`;
                    const statusResponse = await fetch(statusUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`
                        }
                    });
                    
                    if (!statusResponse.ok) {
                        console.warn(`Status check failed with status ${statusResponse.status}. Retrying...`);
                        await sleep(POLLING_INTERVAL_MS);
                        continue;
                    }
                    
                    const statusResult = await statusResponse.json();
                    
                    // Check if the job is complete
                    if (statusResult.status === 'completed') {
                        console.log(`Job for ${originalUrl} completed successfully!`);
                        return statusResult; // Return the results
                    } else if (statusResult.status === 'failed') {
                        throw new Error('Job failed: ' + (statusResult.error || 'Unknown error'));
                    } else {
                        console.log(`Job status: ${statusResult.status || 'unknown'}, waiting...`);
                        await sleep(POLLING_INTERVAL_MS);
                    }
                } catch (error) {
                    console.error('Error during polling:', error);
                    await sleep(POLLING_INTERVAL_MS);
                }
            }
            
            // If we get here, polling timed out
            throw new Error(`Job for ${originalUrl} did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts`);
        }
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Job for ${originalUrl} timed out after ${TOTAL_TIMEOUT_MS}ms total wait time`));
            }, TOTAL_TIMEOUT_MS);
        });
        
        // Race between the polling and timeout
        let extractionResults;
        try {
            extractionResults = await Promise.race([
                pollForCompletion(),
                timeoutPromise
            ]);
        } catch (error) {
            console.error(`Polling error for ${originalUrl}:`, error);
            
            // If we time out, create a substitute response with error info
            if (error.message.includes('timed out')) {
                extractionResults = {
                    status: 'completed',
                    data: {
                        _timedOut: true,
                        _jobId: jobId,
                        _error: error.message,
                        _message: "Job processing took too long. Results may be incomplete."
                    }
                };
                console.warn('Using fallback results due to timeout:', extractionResults);
            } else {
                throw error; // Re-throw other errors
            }
        }
        
        // Return the results
        return extractionResults;
    } catch (error) {
        console.error(`API request failed for ${originalUrl}:`, error);
        throw error;
    }
}

// Process results for a single original URL
function processUrlResult(data, originalUrl, resultIndex) {
    console.log(`Processing result for ${originalUrl}:`, data);
    
    // Initialize flag indicating whether we found any data
    let dataFound = false;
    
    // Handle different data formats
    if (Array.isArray(data)) {
        // Format 1: Array of objects
        // Find the most data-rich result (containing the most fields)
        let bestResult = null;
        let maxFields = 0;
        
        data.forEach(item => {
            const fieldCount = Object.keys(item).filter(key => 
                key !== 'status' && 
                key !== 'statusMessage' && 
                item[key] !== null && 
                item[key] !== undefined &&
                item[key] !== ''
            ).length;
            
            if (fieldCount > maxFields) {
                bestResult = item;
                maxFields = fieldCount;
            }
        });
        
        if (bestResult) {
            // Find source URL in the best result
            let dataSourceUrl = originalUrl; // Default to original URL
            
            // Look for source URL field in the data
            for (const key of Object.keys(bestResult)) {
                // Check for source_url or similar fields
                if (/source.*url|data.*url|found.*url|crawled.*url/i.test(key) && typeof bestResult[key] === 'string') {
                    dataSourceUrl = bestResult[key];
                    break;
                }
            }
            
            // Update the result with the found data and source URL
            bulkResults[resultIndex].dataSourceUrl = dataSourceUrl;
            Object.assign(bulkResults[resultIndex], bestResult);
            bulkResults[resultIndex].status = 'success';
            bulkResults[resultIndex].statusMessage = 'Extracted successfully';
            
            dataFound = true;
        }
    } else if (typeof data === 'object' && data !== null) {
        // Format 2: Single object
        
        // Check if this is our "not found" placeholder and skip it
        if (data._timedOut || data._error) {
            bulkResults[resultIndex].status = 'error';
            bulkResults[resultIndex].statusMessage = data._message || 'Extraction timed out';
            return false;
        }
        
        // Extract data source URL
        let dataSourceUrl = originalUrl; // Default to original URL
        
        // Look for source URL field in the data
        for (const key of Object.keys(data)) {
            // Check for source_url or similar fields
            if (/source.*url|data.*url|found.*url|crawled.*url/i.test(key) && typeof data[key] === 'string') {
                dataSourceUrl = data[key];
                break;
            }
        }
        
        // Check if we have any actual data fields (excluding metadata)
        const dataFields = Object.keys(data).filter(key => 
            !['status', 'statusMessage', 'sourceUrl', '_timedOut', '_error', '_message', '_jobId'].includes(key) &&
            data[key] !== null && 
            data[key] !== undefined &&
            data[key] !== ''
        );
        
        if (dataFields.length > 0) {
            // Update the result with the found data and source URL
            bulkResults[resultIndex].dataSourceUrl = dataSourceUrl;
            Object.assign(bulkResults[resultIndex], data);
            bulkResults[resultIndex].status = 'success';
            bulkResults[resultIndex].statusMessage = 'Extracted successfully';
            
            dataFound = true;
        }
    }
    
    return dataFound;
}

// Download the map results as a CSV file
function downloadMapResults() {
    const urls = mapResults.textContent;
    
    if (!urls.trim()) {
        alert('No URLs to download.');
        return;
    }
    
    // Format as CSV with header
    let csvContent = "URLs\n";
    
    // Add each URL as a row in the CSV
    const urlList = urls.split('\n').filter(url => url.trim());
    urlList.forEach(url => {
        csvContent += `${url}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sitemap.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
