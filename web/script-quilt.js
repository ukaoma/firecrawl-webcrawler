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
const useFire1AgentCheck = document.getElementById('useFire1AgentCheck');
const agentPromptSection = document.getElementById('agentPromptSection');
const agentPromptInput = document.getElementById('agentPromptInput');
const processBulkUrlsButton = document.getElementById('processBulkUrlsButton');
const bulkResultsSection = document.getElementById('bulkResultsSection');
const bulkProgressBar = document.getElementById('bulkProgressBar');
const bulkStatus = document.getElementById('bulkStatus');
const bulkResultsTable = document.getElementById('bulkResultsTable');
const bulkResultsTableBody = document.getElementById('bulkResultsTableBody');
const downloadBulkResultsButton = document.getElementById('downloadBulkResultsButton');

// Knowledge Base Feature DOM Elements
const kbUrlsInput = document.getElementById('kbUrlsInput');
const processKbUrlsButton = document.getElementById('processKbUrlsButton');
const kbResultsSection = document.getElementById('kbResultsSection');
const kbProgressBar = document.getElementById('kbProgressBar');
const kbStatus = document.getElementById('kbStatus');
const kbResultsTable = document.getElementById('kbResultsTable');
const kbResultsTableBody = document.getElementById('kbResultsTableBody');
const downloadKbResultsButton = document.getElementById('downloadKbResultsButton');
const kbGlobalProgressBar = document.getElementById('kbGlobalProgressBar');
const kbGlobalProgressText = document.getElementById('kbGlobalProgressText');
const kbGlobalProgressPercentage = document.getElementById('kbGlobalProgressPercentage');
const kbGlobalStatusStats = document.getElementById('kbGlobalStatusStats');
const kbElapsedTime = document.getElementById('kbElapsedTime');
const kbEstimatedTime = document.getElementById('kbEstimatedTime');
const kbCurrentProgressPercentage = document.getElementById('kbCurrentProgressPercentage');

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

// Knowledge Base Global Variables
let kbResults = [];
let kbExtractionComplete = false;
let kbExtractionStartTime = null;
let processedArticleCount = 0;
let totalArticlesToProcess = 0;
let articleProcessingTimes = [];
let kbProgressTimer = null;

// KB Scrape Feature DOM Elements
const kbScrapeUrlsInput = document.getElementById('kbScrapeUrlsInput');
const processKbScrapeUrlsButton = document.getElementById('processKbScrapeUrlsButton');
const kbScrapeResultsSection = document.getElementById('kbScrapeResultsSection');
const kbScrapeProgressBar = document.getElementById('kbScrapeProgressBar');
const kbScrapeStatus = document.getElementById('kbScrapeStatus');
const kbScrapeResultsTable = document.getElementById('kbScrapeResultsTable');
const kbScrapeResultsTableBody = document.getElementById('kbScrapeResultsTableBody');
const downloadKbScrapeResultsButton = document.getElementById('downloadKbScrapeResultsButton');
const kbScrapeGlobalProgressBar = document.getElementById('kbScrapeGlobalProgressBar');
const kbScrapeGlobalProgressPercentage = document.getElementById('kbScrapeGlobalProgressPercentage');
const kbScrapeGlobalStatusStats = document.getElementById('kbScrapeGlobalStatusStats');
const kbScrapeElapsedTime = document.getElementById('kbScrapeElapsedTime');
const kbScrapeEstimatedTime = document.getElementById('kbScrapeEstimatedTime');
const kbScrapeCurrentProgressPercentage = document.getElementById('kbScrapeCurrentProgressPercentage');

// KB Scrape Global Variables
let kbScrapeResults = [];
let kbScrapeComplete = false;
let kbScrapeStartTime = null;
let processedScrapeCount = 0;
let totalScrapesToProcess = 0;
let scrapeProcessingTimes = [];
let kbScrapeProgressTimer = null;

// Enrichment Feature DOM Elements
const enrichmentCsvFileInput = document.getElementById('enrichmentCsvFileInput');
const enrichmentCsvPreview = document.getElementById('enrichmentCsvPreview');
const enrichmentCsvPreviewTable = document.getElementById('enrichmentCsvPreviewTable');
const enrichmentUrlColumnSection = document.getElementById('enrichmentUrlColumnSection');
const enrichmentUrlColumnSelect = document.getElementById('enrichmentUrlColumnSelect');
const enrichmentPromptSection = document.getElementById('enrichmentPromptSection');
const enrichmentPromptInput = document.getElementById('enrichmentPromptInput');
const enrichmentControls = document.getElementById('enrichmentControls');
const processEnrichmentButton = document.getElementById('processEnrichmentButton');
const enrichmentResultsSection = document.getElementById('enrichmentResultsSection');
const enrichmentProgressBar = document.getElementById('enrichmentProgressBar');
const enrichmentStatus = document.getElementById('enrichmentStatus');
const enrichmentResultsTable = document.getElementById('enrichmentResultsTable');
const enrichmentResultsTableHead = document.getElementById('enrichmentResultsTableHead');
const enrichmentResultsTableBody = document.getElementById('enrichmentResultsTableBody');
const downloadEnrichmentResultsButton = document.getElementById('downloadEnrichmentResultsButton');
const enrichmentGlobalProgressBar = document.getElementById('enrichmentGlobalProgressBar');
const enrichmentGlobalProgressText = document.getElementById('enrichmentGlobalProgressText');
const enrichmentGlobalProgressPercentage = document.getElementById('enrichmentGlobalProgressPercentage');
const enrichmentGlobalStatusStats = document.getElementById('enrichmentGlobalStatusStats');
const enrichmentElapsedTime = document.getElementById('enrichmentElapsedTime');
const enrichmentEstimatedTime = document.getElementById('enrichmentEstimatedTime');
const enrichmentCurrentProgressPercentage = document.getElementById('enrichmentCurrentProgressPercentage');

// Enrichment Global Variables
let enrichmentCsvData = [];
let enrichmentCsvHeaders = [];
let enrichmentResults = [];
let enrichmentComplete = false;
let enrichmentStartTime = null;
let processedEnrichmentCount = 0;
let totalEnrichmentToProcess = 0;
let enrichmentProcessingTimes = [];
let enrichmentProgressTimer = null;
let selectedUrlColumn = '';

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
    processKbUrlsButton.addEventListener('click', processKbUrls);
    downloadKbResultsButton.addEventListener('click', downloadKbResults);
    
    // KB Scrape event listeners
    if (processKbScrapeUrlsButton) {
        processKbScrapeUrlsButton.addEventListener('click', processKbScrapeUrls);
    }
    if (downloadKbScrapeResultsButton) {
        downloadKbScrapeResultsButton.addEventListener('click', downloadKbScrapeResults);
    }
    if (document.getElementById('copyMarkdownButton')) {
        document.getElementById('copyMarkdownButton').addEventListener('click', function() {
            const markdownContent = document.getElementById('markdownContent').textContent;
            copyToClipboard(markdownContent, 'Markdown copied to clipboard!');
        });
    }
    if (document.getElementById('copyScrapedHtmlButton')) {
        document.getElementById('copyScrapedHtmlButton').addEventListener('click', function() {
            const htmlContent = document.getElementById('scrapedHtmlCodeContent').textContent;
            copyToClipboard(htmlContent, 'HTML copied to clipboard!');
        });
    }
    
    // Enrichment event listeners
    if (enrichmentCsvFileInput) {
        enrichmentCsvFileInput.addEventListener('change', handleEnrichmentCSVUpload);
    }
    if (processEnrichmentButton) {
        processEnrichmentButton.addEventListener('click', processEnrichment);
    }
    if (downloadEnrichmentResultsButton) {
        downloadEnrichmentResultsButton.addEventListener('click', downloadEnrichmentResults);
    }
    
    // Set up FIRE-1 agent toggle
    if (useFire1AgentCheck) {
        useFire1AgentCheck.addEventListener('change', function() {
            if (this.checked) {
                agentPromptSection.classList.remove('d-none');
            } else {
                agentPromptSection.classList.add('d-none');
            }
        });
    }
    
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
            if (tab.id === 'map-tab' || tab.id === 'bulk-extract-tab' || tab.id === 'kb-extract-tab') {
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

// Process a single row for enrichment
async function processSingleEnrichmentRow(row, prompt, currentIndex, totalRows) {
    try {
        // Update progress for this row
        enrichmentProgressBar.style.width = '10%';
        enrichmentCurrentProgressPercentage.textContent = '10%';
        
        // Build context from the row data
        const rowContext = Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        
        let enrichmentData = {};
        
        // Check if we have a URL to crawl
        if (selectedUrlColumn && row[selectedUrlColumn]) {
            const url = row[selectedUrlColumn].toString().trim();
            
            // Validate URL
            try {
                new URL(url);
                
                // Call the Firecrawl API with row context
                enrichmentData = await extractEnrichmentDataFromUrl(url, prompt, rowContext);
                
            } catch (urlError) {
                console.warn(`Invalid URL in row ${currentIndex}: ${url}`);
                
                // Fallback to text-only enrichment
                enrichmentData = await extractEnrichmentDataFromText(prompt, rowContext);
            }
        } else {
            // Text-only enrichment without URL
            enrichmentData = await extractEnrichmentDataFromText(prompt, rowContext);
        }
        
        // Update progress for this row
        enrichmentProgressBar.style.width = '100%';
        enrichmentCurrentProgressPercentage.textContent = '100%';
        
        // Add enriched result to the table
        addEnrichmentResult({
            ...row,
            enrichment_data: enrichmentData,
            status: 'success'
        });
        
        return true;
    } catch (error) {
        console.error(`Error enriching row ${currentIndex}:`, error);
        
        // Add error result to the table
        addEnrichmentResult({
            ...row,
            enrichment_data: {},
            error: error.message,
            status: 'error'
        });
        
        return false;
    }
}

// Extract enrichment data from a URL using the Firecrawl API with retry logic
async function extractEnrichmentDataFromUrl(url, prompt, rowContext) {
    console.log(`Enriching data from URL: ${url}`);
    
    const MAX_RETRIES = 3;
    const RETRY_DELAYS = [2000, 5000, 10000]; // 2s, 5s, 10s
    
    for (let retryAttempt = 0; retryAttempt <= MAX_RETRIES; retryAttempt++) {
        try {
            // Build the full prompt with row context
            const fullPrompt = `Given the following business information: ${rowContext}
            
${prompt}

Please provide the enrichment data based on both the existing information and the website content.`;
            
            // Parse user prompt to determine expected fields
            const expectedFields = parseEnrichmentFields(prompt);
            const schemaProperties = {};
            
            // Build a dynamic schema based on the enrichment prompt
            expectedFields.forEach(field => {
                schemaProperties[field] = { type: ["string", "number", "null"] };
            });
            
            const schema = {
                type: "object",
                properties: schemaProperties,
                additionalProperties: false
            };
            
            const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    urls: [url],
                    prompt: fullPrompt,
                    schema: schema
                })
            });
            
            // Handle different types of API errors
            if (!jobSubmissionResponse.ok) {
                const errorText = await jobSubmissionResponse.text();
                const status = jobSubmissionResponse.status;
                
                // Check if this is a retryable error
                if (status === 500 || status === 502 || status === 503 || status === 504) {
                    if (retryAttempt < MAX_RETRIES) {
                        const delay = RETRY_DELAYS[retryAttempt];
                        console.warn(`Server error ${status} for ${url}, retrying in ${delay}ms (attempt ${retryAttempt + 1}/${MAX_RETRIES + 1})`);
                        await sleep(delay);
                        continue; // Retry the request
                    } else {
                        throw new Error(`Server error ${status} after ${MAX_RETRIES + 1} attempts: ${errorText}`);
                    }
                } else if (status === 429) {
                    // Rate limit error - wait longer before retrying
                    if (retryAttempt < MAX_RETRIES) {
                        const delay = 60000; // Wait 60 seconds for rate limit
                        console.warn(`Rate limit hit for ${url}, waiting ${delay}ms before retry (attempt ${retryAttempt + 1}/${MAX_RETRIES + 1})`);
                        await sleep(delay);
                        continue;
                    } else {
                        throw new Error(`Rate limit exceeded after ${MAX_RETRIES + 1} attempts: ${errorText}`);
                    }
                } else {
                    // Non-retryable error (4xx client errors, etc.)
                    throw new Error(`API job submission failed with status ${status}: ${errorText}`);
                }
            }
            
            const jobResponse = await jobSubmissionResponse.json();
            const jobId = jobResponse.id;
            if (!jobId) {
                throw new Error('No job ID returned from API');
            }
            
            // Poll for job completion with improved error handling
            const MAX_POLLING_ATTEMPTS = 30;
            const POLLING_INTERVAL_MS = 2500;
            
            let attempts = 0;
            let jobComplete = false;
            let extractionResults = null;
            let pollingErrors = 0;
            const MAX_POLLING_ERRORS = 5;
            
            while (!jobComplete && attempts < MAX_POLLING_ATTEMPTS) {
                attempts++;
                
                try {
                    const statusResponse = await fetch(`https://api.firecrawl.dev/v1/extract/${jobId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${API_KEY}`
                        }
                    });
                    
                    if (!statusResponse.ok) {
                        const status = statusResponse.status;
                        
                        // Handle polling errors
                        if (status === 500 || status === 502 || status === 503 || status === 504) {
                            pollingErrors++;
                            if (pollingErrors > MAX_POLLING_ERRORS) {
                                throw new Error(`Too many polling errors (${pollingErrors}) for job ${jobId}`);
                            }
                            console.warn(`Polling error ${status} for job ${jobId}, continuing... (${pollingErrors}/${MAX_POLLING_ERRORS})`);
                        }
                        
                        await sleep(POLLING_INTERVAL_MS);
                        continue;
                    }
                    
                    // Reset polling error counter on successful response
                    pollingErrors = 0;
                    
                    const statusResult = await statusResponse.json();
                    
                    if (statusResult.status === 'completed') {
                        jobComplete = true;
                        extractionResults = statusResult;
                        break;
                    } else if (statusResult.status === 'failed') {
                        const errorMessage = statusResult.error || 'Unknown error';
                        
                        // Check if this is a retryable failure
                        if (errorMessage.includes('500') || errorMessage.includes('timeout') || errorMessage.includes('server error')) {
                            if (retryAttempt < MAX_RETRIES) {
                                console.warn(`Job failed with retryable error for ${url}: ${errorMessage}, retrying...`);
                                break; // Break out of polling loop to retry the entire job
                            }
                        }
                        
                        throw new Error('Job failed: ' + errorMessage);
                    } else {
                        await sleep(POLLING_INTERVAL_MS);
                    }
                } catch (networkError) {
                    pollingErrors++;
                    if (pollingErrors > MAX_POLLING_ERRORS) {
                        throw new Error(`Too many network errors during polling: ${networkError.message}`);
                    }
                    console.error(`Network error during polling (${pollingErrors}/${MAX_POLLING_ERRORS}):`, networkError);
                    await sleep(POLLING_INTERVAL_MS);
                    continue;
                }
            }
            
            if (!jobComplete) {
                if (retryAttempt < MAX_RETRIES) {
                    console.warn(`Job polling timeout for ${url}, retrying entire request...`);
                    continue; // Retry the entire request
                } else {
                    throw new Error(`Job did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts and ${MAX_RETRIES + 1} retries`);
                }
            }
            
            // Get the extracted data
            if (extractionResults && extractionResults.data) {
                console.log(`Successfully enriched data for ${url} ${retryAttempt > 0 ? `after ${retryAttempt} retries` : ''}`);
                return extractionResults.data;
            } else {
                return {};
            }
            
        } catch (error) {
            // Log the error for this attempt
            console.error(`Attempt ${retryAttempt + 1}/${MAX_RETRIES + 1} failed for ${url}:`, error.message);
            
            // If this was the last attempt, throw the error
            if (retryAttempt === MAX_RETRIES) {
                throw new Error(`Failed after ${MAX_RETRIES + 1} attempts: ${error.message}`);
            }
            
            // Wait before retrying (unless it's a network error during job submission)
            if (retryAttempt < MAX_RETRIES) {
                const delay = RETRY_DELAYS[retryAttempt];
                console.log(`Waiting ${delay}ms before retry...`);
                await sleep(delay);
            }
        }
    }
}

// Extract enrichment data from text only (no URL crawling)
async function extractEnrichmentDataFromText(prompt, rowContext) {
    console.log(`Enriching data from text context: ${rowContext}`);
    
    // For text-only enrichment, we'll create placeholder data
    const fields = parseEnrichmentFields(prompt);
    const enrichmentData = {};
    
    // Simple text-based enrichment (placeholder implementation)
    fields.forEach(field => {
        if (field.includes('merchandise') || field.includes('product')) {
            // Try to infer merchandise from business name
            if (rowContext.toLowerCase().includes('restaurant') || rowContext.toLowerCase().includes('food')) {
                enrichmentData[field] = 'Food & Dining';
            } else if (rowContext.toLowerCase().includes('retail') || rowContext.toLowerCase().includes('store')) {
                enrichmentData[field] = 'Retail Goods';
            } else {
                enrichmentData[field] = 'General Services';
            }
        } else {
            enrichmentData[field] = 'Not available (text-only enrichment)';
        }
    });
    
    return enrichmentData;
}

// Parse enrichment fields from the prompt with improved extraction for complex prompts
function parseEnrichmentFields(prompt) {
    // Look for field names in the prompt
    const fields = [];
    
    console.log(`Parsing enrichment fields from prompt: "${prompt}"`);
    
    // Clean the prompt first to remove HTML tags and normalize
    const cleanPrompt = prompt
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/\/n\//g, ' ') // Remove /n/ sequences
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    
    console.log(`Cleaned prompt: "${cleanPrompt}"`);
    
    // Enhanced patterns specifically designed for your prompt structure
    const patterns = [
        // Pattern 1: "Add/Also add a/the [field name]:" - handles your exact format
        /(?:add|also\s+add)\s+(?:a|the)\s+([^:]+?):/gi,
        
        // Pattern 2: "quoted phrases" 
        /"([^"]+)"/g,
        
        // Pattern 3: add/create a "field" column or add/create a field column
        /(?:add|create)\s+a\s+['"]?([^'"<:]+?)['"]?\s*(?:column|field)?/gi,
        
        // Pattern 4: add/create the [field]
        /(?:add|create)\s+the\s+([^<:]+?)(?:\s|$|e\.g)/gi,
        
        // Pattern 5: "field" column patterns
        /['"]([^'"]+?)['"]?\s+column/gi,
        
        // Pattern 6: simple word patterns (fallback)
        /\b(\w+)\s+column/gi,
        /\b(\w+)\s+field/gi
    ];
    
    // Track found fields to avoid duplicates
    const foundFields = new Set();
    
    // Try each pattern
    patterns.forEach((pattern, patternIndex) => {
        console.log(`Trying pattern ${patternIndex + 1}: ${pattern}`);
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(cleanPrompt)) !== null) {
            let fieldText = match[1];
            if (fieldText) {
                fieldText = fieldText.trim();
                console.log(`Pattern ${patternIndex + 1} found raw: "${fieldText}"`);
                
                // Clean up the field text more aggressively
                let cleanField = fieldText
                    .toLowerCase()
                    .trim()
                    // Remove common words that aren't part of the field name
                    .replace(/^(a|an|the|new)\s+/gi, '')
                    .replace(/\s+(column|field)$/gi, '')
                    .replace(/\s*under\s*.*$/gi, '') // Remove "under" and everything after
                    .replace(/\s*e\.g\s*.*$/gi, '') // Remove "e.g" and everything after
                    .trim();
                
                // Convert to valid field name (replace spaces and special chars with underscores)
                const fieldName = cleanField.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                
                if (fieldName && fieldName.length > 1 && !foundFields.has(fieldName)) {
                    foundFields.add(fieldName);
                    fields.push(fieldName);
                    console.log(`Added field: "${fieldName}" (from "${fieldText}" -> "${cleanField}")`);
                }
            }
        }
    });
    
    // Additional logic to extract fields from specific contexts
    // Look for examples that might indicate field types
    const examplePattern = /e\.g[.,:]?\s*([^/]+?)(?:\/n\/|$)/gi;
    let exampleMatch;
    while ((exampleMatch = examplePattern.exec(cleanPrompt)) !== null) {
        const exampleText = exampleMatch[1].trim();
        console.log(`Found example text: "${exampleText}"`);
        
        // If the example looks like a URL, it's probably a website field
        if (exampleText.match(/https?:\/\/|www\./)) {
            const websiteField = 'website';
            if (!foundFields.has(websiteField) && !foundFields.has('business_website')) {
                foundFields.add('business_website');
                fields.push('business_website');
                console.log(`Added business_website field based on URL example: "${exampleText}"`);
            }
        }
        
        // If the example looks like hours, it's probably hours
        if (exampleText.match(/\d+-\d+|tu-f|sa|by\s+appt/i)) {
            const hoursField = 'shop_hours';
            if (!foundFields.has(hoursField) && !foundFields.has('hours')) {
                foundFields.add('shop_hours');
                fields.push('shop_hours');
                console.log(`Added shop_hours field based on hours example: "${exampleText}"`);
            }
        }
    }
    
    // Manual extraction for common field patterns that might be missed
    const manualPatterns = [
        { keywords: ['business website', 'website'], field: 'business_website' },
        { keywords: ['shop hours', 'hours', 'schedule', 'time'], field: 'shop_hours' },
        { keywords: ['phone', 'telephone', 'number'], field: 'phone' },
        { keywords: ['address', 'location'], field: 'address' },
        { keywords: ['email', 'contact'], field: 'email' }
    ];
    
    manualPatterns.forEach(({ keywords, field }) => {
        const hasKeyword = keywords.some(keyword => 
            cleanPrompt.toLowerCase().includes(keyword) && !foundFields.has(field)
        );
        
        if (hasKeyword) {
            foundFields.add(field);
            fields.push(field);
            console.log(`Added field via manual pattern: "${field}"`);
        }
    });
    
    // Remove duplicates and clean up
    const uniqueFields = [...new Set(fields)].filter(field => field && field.length > 0);
    
    console.log(`Final extracted fields: [${uniqueFields.join(', ')}]`);
    
    // If no fields found, default to 'enrichment'
    if (uniqueFields.length === 0) {
        console.log('No fields found, defaulting to "enrichment"');
        uniqueFields.push('enrichment');
    }
    
    return uniqueFields;
}

// Add an enrichment result to the table
function addEnrichmentResult(result) {
    enrichmentResults.push(result);
    
    // Create or update table headers based on the original CSV + new enrichment columns
    updateEnrichmentResultsTableHeaders(result);
    
    // Add a row to the table
    const row = document.createElement('tr');
    
    // Get all headers (original + enrichment + status)
    const headers = getEnrichmentTableHeaders();
    
    headers.forEach(header => {
        const cell = document.createElement('td');
        
        if (header === 'Status') {
            if (result.status === 'success') {
                cell.textContent = 'Success';
                cell.classList.add('text-success');
            } else {
                cell.textContent = 'Error';
                cell.classList.add('text-danger');
            }
        } else if (header === 'Error') {
            cell.textContent = result.error || '';
            if (result.error) {
                cell.classList.add('text-danger');
            }
        } else if (result.enrichment_data && result.enrichment_data.hasOwnProperty(header)) {
            // This is an enrichment column
            const value = result.enrichment_data[header];
            cell.textContent = value !== undefined && value !== null ? value.toString() : '-';
        } else if (result.hasOwnProperty(header)) {
            // This is an original CSV column
            cell.textContent = result[header] || '-';
        } else {
            cell.textContent = '-';
        }
        
        row.appendChild(cell);
    });
    
    enrichmentResultsTableBody.appendChild(row);
}

// Update the enrichment results table headers
function updateEnrichmentResultsTableHeaders(result) {
    // Always regenerate headers to account for new enrichment fields
    const headers = getEnrichmentTableHeaders();
    
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    enrichmentResultsTableHead.innerHTML = '';
    enrichmentResultsTableHead.appendChild(headerRow);
    
    // Update existing rows to match new header structure
    updateExistingEnrichmentRows(headers);
}

// Get enrichment table headers (original CSV columns + enrichment columns + status columns)
function getEnrichmentTableHeaders() {
    let headers = [...enrichmentCsvHeaders];
    
    // Get all unique enrichment fields from actual results
    const enrichmentFields = new Set();
    enrichmentResults.forEach(result => {
        if (result.enrichment_data && typeof result.enrichment_data === 'object') {
            Object.keys(result.enrichment_data).forEach(key => {
                enrichmentFields.add(key);
            });
        }
    });
    
    // Add enrichment fields to headers
    headers = headers.concat(Array.from(enrichmentFields));
    
    headers.push('Status', 'Error');
    return headers;
}

// Download enrichment results as a CSV file
function downloadEnrichmentResults() {
    if (enrichmentResults.length === 0) {
        alert('No results to download.');
        return;
    }
    
    const headers = getEnrichmentTableHeaders();
    let csvContent = headers.join(',') + '\n';
    
    enrichmentResults.forEach(result => {
        const row = headers.map(header => {
            let value = '';
            
            if (header === 'Status') {
                value = result.status === 'success' ? 'Success' : 'Error';
            } else if (header === 'Error') {
                value = result.error || '';
            } else if (result.enrichment_data && result.enrichment_data.hasOwnProperty(header)) {
                const enrichmentValue = result.enrichment_data[header];
                value = enrichmentValue !== undefined && enrichmentValue !== null ? enrichmentValue.toString() : '';
            } else if (result.hasOwnProperty(header)) {
                value = result[header] || '';
            }
            
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'enriched_data.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Start enrichment progress tracking
function startEnrichmentProgressTracking(totalRows) {
    enrichmentStartTime = Date.now();
    totalEnrichmentToProcess = totalRows;
    processedEnrichmentCount = 0;
    enrichmentProcessingTimes = [];
    
    enrichmentGlobalProgressBar.style.width = '0%';
    enrichmentGlobalProgressPercentage.textContent = '0%';
    enrichmentGlobalStatusStats.textContent = `Processing 0 of ${totalRows} rows`;
    enrichmentElapsedTime.textContent = 'Elapsed: 0s';
    enrichmentEstimatedTime.textContent = 'Est. remaining: --';
    
    if (enrichmentProgressTimer) {
        clearInterval(enrichmentProgressTimer);
    }
    
    enrichmentProgressTimer = setInterval(() => {
        if (!enrichmentStartTime) return;
        
        const elapsed = Date.now() - enrichmentStartTime;
        enrichmentElapsedTime.textContent = `Elapsed: ${formatTime(elapsed)}`;
        
        if (processedEnrichmentCount > 0 && enrichmentProcessingTimes.length > 0) {
            const avgTimePerRow = enrichmentProcessingTimes.reduce((a, b) => a + b, 0) / enrichmentProcessingTimes.length;
            const remainingRows = totalEnrichmentToProcess - processedEnrichmentCount;
            const estimatedRemainingTime = avgTimePerRow * remainingRows;
            
            enrichmentEstimatedTime.textContent = `Est. remaining: ${formatTime(estimatedRemainingTime)}`;
        }
    }, 1000);
}

// Update enrichment progress when a row is processed
function updateEnrichmentProgress(success = true, processingTime = null) {
    if (!enrichmentStartTime) return;
    
    processedEnrichmentCount++;
    
    if (processingTime) {
        enrichmentProcessingTimes.push(processingTime);
    }
    
    const progressPercent = Math.round((processedEnrichmentCount / totalEnrichmentToProcess) * 100);
    enrichmentGlobalProgressBar.style.width = `${progressPercent}%`;
    enrichmentGlobalProgressPercentage.textContent = `${progressPercent}%`;
    
    enrichmentGlobalStatusStats.textContent = `Processing ${processedEnrichmentCount} of ${totalEnrichmentToProcess} rows`;
    
    if (processedEnrichmentCount >= totalEnrichmentToProcess) {
        finishEnrichmentProgress();
    }
}

// End enrichment progress tracking
function finishEnrichmentProgress() {
    if (enrichmentProgressTimer) {
        clearInterval(enrichmentProgressTimer);
        enrichmentProgressTimer = null;
    }
    
    if (enrichmentStartTime) {
        const totalTime = Date.now() - enrichmentStartTime;
        enrichmentElapsedTime.textContent = `Total time: ${formatTime(totalTime)}`;
        enrichmentEstimatedTime.textContent = `Avg. per row: ${formatTime(totalTime / totalEnrichmentToProcess)}`;
        
        const successCount = enrichmentResults.filter(r => r.status === 'success').length;
        const successRate = Math.round((successCount / totalEnrichmentToProcess) * 100);
        enrichmentGlobalStatusStats.textContent = `Completed: ${successCount} of ${totalEnrichmentToProcess} rows (${successRate}% success)`;
    }
    
    enrichmentStartTime = null;
}

// Update existing enrichment rows to match new header structure
function updateExistingEnrichmentRows(headers) {
    // Get all existing rows
    const existingRows = Array.from(enrichmentResultsTableBody.children);
    
    existingRows.forEach((row, rowIndex) => {
        const result = enrichmentResults[rowIndex];
        if (!result) return;
        
        // Clear the row and rebuild it with the new header structure
        row.innerHTML = '';
        
        headers.forEach(header => {
            const cell = document.createElement('td');
            
            if (header === 'Status') {
                if (result.status === 'success') {
                    cell.textContent = 'Success';
                    cell.classList.add('text-success');
                } else {
                    cell.textContent = 'Error';
                    cell.classList.add('text-danger');
                }
            } else if (header === 'Error') {
                cell.textContent = result.error || '';
                if (result.error) {
                    cell.classList.add('text-danger');
                }
            } else if (result.enrichment_data && result.enrichment_data.hasOwnProperty(header)) {
                // This is an enrichment column
                const value = result.enrichment_data[header];
                cell.textContent = value !== undefined && value !== null ? value.toString() : '-';
            } else if (result.hasOwnProperty(header)) {
                // This is an original CSV column
                cell.textContent = result[header] || '-';
            } else {
                cell.textContent = '-';
            }
            
            row.appendChild(cell);
        });
    });
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

// Handle CSV file upload for enrichment
function handleEnrichmentCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Use PapaParse to parse the CSV
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            enrichmentCsvHeaders = results.meta.fields;
            enrichmentCsvData = results.data;
            
            console.log(`Loaded CSV with ${enrichmentCsvData.length} rows and ${enrichmentCsvHeaders.length} columns`);
            
            // Preview the CSV data
            createEnrichmentCSVPreview(enrichmentCsvData, enrichmentCsvHeaders);
            
            // Set up URL column selection
            setupUrlColumnSelection(enrichmentCsvHeaders);
            
            // Show the enrichment prompt section
            enrichmentPromptSection.classList.remove('d-none');
            enrichmentControls.classList.remove('d-none');
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file. Please check the file format.');
        }
    });
}

// Create a preview of the CSV data for enrichment
function createEnrichmentCSVPreview(data, headers) {
    // Clear previous preview
    enrichmentCsvPreviewTable.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    enrichmentCsvPreviewTable.appendChild(thead);
    
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
    
    enrichmentCsvPreviewTable.appendChild(tbody);
    enrichmentCsvPreview.classList.remove('d-none');
}

// Set up URL column selection
function setupUrlColumnSelection(headers) {
    // Clear existing options
    enrichmentUrlColumnSelect.innerHTML = '<option value="">No URL column (text-only enrichment)</option>';
    
    // Add each column as an option
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        enrichmentUrlColumnSelect.appendChild(option);
    });
    
    // Try to auto-detect URL column
    const urlColumn = findUrlColumn(headers);
    if (urlColumn) {
        enrichmentUrlColumnSelect.value = urlColumn;
        selectedUrlColumn = urlColumn;
    }
    
    // Add event listener for manual selection
    enrichmentUrlColumnSelect.addEventListener('change', function() {
        selectedUrlColumn = this.value;
    });
    
    // Show the URL column section
    enrichmentUrlColumnSection.classList.remove('d-none');
}

// Find the URL column in the CSV
function findUrlColumn(headers) {
    const possibleNames = ['url', 'website', 'link', 'homepage', 'site', 'web'];
    
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

// Process CSV enrichment with concurrent processing
async function processEnrichment() {
    // Get enrichment prompt
    const enrichmentPrompt = enrichmentPromptInput.value.trim();
    
    if (!enrichmentPrompt) {
        alert('Please enter enrichment instructions.');
        return;
    }
    
    if (enrichmentCsvData.length === 0) {
        alert('No CSV data loaded. Please upload a CSV file first.');
        return;
    }
    
    // Show the results section
    enrichmentResultsSection.classList.remove('d-none');
    
    // Clear previous results
    enrichmentResults = [];
    enrichmentResultsTableBody.innerHTML = '';
    enrichmentProgressBar.style.width = '0%';
    enrichmentProgressBar.classList.add('progress-bar-animated');
    enrichmentStatus.textContent = 'Preparing enrichment...';
    enrichmentCurrentProgressPercentage.textContent = '0%';
    
    // Reset global variables
    enrichmentComplete = false;
    
    // Show loading UI with enrichment message
    if (loadingMessage) {
        loadingMessage.textContent = 'Enriching CSV data...';
    }
    loadingOverlay.classList.remove('d-none');
    
    // Start enrichment progress tracking
    startEnrichmentProgressTracking(enrichmentCsvData.length);
    
    try {
        // Process with concurrency (3 concurrent jobs)
        const MAX_CONCURRENT_JOBS = 3;
        enrichmentStatus.textContent = `Processing with ${MAX_CONCURRENT_JOBS} concurrent browsers...`;
        
        // Create a queue of rows to process
        const rowQueue = [...enrichmentCsvData.map((row, index) => ({ row, index }))];
        
        // Create a pool to track active jobs
        const activeJobs = [];
        const processedIndexes = new Set();
        
        // Define function to update status with current active jobs
        const updateConcurrentJobsStatus = () => {
            if (activeJobs.length === 0) return;
            
            const activeJobText = activeJobs
                .slice(0, 3)
                .map(job => `#${job.index}`)
                .join(', ');
                
            const additionalJobsText = activeJobs.length > 3 ? ` and ${activeJobs.length - 3} more` : '';
            enrichmentStatus.textContent = `Enriching rows ${activeJobText}${additionalJobsText} concurrently (${processedIndexes.size} of ${enrichmentCsvData.length} total)`;
        };
        
        // Process the queue concurrently
        while (rowQueue.length > 0 || activeJobs.length > 0) {
            // Fill the active jobs pool up to MAX_CONCURRENT_JOBS
            while (activeJobs.length < MAX_CONCURRENT_JOBS && rowQueue.length > 0) {
                const { row, index } = rowQueue.shift();
                
                if (!processedIndexes.has(index)) {
                    processedIndexes.add(index);
                    
                    // Create a job for this row
                    const rowStartTime = Date.now();
                    const rowIndex = index + 1;
                    
                    // Update status
                    updateConcurrentJobsStatus();
                    
                    // Create a promise for this job
                    const jobPromise = (async () => {
                        try {
                            await processSingleEnrichmentRow(row, enrichmentPrompt, rowIndex, enrichmentCsvData.length);
                            updateEnrichmentProgress(true, Date.now() - rowStartTime);
                            return { row, success: true, time: Date.now() - rowStartTime };
                        } catch (error) {
                            console.error(`Error enriching row ${rowIndex}:`, error);
                            
                            // Add error result to the table
                            addEnrichmentResult({
                                ...row,
                                enrichment_data: {},
                                error: error.message,
                                status: 'error'
                            });
                            
                            updateEnrichmentProgress(false, Date.now() - rowStartTime);
                            return { row, success: false, error, time: Date.now() - rowStartTime };
                        }
                    })();
                    
                    // Add this job to the active jobs pool
                    activeJobs.push({ 
                        promise: jobPromise, 
                        row, 
                        index: rowIndex,
                        startTime: rowStartTime 
                    });
                }
            }
            
            // If we have active jobs, wait for at least one to complete
            if (activeJobs.length > 0) {
                // Create an array of promises that resolve when jobs complete
                const promises = activeJobs.map(job => job.promise);
                
                // Wait for at least one job to complete
                await Promise.race(promises);
                
                // Remove completed jobs from active pool
                const stillRunning = [];
                
                // Check each job to see if it's still running
                for (const job of activeJobs) {
                    const isResolved = await Promise.race([
                        job.promise.then(() => true, () => true),
                        new Promise(resolve => setTimeout(() => resolve(false), 0))
                    ]);
                    
                    if (!isResolved) {
                        stillRunning.push(job);
                    }
                }
                
                // Update active jobs to only include those still running
                activeJobs.length = 0;
                activeJobs.push(...stillRunning);
                
                // Update status with current jobs
                updateConcurrentJobsStatus();
            }
        }
        
        // Processing complete
        enrichmentComplete = true;
        enrichmentProgressBar.style.width = '100%';
        enrichmentProgressBar.classList.remove('progress-bar-animated');
        enrichmentStatus.textContent = `Enrichment complete. ${enrichmentResults.filter(r => r.status === 'success').length} of ${enrichmentCsvData.length} rows processed successfully.`;
        enrichmentCurrentProgressPercentage.textContent = '100%';
        
    } catch (error) {
        console.error('Error in enrichment processing:', error);
        enrichmentStatus.textContent = `Error: ${error.message}`;
        enrichmentStatus.classList.add('text-danger');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
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
    
    // Warn user about rate limits if there are many URLs
    if (urls.length > 10) {
        const proceed = confirm(`You're processing ${urls.length} URLs, but Firecrawl has a rate limit of 10 requests per minute. The extraction will be throttled to respect these limits, which may take some time. Continue?`);
        if (!proceed) return;
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
        // Calculate required delay between requests to stay under rate limit
        // Firecrawl has a limit of 500 requests per minute with Explorer plan
        const MIN_DELAY_BETWEEN_REQUESTS = 120; // 120ms to stay under 500/minute
        
        // Process each URL sequentially with rate limiting
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
                
                // Check if this is a rate limit error
                if (error.message && error.message.includes('429') && error.message.includes('Rate limit exceeded')) {
                    bulkStatus.textContent = `Rate limit hit. Waiting 60 seconds before continuing...`;
                    
                    // If rate limited, wait for 60 seconds before continuing
                    await sleep(60000);
                    
                    // Try again with the same URL (decrement the counter)
                    i--;
                    continue;
                }
                
                // Add error result to the table for non-rate-limit errors
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
            
            // Add a delay between requests to avoid rate limiting
            if (i < urls.length - 1) {
                const timeElapsed = Date.now() - urlStartTime;
                const requiredDelay = Math.max(MIN_DELAY_BETWEEN_REQUESTS - timeElapsed, 0);
                
                if (requiredDelay > 0) {
                    bulkStatus.textContent = `Rate limiting: waiting ${Math.round(requiredDelay/1000)} seconds before processing next URL...`;
                    await sleep(requiredDelay);
                }
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
        
        // Prepare request body
        const requestBody = {
            urls: [url],
            prompt: prompt,
            schema: schema
        };
        
        // If FIRE-1 agent is enabled, add the agent parameter and update the prompt
        if (useFire1AgentCheck && useFire1AgentCheck.checked) {
            // Get agent navigation instructions
            const agentPrompt = agentPromptInput ? agentPromptInput.value.trim() : "";
            const navigationInstructions = agentPrompt || 
                "Navigate through the website content and handle any dynamic elements such as pagination, tabs, or popup dialogs as needed to extract all relevant data.";
            
            // Per the API documentation, only include model in the agent object
            requestBody.agent = {
                model: "FIRE-1"
            };
            
            // Combine the extraction parameters with navigation instructions in the main prompt
            requestBody.prompt = `${requestBody.prompt} ${navigationInstructions}`;
            
            console.log(`Using FIRE-1 agent for ${url}`);
            console.log(`Enhanced prompt: ${requestBody.prompt}`);
            bulkStatus.textContent = `Using FIRE-1 agent for ${url}...`;
        }
        
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

// Process knowledge base articles using the scrape endpoint (for JS-heavy pages)
async function processKbScrapeUrls() {
    // Get URLs from input
    const urlsInput = kbScrapeUrlsInput.value.trim();
    
    if (!urlsInput) {
        alert('Please enter article URLs to scrape.');
        return;
    }
    
    // Parse URLs (split by commas or newlines)
    const urls = urlsInput.split(/[\n,]+/).map(url => url.trim()).filter(url => url !== '');
    
    if (urls.length === 0) {
        alert('No valid URLs found.');
        return;
    }
    
    // Show the results section
    kbScrapeResultsSection.classList.remove('d-none');
    
    // Clear previous results
    kbScrapeResultsTableBody.innerHTML = '';
    kbScrapeProgressBar.style.width = '0%';
    kbScrapeProgressBar.classList.add('progress-bar-animated');
    kbScrapeStatus.textContent = 'Preparing knowledge base scraping...';
    kbScrapeCurrentProgressPercentage.textContent = '0%';
    
    // Reset global variables
    kbScrapeResults = [];
    kbScrapeComplete = false;
    
    // Show loading UI with scraping message
    if (loadingMessage) {
        loadingMessage.textContent = 'Scraping knowledge base articles...';
    }
    loadingOverlay.classList.remove('d-none');
    
    // Start KB scrape progress tracking
    startKbScrapeProgressTracking(urls.length);
    
    try {
        // Process URLs with concurrency (5 concurrent jobs)
        const MAX_CONCURRENT_JOBS = 5;
        kbScrapeStatus.textContent = `Processing with ${MAX_CONCURRENT_JOBS} concurrent jobs...`;
        
        // Create a queue of URLs to process
        const urlQueue = [...urls];
        
        // Create a pool to track active jobs
        const activeJobs = [];
        const processedIndexes = new Set();
        
        // Define function to update status with current active jobs
        const updateConcurrentJobsStatus = () => {
            if (activeJobs.length === 0) return;
            
            const activeJobText = activeJobs
                .slice(0, 3)
                .map(job => `#${job.index}`)
                .join(', ');
                
            const additionalJobsText = activeJobs.length > 3 ? ` and ${activeJobs.length - 3} more` : '';
            kbScrapeStatus.textContent = `Scraping articles ${activeJobText}${additionalJobsText} concurrently (${processedIndexes.size} of ${urls.length} total)`;
        };
        
        // Process the queue concurrently
        while (urlQueue.length > 0 || activeJobs.length > 0) {
            // Fill the active jobs pool up to MAX_CONCURRENT_JOBS
            while (activeJobs.length < MAX_CONCURRENT_JOBS && urlQueue.length > 0) {
                const url = urlQueue.shift();
                const index = urls.indexOf(url);
                
                if (!processedIndexes.has(index)) {
                    processedIndexes.add(index);
                    
                    // Create a job for this URL
                    const articleStartTime = Date.now();
                    const articleIndex = index + 1;
                    
                    // Update status
                    updateConcurrentJobsStatus();
                    
                    // Create a promise for this job
                    const jobPromise = (async () => {
                        try {
                            await processKbScrapeArticle(url, articleIndex, urls.length);
                            updateKbScrapeProgress(true, Date.now() - articleStartTime);
                            return { url, success: true, time: Date.now() - articleStartTime };
                        } catch (error) {
                            console.error(`Error scraping article ${url}:`, error);
                            
                            // Add error result to the table
                            addKbScrapeResult({
                                url: url,
                                category: '',
                                article_name: '',
                                published_date: '',
                                markdown: '',
                                error: error.message,
                                status: 'error'
                            });
                            
                            updateKbScrapeProgress(false, Date.now() - articleStartTime);
                            return { url, success: false, error, time: Date.now() - articleStartTime };
                        }
                    })();
                    
                    // Add this job to the active jobs pool
                    activeJobs.push({ 
                        promise: jobPromise, 
                        url, 
                        index: articleIndex,
                        startTime: articleStartTime 
                    });
                }
            }
            
            // If we have active jobs, wait for at least one to complete
            if (activeJobs.length > 0) {
                // Create an array of promises that resolve when jobs complete
                const promises = activeJobs.map(job => job.promise);
                
                // Wait for at least one job to complete
                await Promise.race(promises);
                
                // Remove completed jobs from active pool
                const stillRunning = [];
                
                // Check each job to see if it's still running
                for (const job of activeJobs) {
                    const isResolved = await Promise.race([
                        job.promise.then(() => true, () => true),
                        new Promise(resolve => setTimeout(() => resolve(false), 0))
                    ]);
                    
                    if (!isResolved) {
                        stillRunning.push(job);
                    }
                }
                
                // Update active jobs to only include those still running
                activeJobs.length = 0;
                activeJobs.push(...stillRunning);
                
                // Update status with current jobs
                updateConcurrentJobsStatus();
            }
        }
        
        // All jobs are complete
        kbScrapeComplete = true;
        kbScrapeProgressBar.style.width = '100%';
        kbScrapeProgressBar.classList.remove('progress-bar-animated');
        kbScrapeStatus.textContent = `Scraping complete. ${kbScrapeResults.filter(r => r.status === 'success').length} of ${urls.length} articles processed successfully.`;
        kbScrapeCurrentProgressPercentage.textContent = '100%';
        
    } catch (error) {
        console.error('Error in knowledge base scraping:', error);
        kbScrapeStatus.textContent = `Error: ${error.message}`;
        kbScrapeStatus.classList.add('text-danger');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}

// Process a single knowledge base article with the scrape endpoint
async function processKbScrapeArticle(url, currentIndex, totalArticles) {
    try {
        // Update progress for this article
        kbScrapeProgressBar.style.width = '10%';
        kbScrapeCurrentProgressPercentage.textContent = '10%';
        
        kbScrapeStatus.textContent = `Scraping article ${currentIndex} of ${totalArticles}...`;
        kbScrapeProgressBar.style.width = '20%';
        kbScrapeCurrentProgressPercentage.textContent = '20%';
        
        console.log(`Scraping knowledge base article from: ${url}`);
        
        // Call the Firecrawl scrape API
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                url: url,
                formats: ['markdown'],
                onlyMainContent: true,
                removeBase64Images: true,
                blockAds: true,
                waitFor: 2000 // Wait 2 seconds before scraping to allow JS content to load
            })
        });
        
        if (!scrapeResponse.ok) {
            const errorText = await scrapeResponse.text();
            throw new Error(`Scrape API failed with status ${scrapeResponse.status}: ${errorText}`);
        }
        
        const scrapeResult = await scrapeResponse.json();
        console.log('Scrape API response:', scrapeResult);
        
        // Update progress
        kbScrapeProgressBar.style.width = '80%';
        kbScrapeCurrentProgressPercentage.textContent = '80%';
        
        // Check if we have markdown data
        if (scrapeResult.success && scrapeResult.data && scrapeResult.data.markdown) {
            // Clean up the markdown by removing related/trending articles sections
            const cleanMarkdown = cleanupMarkdownContent(scrapeResult.data.markdown);
            
            // Parse the markdown to extract metadata
            const parsedData = parseMarkdownMetadata(cleanMarkdown, url);
            
            kbScrapeStatus.textContent = `Scraping complete for article ${currentIndex}. Processing results...`;
            kbScrapeProgressBar.style.width = '90%';
            kbScrapeCurrentProgressPercentage.textContent = '90%';
            
            // Add to results with success
            addKbScrapeResult({
                url: url,
                category: parsedData.category || '',
                article_name: parsedData.title || '',
                published_date: parsedData.publishDate || '',
                markdown: cleanMarkdown,
                status: 'success'
            });
            
            return true;
        } else {
            console.warn(`No markdown in scrape results for article ${url}:`, scrapeResult);
            
            // Add to results with error
            addKbScrapeResult({
                url: url,
                category: '',
                article_name: '',
                published_date: '',
                markdown: '',
                error: 'No markdown content scraped',
                status: 'error'
            });
            
            return false;
        }
    } catch (error) {
        console.error(`Scrape API request failed for article ${url}:`, error);
        throw error;
    }
}

// Remove related articles and trending articles from markdown content
// Also remove boilerplate content before the main content
function cleanupMarkdownContent(markdown) {
    if (!markdown) return '';
    
    // First, remove content before "Skip to Main Content"
    let contentAfterSkip = markdown;
    const skipToMainContentRegex = /\[Skip to Main Content\]|\[Skip to Main Content\]\(.*?\)|Skip to Main Content/i;
    const skipToMainMatch = markdown.match(skipToMainContentRegex);
    
    if (skipToMainMatch) {
        // Find the position of the match, then find the end of that line
        const matchPos = skipToMainMatch.index;
        const endOfLinePos = markdown.indexOf('\n', matchPos);
        
        if (endOfLinePos !== -1) {
            // Only keep content after this line
            contentAfterSkip = markdown.substring(endOfLinePos + 1);
        }
    }
    
    // Now process the remaining content to remove Related/Trending articles
    const lines = contentAfterSkip.split('\n');
    const cleanedLines = [];
    
    let inRelatedArticlesSection = false;
    let inTrendingArticlesSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line starts a section we want to exclude
        if (line.trim().match(/^##?\s*Related\s*Articles/i)) {
            inRelatedArticlesSection = true;
            continue;
        }
        
        if (line.trim().match(/^##?\s*Trending\s*Articles/i)) {
            inTrendingArticlesSection = true;
            continue;
        }
        
        // Check if we're entering a new section which ends the section we're excluding
        if ((inRelatedArticlesSection || inTrendingArticlesSection) && 
            line.trim().match(/^#{1,6}\s+/)) {
            inRelatedArticlesSection = false;
            inTrendingArticlesSection = false;
        }
        
        // Only include the line if we're not in an excluded section
        if (!inRelatedArticlesSection && !inTrendingArticlesSection) {
            cleanedLines.push(line);
        }
    }
    
    return cleanedLines.join('\n');
}

// Parse markdown content to extract metadata (title, category, date)
function parseMarkdownMetadata(markdown, url) {
    const result = {
        title: '',
        category: '',
        publishDate: ''
    };
    
    if (!markdown) return result;
    
    const lines = markdown.split('\n');
    
    // Look for the title (first h1 or h2)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('# ')) {
            result.title = lines[i].trim().replace(/^# /, '');
            break;
        } else if (lines[i].trim().startsWith('## ') && !result.title) {
            result.title = lines[i].trim().replace(/^## /, '');
            break;
        }
    }
    
    // Look for category (usually mentioned with "Category" or in the header)
    const categoryLine = lines.find(line => 
        line.match(/category/i) || 
        line.match(/section/i)
    );
    
    if (categoryLine) {
        const match = categoryLine.match(/:\s*([^,\n]+)/);
        if (match && match[1]) {
            result.category = match[1].trim();
        }
    }
    
    // Look for published date (usually mentioned with "Date" or similar)
    const dateLine = lines.find(line => 
        line.match(/date/i) || 
        line.match(/published/i) ||
        line.match(/created/i)
    );
    
    if (dateLine) {
        // Look for date patterns in the line
        const dateMatch = dateLine.match(/\b(\d{1,2})\s*(\/|-)\s*(\d{1,2})\s*(\/|-)\s*(\d{2,4})\b/) || 
                         dateLine.match(/\b(\w{3,9})\s+(\d{1,2})(,|\s)+(\d{4})\b/);
        
        if (dateMatch) {
            result.publishDate = dateMatch[0].trim();
        }
    }
    
    // Try to get a content preview for display
    let contentLines = lines.filter(line => 
        !line.startsWith('#') && 
        line.trim().length > 0 &&
        !line.match(/^---+$/) && 
        !line.includes('URL Name')
    );
    
    // Set placeholder values if we couldn't find metadata
    if (!result.title) {
        // Try to extract title from the URL
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length > 0) {
                result.title = pathParts[pathParts.length - 1]
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
            }
        } catch (e) {
            result.title = 'Untitled Article';
        }
    }
    
    if (!result.category && contentLines.length > 0) {
        // Try to guess category from content
        for (const line of contentLines) {
            if (line.includes('Category:') || line.includes('Section:')) {
                const match = line.match(/(?:Category|Section):\s*([^,\n]+)/i);
                if (match && match[1]) {
                    result.category = match[1].trim();
                    break;
                }
            }
        }
        
        if (!result.category) {
            result.category = 'General';
        }
    }
    
    return result;
}

// Enhanced extraction of category and publish date from markdown or HTML content
function extractCategoryAndDateFromContent(content, existingCategory = '', existingDate = '') {
    // Initialize with existing values
    let category = existingCategory;
    let publishDate = existingDate;
    
    // Return early if no content
    if (!content) return { category, publishDate };
    
    // Only process if we're missing values
    const needCategory = !category || category === 'General' || category === '-' || category === 'Import' || category === 'End of Day';
    const needDate = !publishDate || publishDate === '-';
    
    if (!needCategory && !needDate) return { category, publishDate };
    
    // Split content by lines for easier processing
    const lines = content.split('\n');
    
    // Only process the first 50 lines to avoid excessive searching
    const linesToProcess = lines.slice(0, 50);
    
    // Date extraction patterns - we do this first since we may use the date location to find categories
    let dateLineIndex = -1;
    let dateMatch = null;
    
    if (needDate) {
        // Match common date formats
        const datePatterns = [
            // Date explicitly labeled
            /published\s+(?:on|date)?:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
            /date:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
            /created:?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
            
            // Different date formats
            /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/,                             // 10/25/2023, 10-25-2023
            /([A-Za-z]+\s+\d{1,2},?\s+\d{4})/,                               // October 25, 2023
            /(\d{1,2}\s+[A-Za-z]+\s+\d{4})/,                                 // 25 October 2023
            /(\d{4}-\d{2}-\d{2})/                                            // 2023-10-25 (ISO format)
        ];
        
        // Try each pattern until we find a match
        for (const pattern of datePatterns) {
            for (let i = 0; i < linesToProcess.length; i++) {
                const line = linesToProcess[i];
                const match = line.match(pattern);
                if (match && match[1]) {
                    publishDate = match[1].trim();
                    dateLineIndex = i;
                    dateMatch = match;
                    break;
                }
            }
            if (publishDate && publishDate !== '-') break;
        }
    }
    
    // Category extraction - with improved logic for finding categories near dates
    if (needCategory) {
        // First look for the word "Knowledge" since it's a common category shown in screenshots
        const knowledgePattern = /\bKnowledge\b/i;
        for (const line of linesToProcess) {
            if (knowledgePattern.test(line)) {
                category = "Knowledge";
                console.log(`Found Knowledge category directly: "${line}"`);
                break;
            }
        }
        
        // If not found yet, look for explicit category/section labels
        if (!category || category === 'General' || category === '-' || category === 'Import' || category === 'End of Day') {
            const categoryPatterns = [
                /category\s*:\s*([^,\n]+)/i,
                /section\s*:\s*([^,\n]+)/i,
                /topic\s*:\s*([^,\n]+)/i,
                /^category\s*[:-]\s*(.+)$/im,
                /^section\s*[:-]\s*(.+)$/im,
                /^in category:?\s*(.+)$/im,
                /^filed under:?\s*(.+)$/im
            ];
            
            // Try each pattern until we find a match
            for (const pattern of categoryPatterns) {
                for (const line of linesToProcess) {
                    const match = line.match(pattern);
                    if (match && match[1]) {
                        // Clean up the category
                        category = match[1].trim();
                        if (category) break;
                    }
                }
                if (category && category !== 'General' && category !== '-' && 
                    category !== 'Import' && category !== 'End of Day') break;
            }
        }
        
        // If we found a date, look for categories near that date
        if (dateLineIndex >= 0 && (!category || category === 'General' || category === '-' || 
                                 category === 'Import' || category === 'End of Day')) {
            const dateLine = linesToProcess[dateLineIndex];
            
            // 1. Check for a category in the same line as the date
            // Look for a category before the date in the same line
            const beforeDateText = dateLine.substring(0, dateMatch.index).trim();
            if (beforeDateText) {
                // Look for a short phrase (1-2 words) that could be a category
                // Remove common non-category phrases
                const beforeDateClean = beforeDateText
                    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '') // Remove non-alphanumeric at start/end
                    .replace(/^(on|by|the|in|at|from|to|with|and|or|for|of)(\s+|$)/i, '') // Remove common prepositions at start
                    .trim();
                
                // If it's a short phrase (1-3 words) and not empty, it might be a category
                if (beforeDateClean && beforeDateClean.split(/\s+/).length <= 3 && beforeDateClean.length > 2) {
                    category = beforeDateClean;
                    console.log(`Found category before date: "${category}" in line: "${dateLine}"`);
                }
            }
            
            // 2. Check the line immediately before the date line
            if ((!category || category === 'General' || category === '-' || 
                 category === 'Import' || category === 'End of Day') && dateLineIndex > 0) {
                const prevLine = linesToProcess[dateLineIndex - 1].trim();
                // If it's a short line (likely just a category or title)
                if (prevLine && prevLine.length < 50 && prevLine.length > 2 && !/^\d+$/.test(prevLine)) {
                    // Extract the last word if it seems like a category (i.e., "Knowledge")
                    const lastWord = prevLine.split(/\s+/).pop();
                    if (lastWord && lastWord.length > 3) { // Ensure it's a substantive word
                        category = lastWord;
                        console.log(`Found category in line before date: "${category}" from line: "${prevLine}"`);
                    } else {
                        // Or use the whole line if it's short enough to be just a category
                        if (prevLine.split(/\s+/).length <= 2) {
                            category = prevLine;
                            console.log(`Found category in line before date (whole line): "${category}"`);
                        }
                    }
                }
            }
        }
        
        // If still no category, check for breadcrumb-like patterns
        if (!category || category === 'General' || category === '-' || 
            category === 'Import' || category === 'End of Day') {
            for (const line of linesToProcess) {
                // Look for breadcrumb patterns with more detailed extraction
                if (/[»>|\/\\]/.test(line) && line.length < 100) {
                    const parts = line.split(/[»>|\/\\]/).map(p => p.trim()).filter(p => p);
                    if (parts.length > 1) {
                        // Prefer the second part (usually the category after Home)
                        // But avoid "Home" as the category
                        for (let i = 1; i < parts.length; i++) {
                            if (parts[i] && !/^home$/i.test(parts[i]) && parts[i].length > 2) {
                                category = parts[i];
                                console.log(`Found category from breadcrumb: "${category}" from line: "${line}"`);
                                break;
                            }
                        }
                    }
                }
                if (category && category !== 'General' && category !== '-' && 
                    category !== 'Import' && category !== 'End of Day') break;
            }
        }
    }
    
    return { category, publishDate };
}

// Add a knowledge base scrape result to the table
function addKbScrapeResult(result) {
    // Try to extract better category and date data if fields are empty or generic
    if (result.status === 'success' && result.markdown) {
        const needsExtraction = 
            !result.category || 
            result.category === 'General' || 
            result.category === '-' ||
            !result.published_date || 
            result.published_date === '-';
            
        if (needsExtraction) {
            console.log(`Performing enhanced metadata extraction for article: ${result.url}`);
            
            // Extract from markdown first (most reliable)
            const enhancedData = extractCategoryAndDateFromContent(
                result.markdown, 
                result.category, 
                result.published_date
            );
            
            // Use the enhanced data only if original fields were empty/default
            if ((!result.category || result.category === 'General' || result.category === '-') && 
                enhancedData.category && enhancedData.category !== 'General' && enhancedData.category !== '-') {
                console.log(`Enhanced extraction found category: "${enhancedData.category}" (was: "${result.category}")`);
                result.category = enhancedData.category;
            }
            
            if ((!result.published_date || result.published_date === '-') && 
                enhancedData.publishDate && enhancedData.publishDate !== '-') {
                console.log(`Enhanced extraction found publish date: "${enhancedData.publishDate}" (was: "${result.published_date}")`);
                result.published_date = enhancedData.publishDate;
            }
        }
    }
    
    // Add to the results array
    kbScrapeResults.push(result);
    
    // Generate unique ID for this result
    const resultId = `kb-scrape-result-${kbScrapeResults.length}`;
    result.id = resultId;
    
    // Add a row to the table
    const row = document.createElement('tr');
    row.setAttribute('data-result-id', resultId);
    
    // URL cell
    const urlCell = document.createElement('td');
    urlCell.textContent = result.url;
    row.appendChild(urlCell);
    
    // Category cell
    const categoryCell = document.createElement('td');
    categoryCell.textContent = result.category || '-';
    row.appendChild(categoryCell);
    
    // Article Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = result.article_name || '-';
    row.appendChild(nameCell);
    
    // Published Date cell
    const dateCell = document.createElement('td');
    dateCell.textContent = result.published_date || '-';
    row.appendChild(dateCell);
    
    // Content Preview cell
    const contentCell = document.createElement('td');
    if (result.status === 'success' && result.markdown) {
        // Create a preview of the content (first 100 characters)
        const contentLines = result.markdown.split('\n').filter(line => 
            !line.startsWith('#') && 
            line.trim().length > 10 &&
            !line.includes('---')
        );
        
        const contentPreview = contentLines.length > 0 
            ? contentLines[0].substring(0, 100) + (contentLines[0].length > 100 ? '...' : '')
            : 'No preview available';
        
        contentCell.textContent = contentPreview;
    } else {
        contentCell.textContent = '-';
    }
    row.appendChild(contentCell);
    
    // Markdown button cell
    const markdownCell = document.createElement('td');
    if (result.status === 'success' && result.markdown) {
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-secondary';
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => showMarkdownModal(result));
        markdownCell.appendChild(viewBtn);
    } else {
        markdownCell.textContent = '-';
    }
    row.appendChild(markdownCell);
    
    // HTML button cell
    const htmlCell = document.createElement('td');
    if (result.status === 'success' && result.markdown) {
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-secondary';
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => showHtmlModal(result));
        htmlCell.appendChild(viewBtn);
    } else {
        htmlCell.textContent = '-';
    }
    row.appendChild(htmlCell);
    
    // Status cell
    const statusCell = document.createElement('td');
    if (result.status === 'success') {
        statusCell.textContent = 'Success';
        statusCell.classList.add('text-success');
    } else {
        statusCell.textContent = 'Error';
        statusCell.classList.add('text-danger');
        statusCell.setAttribute('title', result.error || 'Unknown error');
    }
    row.appendChild(statusCell);
    
    // Add the row to the table
    kbScrapeResultsTableBody.appendChild(row);
}

// Show the markdown modal with the markdown content
function showMarkdownModal(result) {
    // Get the modal elements
    const modal = document.getElementById('kbScrapeMarkdownModal');
    const modalTitle = document.getElementById('kbScrapeMarkdownModalLabel');
    const markdownContent = document.getElementById('markdownContent');
    
    // Set the modal title
    modalTitle.textContent = result.article_name || 'Article Markdown';
    
    // Populate the markdown content
    markdownContent.textContent = result.markdown || 'No markdown content available.';
    
    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Show the HTML modal with the HTML preview
function showHtmlModal(result) {
    // Get the modal elements
    const modal = document.getElementById('kbScrapeHtmlModal');
    const modalTitle = document.getElementById('kbScrapeHtmlModalLabel');
    const htmlPreviewContent = document.getElementById('scrapedHtmlPreviewContent');
    const htmlCodeContent = document.getElementById('scrapedHtmlCodeContent');
    
    // Set the modal title
    modalTitle.textContent = result.article_name || 'Article HTML';
    
    // Convert markdown to HTML using marked.js
    const htmlContent = marked.parse(result.markdown || '');
    
    // Populate the HTML preview
    htmlPreviewContent.innerHTML = htmlContent;
    
    // Populate the HTML code view (escaped)
    htmlCodeContent.textContent = htmlContent;
    
    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Start KB scrape progress tracking
function startKbScrapeProgressTracking(totalArticles) {
    kbScrapeStartTime = Date.now();
    totalScrapesToProcess = totalArticles;
    processedScrapeCount = 0;
    scrapeProcessingTimes = [];
    
    // Reset UI
    kbScrapeGlobalProgressBar.style.width = '0%';
    kbScrapeGlobalProgressPercentage.textContent = '0%';
    kbScrapeGlobalStatusStats.textContent = `Processing 0 of ${totalArticles} articles`;
    kbScrapeElapsedTime.textContent = 'Elapsed: 0s';
    kbScrapeEstimatedTime.textContent = 'Est. remaining: --';
    
    // Start the timer to update elapsed time
    if (kbScrapeProgressTimer) {
        clearInterval(kbScrapeProgressTimer);
    }
    
    kbScrapeProgressTimer = setInterval(() => {
        if (!kbScrapeStartTime) return;
        
        // Update elapsed time
        const elapsed = Date.now() - kbScrapeStartTime;
        kbScrapeElapsedTime.textContent = `Elapsed: ${formatTime(elapsed)}`;
        
        // Calculate estimated remaining time if we have at least one article processed
        if (processedScrapeCount > 0 && scrapeProcessingTimes.length > 0) {
            // Calculate average time per article
            const avgTimePerArticle = scrapeProcessingTimes.reduce((a, b) => a + b, 0) / scrapeProcessingTimes.length;
            
            // Estimate remaining time
            const remainingArticles = totalScrapesToProcess - processedScrapeCount;
            const estimatedRemainingTime = avgTimePerArticle * remainingArticles;
            
            kbScrapeEstimatedTime.textContent = `Est. remaining: ${formatTime(estimatedRemainingTime)}`;
        }
    }, 1000);
}

// Update KB scrape progress when an article is processed
function updateKbScrapeProgress(success = true, processingTime = null) {
    if (!kbScrapeStartTime) return;
    
    processedScrapeCount++;
    
    // Record processing time for this article
    if (processingTime) {
        scrapeProcessingTimes.push(processingTime);
    }
    
    // Calculate and update progress percentage
    const progressPercent = Math.round((processedScrapeCount / totalScrapesToProcess) * 100);
    kbScrapeGlobalProgressBar.style.width = `${progressPercent}%`;
    kbScrapeGlobalProgressPercentage.textContent = `${progressPercent}%`;
    
    // Update status text
    kbScrapeGlobalStatusStats.textContent = `Processing ${processedScrapeCount} of ${totalScrapesToProcess} articles`;
    
    // Check if we're done
    if (processedScrapeCount >= totalScrapesToProcess) {
        finishKbScrapeProgress();
    }
}

// End KB scrape progress tracking
function finishKbScrapeProgress() {
    if (kbScrapeProgressTimer) {
        clearInterval(kbScrapeProgressTimer);
        kbScrapeProgressTimer = null;
    }
    
    // Calculate final stats
    if (kbScrapeStartTime) {
        const totalTime = Date.now() - kbScrapeStartTime;
        kbScrapeElapsedTime.textContent = `Total time: ${formatTime(totalTime)}`;
        kbScrapeEstimatedTime.textContent = `Avg. per article: ${formatTime(totalTime / totalScrapesToProcess)}`;
        
        // Show success percentage
        const successCount = kbScrapeResults.filter(r => r.status === 'success').length;
        const successRate = Math.round((successCount / totalScrapesToProcess) * 100);
        kbScrapeGlobalStatusStats.textContent = `Completed: ${successCount} of ${totalScrapesToProcess} articles (${successRate}% success)`;
    }
    
    kbScrapeStartTime = null;
}

// Download KB scrape results as a CSV file
function downloadKbScrapeResults() {
    if (kbScrapeResults.length === 0) {
        alert('No results to download.');
        return;
    }
    
    // Define CSV headers
    const headers = ['URL', 'Category', 'Article Name', 'Published Date', 'Markdown Content', 'HTML Content', 'Status', 'Error'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add each result as a row
    kbScrapeResults.forEach(result => {
        // Format content as string preserving structure
        let markdownStr = '';
        if (result.markdown) {
            markdownStr = `"${result.markdown.replace(/"/g, '""')}"`;
        }
        
        // Generate HTML content for successful extractions
        let htmlContent = '';
        if (result.status === 'success' && result.markdown) {
            try {
                htmlContent = `"${marked.parse(result.markdown).replace(/"/g, '""')}"`;
            } catch (e) {
                htmlContent = '"Error generating HTML"';
            }
        }
        
        const row = [
            `"${result.url.replace(/"/g, '""')}"`,
            `"${(result.category || '').replace(/"/g, '""')}"`,
            `"${(result.article_name || '').replace(/"/g, '""')}"`,
            `"${(result.published_date || '').replace(/"/g, '""')}"`,
            markdownStr,
            htmlContent,
            result.status === 'success' ? 'Success' : 'Error',
            result.status === 'error' ? `"${(result.error || 'Unknown error').replace(/"/g, '""')}"` : ''
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'knowledge_base_scrape_results.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

// Process knowledge base articles extraction with concurrent processing
async function processKbUrls() {
    // Get URLs from input
    const urlsInput = kbUrlsInput.value.trim();
    
    if (!urlsInput) {
        alert('Please enter article URLs to extract.');
        return;
    }
    
    // Parse URLs (split by commas or newlines)
    const urls = urlsInput.split(/[\n,]+/).map(url => url.trim()).filter(url => url !== '');
    
    if (urls.length === 0) {
        alert('No valid URLs found.');
        return;
    }
    
    // Show the results section
    kbResultsSection.classList.remove('d-none');
    
    // Clear previous results
    kbResultsTableBody.innerHTML = '';
    kbProgressBar.style.width = '0%';
    kbProgressBar.classList.add('progress-bar-animated');
    kbStatus.textContent = 'Preparing knowledge base extraction...';
    kbCurrentProgressPercentage.textContent = '0%';
    
    // Reset global variables
    kbResults = [];
    kbExtractionComplete = false;
    
    // Show loading UI with extraction message
    if (loadingMessage) {
        loadingMessage.textContent = 'Extracting knowledge base articles...';
    }
    loadingOverlay.classList.remove('d-none');
    
    // Start KB progress tracking
    startKbProgressTracking(urls.length);
    
    try {
        // Process URLs with concurrency (5 concurrent jobs)
        const MAX_CONCURRENT_JOBS = 5; // Utilizing all concurrent browser sessions
        kbStatus.textContent = `Processing with ${MAX_CONCURRENT_JOBS} concurrent jobs...`;
        
        // Create a queue of URLs to process
        const urlQueue = [...urls]; // Copy the array
        
        // Create a pool to track active jobs
        const activeJobs = [];
        const processedIndexes = new Set(); // Track which indexes have been processed
        
        // Define function to update status with current active jobs
        // Define this here so it has access to activeJobs via closure
        const updateConcurrentJobsStatus = () => {
            if (activeJobs.length === 0) return;
            
            const activeJobText = activeJobs
                .slice(0, 3) // Show at most 3 jobs to avoid long status text
                .map(job => `#${job.index}`)
                .join(', ');
                
            const additionalJobsText = activeJobs.length > 3 ? ` and ${activeJobs.length - 3} more` : '';
            kbStatus.textContent = `Processing articles ${activeJobText}${additionalJobsText} concurrently (${processedIndexes.size} of ${urls.length} total)`;
        };
        
        // Process the queue concurrently
        while (urlQueue.length > 0 || activeJobs.length > 0) {
            // Fill the active jobs pool up to MAX_CONCURRENT_JOBS
            while (activeJobs.length < MAX_CONCURRENT_JOBS && urlQueue.length > 0) {
                const url = urlQueue.shift(); // Get next URL from queue
                const index = urls.indexOf(url);
                
                if (!processedIndexes.has(index)) {
                    processedIndexes.add(index);
                    
                    // Create a job for this URL
                    const articleStartTime = Date.now();
                    const articleIndex = index + 1; // 1-based index for display
                    
                    // Update one of the currently processing jobs in the status
                    updateConcurrentJobsStatus();
                    
                    // Create a promise for this job
                    const jobPromise = (async () => {
                        try {
                            await processKbArticle(url, articleIndex, urls.length);
                            updateKbProgress(true, Date.now() - articleStartTime);
                            return { url, success: true, time: Date.now() - articleStartTime };
                        } catch (error) {
                            console.error(`Error processing article ${url}:`, error);
                            
                            // Add error result to the table
                            addKbResult({
                                url: url,
                                category: '',
                                article_name: '',
                                published_date: '',
                                content: [],
                                error: error.message,
                                status: 'error'
                            });
                            
                            updateKbProgress(false, Date.now() - articleStartTime);
                            return { url, success: false, error, time: Date.now() - articleStartTime };
                        }
                    })();
                    
                    // Add this job to the active jobs pool
                    activeJobs.push({ 
                        promise: jobPromise, 
                        url, 
                        index: articleIndex,
                        startTime: articleStartTime 
                    });
                }
            }
            
            // If we have active jobs, wait for at least one to complete
            if (activeJobs.length > 0) {
                // Create an array of promises that resolve when jobs complete
                const promises = activeJobs.map(job => job.promise);
                
                // Wait for at least one job to complete
                await Promise.race(promises);
                
                // Remove completed jobs from active pool by checking which promises have resolved
                const stillRunning = [];
                
                // Check each job to see if it's still running
                for (const job of activeJobs) {
                    // Use Promise.race with a zero-timeout to check if the promise is still pending
                    const isResolved = await Promise.race([
                        job.promise.then(() => true, () => true), // Resolved (success or error)
                        new Promise(resolve => setTimeout(() => resolve(false), 0)) // Still pending
                    ]);
                    
                    if (!isResolved) {
                        stillRunning.push(job);
                    }
                }
                
                // Update active jobs to only include those still running
                activeJobs.length = 0;
                activeJobs.push(...stillRunning);
                
                // Update status with current jobs
                updateConcurrentJobsStatus();
            }
        }
        
        // All jobs are complete
        kbExtractionComplete = true;
        kbProgressBar.style.width = '100%';
        kbProgressBar.classList.remove('progress-bar-animated');
        kbStatus.textContent = `Extraction complete. ${kbResults.filter(r => r.status === 'success').length} of ${urls.length} articles processed successfully.`;
        kbCurrentProgressPercentage.textContent = '100%';
        
    } catch (error) {
        console.error('Error in knowledge base processing:', error);
        kbStatus.textContent = `Error: ${error.message}`;
        kbStatus.classList.add('text-danger');
    } finally {
        loadingOverlay.classList.add('d-none');
    }
}

// Process a single knowledge base article
async function processKbArticle(url, currentIndex, totalArticles) {
    try {
        // Update progress for this article
        kbProgressBar.style.width = '10%';
        kbCurrentProgressPercentage.textContent = '10%';
        
        // Prepare the schema for knowledge base article extraction
        const articleSchema = {
            type: "object",
            properties: {
                category: { type: "string" },
                article_name: { type: "string" },
                published_date: { type: "string" },
                content: { 
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: { type: "string" },  // can be "heading", "text", "image"
                            content: { type: "string" },
                            is_bold: { type: "boolean", nullable: true },
                            level: { type: "number", nullable: true }, // for headings
                            image_url: { type: "string", nullable: true }
                        }
                    }
                }
            },
            required: ["category", "article_name", "published_date", "content"]
        };
        
        const prompt = "Extract the following from this knowledge base article (ignore related/trending articles): the article's category/section, title, published date, and all main content. For the content, preserve the structure with headings, text paragraphs (noting if text is bold), and ALL images. IMPORTANT: For images, always extract the actual image URLs from the article - never use placeholder URLs (like example.com/image.png) and never set image fields to null unless there is truly no image in that section. Return all image URLs as absolute URLs (not relative paths). If you find images with relative paths (starting with '/' or '../'), convert them to absolute URLs using the page's base URL/domain. Only include real images that exist in the article content.";
        
        kbStatus.textContent = `Submitting extraction job for article ${currentIndex} of ${totalArticles}...`;
        kbProgressBar.style.width = '20%';
        kbCurrentProgressPercentage.textContent = '20%';
        
        console.log(`Extracting knowledge base article from: ${url}`);
        console.log(`Using schema:`, articleSchema);
        
        // Call the Firecrawl API to extract article data
        const jobSubmissionResponse = await fetch('https://api.firecrawl.dev/v1/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                urls: [url],
                prompt: prompt,
                schema: articleSchema
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
        kbStatus.textContent = `Extracting article ${currentIndex} of ${totalArticles}...`;
        kbProgressBar.style.width = '50%';
        kbCurrentProgressPercentage.textContent = '50%';
        
        // Set up polling with higher limits for complex articles
        const MAX_POLLING_ATTEMPTS = 30;
        const POLLING_INTERVAL_MS = 2500;
        
        let attempts = 0;
        let jobComplete = false;
        let extractionResults = null;
        
        while (!jobComplete && attempts < MAX_POLLING_ATTEMPTS) {
            attempts++;
            console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS} for article ${url}...`);
            
            // Update progress based on polling progress
            const pollingProgress = 50 + (attempts / MAX_POLLING_ATTEMPTS) * 40;
            kbProgressBar.style.width = `${pollingProgress}%`;
            kbCurrentProgressPercentage.textContent = `${Math.round(pollingProgress)}%`;
            
            kbStatus.textContent = `Checking extraction status for article ${currentIndex}... (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`;
            
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
                console.error(`Network error during polling for article ${url}:`, networkError);
                await sleep(POLLING_INTERVAL_MS);
                continue;
            }
            
            // Check if the job is complete
            if (statusResult.status === 'completed') {
                console.log(`Job completed successfully for article ${url}!`);
                jobComplete = true;
                extractionResults = statusResult;
                break;
            } else if (statusResult.status === 'failed') {
                throw new Error('Job failed: ' + (statusResult.error || 'Unknown error'));
            } else {
                console.log(`Job status for article ${url}: ${statusResult.status || 'unknown'}, waiting...`);
                await sleep(POLLING_INTERVAL_MS);
            }
        }
        
        if (!jobComplete) {
            throw new Error(`Job did not complete after ${MAX_POLLING_ATTEMPTS} polling attempts`);
        }
        
        kbStatus.textContent = `Extraction complete for article ${currentIndex}. Processing results...`;
        kbProgressBar.style.width = '90%';
        kbCurrentProgressPercentage.textContent = '90%';
        
        // Get the extracted data
        let articleData;
        
        if (extractionResults && extractionResults.data) {
            articleData = extractionResults.data;
            console.log('Extracted article data:', articleData);
            
            // Check if content is present and non-empty
            if (!articleData.content || !Array.isArray(articleData.content) || articleData.content.length === 0) {
                console.warn(`Empty content returned for article ${url}`);
                
                // Add to results with error
                addKbResult({
                    url: url,
                    category: articleData.category || '',
                    article_name: articleData.article_name || '',
                    published_date: articleData.published_date || '',
                    content: [],
                    error: 'Article was extracted but content is empty',
                    status: 'error'
                });
                
                return false;
            }
            
            // Content exists, validate and fix the image URLs
            let hasPlaceholderImage = false;
            let hasRelativeUrls = false;
            
            // Parse the article URL to get the origin for resolving relative URLs
            let articleOrigin = '';
            try {
                const parsedUrl = new URL(url);
                articleOrigin = parsedUrl.origin; // e.g., https://rainpos.my.site.com
            } catch (e) {
                console.warn(`Could not parse article URL: ${url}`, e);
            }
            
            // Process each content item
            articleData.content = articleData.content.map(item => {
                // Only process items that have image_url property
                if (item.image_url) {
                    // Check for placeholder URLs like example.com
                    if (item.image_url.includes('example.com') || 
                        item.image_url.includes('placeholder') || 
                        item.image_url.includes('dummy.')) {
                        console.warn(`Found placeholder image URL: ${item.image_url}`);
                        hasPlaceholderImage = true;
                        // Remove the placeholder URL entirely (better than keeping a false URL)
                        return {...item, image_url: null};
                    }
                    
                    // Handle relative URLs (starting with / or ../)
                    if (item.image_url.startsWith('/') && articleOrigin) {
                        console.log(`Converting relative URL to absolute: ${item.image_url}`);
                        hasRelativeUrls = true;
                        return {...item, image_url: articleOrigin + item.image_url};
                    }
                    
                    // Handle relative URLs starting with ../ (less common but possible)
                    if (item.image_url.startsWith('../') && articleOrigin) {
                        console.log(`Converting relative URL (../) to absolute: ${item.image_url}`);
                        hasRelativeUrls = true;
                        // This is a simplification - for proper path resolution a more complex algorithm is needed
                        // But for most cases, replacing ../ with the origin will work for Salesforce Knowledge
                        return {...item, image_url: articleOrigin + '/' + item.image_url.substring(3)};
                    }
                }
                return item;
            });
            
            // Log warnings
            if (hasPlaceholderImage) {
                console.warn(`Article ${url} contained placeholder image URLs that were removed.`);
            }
            
            if (hasRelativeUrls) {
                console.log(`Article ${url} contained relative image URLs that were converted to absolute URLs.`);
            }
            
            // Add to results
            addKbResult({
                url: url,
                category: articleData.category || '',
                article_name: articleData.article_name || '',
                published_date: articleData.published_date || '',
                content: articleData.content || [],
                status: 'success'
            });
            
            return true;
        } else {
            console.warn(`No data field in extraction results for article ${url}:`, extractionResults);
            
            // Add to results with error
            addKbResult({
                url: url,
                category: '',
                article_name: '',
                published_date: '',
                content: [],
                error: 'No content extracted',
                status: 'error'
            });
            
            return false;
        }
    } catch (error) {
        console.error(`API request failed for article ${url}:`, error);
        throw error;
    }
}

/**
 * Converts KB content blocks to semantic HTML
 * @param {Array} contentBlocks - Array of content blocks (e.g., headings, text, images, lists)
 * @returns {string} - Semantic HTML representation of the content
 */
function convertKbContentToHtml(contentBlocks) {
    if (!contentBlocks || !Array.isArray(contentBlocks) || contentBlocks.length === 0) {
        return '<p class="text-muted">No content available.</p>';
    }
    
    let html = '';
    
    // Process each content block based on its type
    contentBlocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                // Create a heading with the appropriate level (h1-h6)
                const level = block.level && block.level >= 1 && block.level <= 6 ? block.level : 2;
                html += `<h${level}>${escapeHtml(block.content)}</h${level}>`;
                break;
                
            case 'text':
                // Create a paragraph, with optional bolding
                if (block.is_bold) {
                    html += `<p><strong>${escapeHtml(block.content)}</strong></p>`;
                } else {
                    html += `<p>${escapeHtml(block.content)}</p>`;
                }
                break;
                
            case 'image':
                // Create an image with proper handling for missing URLs
                // First check image_url, then fallback to content field if image_url is null
                const imageUrl = block.image_url || (block.type === 'image' ? block.content : null);
                if (imageUrl) {
                    html += `<img src="${imageUrl}" alt="Article image" />`;
                } else {
                    html += `<div class="missing-image">Image not available</div>`;
                }
                break;
                
            case 'list':
                // Create ordered or unordered lists
                if (block.items && Array.isArray(block.items)) {
                    const listType = block.ordered ? 'ol' : 'ul';
                    html += `<${listType}>`;
                    block.items.forEach(item => {
                        html += `<li>${escapeHtml(item)}</li>`;
                    });
                    html += `</${listType}>`;
                }
                break;
                
            default:
                // Fallback for unknown types
                html += `<p>${escapeHtml(block.content || JSON.stringify(block))}</p>`;
        }
    });
    
    return html;
}

/**
 * Helper function to escape HTML special characters
 * @param {string} text - The text to escape
 * @returns {string} - HTML-escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    
    const element = document.createElement('div');
    element.textContent = text;
    return element.innerHTML;
}

// Add a knowledge base result to the table
function addKbResult(result) {
    // Add to the results array
    kbResults.push(result);
    
    // Generate unique ID for this result
    const resultId = `kb-result-${kbResults.length}`;
    result.id = resultId; // Store the ID with the result
    
    // Add a row to the table
    const row = document.createElement('tr');
    row.setAttribute('data-result-id', resultId);
    
    // URL cell
    const urlCell = document.createElement('td');
    urlCell.textContent = result.url;
    row.appendChild(urlCell);
    
    // Category cell
    const categoryCell = document.createElement('td');
    categoryCell.textContent = result.category || '-';
    row.appendChild(categoryCell);
    
    // Article Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = result.article_name || '-';
    row.appendChild(nameCell);
    
    // Published Date cell
    const dateCell = document.createElement('td');
    dateCell.textContent = result.published_date || '-';
    row.appendChild(dateCell);
    
    // Content Preview cell
    const contentCell = document.createElement('td');
    if (result.status === 'success' && result.content && result.content.length > 0) {
        // Create a preview of the content
        const contentPreview = result.content.slice(0, 3).map(item => {
            if (item.type === 'heading') {
                return `<strong>${item.content}</strong>`;
            } else if (item.type === 'text') {
                return item.is_bold ? `<b>${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}</b>` : 
                    `${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}`;
            } else if (item.type === 'image') {
                return `<em>[Image: ${item.image_url ? item.image_url.substring(0, 30) + '...' : 'no URL'}]</em>`;
            }
            return '';
        }).join('<br>');
        
        // Add the preview and View Full Content button
        contentCell.innerHTML = contentPreview + (result.content.length > 3 ? '<br>...' : '');
        
        // Only add View Content button if we have content
        if (result.content.length > 0) {
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm view-content-btn mt-2';
            viewBtn.textContent = 'View Full Content';
            viewBtn.setAttribute('data-result-id', resultId);
            viewBtn.addEventListener('click', () => showContentModal(result));
            contentCell.appendChild(viewBtn);
        }
    } else {
        contentCell.textContent = '-';
    }
    row.appendChild(contentCell);
    
    // Status cell
    const statusCell = document.createElement('td');
    if (result.status === 'success') {
        statusCell.textContent = 'Success';
        statusCell.classList.add('text-success');
    } else {
        statusCell.textContent = 'Error';
        statusCell.classList.add('text-danger');
        statusCell.setAttribute('title', result.error || 'Unknown error');
    }
    row.appendChild(statusCell);
    
    // Add the row to the table
    kbResultsTableBody.appendChild(row);
}

/**
 * Shows the content modal with HTML preview, HTML code, and JSON
 * @param {Object} result - The KB result object containing content
 */
function showContentModal(result) {
    // Get the modal elements
    const modal = document.getElementById('kbContentModal');
    const modalTitle = document.getElementById('kbContentModalLabel');
    const htmlPreviewContent = document.getElementById('htmlPreviewContent');
    const htmlCodeContent = document.getElementById('htmlCodeContent');
    const jsonContent = document.getElementById('jsonContent');
    
    // Set the modal title
    modalTitle.textContent = result.article_name || 'Article Content';
    
    // Generate the HTML content
    const htmlContent = convertKbContentToHtml(result.content);
    
    // Populate the HTML preview
    htmlPreviewContent.innerHTML = htmlContent;
    
    // Populate the HTML code view (escaped)
    htmlCodeContent.textContent = htmlContent;
    
    // Populate the JSON view (pretty-printed)
    jsonContent.textContent = JSON.stringify(result.content, null, 2);
    
    // Set up the copy buttons
    document.getElementById('copyHtmlButton').onclick = () => {
        copyToClipboard(htmlContent, 'HTML copied to clipboard!');
    };
    
    document.getElementById('copyJsonButton').onclick = () => {
        copyToClipboard(JSON.stringify(result.content, null, 2), 'JSON copied to clipboard!');
    };
    
    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Copies content to clipboard and shows a temporary success message
 * @param {string} content - The content to copy
 * @param {string} successMessage - The success message to display
 */
function copyToClipboard(content, successMessage) {
    // Copy to clipboard
    navigator.clipboard.writeText(content)
        .then(() => {
            // Show success message
            const button = event.target;
            const originalText = button.textContent;
            
            // Change button text to success message
            button.textContent = successMessage;
            button.classList.add('btn-success');
            button.classList.remove('btn-primary');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
}

// Start knowledge base progress tracking
function startKbProgressTracking(totalArticles) {
    kbExtractionStartTime = Date.now();
    totalArticlesToProcess = totalArticles;
    processedArticleCount = 0;
    articleProcessingTimes = [];
    
    // Reset UI
    kbGlobalProgressBar.style.width = '0%';
    kbGlobalProgressPercentage.textContent = '0%';
    kbGlobalStatusStats.textContent = `Processing 0 of ${totalArticles} articles`;
    kbElapsedTime.textContent = 'Elapsed: 0s';
    kbEstimatedTime.textContent = 'Est. remaining: --';
    
    // Start the timer to update elapsed time
    if (kbProgressTimer) {
        clearInterval(kbProgressTimer);
    }
    
    kbProgressTimer = setInterval(() => {
        if (!kbExtractionStartTime) return;
        
        // Update elapsed time
        const elapsed = Date.now() - kbExtractionStartTime;
        kbElapsedTime.textContent = `Elapsed: ${formatTime(elapsed)}`;
        
        // Calculate estimated remaining time if we have at least one article processed
        if (processedArticleCount > 0 && articleProcessingTimes.length > 0) {
            // Calculate average time per article
            const avgTimePerArticle = articleProcessingTimes.reduce((a, b) => a + b, 0) / articleProcessingTimes.length;
            
            // Estimate remaining time
            const remainingArticles = totalArticlesToProcess - processedArticleCount;
            const estimatedRemainingTime = avgTimePerArticle * remainingArticles;
            
            kbEstimatedTime.textContent = `Est. remaining: ${formatTime(estimatedRemainingTime)}`;
        }
    }, 1000);
}

// Update KB progress when an article is processed
function updateKbProgress(success = true, processingTime = null) {
    if (!kbExtractionStartTime) return;
    
    processedArticleCount++;
    
    // Record processing time for this article
    if (processingTime) {
        articleProcessingTimes.push(processingTime);
    }
    
    // Calculate and update progress percentage
    const progressPercent = Math.round((processedArticleCount / totalArticlesToProcess) * 100);
    kbGlobalProgressBar.style.width = `${progressPercent}%`;
    kbGlobalProgressPercentage.textContent = `${progressPercent}%`;
    
    // Update status text
    kbGlobalStatusStats.textContent = `Processing ${processedArticleCount} of ${totalArticlesToProcess} articles`;
    
    // Check if we're done
    if (processedArticleCount >= totalArticlesToProcess) {
        finishKbProgress();
    }
}

// End KB progress tracking
function finishKbProgress() {
    if (kbProgressTimer) {
        clearInterval(kbProgressTimer);
        kbProgressTimer = null;
    }
    
    // Calculate final stats
    if (kbExtractionStartTime) {
        const totalTime = Date.now() - kbExtractionStartTime;
        kbElapsedTime.textContent = `Total time: ${formatTime(totalTime)}`;
        kbEstimatedTime.textContent = `Avg. per article: ${formatTime(totalTime / totalArticlesToProcess)}`;
        
        // Show success percentage
        const successCount = kbResults.filter(r => r.status === 'success').length;
        const successRate = Math.round((successCount / totalArticlesToProcess) * 100);
        kbGlobalStatusStats.textContent = `Completed: ${successCount} of ${totalArticlesToProcess} articles (${successRate}% success)`;
    }
    
    kbExtractionStartTime = null;
}

// Download KB results as a CSV file
function downloadKbResults() {
    if (kbResults.length === 0) {
        alert('No results to download.');
        return;
    }
    
    // Define CSV headers
    const headers = ['URL', 'Category', 'Article Name', 'Published Date', 'Content', 'HTML Content', 'Status', 'Error'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add each result as a row
    kbResults.forEach(result => {
        // Format content as JSON string to preserve structure
        let contentStr = '';
        if (result.content && result.content.length > 0) {
            try {
                contentStr = JSON.stringify(result.content).replace(/"/g, '""');
            } catch (e) {
                contentStr = 'Error serializing content';
            }
        }
        
        // Generate HTML content for successful extractions
        let htmlContent = '';
        if (result.status === 'success' && result.content && result.content.length > 0) {
            try {
                htmlContent = convertKbContentToHtml(result.content).replace(/"/g, '""');
            } catch (e) {
                htmlContent = 'Error generating HTML';
            }
        }
        
        const row = [
            `"${result.url.replace(/"/g, '""')}"`,
            `"${(result.category || '').replace(/"/g, '""')}"`,
            `"${(result.article_name || '').replace(/"/g, '""')}"`,
            `"${(result.published_date || '').replace(/"/g, '""')}"`,
            `"${contentStr}"`,
            `"${htmlContent}"`,
            result.status === 'success' ? 'Success' : 'Error',
            result.status === 'error' ? `"${(result.error || 'Unknown error').replace(/"/g, '""')}"` : ''
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'knowledge_base_extraction.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
