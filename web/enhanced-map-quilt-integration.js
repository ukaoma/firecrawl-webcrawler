/**
 * Integration of enhanced website map functionality into the Quilt UI
 * This file connects the Quilt UI to the enhanced_website_map.js module
 */

console.log("Enhanced map Quilt integration loading...");

// Initialize on page load to ensure all elements are available
window.addEventListener('load', () => {
    console.log("Enhanced map integration: window.load event fired");
    // Elements from the existing Quilt UI
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
     * Add UI elements for enhanced mapping options with Quilt styling
     */
    function addEnhancedMappingOptions() {
        console.log("Adding enhanced mapping options to Quilt UI");
        
        // Select the map tab pane
        const mapTabPane = document.querySelector('#map');
        
        if (!mapTabPane) {
            console.error("Could not find #map tab pane element");
            return;
        }
        
        console.log("Found map tab pane:", mapTabPane);

        // Create options UI with Quilt styling
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'mb-4 mt-3 alert alert-primary';
        optionsDiv.innerHTML = `
            <h5 class="mb-3">Enhanced Website Mapping</h5>
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
                
                <!-- New data source options -->
                <div class="row g-3 mt-1">
                    <div class="col-md-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="fetchSitemap" checked>
                            <label class="form-check-label" for="fetchSitemap">
                                Check sitemap.xml
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="fetchRobotsTxt" checked>
                            <label class="form-check-label" for="fetchRobotsTxt">
                                Check robots.txt
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="jsRendering">
                            <label class="form-check-label" for="jsRendering">
                                Enable JS rendering
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
                        <label for="maxDepth" class="form-label">Max Crawl Depth (0 = no limit)</label>
                        <input type="number" class="form-control" id="maxDepth" min="0" value="3">
                    </div>
                </div>
                
                <div class="row g-3 mt-1">
                    <div class="col-md-6">
                        <label for="allowedDomains" class="form-label">Allowed Domains (comma separated)</label>
                        <input type="text" class="form-control" id="allowedDomains" placeholder="Leave empty to use base domain">
                    </div>
                    <div class="col-md-6">
                        <label for="crawlDelay" class="form-label">Crawl Delay (ms, 0 = auto)</label>
                        <input type="number" class="form-control" id="crawlDelay" min="0" value="0">
                    </div>
                </div>
                
                <div id="diagnosticsSection" class="mt-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="showDiagnostics">
                        <label class="form-check-label" for="showDiagnostics">
                            Show detailed diagnostics
                        </label>
                    </div>
                </div>
            </div>
        `;

        // Insert at the beginning of the map tab content
        if (mapTabPane.firstChild) {
            mapTabPane.insertBefore(optionsDiv, mapTabPane.firstChild);
        } else {
            mapTabPane.appendChild(optionsDiv);
        }
        
        console.log("Enhanced mapping options added to Quilt UI");

        // Add toggle behavior
        const useEnhancedMode = document.getElementById('useEnhancedMode');
        const enhancedOptions = document.getElementById('enhancedOptions');
        
        if (useEnhancedMode && enhancedOptions) {
            useEnhancedMode.addEventListener('change', (event) => {
                enhancedOptions.style.display = event.target.checked ? 'block' : 'none';
            });
        }

        // Create diagnostics container
        const diagnosticsContainer = document.createElement('div');
        diagnosticsContainer.id = 'mapDiagnosticsContainer';
        diagnosticsContainer.className = 'd-none mt-4 p-3 border rounded bg-light';
        diagnosticsContainer.innerHTML = `
            <h6 class="mb-3">Mapping Diagnostics</h6>
            <div class="row g-3">
                <div class="col-md-6">
                    <h6>URLs by Source</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Crawl: <span id="diagCrawlCount">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Map API: <span id="diagMapCount">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Sitemap: <span id="diagSitemapCount">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Homepage: <span id="diagHomepageCount">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Robots.txt: <span id="diagRobotsTxtCount">0</span>
                        </li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Performance</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Total URLs: <span id="diagTotalUrls">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Skipped URLs: <span id="diagSkippedUrls">0</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                            Execution Time: <span id="diagExecutionTime">0s</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-3">
                <h6>Issues & Warnings</h6>
                <div id="diagIssuesContainer" class="small">
                    <div class="alert alert-success">No issues detected</div>
                </div>
            </div>
        `;

        // Append diagnostics container after map results
        if (mapResultsSection) {
            mapResultsSection.appendChild(diagnosticsContainer);
        }

        // Show/hide diagnostics based on checkbox
        const showDiagnostics = document.getElementById('showDiagnostics');
        if (showDiagnostics) {
            showDiagnostics.addEventListener('change', (event) => {
                const diagContainer = document.getElementById('mapDiagnosticsContainer');
                if (diagContainer) {
                    diagContainer.classList.toggle('d-none', !event.target.checked);
                }
            });
        }
    }

    /**
     * Add global progress tracking UI
     */
    function addGlobalProgressTracking() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'position-fixed bottom-0 start-0 end-0 p-3 bg-light border-top d-none';
        progressContainer.id = 'mapGlobalProgressContainer';
        progressContainer.innerHTML = `
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-9">
                        <div class="progress" style="height: 20px;">
                            <div id="mapGlobalProgressBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%"></div>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <div id="mapGlobalStatusStats">Processing 0 URLs</div>
                            <div id="mapGlobalProgressPercentage">0%</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div id="mapElapsedTime">Elapsed: 0s</div>
                        <div id="mapEstimatedTime">Est. remaining: --</div>
                        <div class="fs-6 text-muted">Current phase: <span id="mapCurrentProgress">--</span></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(progressContainer);
    }

    // Ensure global progress UI is added
    if (!document.getElementById('mapGlobalProgressContainer')) {
        addGlobalProgressTracking();
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
        
        // Show global progress container
        const globalProgressContainer = document.getElementById('mapGlobalProgressContainer');
        if (globalProgressContainer) {
            globalProgressContainer.classList.remove('d-none');
        }
        
        try {
            // Get options
            const options = {
                useWebSocket: document.getElementById('useWebSocket')?.checked || false,
                allowBackwardLinks: document.getElementById('allowBackwardLinks')?.checked || false,
                fetchSitemap: document.getElementById('fetchSitemap')?.checked ?? true,
                fetchRobotsTxt: document.getElementById('fetchRobotsTxt')?.checked ?? true,
                jsRendering: document.getElementById('jsRendering')?.checked || false,
                limit: parseInt(document.getElementById('urlLimit')?.value || '0', 10) || undefined,
                maxDepth: parseInt(document.getElementById('maxDepth')?.value || '0', 10) || undefined,
                crawlDelay: parseInt(document.getElementById('crawlDelay')?.value || '0', 10) || undefined
            };
            
            // Get allowed domains
            const allowedDomainsInput = document.getElementById('allowedDomains')?.value || '';
            if (allowedDomainsInput.trim()) {
                options.allowedDomains = allowedDomainsInput.split(',').map(d => d.trim()).filter(Boolean);
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
                
                // Update global progress UI
                updateGlobalProgress(progressData);
                
                // Update diagnostics if available
                if (progressData.diagnostics) {
                    updateDiagnostics(progressData.diagnostics);
                }
                
                // Handle errors
                if (progressData.phase === 'error') {
                    mapStatus.classList.add('text-danger');
                    mapProgressBar.classList.remove('progress-bar-animated');
                    console.error('Mapping error:', progressData.error);
                }
            };
            
            // Call the enhanced website map function
            const result = await window.enhancedWebsiteMap.mapWebsiteAsync(url, options, progressCallback);
            const rankedUrls = result.urls;
            
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
                
                // Final diagnostics update
                updateDiagnostics(result.diagnostics);
                
                // Show diagnostics if there are warnings or issues
                const hasDiagnosticInfo = result.diagnostics && 
                    (result.diagnostics.issues.length > 0 || result.diagnostics.warnings.length > 0);
                
                if (hasDiagnosticInfo) {
                    const showDiagnosticsCheckbox = document.getElementById('showDiagnostics');
                    if (showDiagnosticsCheckbox) {
                        showDiagnosticsCheckbox.checked = true;
                        const diagContainer = document.getElementById('mapDiagnosticsContainer');
                        if (diagContainer) {
                            diagContainer.classList.remove('d-none');
                        }
                    }
                }
                
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
            
            // Hide global progress container after a delay
            setTimeout(() => {
                const globalProgressContainer = document.getElementById('mapGlobalProgressContainer');
                if (globalProgressContainer) {
                    globalProgressContainer.classList.add('d-none');
                }
            }, 3000);
        }
    }

    /**
     * Update global progress UI based on progress data
     */
    function updateGlobalProgress(progressData) {
        const globalProgressBar = document.getElementById('mapGlobalProgressBar');
        const globalProgressPercentage = document.getElementById('mapGlobalProgressPercentage');
        const globalStatusStats = document.getElementById('mapGlobalStatusStats');
        const elapsedTime = document.getElementById('mapElapsedTime');
        const estimatedTime = document.getElementById('mapEstimatedTime');
        const currentProgress = document.getElementById('mapCurrentProgress');
        
        if (!globalProgressBar || !globalProgressPercentage || !globalStatusStats) return;
        
        // Update progress percentage
        if (progressData.progress !== undefined) {
            globalProgressBar.style.width = `${progressData.progress}%`;
            globalProgressPercentage.textContent = `${Math.round(progressData.progress)}%`;
        }
        
        // Update status text
        if (progressData.message) {
            globalStatusStats.textContent = progressData.message;
        }
        
        // Update URL count if available
        if (progressData.urlCount !== undefined) {
            globalStatusStats.textContent = `Discovered ${progressData.urlCount} URLs`;
        }
        
        // Update phase status
        if (progressData.phase) {
            const phaseMapping = {
                'starting': 'Starting crawl...',
                'crawling': 'Initializing crawler...',
                'discovering': 'Discovering URLs...',
                'websocket_connected': 'Connected via WebSocket',
                'crawl_complete': 'Crawl complete',
                'analyzing': 'Analyzing results...',
                'mapping': 'Fetching from map endpoint...',
                'sitemap': 'Checking sitemap.xml...',
                'robots': 'Checking robots.txt...',
                'combining': 'Combining URL sources...',
                'ranking': 'Ranking URLs...',
                'complete': 'Mapping complete!'
            };
            
            if (phaseMapping[progressData.phase]) {
                if (currentProgress) {
                    currentProgress.textContent = phaseMapping[progressData.phase];
                }
            }
        }
        
        // Update time stats if diagnostics available
        if (progressData.diagnostics && progressData.diagnostics.startTime) {
            const elapsedMs = Date.now() - progressData.diagnostics.startTime;
            const elapsedSec = Math.round(elapsedMs / 1000);
            
            if (elapsedTime) {
                elapsedTime.textContent = `Elapsed: ${formatTime(elapsedSec)}`;
            }
            
            // Calculate estimated time remaining based on progress
            if (progressData.progress && progressData.progress > 0 && progressData.progress < 100) {
                const remainingSec = Math.round((elapsedMs / progressData.progress) * (100 - progressData.progress) / 1000);
                
                if (estimatedTime) {
                    estimatedTime.textContent = `Est. remaining: ${formatTime(remainingSec)}`;
                }
            }
        }
    }
    
    /**
     * Format time in seconds to a human-readable string
     */
    function formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            return `${min}m ${sec}s`;
        } else {
            const hr = Math.floor(seconds / 3600);
            const min = Math.floor((seconds % 3600) / 60);
            return `${hr}h ${min}m`;
        }
    }
    
    /**
     * Update diagnostics UI with data from the mapper
     */
    function updateDiagnostics(diagnostics) {
        if (!diagnostics) return;
        
        // Update URL source counts
        if (diagnostics.urlsBySource) {
            const sources = diagnostics.urlsBySource;
            
            document.getElementById('diagCrawlCount')?.textContent = sources.crawl || '0';
            document.getElementById('diagMapCount')?.textContent = sources.map || '0';
            document.getElementById('diagSitemapCount')?.textContent = sources.sitemap || '0';
            document.getElementById('diagHomepageCount')?.textContent = sources.homepage || '0';
            document.getElementById('diagRobotsTxtCount')?.textContent = sources.robotsTxt || '0';
        }
        
        // Update performance counts
        document.getElementById('diagTotalUrls')?.textContent = diagnostics.urlsDiscovered || '0';
        document.getElementById('diagSkippedUrls')?.textContent = diagnostics.urlsSkipped || '0';
        
        // Update execution time
        if (diagnostics.endTime && diagnostics.startTime) {
            const executionTimeMs = diagnostics.endTime - diagnostics.startTime;
            const executionTimeSec = Math.round(executionTimeMs / 1000);
            document.getElementById('diagExecutionTime')?.textContent = formatTime(executionTimeSec);
        }
        
        // Update issues and warnings
        const issuesContainer = document.getElementById('diagIssuesContainer');
        if (issuesContainer) {
            // Clear container
            issuesContainer.innerHTML = '';
            
            const hasIssues = diagnostics.issues && diagnostics.issues.length > 0;
            const hasWarnings = diagnostics.warnings && diagnostics.warnings.length > 0;
            
            // Add issues
            if (hasIssues) {
                diagnostics.issues.forEach(issue => {
                    const issueEl = document.createElement('div');
                    issueEl.className = 'alert alert-danger mb-2 py-2';
                    issueEl.innerHTML = `
                        <strong>Issue (${issue.source}):</strong> ${issue.error}
                    `;
                    issuesContainer.appendChild(issueEl);
                });
            }
            
            // Add warnings
            if (hasWarnings) {
                diagnostics.warnings.forEach(warning => {
                    const warningEl = document.createElement('div');
                    warningEl.className = 'alert alert-warning mb-2 py-2';
                    warningEl.innerHTML = `
                        <strong>Warning (${warning.type}):</strong> ${warning.message}
                    `;
                    issuesContainer.appendChild(warningEl);
                });
            }
            
            // Add robots.txt disallowed paths if available
            if (diagnostics.robotsTxtDisallowed && diagnostics.robotsTxtDisallowed.length > 0) {
                const disallowedEl = document.createElement('div');
                disallowedEl.className = 'alert alert-info mb-2 py-2';
                disallowedEl.innerHTML = `
                    <strong>Robots.txt Disallow:</strong> 
                    <span class="text-muted">${diagnostics.robotsTxtDisallowed.slice(0, 5).join(', ')}${diagnostics.robotsTxtDisallowed.length > 5 ? '...' : ''}</span>
                `;
                issuesContainer.appendChild(disallowedEl);
            }
            
            // Add success message if no issues/warnings
            if (!hasIssues && !hasWarnings) {
                const successEl = document.createElement('div');
                successEl.className = 'alert alert-success';
                successEl.textContent = 'No issues detected';
                issuesContainer.appendChild(successEl);
            }
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
