import parse from 'url-parse';

const base = document.querySelector('base');
const baseUrl = (base && parse(base.href)) || {};

export const BASE_URL = base.href;
export const BASE_PATH = baseUrl.pathname;
