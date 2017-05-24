import ta from 'timeago.js';
import has from 'lodash/has';
import get from 'lodash/get';
import merge from 'lodash/merge';

import esTA from '../../../node_modules/timeago.js/locales/es';
import en from '../../../locales/en.yml';
import es from '../../../locales/es.yml';
import * as plugins from '../helpers/plugins';

// Translations are happening at https://www.transifex.com/the-coral-project/talk-1/dashboard/.

const defaultLanguage = 'en';
const translations = {...en, ...es};

let lang;
let timeagoInstance;
let loadedPluginsTranslations = false;

function setLocale(locale) {
  try {
    localStorage.setItem('locale', locale);
  } catch (err) {
    console.error(err);
  }
}

function getLocale() {
  return (localStorage.getItem('locale') || navigator.language || defaultLanguage).split('-')[0];
}

function init() {
  const locale = getLocale();
  setLocale(locale);

  // Extract language key.
  lang = locale.split('-')[0];

  // Check if we have a translation in this language.
  if (!(lang in translations)) {
    lang = defaultLanguage;
  }

  ta.register('es', esTA);
  timeagoInstance = ta();
}

function loadPluginsTranslations() {
  plugins.getTranslations().forEach((t) => loadTranslations(t));
}

export function loadTranslations(newTranslations) {
  merge(translations, newTranslations);
}

export function timeago(time) {
  return timeagoInstance.format(new Date(time), lang);
}

/**
 * Expose the translation function
 *
 * it takes a string with the translation key and returns
 * the translation value or the key itself if not found
 * it works with nested translations (my.page.title)
 *
 * any extra parameters are optional and replace a variable marked by {0}, {1}, etc in the translation.
 */
export function t(key, ...replacements) {
  if (!loadedPluginsTranslations) {
    loadPluginsTranslations();
    loadedPluginsTranslations = true;
  }
  const fullKey = `${lang}.${key}`;
  if (has(translations, fullKey)) {
    let translation = get(translations, fullKey);

    // replace any {n} with the arguments passed to this method
    replacements.forEach((str, i) => {
      translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str);
    });
    return translation;
  } else {
    console.warn(`${fullKey} language key not set`);
    return key;
  }
}

export default t;

init();
