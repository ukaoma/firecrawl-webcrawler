#!/bin/bash
# Enhanced script to diagnose the "Loading"/"CSS Error" issues
# This tool shows WHY direct fetches fail but Firecrawl /scrape works for JavaScript-heavy sites

# Check if a URL is provided
if [ -z "$1" ]; then
  echo "Please provide a URL to debug."
  echo "Usage: ./run_debug.sh <url>"
  exit 1
fi

URL="$1"

# Create necessary directories
mkdir -p logs
mkdir -p debug_output

# Print informative header
echo "==========================================================="
echo "  FIRECRAWL DEEP DIAGNOSTIC TOOL"
echo "  Analyzing Dynamic Content Loading Issues"
echo "==========================================================="
echo ""
echo "This tool will:"
echo "1. Attempt direct access to show why normal HTTP fetches fail"
echo "2. Use Firecrawl's /scrape endpoint to properly load dynamic content"
echo "3. Compare the results to demonstrate why /scrape is required"
echo ""
echo "Starting debug analysis for: $URL"
echo "Results will be saved to ./debug_output/"
echo "==========================================================="

# Run the debugger with logging
node debug_page_loading.js "$URL" 2>&1 | tee "logs/debug_run_$(date +"%Y%m%d_%H%M%S").log"

echo ""
echo "Debug process completed. See ./debug_output/ for detailed results."
echo "Log file saved to logs/ directory."
echo ""
echo "==========================================================="
echo "  RECOMMENDATION"
echo "==========================================================="
echo "For JavaScript-heavy sites like Salesforce Knowledge:"
echo "- NEVER use direct fetch or extract endpoint (results in 'Loading' state)"
