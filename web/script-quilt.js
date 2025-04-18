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
        
        // Set up polling with higher limits for complex sites
        const MAX_POLLING_ATTEMPTS = 30; // Increased from 15 to handle complex sites better
        const POLLING_INTERVAL_MS = 2500; // Slightly increased interval to reduce rate-limiting
        
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

// Parse extraction parameters to determine expected columns
function parseExtractionParameters(prompt) {
    // Default essential columns that should always be included
    const baseColumns = ['URL', 'Status', 'Error'];
    
    // Parse the comma-delimited parameters directly from the user's prompt
    const extractionParams = [];
    
    if (prompt && prompt.trim()) {
        // Split by commas and clean up each parameter
        const params = prompt.split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);
        
        // Add each parameter exactly as specified by the user
        params.forEach(param => {
            // Convert param to a valid JavaScript property name (remove spaces, special chars)
            const cleanParam = param.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
            if (cleanParam && !extractionParams.includes(cleanParam)) {
                extractionParams.push(cleanParam);
            }
        });
    }
    
    // Return only the exact parameters the user specified, plus the base columns
    return [...baseColumns, ...extractionParams];
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
        
        // Parse user parameters exactly as specified
        const userParameters = prompt.split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);
        
        console.log(`User-specified parameters: ${userParameters.join(', ')}`);
        
        // Create a schema based on the exact user parameters
        const expectedFields = parseExtractionParameters(prompt);
        const schemaProperties = {};
        
        // Build a dynamic schema based strictly on user-specified fields
        userParameters.forEach(field => {
            // Convert each parameter to a valid schema property name
            const propertyName = field.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
            schemaProperties[propertyName] = { type: ["string", "number", "null"] };
        });
        
        // Create the schema object - IMPORTANT: Set additionalProperties to false
        const schema = {
            type: "object",
            properties: schemaProperties,
            additionalProperties: false // Only allow the properties explicitly specified
        };
        
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                urls: [url],
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
        
        // Poll for job completion
        bulkStatus.textContent = `Waiting for extraction to complete for ${url}...`;
        bulkProgressBar.style.width = '50%';
        currentUrlProgressPercentage.textContent = '50%';
        
        // Set up polling with higher limits for complex sites
        const MAX_POLLING_ATTEMPTS = 30; // Increased from 15 to handle complex sites better
        const POLLING_INTERVAL_MS = 2500; // Slightly increased interval to reduce rate-limiting
        
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

// Update the bulk results table headers based strictly on user-specified extraction parameters
function updateBulkResultsTableHeaders(data) {
    // Get existing headers
    const existingHeaders = Array.from(bulkResultsTable.querySelector('thead tr')?.children || [])
        .map(th => th.textContent);
    
    // If headers already exist, no need to update
    if (existingHeaders.length > 0) return;
    
    // Get the current extraction parameters from the input field
    const extractionPrompt = extractionPromptInput.value.trim();
    
    // Parse the exact extraction parameters specified by the user
    const userParameters = extractionPrompt.split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0)
        .map(param => param.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase());
    
    console.log(`Creating table headers based on user parameters: ${userParameters.join(', ')}`);
    
    // Start with URL as the first header
    let headers = ['URL'];
    
    // Add ONLY the user-specified parameters as headers
    userParameters.forEach(param => {
        if (!headers.includes(param)) {
            headers.push(param);
        }
    });
    
    // Ensure Status and Error columns are always present at the end
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

// Get the current set of headers from all results, filtered to only include user-specified parameters
function getDataHeadersFromResults() {
    // Get the current extraction parameters from the input field
    const extractionPrompt = extractionPromptInput.value.trim();
    
    // Parse the exact extraction parameters specified by the user
    const userParameters = extractionPrompt.split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0)
        .map(param => param.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase());
    
    // Start with URL as the first header
    let headers = ['URL'];
    
    // Add only the user-specified parameters
    userParameters.forEach(param => {
        if (!headers.includes(param)) {
            headers.push(param);
        }
    });
    
    // Add status and error columns
    if (!headers.includes('Status')) {
        headers.push('Status');
    }
    if (!headers.includes('Error')) {
        headers.push('Error');
    }
    
    return headers;
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
        const response = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                urls: [url],
                prompt: "Extract all URLs from this website. Include both internal and external links.",
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

// Rank URLs by importance
function rankUrlsByImportance(urls, homepageLinks, baseUrl) {
    // Parse the base URL to get the domain
    let baseDomain;
    try {
        const parsedUrl = new URL(baseUrl);
        baseDomain = parsedUrl.hostname;
    } catch (e) {
        console.error('Error parsing base URL:', e);
        baseDomain = baseUrl;
    }
    
    // Define scoring criteria
    const scores = {};
    
    // Initialize scores
    urls.forEach(url => {
        scores[url] = 0;
    });
    
    // Score 1: URLs directly linked from homepage get higher priority
    homepageLinks.forEach(link => {
        if (scores[link] !== undefined) {
            scores[link] += 10;
        }
    });
    
    // Score 2: Internal URLs get higher priority than external
    urls.forEach(url => {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname === baseDomain) {
                scores[url] += 5;
            }
        } catch (e) {
            // Invalid URL, don't change score
        }
    });
    
    // Score 3: Shorter URLs (closer to root) get higher priority
    urls.forEach(url => {
        try {
            const parsedUrl = new URL(url);
            const pathDepth = parsedUrl.pathname.split('/').filter(Boolean).length;
            scores[url] += Math.max(5 - pathDepth, 0); // Higher score for shorter paths
        } catch (e) {
            // Invalid URL, don't change score
        }
    });
    
    // Sort URLs by score (descending)
    return [...urls].sort((a, b) => scores[b] - scores[a]);
}

// Download the mapped URLs as a text file
function downloadMapResults() {
    const content = mapResults.textContent;
    
    if (!content) {
        alert('No URLs to download.');
        return;
    }
    
    // Create a blob and download link
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mapped_urls.txt');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
