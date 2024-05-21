# utilities/tenant

This script includes helpful tools for handling and processing tenants with Coral.

# Getting started

Before you can use the tenant scripts, you must first perform a build of Coral. At the root of the repo, perform a build:

```
sh npm-i.sh
sh scripts/build-development.sh
```

Then navigate into this tenant utilities folder and install the dependencies:

```
cd utilities/tenant
npm i
```

# `createTenant` command

```
npm run start -- --mongoURI mongodb://localhost:27017 --mongoDBName coral createTenant
```

The above command will take a `mongoURI` and `mongoDBName` and then prompt you with details so it can create a brand new tenant on that mongo cluster for that dbName.