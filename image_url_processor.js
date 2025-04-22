/**
 * Utility functions for processing image URLs in extracted HTML content
 * Ensures images from rainpos.my.site.com use the /servlet/rtaImage format
 */

/**
 * Processes HTML content to ensure all rainpos.my.site.com images use the /servlet/rtaImage format
 * Images that don't use this format are removed or potentially replaced with servlet equivalents
 * 
 * @param {string} htmlContent - The HTML content containing image tags
 * @returns {string} - The processed HTML with only public image URLs
 */
function processHtmlImages(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return htmlContent;
  }

  // Collect all servlet URLs in the page first - they might be in script tags, links, or elsewhere
  const servletUrls = [];
  const servletUrlRegex = /https?:\/\/rainpos\.my\.site\.com\/servlet\/rtaImage\?[^"'\s)]+/gi;
  let servletMatch;
  while ((servletMatch = servletUrlRegex.exec(htmlContent)) !== null) {
    servletUrls.push(servletMatch[0]);
  }

  console.log(`Found ${servletUrls.length} servlet image URLs in content`);
  
  // Regular expression to find image tags
  const imgTagRegex = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  
  // Create a map of direct image filenames to servlet URLs (if possible)
  const imageNameToServletUrl = {};
  
  // First pass: build potential mappings
  const processedHtml = htmlContent.replace(imgTagRegex, (match, srcUrl) => {
    if (srcUrl.includes('rainpos.my.site.com') && srcUrl.includes('/images/')) {
      // Extract the filename from the direct URL
      const filename = srcUrl.split('/').pop();
      // Look for a potential match in servlet URLs (very basic heuristic)
      for (const servletUrl of servletUrls) {
        if (servletUrl.includes(filename.split('.')[0])) {
          imageNameToServletUrl[srcUrl] = servletUrl;
          console.log(`Potential mapping found: ${srcUrl} -> ${servletUrl}`);
          break;
        }
      }
    }
    return match; // Don't modify the HTML in this pass
  });
  
  // Second pass: process each image tag
  return processedHtml.replace(imgTagRegex, (match, srcUrl) => {
    // Check if this is a rainpos image
    if (srcUrl.includes('rainpos.my.site.com')) {
      // Check if it's already using the /servlet/rtaImage format
      if (srcUrl.includes('/servlet/rtaImage')) {
        // Keep images that are already in the correct format
        return match;
      } else {
        // Check if we have a servlet equivalent for this image
        if (imageNameToServletUrl[srcUrl]) {
          console.log(`Replaced non-public image URL: ${srcUrl} -> ${imageNameToServletUrl[srcUrl]}`);
          return match.replace(srcUrl, imageNameToServletUrl[srcUrl]);
        } else {
          // Remove images that aren't in the correct format and don't have servlet equivalents
          console.log(`Removed non-public image URL (no servlet equivalent found): ${srcUrl}`);
          return ''; // Remove the img tag
        }
      }
    }
    // Keep all non-rainpos images
    return match;
  });
}

/**
 * Checks if an image URL from rainpos.my.site.com is in the public format
 * 
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - True if the URL is in the public format, false otherwise
 */
function isPublicRainposImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  
  // Check if this is a rainpos URL
  if (!imageUrl.includes('rainpos.my.site.com')) {
    // Non-rainpos URLs are not relevant to this check
    return true;
  }
  
  // Check if it uses the public /servlet/rtaImage format
  return imageUrl.includes('/servlet/rtaImage');
}

/**
 * Process an extraction result to ensure any HTML content has proper image URLs
 * This can be used with the results from Firecrawl API's extract method
 * 
 * @param {Object} extractionResult - The result object from Firecrawl API
 * @returns {Object} - The processed result with corrected image URLs
 */
function processExtractionResult(extractionResult) {
  if (!extractionResult) {
    return extractionResult;
  }

  // Helper function to recursively process objects and arrays
  function processValue(value) {
    if (typeof value === 'string') {
      // If it looks like HTML (contains image tags), process it
      if (value.includes('<img')) {
        return processHtmlImages(value);
      }
      return value;
    } else if (Array.isArray(value)) {
      // Process each array item
      return value.map(item => processValue(item));
    } else if (value && typeof value === 'object') {
      // Process each object property
      const result = {};
      for (const key in value) {
        result[key] = processValue(value[key]);
      }
      return result;
    }
    return value;
  }

  // Start processing at the root level
  return processValue(extractionResult);
}

module.exports = {
  processHtmlImages,
  isPublicRainposImage,
  processExtractionResult
};
