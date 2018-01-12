---
title: Migrating to v4.0.0
permalink: /migration/4/
---

Since our `v3.*` release, this is the most significant set of changes introduced
into Talk so far, as a major database migration and template change are both required to
run it.

## Dependencies

If you are running via source, once you update your code, it's always important
to run the following in order to update your dependencies:

```bash
yarn
```

If you are running via Docker, you just have to replace your version number with
the desired version from Dockerhub.

## Database Migrations

We have introduced several new fields that require the database to be modified.
To run these migrations, ensure that all nodes of Talk are stopped. It is not
well defined what will happen if a Talk application begins writing data mid
migration.

Running the following will start the migration process:

```bash
./bin/cli migration run
```
This will prompt you to perform a database backup before starting the migration
process. Data loss is entirely possible otherwise.
{: .code-aside}

The migration itself may take some time to complete, as we're reformatting
documents rather than performing a nice table alter. If the process crashes
during the migration, simply re-run it. The migration operations are designed
to act atomically, and be idempotent to documents already updated.

## Database Verifications

In `v3.*`, we introduced the concept of "verifying the database". Some of our
operations update cached values that live along side the original document to
improve performance. Running the cli command for verifying the database's cache
ensures that all the cached values are up to date.

Running the following will start the database verification process:

```bash
./bin/cli verify db --fix
```
You can notice the `--fix` option, without it, the tool should instead perform
a dry run of the operations it intends to perform.
{: .code-aside}

This process, like the migration process, should take some time to complete on
large databases.

Once you have updated your databases, that's all you have to do! Talk should now
function even better and faster with all the new features we poured into v4.0.0!

## Template Change

In `v4.0.0`, we introduced extensive support for compressing our javascript
bundles. To support this, we had to modify our routing. All static files are now
served out of a `/static` prefix, so you will have to change your embed code:

**Old:**

```https://your-talk-url.com/embed.js```

**New:**

```https://your-talk-url.com/static/embed.js```

This should be changed in your embed code on the site where you are embedding
Talk.
