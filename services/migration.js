const MigrationModel = require('../models/migration');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const sc = require('snake-case');

const migrationTemplate = `
module.exports = {
  async up() {
    
  }
};

`;

module.exports = class MigrationService {
  static async create(name) {
    if (!name || typeof name !== 'string' || name.length === 0) {
      throw new Error('name must be defined');
    }

    let version = Math.round(Date.now() / 1000, 0);
    let filename = path.join(__dirname, '..', 'migrations', `${version}_${sc(name)}.js`);
    fs.writeFileSync(filename, migrationTemplate, 'utf8');

    console.log(`Created migration ${version} in ${filename}`);
  }

  static async listPending() {

    // Get all the migration files.
    let migrationFiles = fs.readdirSync(path.join(__dirname, '..', 'migrations'));

    // Ensure that all migrations follow this format.
    const migrationSchema = Joi.object({
      up: Joi.func().required(),
      down: Joi.func()
    });

    // Extract the version from the filename with this regex.
    const versionRe = /(\d+)_([\S_]+)\.js/;

    // Get the latest version.
    let latestVersion = await MigrationService.latestVersion();

    // Parse the migrations from the file listing.
    let migrations = migrationFiles
      .map((filename) => {

        // Parse the version from the filename.
        let matches = filename.match(versionRe);
        if (matches.length !== 3) {
          return null;
        }
        let version = parseInt(matches[1]);

        // Don't rerun migrations from versions already ran.
        if (version <= latestVersion) {
          return null;
        }

        // Read the migration from the filesystem.
        let migration = require(`../migrations/${filename}`);
        Joi.assert(migration, migrationSchema, `Migration ${filename} does did not pass validation`);

        return {
          filename,
          version,
          migration
        };
      })
      .filter((migration) => migration !== null)
      .sort((a, b) => {
        if (a.version < b.version) {
          return -1;
        }

        if (a.version > b.version) {
          return 1;
        }

        return 0;
      });
    
    return migrations;
  }

  static async run(migrations) {
    if (migrations.length === 0) {
      console.log('No migrations to run!');
      return;
    }

    for (let {version, migration} of migrations) {
      console.log(`Starting migration ${version}.js`);
      await migration.up();
      console.log(`Finished migration ${version}.js`);
      
      console.log(`Recording migration ${version}.js`);

      // Record that the migration was finished.
      let m = new MigrationModel({version});
      await m.save();

      console.log(`Finished recording migration ${version}.js`);
    }
  }

  static async latestVersion() {

    // Load the latest migration details from the database.
    let latestMigration = await MigrationModel
      .find({})
      .sort({version: -1})
      .limit(1)
      .exec();

    // If there weren't any migrations at all, then error out.
    if (latestMigration.length === 0) {
      return null;
    }
    
    // If the latest migration does not match the required version, then error
    // out.
    return latestMigration[0].version;
  }

  static async verify(requiredVersion) {

    // If the requiredVersion isn't specified or is 0, then don't complain.
    if (typeof requiredVersion !== 'number' || requiredVersion === 0) {
      return;
    }

    // If the latest migration does not match the required version, then error
    // out.
    let latestVersion = await MigrationService.latestVersion();
    if (!latestVersion || latestVersion < requiredVersion) {
      throw new Error(`A database migration is required, version required ${requiredVersion}, found ${latestVersion}. Please run \`./bin/cli migration run\``);
    }
  }
};
