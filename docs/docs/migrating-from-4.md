---
title: Migrating from v4.x to v5+
---

## **⏰It is currently not possible to upgrade directly from 4.x.x versions to version 5.x**+ ⏰

**Trying will break your install of Coral!**

Coral version 5+ is more than just a version bump, it includes a fundamental rewrite of underlying core components, changes to the database schema, and the introduction of Typescript strong data types. This means migrating is a bit more complicated than running a simple database migration.

### Migration Path

A step by step migration path is currently in development, and we will be announcing it here once it’s ready.

The process for migration will include:

- Create a mongodump export of your 4.x.x database
- Use an import tool to transform the data for v5+, and import it to a new mongo database
- Deploy & configure v5 on your production infrastructure (pointing to new DB)
- Update your embed script to the new version

Downtime will be required to complete the migration, and you should carefully plan your migration accordingly depending on your infrastructure setup, and amount of data to be migrated.

### Migrating Plugins

Plugins are no longer supported and will not work with any instance of Coral >= v5. Most of the optional `talk-plugin` features have been built right into core so you no longer need install, manage, and worry about plugins. If you were using plugins to achieve custom functionality, please contact us to learn about some of the new ways to solve custom use cases in v5 and beyond.

### Supporting your Migration

We would love to help!

If you’re currently running any open source version 4.x/5.x+ and would like
assistance with planning and/or executing a migration please reach out to us at
support@coralproject.net.

We can help you figure out the best path forward, and give you early access to
the migration tools we’re working on.
