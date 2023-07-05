#!/usr/bin/env ts-node

/**
 * This script can be invoked via:
 *
 *   npm run migration:create <migration name>
 *
 * To create new database migrations.
 */

/* eslint-disable no-console */

import fs from "fs-extra";
import lodash from "lodash";
import path from "path";

const templateFilePath = path.resolve(
  path.join(
    __dirname,
    "../../src/core/server/services/migrate/migration_sample.ts"
  )
);

const argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.error("usage: npm run migration:create <migration name>");
  process.exit(1);
}

// Get the name of the new migration.
const name = lodash.snakeCase(argv[0]);

// Get the version of the new migration.
const version = Date.now();

// Get the filePath of the new migration.
const filePath = path.resolve(
  path.join(
    __dirname,
    `../../src/core/server/services/migrate/migrations/${version}_${name}.ts`
  )
);

if (fs.existsSync(filePath)) {
  console.error(`migration already exists at: ${filePath}`);
  process.exit(1);
}

// Write the template out to the file.
fs.copyFileSync(templateFilePath, filePath);

console.log(`created new migration at: ${filePath}`);
