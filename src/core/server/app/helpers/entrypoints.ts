import fs from "fs";

import logger from "coral-server/logger";

export interface Asset {
  src: string;
  integrity: string;
}

/**
 * Entrypoint is the version of the entrypoint that has collected entries with
 * integrity values.
 */
export type Entrypoint = Record<string, Asset[]>;

/**
 * RawEntrypoint is the entrypoint entry generated by the webpack plugin.
 */
export type RawEntrypoint = Record<string, string[]>;

/**
 * Manifest is the full raw manifest that is generated by the webpack plugin.
 */
export type Manifest = {
  /**
   * entrypoints are generated by the webpack plugin for each of the entrypoints
   * with their required chunks.
   */
  entrypoints: Record<string, RawEntrypoint>;
} & Record<string, Asset>;

/**
 * Entrypoints will parse the manifest provided by the `webpack-assets-manifest`
 * plugin and make their assets available for each entrypoint.
 */
export default class Entrypoints {
  private entrypoints = new Map<string, Entrypoint>();

  constructor(manifest: Manifest) {
    for (const entry in manifest.entrypoints) {
      if (!Object.prototype.hasOwnProperty.call(manifest.entrypoints, entry)) {
        continue;
      }

      // Grab the entrypoint that contains the list of all the assets
      // for this entrypoint.
      const entrypoint: Entrypoint = {};

      // Itterate over the extension's in the entrypoint.
      for (const extension in manifest.entrypoints[entry]) {
        if (
          !Object.prototype.hasOwnProperty.call(
            manifest.entrypoints[entry],
            extension
          )
        ) {
          continue;
        }

        // Create the extension in the entrypoint.
        entrypoint[extension] = [];

        // Grab the files in the extension.
        const assets = manifest.entrypoints[entry][extension];

        // Itterate over the src field for each of the files.
        for (const src of assets) {
          // Search for the entry in the assets.
          for (const name in manifest) {
            if (
              name !== "entrypoints" &&
              !Object.prototype.hasOwnProperty.call(manifest, name)
            ) {
              continue;
            }

            // Grab the asset.
            const asset = manifest[name];

            // Check to see if the asset is a match.
            if (asset.src === src) {
              entrypoint[extension].push(asset);
              break;
            }
          }
        }

        this.entrypoints.set(entry, entrypoint);
      }
    }
  }

  public get(name: string): Readonly<Entrypoint> {
    const entrypoint = this.entrypoints.get(name);
    if (!entrypoint) {
      throw new Error(`Entrypoint ${name} does not exist in the manifest`);
    }

    return entrypoint;
  }

  public static fromFile(filepath: string): Entrypoints | null {
    try {
      // Load the manifest.
      const manifest = JSON.parse(
        fs.readFileSync(filepath, { encoding: "utf8" })
      );

      // Create and return the entrypoints.
      return new Entrypoints(manifest);
    } catch (err) {
      logger.error(
        { err },
        "could not load the manifest, maybe you need to run `npm run build`"
      );
      return null;
    }
  }
}
