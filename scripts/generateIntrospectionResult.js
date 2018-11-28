#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const { graphql } = require('graphql');
const schema = require('../graph/schema');

// Copied from https://github.com/graphql/graphql-js/blob/f995c1f92e94d9c451104b6a0db8034165ef8640/src/utilities/introspectionQuery.js#L18-L113
// which is available in graphql@0.13.2
//
// TODO: remove when we upgrade to at least graphql@0.13.2.
function getIntrospectionQuery(options = {}) {
  const descriptions = !(options && options.descriptions === false);
  return `
    query IntrospectionQuery {
      __schema {
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
        directives {
          name
          ${descriptions ? 'description' : ''}
          locations
          args {
            ...InputValue
          }
        }
      }
    }
    fragment FullType on __Type {
      kind
      name
      ${descriptions ? 'description' : ''}
      fields(includeDeprecated: true) {
        name
        ${descriptions ? 'description' : ''}
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${descriptions ? 'description' : ''}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }
    fragment InputValue on __InputValue {
      name
      ${descriptions ? 'description' : ''}
      type { ...TypeRef }
      defaultValue
    }
    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}

const generateIntrospectionResult = async (resultLocation, options = {}) => {
  const dir = path.dirname(resultLocation);
  try {
    fs.accessSync(dir);
  } catch (err) {
    console.log(`Cannot write to ${dir}, not generating introspection.json`);
    return;
  }

  const result = await graphql(schema, getIntrospectionQuery(options));

  // Serialize the introspection result as JSON.
  const introspectionResult = JSON.stringify(
    options.raw ? result : result.data,
    null,
    2
  );

  // Write the introspection result to the filesystem.
  fs.writeFileSync(resultLocation, introspectionResult, 'utf8');

  console.log(`Outputted result of introspectionQuery to ${resultLocation}`);
};

const graphIntrospectionFilename = path.resolve(
  __dirname,
  '..',
  'client',
  'coral-framework',
  'graphql',
  'introspection.json'
);

const docsIntrospectionFilename = path.resolve(
  __dirname,
  '..',
  'docs',
  'source',
  '_data',
  'introspection.json'
);

Promise.all([
  generateIntrospectionResult(graphIntrospectionFilename, {
    descriptions: false,
  }),
  generateIntrospectionResult(docsIntrospectionFilename, {
    raw: true,
  }),
]).catch(err => {
  console.error(err);
  process.exit(1);
});
