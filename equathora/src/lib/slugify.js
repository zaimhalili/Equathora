/**
 * Utility functions for generating and handling URL slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified string
 */
export function slugify(text) {
    if (!text) return '';
    
    return text
        .toString()
        .toLowerCase()
        .trim()
        // Remove special characters except spaces and hyphens
        .replace(/[^a-z0-9\s-]/g, '')
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Replace multiple hyphens with single hyphen
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending the problem ID
 * @param {string} title - The problem title
 * @param {number|string} id - The problem ID
 * @returns {string} - The unique slug
 */
export function generateProblemSlug(title, id) {
    const baseSlug = slugify(title);
    return `${baseSlug}-${id}`;
}

/**
 * Extract the problem ID from a slug (assumes ID is appended after last hyphen)
 * @param {string} slug - The full slug
 * @returns {number|null} - The extracted ID or null
 */
export function extractIdFromSlug(slug) {
    if (!slug) return null;
    
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    
    return isNaN(id) ? null : id;
}

/**
 * Validate if a string is a valid slug format
 * @param {string} slug - The slug to validate
 * @returns {boolean} - True if valid slug format
 */
export function isValidSlug(slug) {
    if (!slug || typeof slug !== 'string') return false;
    // Valid slug: lowercase alphanumeric with hyphens, no consecutive hyphens
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
