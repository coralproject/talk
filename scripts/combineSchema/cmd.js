const { mergeTypeDefs } = require("@graphql-tools/merge");
const { print } = require("graphql");
const fs = require("fs");
const path = require("path");

const getArg = (name) => {
  const argIndex = process.argv.indexOf(name);
  if (argIndex === -1) {
    // eslint-disable-next-line no-console
    console.error(`unable to find argument: ${name}`);
  }

  const valueIndex = argIndex + 1;
  if (valueIndex >= process.argv.length) {
    // eslint-disable-next-line no-console
    console.error(`no value provided for ${name}`);
  }

  return process.argv[valueIndex];
};

const paths = getArg("--paths");
const output = getArg("--output");

const schemaPaths = paths.split(",");

const outputDir = path.dirname(output);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const schemas = schemaPaths.map((schemaPath) => {
  const p = schemaPath.trim();
  return fs.readFileSync(p).toString();
});

const mergedSchema = mergeTypeDefs(schemas);

const result = print(mergedSchema);
fs.writeFileSync(output, result);
