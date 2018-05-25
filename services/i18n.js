const fs = require('fs');
const path = require('path');
const debug = require('debug')('talk:services:i18n');
const {
  acceptedLanguages,
  negotiateLanguages,
} = require('fluent-langneg/compat');
const { first, get, has, merge, isUndefined } = require('lodash');
const yaml = require('yamljs');
const plugins = require('./plugins');
const { DEFAULT_LANG, WHITELISTED_LANGUAGES } = require('../config');

const resolve = (...paths) =>
  path.resolve(path.join(__dirname, '..', 'locales', ...paths));

// Load all the translations.
const translations = fs
  .readdirSync(resolve())

  // Resolve all the filenames relative the the locales directory.
  .map(filename => resolve(filename))

  // Translations are only yml/yaml files.
  .filter(filename => /\.(yaml|yml)$/.test(filename))

  // Load the translation files from disk.
  .map(filename => fs.readFileSync(filename, 'utf8'))

  // Load the translation files and merge the yaml into the existing packs.
  .reduce((packs, contents) => merge(packs, yaml.parse(contents)), {});

// Create a list of all supported translations.
const supportedLocales = Object.keys(translations);

// Move the default language to the front.
if (supportedLocales.includes(DEFAULT_LANG)) {
  const from = supportedLocales.indexOf(DEFAULT_LANG);
  supportedLocales.splice(from, 1);
  supportedLocales.splice(0, 0, DEFAULT_LANG);
}
debug(`loaded language sets for ${supportedLocales}`);

let loadedPluginTranslations = false;
const lazyLoadPluginTranslations = () => {
  if (loadedPluginTranslations) {
    return;
  }

  // Load the plugin translations.
  plugins
    .get('server', 'translations')
    .forEach(({ plugin, translations: filename }) => {
      debug(`added plugin '${plugin.name}'`);

      const pack = yaml.parse(fs.readFileSync(filename, 'utf8'));

      // Merge the translations into the system translations.
      merge(translations, pack);

      // Push new languages into the supportedLocales array.
      Object.keys(pack).forEach(language => {
        if (!supportedLocales.includes(language)) {
          supportedLocales.push(language);
        }
      });
    });

  loadedPluginTranslations = true;
};

const t = lang => (key, ...replacements) => {
  // Loads the translations into the translations array from plugins. This is
  // done lazily to ensure that we don't have an import cycle.
  lazyLoadPluginTranslations();

  let translation;
  if (has(translations[lang], key)) {
    translation = get(translations[lang], key);
  } else if (has(translations['en'], key)) {
    translation = get(translations['en'], key);
    console.warn(`${lang}.${key} language key not set`);
  }

  if (!translation) {
    console.warn(`${lang}.${key} and en.${key} language key not set`);
    return key;
  }

  // Handle replacements in the translation string.
  return translation.replace(
    /{(\d+)}/g,
    (match, number) =>
      !isUndefined(replacements[number]) ? replacements[number] : match
  );
};

/**
 * Exposes a service object to allow translations.
 * @type {Object}
 */
const i18n = {
  request(req) {
    const acceptsLanguages = acceptedLanguages(req.headers['accept-language']);
    debug(`possible languages given request '${acceptsLanguages}'`);

    // negotiate the language.
    const lang = first(
      negotiateLanguages(
        acceptsLanguages,
        WHITELISTED_LANGUAGES || supportedLocales,
        {
          defaultLocale: DEFAULT_LANG,
          strategy: 'lookup',
        }
      )
    );
    debug(`decided language as '${lang}'`);

    return t(lang);
  },
  t: t(DEFAULT_LANG),
};

module.exports = i18n;
