const codegen = require("@graphql-codegen/core").codegen;
const { MapperKind, mapSchema } = require("@graphql-tools/utils");

const typescriptPlugin = require("@graphql-codegen/typescript");
const { generateTSTypesAsString } = require("graphql-schema-typescript");
const { loadConfigSync } = require("graphql-config");
const path = require("path");
const fs = require("fs");
const { GraphQLEnumType } = require("graphql");

function futureProofEnums(schema) {
  return mapSchema(schema, {
    [MapperKind.ENUM_TYPE]: (type) => {
      const config = type.toConfig();
      config.values = {
        ...config.values,
        FUTURE_PROOF: {
          value: "FUTURE_PROOF",
        },
      };
      return new GraphQLEnumType(config);
    },
  });
}

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
      resolverTypes: true,
    },
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/client/framework/testHelpers/schema/__generated__/resolverTypes.ts"
      ),
      config: {
        smartTResult: true,
        smartTParent: true,
      },
      resolverTypes: true,
    },
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/common/schema/__generated__/schemaTypes.ts"
      ),
    },
    {
      name: "stream",
      fileName: path.join(
        __dirname,
        "../src/core/client/stream/schema/__generated__/streamSchemaTypes.ts"
      ),
    },
    {
      name: "admin",
      fileName: path.join(
        __dirname,
        "../src/core/client/admin/schema/__generated__/adminSchemaTypes.ts"
      ),
    },
    {
      name: "auth",
      fileName: path.join(
        __dirname,
        "../src/core/client/auth/schema/__generated__/authSchemaTypes.ts"
      ),
    },
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/client/install/schema/__generated__/installSchemaTypes.ts"
      ),
    },
    {
      name: "tenant",
      fileName: path.join(
        __dirname,
        "../src/core/client/account/schema/__generated__/accountSchemaTypes.ts"
      ),
    },
  ];

  for (const file of files) {
    // Load the graph schema.
    const schema = projects[file.name].getSchemaSync();

    // Create the generated directory.
    const dir = path.dirname(file.fileName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let content = "";

    if (file.resolverTypes) {
      // Create the types for this file.
      content = await generateTSTypesAsString(schema, file.fileName, {
        tabSpaces: 2,
        typePrefix: "GQL",
        strictNulls: false,
        ...file.config,
      });
    } else {
      content = await codegen({
        // used by a plugin internally, although the 'typescript' plugin currently
        // returns the string output, rather than writing to a file
        filename: file.fileName,
        schema: futureProofEnums(schema),
        plugins: [
          {
            typescript: {
              futureProofEnums: true,
              futureProofUnions: true,
              enumsAsConst: true,
              scalars: {
                Cursor: "string",
                Time: "string",
                Locale: "string",
              },
              typesPrefix: "GQL",
              namingConvention: "keep",
              ...file.config,
            }, // Here you can pass configuration to the plugin
          },
        ],
        pluginMap: {
          typescript: typescriptPlugin,
        },
      });
      content = content.replace(
        /FUTURE_PROOF: 'FUTURE_PROOF'/g,
        "'%future added value': '%future added value'"
      );
    }

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
