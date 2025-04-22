#!/bin/bash
# Helper script to run the image extraction test and demonstrate the solution

# Print header
echo "==============================================="
echo "Servlet Image Extraction Solution - Test Runner"
echo "==============================================="
echo

# Run the sample extract script with action sequence
echo "1. Running sample extraction with action sequence..."
node sample_extract.js
echo "Sample extraction complete."
echo

# Run the test script that compares with/without actions
echo "2. Running comparative test (with vs without action sequence)..."
echo "This will show the improvement in image extraction consistency."
node test_image_extraction.js
echo

# Provide next steps
echo "==============================================="
echo "Next Steps:"
echo "- Check image_extraction_test_results.json for detailed comparison"
echo "- Review the sample_result.json for sample extraction results"
echo "- See IMAGE_EXTRACTION_DOCS.md for full documentation"
echo
echo "To run a full extraction with the improved implementation:"
echo "  node firecrawl_extractor.js"
echo "  or"
echo "  node zip_extractor_robust.js"
echo "==============================================="
