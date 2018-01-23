#! /usr/bin/env node

const path = require('path');
const introspectionFilename = path.resolve(
  __dirname,
  '..',
  'client',
  'coral-framework',
  'graphql',
  'introspection.json'
);

const fs = require('fs');
const { graphql, introspectionQuery } = require('graphql');
const schema = require('../graph/schema');

graphql(schema, introspectionQuery)
  .then(({ data }) => {
    // Serialize the introspection result as JSON.
    const introspectionResult = JSON.stringify(data, null, 2);

    // Write the introspection result to the filesystem.
    fs.writeFileSync(introspectionFilename, introspectionResult, 'utf8');

    console.log(
      `Outputted result of introspectionQuery to ${introspectionFilename}`
    );
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
