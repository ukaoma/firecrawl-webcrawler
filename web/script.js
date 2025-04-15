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

// Global Variables
let zipCodes = [];
let results = [];
let csvHeaders = [];
let processingComplete = false;
let currentBatchIndex = 0;
let totalBatches = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    processButton.addEventListener('click', processZipCodes);
    downloadButton.addEventListener('click', downloadResults);
    csvFileInput.addEventListener('change', handleCSVUpload);
    
    // Initialize Bootstrap tabs
    const tabElements = document.querySelectorAll('a[data-bs-toggle="tab"]');
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
    
    // Show loading UI
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
