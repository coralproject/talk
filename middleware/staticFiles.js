const express = require('express');
const path = require('path');
const staticServer = require('express-static-gzip');
const { merge } = require('lodash');
const { EMBED_EXPIRY_TIME, STATIC_EXPIRY_TIME } = require('../config');

// EMBED_CACHE_CONTROL_HEADER is the header sent when the file is embed.js.
const EMBED_CACHE_CONTROL_HEADER = [
  'public',
  `max-age=${Math.floor(EMBED_EXPIRY_TIME / 1000)}`,
  'immutable',
].join(', ');

// Define the options to be applied to all static files, the embed itself has a
// separate override.
const defaultOpts = {
  maxAge: STATIC_EXPIRY_TIME,
  immutable: true,
  setHeaders: (res, path) => {
    if (path.includes('/dist/embed.js')) {
      // embed.js has a different max-age then the rest of the static files.
      res.setHeader('Cache-Control', EMBED_CACHE_CONTROL_HEADER);
    }
  },
};

// Setup the configuration for the compression options on how to serve files.
const compressionOpts = {
  indexFromEmptyFile: false,
  enableBrotli: true,
  customCompressions: [{ encodingName: 'deflate', fileExtension: 'zz' }],
};

// Serve the directories under ../dist.
const dist = path.resolve(path.join(__dirname, '../dist'));

/**
 * middleware in production will serve compressed files if available, otherwise
 * it will use express's static middleware.
 */
module.exports =
  process.env.NODE_ENV === 'production'
    ? staticServer(dist, merge(compressionOpts, defaultOpts))
    : express.static(dist, defaultOpts);
