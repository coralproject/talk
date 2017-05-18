const time = require('timeago.js');
const has = require('lodash/has');
const get = require('lodash/get');

const esTA = require('../../../node_modules/timeago.js/locales/es');

const defaultLanguage = 'en';

let translations = {};

// Add es timeago locale for the timeago registration.
time.register('es', esTA);
let timeagoInstance = time();

const fetchTranslations = (locale) => {
  translations = require(`json-loader!yaml-loader!../locales/${locale}.yml`)[locale];
};

const setLocale = (locale) => {
  try {
    localStorage.setItem('locale', locale);
  } catch (err) {
    console.error(err);
  }
};

const getLocale = () => (localStorage.getItem('locale') || navigator.language || defaultLanguage).split('-')[0];

export const loadTranslations = (translations) => {
  try {
    const locale = getLocale();
    setLocale(locale);

    // If we have a translations file, let's use that one.
    // Otherwise get the core translations.
    if (translations !== undefined) {
      translations = translations[locale];
      return translations;
    }

    return fetchTranslations(locale);

  } catch (err) {
    console.error(err);
    return fetchTranslations(defaultLanguage);
  }
};

export const timeago = (time) => {
  return timeagoInstance.format(new Date(time), getLocale());
};

/**
 * Expose the translation function
 *
 * it takes a string with the translation key and returns
 * the translation value or the key itself if not found
 * it works with nested translations (my.page.title)
 *
 * any extra parameters are optional and replace a variable marked by {0}, {1}, etc in the translation.
 */
const t = (key, ...replacements) => {
  if (has(translations, key)) {
    let translation = get(translations, key);

    // replace any {n} with the arguments passed to this method
    replacements.forEach((str, i) => {
      translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str);
    });
    return translation;
  } else {
    console.warn(`${key} language key not set`);
    return key;
  }
};

export default t;
