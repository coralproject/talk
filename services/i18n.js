const fs = require('fs');
const path = require('path');
const debug = require('debug')('talk:services:i18n');
const accepts = require('accepts');
const _ = require('lodash');
const yaml = require('yamljs');
const plugins = require('./plugins');
const { DEFAULT_LANG } = require('../config');

const resolve = (...paths) =>
  path.resolve(path.join(__dirname, '..', 'locales', ...paths));

// Load all the translations.
let translations = fs
  .readdirSync(resolve())

  // Resolve all the filenames relative the the locales directory.
  .map(filename => resolve(filename))

  // Translations are only yml/yaml files.
  .filter(filename => /\.(yaml|yml)$/.test(filename))

  // Load the translation files from disk.
  .map(filename => fs.readFileSync(filename, 'utf8'))

  // Load the translation files.
  .reduce((packs, contents) => {
    const pack = yaml.parse(contents);

    return _.merge(packs, pack);
  }, {});

// Create a list of all supported translations.
const languages = Object.keys(translations);

// Move the default language to the front.
if (languages.includes(DEFAULT_LANG)) {
  const from = languages.indexOf(DEFAULT_LANG);
  languages.splice(from, 1);
  languages.splice(0, 0, DEFAULT_LANG);
}
debug(`loaded language sets for ${languages}`);

let loadedPluginTranslations = false;
const loadPluginTranslations = () => {
  if (loadedPluginTranslations) {
    return;
  }

  // Load the plugin translations.
  plugins
    .get('server', 'translations')
    .forEach(({ plugin, translations: filename }) => {
      debug(`added plugin '${plugin.name}'`);

      const pack = yaml.parse(fs.readFileSync(filename, 'utf8'));

      translations = _.merge(translations, pack);
    });

  loadedPluginTranslations = true;
};

const t = language => (key, ...replacements) => {
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
};

/**
 * Exposes a service object to allow translations.
 * @type {Object}
 */
const i18n = {
  request(req) {
    debug(`possible languages given request '${accepts(req).languages()}'`);
    const lang = accepts(req).language(languages);
    debug(`parsed request language as '${lang}'`);
    const language = lang ? lang : DEFAULT_LANG;
    debug(`decided language as '${language}'`);

    return t(language);
  },
  t: t(DEFAULT_LANG),
};

module.exports = i18n;
