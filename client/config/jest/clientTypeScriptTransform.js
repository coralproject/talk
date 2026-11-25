const path = require("path");
const tsJest = require("ts-jest").default;

const transformer = tsJest.createTransformer({
  babelConfig: true,
  tsconfig: path.resolve(__dirname, "../../src/core/client/tsconfig.json"),
  useESM: true,
});

// Keep ES modules intact until Babel has applied the Relay transform. The
// Babel environment preset then emits CommonJS for Jest.
const process = transformer.process.bind(transformer);
transformer.process = (sourceText, sourcePath, transformOptions) =>
  process(sourceText, sourcePath, {
    ...transformOptions,
    supportsStaticESM: true,
  });

module.exports = transformer;
