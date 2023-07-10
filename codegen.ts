import { CodegenConfig } from "@graphql-codegen/cli";
// import prefixType from "./scripts/prefixTypes";

const config: CodegenConfig = {
  schema: "src/core/server/graph/schema/schema.graphql",
  generates: {
    "src/core/server/graph/schema/__generated__/types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-resolvers",
        "typescript-document-nodes",
      ],
      config: {
        contextType: "GraphContext",
        preResolveTypes:
          'import GraphContext from "coral-server/graph/context";',
        namingConvention: {
          typeNames: (name) => `GQL${name}`,
          enumvValues: "keep",
        },
      },
    },
  },
};

export default config;
