const { ROOT_URL, ROOT_URL_MOUNT_PATH, STATIC_URI } = require('./config');
const { URL } = require('url');

const trailingSlash = url =>
  url && url.length > 0 && url[url.length - 1] === '/' ? url : `${url}/`;

// Set the BASE_URL as the ROOT_URL, here we derive the root url by ensuring
// that it ends in a `/`.
const BASE_URL = trailingSlash(ROOT_URL);

// The BASE_PATH is simply the path component of the BASE_URL.
const BASE_PATH = new URL(BASE_URL).pathname;

const BASE_ORIGIN = new URL(BASE_URL).origin;

// The MOUNT_PATH is derived from the BASE_PATH, if it is provided and enabled.
// This will mount all the application routes onto it.
const MOUNT_PATH = ROOT_URL_MOUNT_PATH ? BASE_PATH : '/';

// The STATIC_URL is the url where static assets should be loaded from.
const STATIC_URL = trailingSlash(STATIC_URI);

const STATIC_ORIGIN = new URL(STATIC_URI).origin;

module.exports = {
  BASE_URL,
  BASE_ORIGIN,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
  STATIC_ORIGIN,
};
