import url from 'url';

const base = document.querySelector('base');
const baseUrl = (base && url.parse(base.href)) || {};

export const BASE_URL = base.href;
export const BASE_PATH = baseUrl.pathname;
