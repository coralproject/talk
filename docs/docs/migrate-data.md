---
title: "Migrating from Talk v4.x to Coral v7+: Migrating Data"
---

## Before you start

Before you start the data migration process, make sure you have the following:

- a tenant ID for the new v7 coral instance you have created (you can find this by inspecting the record in the `tenants` collection in your new mongo instance)
- a site ID for the new v7 coral instance (inspect the one record in the `sites` collection)
- a mongo instance with a replica of your v4 production data set
- a local machine or virtual machine with sufficient RAM and processing power to run `mongoexport` and `mongoimport` on your data set. In our experience, large data sets (10+ GB) will require a minimum of 16GB RAM and 8 cores.
  <<<<<<< HEAD
- # _before_ you start the migration process, it is a good idea to create several test users (one commenter, one moderator, one admin). Following the data migration, attempt to log in and comment/moderate as these users to verify that account and login related data was migrated correctly, and that authentication has been configured correctly.
- _before_ you start the migration process, it is a good idea to create several test users (one commenter, one moderator, one admin). Following the data migration, attempt to log in and comment/moderate as these users to verify that account and login related data was migrated correctly, and that authentication has bee configured correctly.
  > > > > > > > main

## 1. Obtain JSON files for v4 data

The first step in the data migration process is to get one JSON file for each collection in your v4 data. You will need to use [mongoexport](https://www.mongodb.com/docs/database-tools/mongoexport/) to get these files. The following bash script will create a folder containing the JSON files for each collection. This script may take a long time to run on large data sets.

```bash
# Set this to the v4 TALK_MONGO_URL used by Coral.
export TALK_MONGO_URL="..."

# Set this to a folder where we'll export the documents from your ^4 database.
export CORAL_INPUT_DIRECTORY="$PWD/coral/input"

# Make the directory
mkdir -p "${CORAL_INPUT_DIRECTORY}"

# Dump each collection to the export directory. This operation can take some
# time for larger data sets.
collections=(actions assets comments settings users)
for collection in ${collections[*]}
do
  mongoexport --uri "$TALK_MONGO_URL" -c $collection -o "${CORAL_INPUT_DIRECTORY}/${collection}.json"
done
```

## 2. Run `coral-importer`

Download the [coral-importer](https://github.com/coralproject/coral-importer/releases/tag/v0.5.0) tool and unarchive it onto the machine you will be running the import on. The following example bash script will configure the importer and run it in "dry run" mode, which will not write any new files, but will validate document formats and configuration.

```bash

# Set this to the folder that contains the exported documents from v4
export CORAL_INPUT_DIRECTORY="$PWD/coral/input"

# Set this to a folder where we'll export the documents to be uploaded to your
# ^7 database.
export CORAL_OUTPUT_DIRECTORY="$PWD/coral/output"

# make the output directory
mkdir -p "${CORAL_OUTPUT_DIRECTORY}"

# Set this to the ID of your new v7 Tenant.
export CORAL_TENANT_ID=""

# Set this to the ID of your v7 Site.
export CORAL_SITE_ID=""

# This importer tool is designed to work with Coral at the following migration
# version. This is the newest file in the
# https://github.com/coralproject/talk/tree/develop/src/core/server/services/migrate/migrations
# directory for your version of Coral.
export CORAL_MIGRATION_ID="1582929716101"

# Set this to the file location where you want to export your log files to.
export CORAL_LOG="$PWD/coral/logs.json"

touch "${CORAL_LOG}

# Run the importer tool in dry mode to perform document validation before we
# actually write any files. This may take some time and will use about 40% of
# the dataset's size in RAM to perform the validation.
coral-importer legacy --dryRun

```

If this script succeeded, run it a second time, removing the `--dryRun` flag. If it did not succeed, inspect the logs.json file for more information.

The importer will write new JSON files to your export directory, transformed to be compatible with the new v7 Coral instance.

**If you _do not_ plan to use SSO authentication, skip ahead to step 4**

## 3. Transform User Profile data for SSO using the `map` command

**This step is only necessary if you used a custom plugin to implement SSO authentication in v4**

Read the following instructions carefully and in their entirety before attempting this step.

The following step will perform a further transformation on your users.json file to update user profile data as requried for SSO authentication. The configuration for this step will depend on the specific implementation of your v4 authentication plugin and the shape of the data it stored.

If your plugin saved the User ID at the root level of the document or in an object field, you can specify the path to the user ID using the `CORAL_MAPPER_USERS_SSO_ID` environemnt variable.

```bash
export CORAL_MAPPER_USERS_SSO_ID="id"
```

If your plugin saved the User ID (the ID encoded in the authentication token) in the `profiles` array on the `user` document along with a `provider` field, for example:

```json
{
  "profiles": [
    {
      "provider": "my-auth",
      "id": "..."
    }
  ]
}
```

then you will need to configure the `CORAL_MAPPER_USERS_SSO_PROVIDER` environment variable with the name of the `provider`.

```bash
export CORAL_MAPPER_USERS_SSO_PROVIDER="my-auth"
```

**Only set _either_ `CORAL_MAPPER_USERS_SSO_ID` or `CORAL_MAPPER_USERS_SSO_PROVIDER` but not both, depending on your data**

If your custom plugin wrote the username field to a field that is _not_ called `username` at the top-level of the `user` document, then you will need to set the `CORAL_MAPPER_USERS_USERNAME` environment variable. For example, if your data looks like this:

```json
{
  "metadata": {
    "displayName": "user name"
  }
}
```

you would set `CORAL_MAPPER_USERS_USERNAME="metadata.displayName`. If your username value is stored in `username` at the root level of the document, you do not need to configure this value.

The following example script will run the mapper step as a "dry run" to validate the data:

```bash

# Set this to the folder that contains the exported documents from v4
export CORAL_INPUT_DIRECTORY="$PWD/coral/input"

# Set this to the folder containing the transformed documents
export CORAL_OUTPUT_DIRECTORY="$PWD/coral/output"

# Set this to the ID of your new v7 Tenant.
export CORAL_TENANT_ID=""

# Set this to the ID of your v7 Site.
export CORAL_SITE_ID=""

export CORAL_LOG="$PWD/coral/logs.json"

# Set this to the name of a directory we can write output files that have
# been mapped.
export CORAL_MAPPER_POST_DIRECTORY="$PWD/coral/post"

mkdir -p "${CORAL_MAPPER_POST_DIRECTORY}"

# see note above, uncomment if necessary
# export CORAL_MAPPER_USERS_SSO_PROVIDER=""

# see note above, uncomment if necessary
# export CORAL_MAPPER_USERS_USERNAME=""

coral-importer legacy --dryRun map

```

If this script succeeded, run it a second time, removing the `--dryRun` flag. If it did not succeed, inspect the logs.json file for more information.

### Multiple auth providers in v4 data

If you have multiple values for `profiles[x].provider`, but your SSO authentication system can issue tokens for both types of users, you will need to complete some additional steps. For example, if some user documents look like this:

```json
{
  "profiles": [
    {
      "provider": "provider-1",
      "id": "abc123"
    }
  ]
}
```

and some user documents look like this:

```json
{
  "profiles": [
    {
      "provider": "provider-2",
      "id": "def456"
    }
  ]
}
```

Then running the above process with `CORAL_MAPPER_USERS_SSO_PROVIDER="provider-1"` will only migrate the users that used provider 1. If your SSO system can issue tokens for both types of users, you will just need to migrate the data for each provider separately:

1. Run the import map script for a first time, setting `CORAL_MAPPER_POST_DIRECTORY` to `$PWD/coral/provider-1` and `CORAL_MAPPER_USERS_SSO_PROVIDER` to `"provider-1"`.
2. Run the import map script for a second time, setting `CORAL_MAPPER_POST_DIRECTORY` to `$PWD/coral/provider-2` and `CORAL_MAPPER_USERS_SSO_PROVIDER` to `"provider-2"`.
3. Combine the two files together into one `users.json` file.

If you have two separate authentication providers and your SSO system can only issue tokens for one of them, you will have to have users of the unsupported authentication system log in using the supported authentication system and update or link the accounts from your authentication server. The Coral import mapper does not support mapping to multiple authentication providers.

#### Individual users with multiple providers

If you have individual user documents that have multiple provider values, for example:

```json
{
  "profiles": [
    {
      "provider": "provider-1",
      "id": "def456"
    },
    {
      "provider": "legacy-provider",
      "id": "def456"
    }
  ]
}
```

You will need to select only 1 provider for the map process and ignore the other. Users must have only one `provider` value or there will be errors in the import or login steps.

## 4. Importing transformed data into v7 mongo instance

If you have completed the import mapping process above, replace the `users.json` file in your output directory with the `users.json` file created by the mapper before completing this step.

The following bash script will import the transformed data into your new v7 mongo instance. This operation may take a long time depending on available system resources and the size of your data set.

```bash

# Set this to the MONGO_URL used by the new Coral ^6 instance. This should be
# different than the CORAL_MONGO_URI used by ^4.
export MONGO_URL="..."

# Set this to a folder where we'll export the documents to be uploaded to your
# ^5 database.
export CORAL_OUTPUT_DIRECTORY="$PWD/coral/output"

# This command should get the number of CPU's available on your machine,
# otherwise if it fails just set it to the number of CPU's manually.
export CONCURRENCY="$(sysctl -n hw.ncpu)"

# For each of these collections, import them into the new MongoDB database.
collections=(commentActions stories users comments)
for collection in ${collections[*]}
do
  mongoimport --uri "$MONGO_URL" --file "${CORAL_OUTPUT_DIRECTORY}/$collection.json" --collection "$collection" --numInsertionWorkers $CONCURRENCY
done

```

## 5. Update counts using coral-counts tool

Comment counts in v7 are updated as data is created, so following an import they will all be set to 0. To calculate correct comment counts for imported data, you will need to download and run the [coral-counts](https://github.com/coralproject/coral-counts) tool.

```bash

export MONGODB_URI=""
export TENANT_ID=""
export SITE_ID=""

./coral-counts
```

This command make take a while to run on large data sets.

## 6. Test and verify

You should now be able to visit the admin URL of your new Coral v7 instance and view comment, story, and user data. Attempt to log in as both a commenter and moderator to verify that authentication is configured correctly.
