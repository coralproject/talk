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
  enableTreeShake: {
    doc: "Enabled tree shaking in development",
    format: Boolean,
    default: false,
    env: "WEBPACK_TREESHAKE",
    arg: "enableTreeShake",
  },
});

export type Config = typeof config;

export const createClientEnv = (c: Config) => ({
  NODE_ENV: c.get("env"),
});

// Setup the base configuration.
export default config;
