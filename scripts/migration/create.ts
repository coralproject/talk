#!/usr/bin/env ts-node

/**
 * This script can be invoked via:
 *
 *   npm run migration:create <migration name>
 *
 * To create new database migrations.
 */

// tslint:disable: no-console

import { stripIndent } from "common-tags";
import fs from "fs-extra";
import lodash from "lodash";
import path from "path";

const template = stripIndent`
import { Db } from "mongodb";

// Use the following collections reference to interact with specific
// collections.
// import collections from "coral-server/services/mongodb/collections";

import Migration from "../migration";

export default class extends Migration {
  public async run(mongo: Db) {
    throw new Error("migration not implemented");
  }
}`;

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
fs.writeFileSync(filePath, template);

console.log(`created new migration at: ${filePath}`);
