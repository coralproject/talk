const { Linter, Configuration } = require("tslint");
const { generateTSTypesAsString } = require("graphql-schema-typescript");
const { getGraphQLConfig } = require("graphql-config");
const path = require("path");
const fs = require("fs");

function lintAndWrite(files) {
  const linter = new Linter({ fix: true });

  for (const { fileName, types } of files) {
    const configuration = Configuration.findConfiguration(null, fileName)
      .results;
    linter.lint(fileName, types, configuration);
  }
}

function getFileName(name) {
  return path.join(
    __dirname,
    "../src/core/server/graph",
    name,
    "schema/__generated__/types.ts"
  );
}

async function main() {
  const config = getGraphQLConfig(__dirname);
  const projects = config.getProjects();

  const files = [
    {
      name: "tenant",
      fileName: getFileName("tenant"),
      config: {
        contextType: "TenantContext",
        importStatements: [
          'import { Cursor } from "talk-server/models/connection";',
          'import TenantContext from "talk-server/graph/tenant/context";',
        ],
        customScalarType: { Cursor: "Cursor", Time: "string" },
      },
    },
    {
      name: "management",
      fileName: getFileName("management"),
      config: {
        contextType: "ManagementContext",
        importStatements: [
          'import ManagementContext from "talk-server/graph/management/context";',
        ],
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
    file.types = await generateTSTypesAsString(schema, {
      tabSpaces: 2,
      typePrefix: "GQL",
      strictNulls: false,
      ...file.config,
    });
  }

  // Send the files off to the linter to be linted and written.
  lintAndWrite(files);

  return files;
}

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
