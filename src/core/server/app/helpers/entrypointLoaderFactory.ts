import fetch from "node-fetch";
import path from "path";

import logger from "coral-server/logger";

import Entrypoints, { Entrypoint } from "./entrypoints";

interface EntrypointLoaderOptions {
  /** If set, load manifest from webpack dev server instead */
  fromWebpackDevServerURL?: string | null;
}

export type EntrypointLoader = () => Promise<Readonly<Entrypoint> | null>;

function loadManifestFromFile(manifestFilename: string) {
  // TODO: (wyattjoh) figure out a better way of referencing paths.
  // Load the entrypoint manifest.
  const manifestFilepath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "dist",
    "static",
    manifestFilename
  );
  return Entrypoints.fromFile(manifestFilepath);
}

export default class EntrypointLoaderFactory {
  private manifestFilename: string;
  private entrypoints: Entrypoints | null = null;
  private options: EntrypointLoaderOptions;

  constructor(manifestFilename: string, options: EntrypointLoaderOptions = {}) {
    this.manifestFilename = manifestFilename;
    this.options = options;

    if (!options.fromWebpackDevServerURL) {
      // Load directly from file and cache it.
      this.entrypoints = loadManifestFromFile(this.manifestFilename);
      if (!this.entrypoints) {
        throw new Error(
          `Failed to load manifest file ${this.manifestFilename}`
        );
      }
    }
  }

  public create(name: string): EntrypointLoader {
    if (this.options.fromWebpackDevServerURL) {
      const url = `${this.options.fromWebpackDevServerURL}/${this.manifestFilename}`;
      return async () => {
        // Loading manifests from Webpack Dev Server each time this is called.
        logger.info(`Loading manifests from Webpack Dev Server '${url}'`);
        const res = await fetch(url);
        if (!res.ok) {
          logger.error(
            { manifest: url },
            "could not load the generated manifest"
          );
          return null;
        }
        const manifest = await res.json();
        return new Entrypoints(manifest).get(name);
      };
    }
    // Used cached manifest loaded from file instead.
    if (this.entrypoints) {
      const entrypoint = this.entrypoints.get(name);
      return () => Promise.resolve(entrypoint);
    }
    throw new Error(`Failed to load entrypoint ${name}`);
  }
}
