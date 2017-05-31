const has = require('lodash/has');
const get = require('lodash/get');

const yaml = require('yamljs');
const es = yaml.load('./locales/es.yml');
const en = yaml.load('./locales/en.yml');

// default language
const language = 'en';
const translations = Object.assign(en, es);

/**
 * Exposes a service object to allow translations.
 * @type {Object}
 */
const i18n = {

  /**
   * Create the new Task kue.
   */
  init() {

    // To Do - set language and retrieve it
    return 'set it';
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
