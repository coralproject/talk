/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import readLine from "readline";

const CONFIG_FILE = "importBlocker.json";

interface Source {
  name: string;
  directory: string;
  blockedImports: string[];
  extensions: string[];
}

interface Config {
  sources: Source[];
}

interface Error {
  path: string;
  lineNumber: number;
  line: string;
}

const loadConfig = (): Config => {
  const configRaw = fs.readFileSync(CONFIG_FILE).toString();
  const config = JSON.parse(configRaw) as Config;

  return config;
};

const errors: Error[] = [];

const processFile = async (
  source: Source,
  filePath: string,
  filters: string[]
) => {
  const stream = fs.createReadStream(filePath);
  const reader = readLine.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let lineCounter = 0;
  for await (const line of reader) {
    for (const filter of filters) {
      if (line.includes(filter)) {
        errors.push({
          path: filePath,
          lineNumber: lineCounter,
          line,
        });
      }
    }

    lineCounter++;
  }
};

const processDir = async (source: Source, dir: string, filters: string[]) => {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.lstatSync(fullPath);

    if (stats.isDirectory()) {
      await processDir(source, fullPath, filters);
    } else if (stats.isFile()) {
      const ext = path.extname(item);

      if (source.extensions.includes(ext)) {
        await processFile(source, fullPath, filters);
      }
    }
  }
};

const run = async () => {
  const config = loadConfig();

  for (const source of config.sources) {
    const filters = source.blockedImports.map(
      (blockedImport) => `from "${blockedImport}`
    );

    await processDir(source, source.directory, filters);
  }

  if (errors.length > 0) {
    console.error("Blocked imports linter found the following errors:");

    for (const error of errors) {
      console.error(
        `  Blocked import found in '${error.path}' on line ${error.lineNumber}: ${error.line}`
      );
    }

    process.exit(1);
  } else {
    console.log("Blocked imports linter found 0 errors.");
  }
};

run().finally(() => {});
