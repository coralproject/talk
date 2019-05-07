import convict from "convict";

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port the server is bound to",
    format: "port",
    default: 3000,
    env: "PORT",
    arg: "port",
  },
  dev_port: {
    doc: "The port to bind for the Webpack Dev Server.",
    format: "port",
    default: 8080,
    env: "DEV_PORT",
    arg: "dev-port",
  },
  generateReport: {
    doc: "Generate a report using webpack-bundle-analyzer",
    format: Boolean,
    default: false,
    env: "WEBPACK_REPORT",
    arg: "generateReport",
  },
  disableSourcemaps: {
    doc: "Disable sourcemaps generation",
    format: Boolean,
    default: false,
    env: "WEBPACK_DISABLE_SOURCEMAPS",
    arg: "disableSourceMaps",
  },
  disableMinimize: {
    doc: "Disable minimization in production",
    format: Boolean,
    default: false,
    env: "WEBPACK_DISABLE_MINIMIZE",
    arg: "disableMinimize",
  },
  disableChunkSplitting: {
    doc: "Disables chunk splitting beheviour",
    format: Boolean,
    default: false,
    env: "WEBPACK_DISABLE_CHUNK_SPLITTING",
    arg: "disableChunkSplitting",
  },
  enableTreeShake: {
    doc: "Enabled tree shaking in development",
    format: Boolean,
    default: false,
    env: "WEBPACK_TREESHAKE",
    arg: "enableTreeShake",
  },
  maxCores: {
    doc: "Set maximum of available cores",
    format: "nat",
    default: require("os").cpus().length,
    env: "WEBPACK_MAX_CORES",
    arg: "maxCores",
  },
});

export type Config = typeof config;

export const createClientEnv = (c: Config) => ({
  NODE_ENV: c.get("env"),
});

// Setup the base configuration.
export default config;
