import config from "./config";

export const CONFIG = Symbol("CONFIG");

export function createConfig() {
  // Load the configuration.
  config.validate({ allowed: "strict" });

  // Do some extra validation for production.
  if (config.get("env") === "production") {
    // Ensure that the signing secret has been specified.
    if (config.get("signing_secret") === config.default("signing_secret")) {
      throw new Error("SIGNING_SECRET is required in production environments");
    }
  }

  return config;
}
