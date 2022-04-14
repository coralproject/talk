---
title: "Migrating to v7: Migrating Data"
---

# Migrating data from v4 to v7+

Once you have created a new v7 Coral instance, **but before you have created _any_ data in that new instance**, you can export your data from v4 and import it into v7. Ensure you start with a clean install with no stories, comments, or users to avoid data conflicts.

Migrating data from v4 to v7+ is enabled through the [coral-importer tool](https://github.com/coralproject/coral-importer/tree/v0.5.0-alpha.4). Given the URL to your v4 mongo instance, it will output transformed json files to be imported into your v7 mongo instance.

## Prerequisites for using coral-importer

- URL for v4 talk mongo instance
- ID for your new v7 tenant
- ID for site in your new v7 tenant (there should be a single site, import to multi-site is not supported)
- 8-12 GB of RAM
- familiarity with mongo DB. For larger or more complex data sets (ex those that used custom SSO or other multiple auth providers), a higher level of expertise may be required.

[Read documentation for coral-importer](https://github.com/coralproject/coral-importer/tree/v0.5.0-alpha.4)
