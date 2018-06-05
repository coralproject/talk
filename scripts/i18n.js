#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');
const sortObject = require('deep-sort-object');
const get = require('lodash/get');
const set = require('lodash/set');
const cloneDeep = require('lodash/cloneDeep');

// Make things colorful!
require('colors');

const localesPath = path.resolve(__dirname, '../locales');

/**
 * Walk through all locale files, parse it and call
 * callback with the data. If the callback returns a
 * value, use this to write a new yaml locale file.
 *
 * Currently this is limited to the top level locales
 * not including the plugins.
 */
function walk(callback) {
  fs.readdirSync(localesPath).forEach(file => {
    const filePath = path.join(localesPath, file);
    const data = yaml.load(filePath);
    const transformed = callback(cloneDeep(data), file);
    if (transformed) {
      fs.writeFileSync(filePath, yaml.stringify(transformed, 100, 2));
    }
  });
}

/**
 * Sort translation keys alphabetically
 */
function actionSort() {
  walk((data, file) => {
    console.log(`Sorting ${file}`);
    return sortObject(data);
  });
  console.log('All locales sorted'.green);
}

/**
 * Delete a key from translations files
 */
function actionDelete(pathStr) {
  const pathArray = pathStr.split('.');
  const parentPathArray = pathArray.slice(0, pathArray.length - 1);
  const leaf = pathArray[pathArray.length - 1];
  let found = false;

  walk((data, file) => {
    const languages = Object.keys(data);
    languages.forEach(language => {
      const translations = data[language];
      const find = get(translations, parentPathArray);
      if (find[leaf]) {
        console.log(`Deleted '${language}.${pathStr}' from ${file}`.green);
        delete find[leaf];
        found = true;
      }
    });
    return data;
  });

  if (!found) {
    console.log(`Could not find translations for ${pathStr}`);
  }
}

/**
 * Copy value of key to another key in translations files
 */
function actionCopy(from, to, { force }) {
  let found = false;

  walk((data, file) => {
    const languages = Object.keys(data);
    languages.forEach(language => {
      const translations = data[language];
      const find = get(translations, from);
      if (find) {
        // File already exist.
        if (get(translations, to)) {
          if (!force) {
            // Do not overwrite and skip this iteration.
            console.log(
              `'${language}.${to}' already exists in ${file} use -f to overwrite`
                .red
            );
            return;
          } else {
            // Force overwrite.
            console.log(
              `Overwritten '${language}.${to}' with '${language}.${from}' in ${file}`
                .green
            );
          }
        } else {
          console.log(
            `Copied '${language}.${from}' to '${language}.${to}' in ${file}`
              .green
          );
        }

        // Write.
        set(translations, to, find);
        found = true;
      }
    });
    return sortObject(data);
  });

  if (!found) {
    console.log(`Could not find translations for ${from}`);
  }
}

/**
 * Drop all translation keys that are not also present in the EN locale.
 */
function actionDropUnused() {
  const enKeys = [];

  const gatherKeys = (value, parentKey = '') => {
    if (typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const keys = Object.keys(value);
    keys.forEach(k => {
      const path = `${parentKey ? `${parentKey}.` : ''}${k}`;
      enKeys.push(path);
      gatherKeys(value[k], path);
    });
  };

  const dropUnusedKeys = (value, language, parentKey = '') => {
    if (typeof value !== 'object' || Array.isArray(value)) {
      return;
    }
    const keys = Object.keys(value);
    keys.forEach(k => {
      const path = `${parentKey ? `${parentKey}.` : ''}${k}`;
      if (enKeys.indexOf(path) === -1) {
        console.log(`Drop ${language}.${path}`);
        delete value[k];
        return;
      }
      dropUnusedKeys(value[k], language, path);
    });
  };

  // Gather all possible translations in the en locale.
  walk(data => {
    const translations = data.en;
    if (!translations) {
      return;
    }
    gatherKeys(translations);
  });

  // Remove translations not in the en locale.
  walk(data => {
    const languages = Object.keys(data).filter(l => l !== 'en');
    languages.forEach(language => {
      const translations = data[language];
      dropUnusedKeys(translations, language);
    });
    return data;
  });
}

program
  .version('0.1.0')
  .description(
    'Tools to help manage i18n locales.\n  Currently this is limited to top level locales excluding the plugin locales.'
  );

program
  .command('sort')
  .description('Sort keys of all locales in alphabetical order')
  .action(actionSort);

program
  .command('delete <path>')
  .description('Delete key at path in all locales')
  .action(actionDelete);

program
  .command('copy <from> <to>')
  .description('Copy translation from one key to another')
  .option('-f, --force', 'Force overwrite')
  .action(actionCopy);

program
  .command('drop-unused')
  .description('Drop translations that are not present in the en locale')
  .action(actionDropUnused);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
