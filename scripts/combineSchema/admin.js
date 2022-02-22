const { mergeTypeDefs } = require("@graphql-tools/merge");
const { print } = require("graphql");
const fs = require("fs");
const path = require("path");

const SCHEMA_PATH = "./src/core/server/graph/schema/schema.graphql";
const FRAMEWORK_LOCAL_PATH =
  "./src/core/client/framework/lib/relay/local.graphql";
const LOCAL_PATH = "./src/core/client/admin/local/local.graphql";
const OUTPUT_PATH = "__generated__/combined.admin.graphql";

const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const schema = fs.readFileSync(SCHEMA_PATH).toString();
const framework = fs.readFileSync(FRAMEWORK_LOCAL_PATH).toString();
const local = fs.readFileSync(LOCAL_PATH).toString();

const mergedSchema = mergeTypeDefs([schema, framework, local]);

const result = print(mergedSchema);
fs.writeFileSync(OUTPUT_PATH, result);
