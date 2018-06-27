const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');
const memoize = require('lodash/memoize');

const pascalCase = (x) => upperFirst(camelCase(x));

/**
 * Default values for every param that can be passed in the loader query.
 */
const DEFAULT_QUERY_VALUES = {
  // Path to locales.
  pathToLocales: null,

  // Default locale if non could be negotiated.
  defaultLocale: 'en-US',

  // Fallback locale if a translation was not found.
  // If not set, will use the text that is already
  // in the code base.
  fallbackLocale: '',

  // If set, restrict to this list of available locales.
  availableLocales: null,

  // Common fluent files are always included in the locale bundles.
  commonFiles: [],

  // Locales that come with the main bundle. Others are loaded on demand.
  bundled: [],

  // Target specifies the prefix for fluent files to be loaded. ${target}-xyz.ftl and ${†arget}.ftl are
  // loaded into the locales.
  target: '',
};

function getFiles(target, pathToLocale, context) {
  const {pathToLocales, commonFiles} = context;

  const common = [];
  const suffixes = [];

  const files = fs.readdirSync(pathToLocale);

  files.forEach(f => {
    if (commonFiles.includes(f)) {
      common.push(f);
      return;
    }
    if (f.startsWith(target)) {
      suffixes.push(f.substr(target.length));
      return;
    }
  });

  return {common, suffixes};
}

function generateTarget(target, context) {
  const {defaultLocale, fallbackLocale, pathToLocales, locales, commonFiles, bundled} = context;
  const getLocalePath = locale => path.join(pathToLocales, locale);
  const getLocaleFiles = memoize(locale => getFiles(target, getLocalePath(locale), context));
  const loadables = locales.filter(local => !bundled.includes(local));

  return `
    var ret = {
      defaultLocale: ${JSON.stringify(defaultLocale)},
      fallbackLocale: ${JSON.stringify(fallbackLocale)},
      availableLocales: ${JSON.stringify(locales)},
      bundled: {},
      loadables: {},
    };

  // Bundled locales are directly available in the main bundle.
  ${bundled.map(locale => `
    {
      var suffixes = ${JSON.stringify(getLocaleFiles(locale).suffixes)};
      var contents = [];
    ${getLocaleFiles(locale).common.map(file => `
      contents.push(require('${getLocalePath(locale)}/${file}'));
    `).join("\n")}
      contents = contents.concat(suffixes.map(function(suffix) { return require(\`${getLocalePath(locale)}/${target}\${suffix}\`); }));
      ret.bundled[${JSON.stringify(locale)}] = contents.join("\\n");
    }
  `).join("\n")}

  // Loadables are in a separate bundle, that can be easily loaded.
  ${loadables.map(locale => `
    ret.loadables[${JSON.stringify(locale)}] = function() {
      var suffixes = ${JSON.stringify(getLocaleFiles(locale).suffixes)};
      var promises = [];
    ${getLocaleFiles(locale).common.map(file => `
      promises.push(
        import(
          /* webpackChunkName: ${JSON.stringify(`${target}-locale-${locale}`)}, webpackMode: "lazy" */
          '${getLocalePath(locale)}/${file}'
        )
      );
    `).join("\n")}
      promises = promises.concat(suffixes.map(function(suffix) {
        return import(
          /* webpackChunkName: ${JSON.stringify(`${target}-locale-${locale}`)}, webpackMode: "lazy-once" */
          \`${getLocalePath(locale)}/${target}\${suffix}\`
        )
      }));
      return Promise.all(promises).then(function(modules) {
        return modules.map(function(m){return m.default}).join("\\n");
      });
    };
  `).join("\n")}
    module.exports = ret;
  `;
}

module.exports = function(source) {
  const options = Object.assign({}, DEFAULT_QUERY_VALUES, loaderUtils.getOptions(this));
  const {pathToLocales, defaultLocale, fallbackLocale, availableLocales, target, bundled, commonFiles} = options;

  let locales = fs.readdirSync(pathToLocales);
  if (availableLocales) {
    availableLocales.forEach(locale => {
      if (!locales.includes(locale)) {
        throw new Error(`locale ${fallbackLocale} not available`);
      }
    });
    locales = availableLocales;
  }

  if (fallbackLocale && !locales.includes(fallbackLocale)) {
    throw new Error(`fallbackLocale ${fallbackLocale} not in available locales`);
  }
  if (!pathToLocales) {
    throw new Error(`pathToLocales is required`);
  }
  if (!defaultLocale) {
    throw new Error(`defaultLocale is required`);
  }

  if (!locales.includes(defaultLocale)) {
    throw new Error(`defaultLocale ${defaultLocale} not in available locales`);
  }

  const context = {pathToLocales, defaultLocale, fallbackLocale, commonFiles, locales, bundled};

  this.cacheable();
  return generateTarget(target, context);
};
