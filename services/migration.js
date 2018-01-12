const MigrationModel = require('../models/migration');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const debug = require('debug')('talk:services:migration');
const sc = require('snake-case');
const { talk: { migration: { minVersion } } } = require('../package.json');

const migrationTemplate = `module.exports = {
  async up() {
    
  }
};

`;

class MigrationService {
  /**
   * Creates a new migration file.
   *
   * @param {String} name name of the migration
   */
  static async create(name) {
    if (!name || typeof name !== 'string' || name.length === 0) {
      throw new Error('name must be defined');
    }

    // Create a new Migration based on the current time.
    let version = Math.round(Date.now() / 1000, 0);
    let filename = path.join(
      __dirname,
      '..',
      'migrations',
      `${version}_${sc(name)}.js`
    );
    fs.writeFileSync(filename, migrationTemplate, 'utf8');

    console.log(`Created migration ${version} in ${filename}`);
  }

  /**
   * Returns a list of all pending migrations.
   */
  static async listPending() {
    // Get all the migration files.
    let migrationFiles = fs.readdirSync(
      path.join(__dirname, '..', 'migrations')
    );

    // Ensure that all migrations follow this format.
    const migrationSchema = Joi.object({
      up: Joi.func().required(),
      down: Joi.func(),
    });

    // Extract the version from the filename with this regex.
    const versionRe = /(\d+)_([\S_]+)\.js/;

    // Get the latest version.
    let latestVersion = await MigrationService.latestVersion();

    // Parse the migrations from the file listing.
    let migrations = migrationFiles
      .map(filename => {
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
        Joi.assert(
          migration,
          migrationSchema,
          `Migration ${filename} does did not pass validation`
        );

        return {
          filename,
          version,
          migration,
        };
      })
      .filter(migration => migration !== null)
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

  /**
   * Runs an list of migrations.
   *
   * @param {Array} migrations a list of migrations returned by `listPending`
   */
  static async run(migrations) {
    if (migrations.length === 0) {
      console.log('No migrations to run!');
      return;
    }

    for (let { filename, version, migration } of migrations) {
      try {
        console.log(`Starting migration ${filename}`);
        await migration.up();
        console.log(`Finished migration ${filename}`);
      } catch (e) {
        console.error(`Migration ${filename} failed`);
        throw e;
      }

      try {
        console.log(`Recording migration ${filename}`);

        // Record that the migration was finished.
        let m = new MigrationModel({ version });
        await m.save();

        console.log(`Finished recording migration ${filename}`);
      } catch (e) {
        console.error(`Migration ${filename} could not be recorded`);
        throw e;
      }
    }

    console.log(
      `Database now at migration version ${
        migrations[migrations.length - 1].version
      }`
    );
  }

  /**
   * Returns the latest migration version number that has been applied to the
   * database, null if none were found.
   */
  static async latestVersion() {
    // Load the latest migration details from the database.
    let latestMigration = await MigrationModel.find({})
      .sort({ version: -1 })
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

  static async verify() {
    // If the requiredVersion isn't specified or is 0, then don't complain.
    if (typeof minVersion !== 'number' || minVersion === 0) {
      return;
    }

    // If the latest migration does not match the required version, then error
    // out.
    let latestVersion = await MigrationService.latestVersion();
    if (!latestVersion || latestVersion < minVersion) {
      throw new Error(
        `A database migration is required, version required ${minVersion}, found ${latestVersion}. Please run \`./bin/cli migration run\``
      );
    }

    debug(
      `minimum migration version ${minVersion} was met with version ${latestVersion}`
    );

    return latestVersion;
  }
}

module.exports = MigrationService;
