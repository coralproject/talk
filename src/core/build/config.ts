import convict from "convict";
import os from "os";

import { LOCALES } from "../common/helpers/i18n/locales";

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
  defaultLocale: {
    doc: "Specify the default locale to use",
    format: LOCALES,
    default: "en-US",
    env: "LOCALE",
  },
  fallbackLocale: {
    doc: "Specify the default fallback locale to use",
    format: LOCALES,
    default: "en-US",
    env: "FALLBACK_LOCALE",
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
  /** Enable react profiler support: https://kentcdodds.com/blog/profile-a-react-app-for-performance  */
  enableReactProfiler: {
    doc: "Enable react profiler in production",
    format: Boolean,
    default: false,
    env: "REACT_PROFILER",
    arg: "enableReactProfiler",
  },
  maxCores: {
    doc: "Set maximum of available cores",
    format: "nat",
    default: os.cpus().length,
    env: "WEBPACK_MAX_CORES",
    arg: "maxCores",
  },
});

export type Config = typeof config;

/**
 * createClientEnv returns the environment that will be available inside
 * the webpack bundle.
 */
export const createClientEnv = (c: Config) => ({
  NODE_ENV: c.get("env"),
  WEBPACK: "true",
});

// Setup the base configuration.
export default config;
