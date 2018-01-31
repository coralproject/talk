// This is always loaded in the body of the page, meaning that the dom element
// for this data blob is always loaded when we render this piece.
const CONFIG_ELEMENT = document.querySelector('#data');

// Parse the configuration from that element if it exists, otherwise, an empty
// object.
const CONFIG = CONFIG_ELEMENT ? JSON.parse(CONFIG_ELEMENT.textContent) : {};

// Export the expected fields.
export const LIVE_URI = CONFIG.LIVE_URI;
export const STATIC_URL = CONFIG.STATIC_URL;
