#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');
const sortObject = require('deep-sort-object');

// Make things colorful!
require('colors');

const localesPath = path.resolve(__dirname, '../locales');

function walk(callback) {
  fs.readdirSync(localesPath).forEach(file => {
    const filePath = path.join(localesPath, file);
    const data = yaml.load(filePath);
    const transformed = callback(data, file);
    if (transformed) {
      fs.writeFileSync(filePath, yaml.stringify(transformed, 100, 2));
    }
  });
}

function sort() {
  walk((data, file) => {
    console.log(`Sorting ${file}`);
    return sortObject(data);
  });
  console.log('All locales sorted'.green);
}

program.version('0.1.0').description('Tools to help manage i18n locals');

program
  .command('sort')
  .description('Sort keys of all locales in alphabetical order')
  .action(sort);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
