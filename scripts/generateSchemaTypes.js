const { generateTSTypesAsString } = require("graphql-schema-typescript");
const { getGraphQLConfig } = require("graphql-config");
const path = require("path");
const fs = require("fs");

async function main() {
  const config = getGraphQLConfig(__dirname);
  const projects = config.getProjects();

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
    const schema = projects[file.name].getSchema();

    // Create the generated directory.
    const dir = path.dirname(file.fileName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Create the types for this file.
    const types = await generateTSTypesAsString(schema, {
      tabSpaces: 2,
      typePrefix: "GQL",
      strictNulls: false,
      ...file.config,
    });

    fs.writeFileSync(file.fileName, types);
  }

  return files;
}

module.exports = main;

if (require.main === module) {
  // Only run the main module on file load if this is the main module (we're
  // executing this file directly).
  main()
    .then(files => {
      for (const { fileName } of files) {
        // eslint-disable-next-line no-console
        console.log(`Generated ${fileName}`);
      }
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
}
