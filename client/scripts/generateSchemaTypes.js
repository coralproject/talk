const { generateTSTypesAsString } = require("graphql-schema-typescript");
const { loadConfigSync } = require("graphql-config");
const path = require("path");
const fs = require("fs");

async function main() {
  const config = loadConfigSync({});
  const projects = config.projects;

  const files = [
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/server/graph/schema/__generated__/types.ts"
      ),
      config: {
        contextType: "GraphContext",
        importStatements: [
          'import GraphContext from "coral-server/graph/context";',
          'import { Cursor } from "coral-server/models/helpers";',
        ],
        customScalarType: { Cursor: "Cursor", Time: "Date" },
      },
    },
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/client/framework/schema/__generated__/types.ts"
      ),
      config: {
        smartTResult: true,
        smartTParent: true,
      },
    },
  ];

  for (const file of files) {
    // Load the graph schema.
    const schemaConfig = projects[file.name].schema;

    if (!schemaConfig) {
      // eslint-disable-next-line no-console
      console.error(
        `SchemaPath for project ${program.schema} not found in graphql config`
      );
      process.exit(1);
    }

    if (schemaConfig.length > 1) {
      // eslint-disable-next-line no-console
      console.error(`Multiple schemas provided, but we expected only one`);
      process.exit(1);
    }

    const schema = schemaConfig[0];

    // Create the generated directory.
    const dir = path.dirname(file.fileName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Create the types for this file.
    const types = await generateTSTypesAsString(schema, file.fileName, {
      tabSpaces: 2,
      typePrefix: "GQL",
      strictNulls: false,
      ...file.config,
    });

    const content = types;

    // TODO: (cvle) The following comment block contains code that was meant to
    // solve https://vmproduct.atlassian.net/browse/CORL-1377 by adding null as a possible
    // value to optional fields. However the server code is deeply tangled with the
    // previous wrong types and need to be sorted out first.

    // Here comes our modifications.
    /* const resolverIndex = types.indexOf("GQLResolver");
    if (resolverIndex > 0) {
      content =
        // TODO: (cvle) contribute a non-hacky way to the `graphql-schema-typescript` project.
        // Make optional type fields nullable before the GQLResolver part..
        types.slice(0, resolverIndex).replace(/\?: /g, "?: null | ") +
        types.slice(resolverIndex);
    }*/

    fs.writeFileSync(file.fileName, content);
  }

  return files;
}

module.exports = main;

if (require.main === module) {
  // Only run the main module on file load if this is the main module (we're
  // executing this file directly).
  main()
    .then((files) => {
      for (const { fileName } of files) {
        // eslint-disable-next-line no-console
        console.log(`Generated ${fileName}`);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
}
