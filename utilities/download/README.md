# utilities/download

This script allows users to download tenant data from a Mongo database by `tenantID`.

# Getting started

Navigate into the `utilities/download` folder and install the dependencies:

```
cd utilities/download
npm i
```

Then create a config file named `config.json` in the `utilities/download` folder following a similar format to the config file defined below:

```
{
  "mongoURI": "mongodb://localhost:27017",
  "mongoDBName": "coral",
  "outputDir": "output/test/",
  "tenantIDs": [
    "60b9be43-e0ab-4145-8532-5b0d761016fd"
  ]
}
```

Then you can download from the database via the following command:

```
npm run start -- -c config.json
```