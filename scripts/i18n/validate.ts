#!/usr/bin/env ./node_modules/.bin/tsnd

//
// Based on the script written by @cristiandean
//
// Source: https://gist.github.com/cristiandean/8196bc2b965f9acf9ad8f9e4530011c1
//

import { FluentResource } from "@fluent/bundle";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

const LOCALE_DIRECTORIES = [
  path.join(PROJECT_ROOT, "src/locales"),
  path.join(PROJECT_ROOT, "src/core/server/locales"),
];

const wrap = (color: string) => (msg: string) => {
  if (!msg) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`${color}%s\x1b[0m`, msg);
};

const log = {
  red: wrap("\x1b[31m"),
  green: wrap("\x1b[32m"),
  plain: wrap("\x1b[0m"),
};

interface LocaleFileListing {
  locale: string;
  files: LocaleFile[];
}

interface LocaleFile {
  fileName: string;
  directory: string;
  filePath: string;
  keys: Set<string>;
}

function loadLocale(locale: string) {
  const listing: LocaleFileListing = { locale, files: [] };

  for (const directory of LOCALE_DIRECTORIES) {
    // Resolve the directory with the language code, this should be a folder
    // containing language files for the specified context.
    const localeDirectory = path.join(directory, locale);
    if (!fs.existsSync(localeDirectory)) {
      continue;
    }

    // The folder exists, list all files in this directory and begin loading
    // them.
    const localeFiles = fs.readdirSync(localeDirectory);
    for (const fileName of localeFiles) {
      const filePath = path.join(localeDirectory, fileName);

      // Load the file.
      const source = fs.readFileSync(filePath, "utf-8").toString();

      // Create the resource based on the file.
      const resource = new FluentResource(source);

      // Iterate over the ids to create the set of ID's.
      const keys = new Set<string>();

      for (const entry of resource.body) {
        if (entry.id.startsWith("-")) {
          // Identifiers starting with a `-` define terms, these are not used
          // for this as we're only comparing messages.
          continue;
        }

        keys.add(entry.id);
      }

      // Add the new file.
      listing.files.push({ fileName, directory, filePath, keys });
    }
  }

  return listing;
}

function diffSet(a: Set<string>, b: Set<string>): Set<string> {
  const n = new Set(a);
  for (const e of b) {
    n.delete(e);
  }
  return n;
}

function prefixDiffSet(prefix: string, a: Set<string>, b: Set<string>) {
  return [...diffSet(a, b).values()]
    .map((value) => `${prefix}${value}`)
    .join("\n");
}

function diff(from: LocaleFileListing, to: LocaleFileListing) {
  for (const f of from.files) {
    // Log the header information for this file.
    log.plain(`* From: ${f.filePath}`);

    // Find the associated "to" file.
    const t = to.files.find(
      (file) => file.fileName === f.fileName && file.directory === f.directory
    );
    if (!t) {
      log.red(
        `* To:   ${path.join(f.directory, to.locale, f.fileName)} (missing)`
      );
      log.plain("-".repeat(60));
      continue;
    }

    log.plain(`* To:   ${t.filePath}`);

    log.green(prefixDiffSet("  + ", f.keys, t.keys));
    log.red(prefixDiffSet("  - ", t.keys, f.keys));

    log.plain("-".repeat(60));
  }
}

function main() {
  try {
    if (process.argv.length < 3) {
      throw new Error("usage: ./scripts/i18n/missingTranslations.ts <locale>");
    }

    // Load the target translation.
    const to = loadLocale(process.argv[2]);

    // Load the base language (US English).
    const from = loadLocale("en-US");

    // Report the difference in key existence.
    diff(from, to);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    process.exit(1);
  }
}

main();
