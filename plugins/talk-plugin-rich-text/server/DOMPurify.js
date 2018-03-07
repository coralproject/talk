const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const config = require('./config');

// Initializing JSDOM and DOMPurify
const window = new JSDOM('', config.jsdom).window;
const DOMPurify = createDOMPurify(window);

// Setting our secure config
DOMPurify.setConfig(config.dompurify);

module.exports = DOMPurify;
