const { Linter, Configuration } = require("tslint");
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
        "../src/core/server/graph/tenant/schema/__generated__/types.ts"
      ),
      config: {
        contextType: "TenantContext",
        importStatements: [
          'import TenantContext from "talk-server/graph/tenant/context";',
          'import { Cursor } from "talk-server/models/helpers/connection";',
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
        // tslint:disable-next-line:no-console
        console.log(`Generated ${fileName}`);
      }
    })
    .catch(err => {
      // tslint:disable-next-line:no-console
      console.error(err);
    });
}
