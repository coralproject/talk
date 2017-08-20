const {ROOT_URL, ROOT_URL_MOUNT_PATH} = require('./config');
const {URL} = require('url');

// Set the BASE_URL as the ROOT_URL, here we derive the root url by ensuring
// that it ends in a `/`.
const BASE_URL = ROOT_URL && ROOT_URL.length > 0 && ROOT_URL[ROOT_URL.length - 1] === '/' ? ROOT_URL : `${ROOT_URL}/`;

// The BASE_PATH is simply the path component of the BASE_URL.
const BASE_PATH = new URL(BASE_URL).pathname;

// The MOUNT_PATH is derived from the BASE_PATH, if it is provided and enabled.
// This will mount all the application routes onto it.
const MOUNT_PATH = ROOT_URL_MOUNT_PATH ? BASE_PATH : '/';

module.exports = {
  BASE_URL: BASE_URL,
  BASE_PATH: BASE_PATH,
  MOUNT_PATH: MOUNT_PATH,
}
