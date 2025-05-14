/**
 * Integration of enhanced website map functionality into the web UI
 * This file connects the UI to the enhanced_website_map.js module
 */

// Initialize once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Elements from the existing UI
    const websiteUrlInput = document.getElementById('websiteUrlInput');
    const mapButton = document.getElementById('mapButton');
    const mapResultsSection = document.getElementById('mapResultsSection');
    const urlCount = document.getElementById('urlCount');
    const downloadUrlsButton = document.getElementById('downloadUrlsButton');
    const mapProgressBar = document.getElementById('mapProgressBar');
    const mapStatus = document.getElementById('mapStatus');
    const mapResults = document.getElementById('mapResults');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = loadingOverlay ? loadingOverlay.querySelector('p') : null;

    // Add new UI elements for enhanced mapping options
    addEnhancedMappingOptions();

    // Override the existing map button click handler
    if (mapButton) {
        // Store the original handler to fall back to if needed
        const originalMapHandler = mapButton.onclick;
        
        // Replace with our enhanced handler
        mapButton.onclick = (event) => {
            event.preventDefault();
            
            // Check if enhanced mode is enabled
            const useEnhancedMode = document.getElementById('useEnhancedMode')?.checked || false;
            
            if (useEnhancedMode) {
                processEnhancedWebsiteMap();
            } else {
                // Fall back to original handler
                if (typeof originalMapHandler === 'function') {
                    originalMapHandler.call(mapButton, event);
                } else if (typeof processWebsiteMap === 'function') {
                    processWebsiteMap();
                }
            }
        };
    }

    /**
     * Add UI elements for enhanced mapping options
     */
    function addEnhancedMappingOptions() {
        // Find the appropriate container
        const mapContainer = document.querySelector('#map-tab .card-body');
        if (!mapContainer) return;

        // Create options UI
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'mb-3 border-top pt-3 mt-3';
        optionsDiv.innerHTML = `
            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="useEnhancedMode" checked>
                <label class="form-check-label" for="useEnhancedMode">
                    Use enhanced async crawling (recommended for large sites)
                </label>
            </div>
            <div id="enhancedOptions" class="border-start ps-3 mb-3">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="useWebSocket" checked>
                            <label class="form-check-label" for="useWebSocket">
                                Use WebSocket for real-time updates
                            </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="allowBackwardLinks">
                            <label class="form-check-label" for="allowBackwardLinks">
                                Allow backward links (crawl entire site)
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row g-3 mt-1">
                    <div class="col-md-6">
                        <label for="urlLimit" class="form-label">URL Limit (0 = no limit)</label>
                        <input type="number" class="form-control" id="urlLimit" min="0" value="100">
                    </div>
                    <div class="col-md-6">
                        <label for="allowedDomains" class="form-label">Allowed Domains (comma separated)</label>
                        <input type="text" class="form-control" id="allowedDomains" placeholder="Leave empty to use base domain">
                    </div>
                </div>
            </div>
        `;

        // Insert before the map button
        const buttonContainer = document.querySelector('#map-tab button');
        if (buttonContainer && buttonContainer.parentNode) {
            buttonContainer.parentNode.insertBefore(optionsDiv, buttonContainer);
        } else {
            mapContainer.appendChild(optionsDiv);
        }

        // Add toggle behavior
        const useEnhancedMode = document.getElementById('useEnhancedMode');
        const enhancedOptions = document.getElementById('enhancedOptions');
        
        if (useEnhancedMode && enhancedOptions) {
            useEnhancedMode.addEventListener('change', (event) => {
                enhancedOptions.style.display = event.target.checked ? 'block' : 'none';
            });
        }
    }

    /**
     * Process website mapping using the enhanced async crawl
     */
    async function processEnhancedWebsiteMap() {
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
        mapStatus.textContent = 'Starting enhanced website mapping...';
        mapProgressBar.style.width = '5%';
        mapProgressBar.classList.add('progress-bar-animated');
        urlCount.textContent = '0';
        
        // Show loading UI with website mapping message
        if (loadingMessage) {
            loadingMessage.textContent = 'Mapping website URLs using enhanced async crawling...';
        }
        loadingOverlay.classList.remove('d-none');
        
        try {
            // Get options
            const options = {
                useWebSocket: document.getElementById('useWebSocket')?.checked || false,
                allowBackwardLinks: document.getElementById('allowBackwardLinks')?.checked || false,
                limit: parseInt(document.getElementById('urlLimit')?.value || '0', 10) || 0
            };
            
            // Get allowed domains
            const allowedDomainsInput = document.getElementById('allowedDomains')?.value || '';
            if (allowedDomainsInput.trim()) {
                options.allowedDomains = allowedDomainsInput.split(',').map(d => d.trim()).filter(Boolean);
            }
            
            // If limit is 0, set to undefined (no limit)
            if (options.limit === 0) {
                options.limit = undefined;
            }
            
            // Create progress callback
            const progressCallback = (progressData) => {
                // Update progress bar
                if (progressData.progress !== undefined) {
                    mapProgressBar.style.width = `${progressData.progress}%`;
                }
                
                // Update status message
                if (progressData.message) {
                    mapStatus.textContent = progressData.message;
                    console.log(progressData.phase, progressData.message);
                }
                
                // Update URL count if available
                if (progressData.urlCount !== undefined) {
                    urlCount.textContent = progressData.urlCount.toString();
                }
                
                // Handle errors
                if (progressData.phase === 'error') {
                    mapStatus.classList.add('text-danger');
                    mapProgressBar.classList.remove('progress-bar-animated');
                    console.error('Mapping error:', progressData.error);
                }
            };
            
            // Call the enhanced website map function
            const rankedUrls = await window.enhancedWebsiteMap.mapWebsiteAsync(url, options, progressCallback);
            
            // Display the results
            if (rankedUrls && rankedUrls.length > 0) {
                // Format the URLs nicely, one per line
                const formattedUrls = rankedUrls.join('\n');
                mapResults.textContent = formattedUrls;
                
                // Complete the progress bar
                mapProgressBar.style.width = '100%';
                mapProgressBar.classList.remove('progress-bar-animated');
                mapStatus.textContent = `Mapping complete. Found ${rankedUrls.length} URLs, ranked by importance.`;
                urlCount.textContent = rankedUrls.length.toString();
            } else {
                mapProgressBar.style.width = '100%';
                mapProgressBar.classList.remove('progress-bar-animated');
                mapStatus.textContent = 'No URLs found. The website may not have any links or may be blocking crawlers.';
                mapResults.textContent = 'No URLs found.';
                urlCount.textContent = '0';
            }
        } catch (error) {
            console.error('Error in enhanced website mapping:', error);
            mapStatus.textContent = `Error: ${error.message}`;
            mapStatus.classList.add('text-danger');
            mapProgressBar.style.width = '100%';
            mapProgressBar.classList.remove('progress-bar-animated');
        } finally {
            loadingOverlay.classList.add('d-none');
        }
    }

    // Ensure the original downloadMapResults function still works
    if (typeof downloadUrlsButton !== 'undefined' && !downloadUrlsButton.onclick) {
        downloadUrlsButton.addEventListener('click', () => {
            if (!mapResults || !mapResults.textContent) {
                alert('No URLs to download.');
                return;
            }
            
            // Get the URLs from the text area
            const urls = mapResults.textContent.split('\n').filter(url => url.trim() !== '');
            
            // Create CSV content
            let csvContent = 'URL\n' + urls.map(url => `"${url.replace(/"/g, '""')}"`).join('\n');
            
            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'website_urls.csv');
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
