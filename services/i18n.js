const fs = require('fs');
const path = require('path');
const debug = require('debug')('talk:services:i18n');
const accepts = require('accepts');
const _ = require('lodash');
const yaml = require('yamljs');
const plugins = require('./plugins');

const resolve = (...paths) => path.resolve(path.join(__dirname, '..', 'locales', ...paths));

// Load all the translations.
let translations = fs.readdirSync(resolve())

  // Resolve all the filenames relative the the locales directory.
  .map((filename) => resolve(filename))

  // Translations are only yml/yaml files.
  .filter((filename) => /\.(yaml|yml)$/.test(filename))

  // Load the translation files from disk.
  .map((filename) => fs.readFileSync(filename, 'utf8'))

  // Load the translation files.
  .reduce((packs, contents) => {

    const pack = yaml.parse(contents);

    return _.merge(packs, pack);
  }, {});

// Create a list of all supported translations.
const languages = Object.keys(translations);

let defaultLanguage = process.env.TALK_DEFAULT_LANG || 'en';
let language = defaultLanguage;

let loadedPluginTranslations = false;
const loadPluginTranslations = () => {
  if (loadedPluginTranslations) {
    return;
  }

  // Load the plugin translations.
  plugins.get('server', 'translations').forEach(({plugin, translations: filename}) => {
    debug(`added plugin '${plugin.name}'`);

    const pack = yaml.parse(fs.readFileSync(filename, 'utf8'));

    translations = _.merge(translations, pack);
  });

  loadedPluginTranslations = true;
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
    const lang = accepts(req).language(languages);
    language = lang ? lang : defaultLanguage;
  },

  /**
   * Translates a key.
   */
  t(key, ...replacements) {

    // Loads the translations into the translations array from plugins. This is
    // done lazily to ensure that we don't have an import cycle.
    loadPluginTranslations();

    // Check if the translation exists on the object.
    if (_.has(translations[language], key)) {

      // Get the translation value.
      let translation = _.get(translations[language], key);

      // Replace any {n} with the arguments passed to this method.
      replacements.forEach((str, n) => {
        translation = translation.replace(new RegExp(`\\{${n}\\}`, 'g'), str);
      });

      return translation;
    } else {
      console.warn(`${key} language key not set`);
      return key;
    }
  },
};

module.exports = i18n;
