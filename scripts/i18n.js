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

function actionSort() {
  walk((data, file) => {
    console.log(`Sorting ${file}`);
    return sortObject(data);
  });
  console.log('All locales sorted'.green);
}

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

program.version('0.1.0').description('Tools to help manage i18n locales');

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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
