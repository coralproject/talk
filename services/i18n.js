const has = require('lodash/has');
const get = require('lodash/get');

const yaml = require('yamljs');
const es = yaml.load('./locales/es.yml');
const en = yaml.load('./locales/en.yml');

// default language
let defaultLanguage = 'en';
let language = defaultLanguage;
const translations = Object.assign(en, es);

/**
* guess language setting based on http headers
*/
const guessLanguage = (request) => {

  if (typeof request === 'object') {

    let languageHeader = request.headers ? request.headers['accept-language'] : undefined;
    const acceptedLanguages = getAcceptedLanguagesFromHeader(languageHeader);

    let lang;
    for (let i = 0; i < acceptedLanguages.length; i++) {
      lang = acceptedLanguages[i].split('-', 2)[0];
    }
    return lang;
  }

  return defaultLanguage;
};

/**
 * Get a sorted list of accepted languages from the HTTP Accept-Language header
 */
const getAcceptedLanguagesFromHeader = (header) => {
  let languages = header.split(',');
  let preferences = {};
  return languages.map((item) => {
    let preferenceParts = item.trim().split(';q=');
    if (preferenceParts.length < 2) {
      preferenceParts[1] = 1.0;
    } else {
      let quality = parseFloat(preferenceParts[1]);
      preferenceParts[1] = quality ? quality : 0.0;
    }
    preferences[preferenceParts[0]] = preferenceParts[1];

    return preferenceParts[0];
  })
  .filter(function(lang) {
    return preferences[lang] > 0;
  })
  .sort(function sortLanguages(a, b) {
    return preferences[b] - preferences[a];
  });
};

/**
 * Exposes a service object to allow translations.
 * @type {Object}
 */
const i18n = {

  /**
   * Create the new Task kue.
   */
  init(req) {
    language = guessLanguage(req);
  },

  /**
   * Translates a key.
   */
  t(key, ...replacements) {

    if (has(translations[language], key)) {

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
  },
};

module.exports = i18n;
