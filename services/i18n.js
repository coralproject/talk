const has = require('lodash/has');
const get = require('lodash/get');

const yaml = require('yamljs');

const es = yaml.load('./locales/es.yml');
const en = yaml.load('./locales/en.yml');
const fr = yaml.load('./locales/fr.yml');
const pt_BR = yaml.load('./locales/pt_BR.yml');

const accepts = require('accepts');

// default language
let defaultLanguage = 'en';
let language = defaultLanguage;
const languages = ['en', 'es', 'fr', 'pt_BR'];

const translations = Object.assign(en, es, fr, pt_BR);

/**
 * Exposes a service object to allow translations.
 * @type {Object}
 */
const i18n = {

  /**
   * Create the new Task kue.
   */
  init(req) {
    const lang = accepts(req).language(languages);
    language = lang ? lang : defaultLanguage;
  },

  /**
   * Translates a key.
   */
  t(key, ...replacements) {

    if (has(translations[language], key)) {

      let translation = get(translations[language], key);

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
