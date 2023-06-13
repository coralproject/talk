#!/usr/bin/env ts-node
/* eslint-disable no-console */

import { exec, ExecException } from "child_process";
import program from "commander";
import fs from "fs-extra";

const CLIENT_ROOT = "./src/core/client";

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

program
  .version("0.1.0")
  .usage("--bundle stream")
  .option("--bundle <name>", "Find gql recursively in the bundle")
  .option("--persist", "Use persisted queries")
  .description("Compile relay gql data")
  .parse(process.argv);

if (!program.bundle) {
  // eslint-disable-next-line no-console
  console.error("bundle not provided");
  process.exit(1);
}

// Set the persisted query path.
const persist = program.persist
  ? `${CLIENT_ROOT}/${program.bundle}/persisted-queries.json`
  : null;

// create artifact directory if it does not exist
const artifactDir = `./src/core/client/${program.bundle}/__generated__`;
fs.ensureDirSync(artifactDir);

const logExec = (
  error: ExecException | null,
  stdout: string,
  stderr: string
) => {
  if (stderr && stderr.trim() !== "") {
    console.log(stderr);
  }
  if (stdout && stdout.trim() !== "") {
    console.log(stdout);
  }

  if (error) {
    console.log(error);
  }
};

// ensure a persisted-queries.json exists so that relay
// doesn't panic when we tell it to `repersist` to output
// our persisted-queries.json since the way it knows to
// make a new file is a diffing algorithm against a previous
// file.
if (persist) {
  fs.writeFileSync(persist, "{}", "utf-8");
}

const run = async () => {
  // combine graphql files together for bundle
  exec(
    `cat ./src/core/server/graph/schema/schema.graphql \
    ./src/core/client/framework/lib/relay/local.graphql \
    ./src/core/client/${program.bundle}/local/local.graphql > \
    ./src/core/client/${program.bundle}/local/combined.graphql`,
    logExec
  );

  exec(
    `npm run relay -- --repersist src/core/client/${program.bundle}/relay.config.json`,
    logExec
  );

  // it takes a moment to dump out the persisted queries.
  await sleep(1000);

  if (persist && fs.existsSync(persist)) {
    // Create the new folder.
    const generated = "./src/core/server/graph/persisted/__generated__";

    // Create the generated directory if it doesn't exist.
    fs.ensureDirSync(generated);

    // Copy the file over to the destination directory.
    fs.copySync(persist, `${generated}/${program.bundle}.json`, {
      overwrite: true,
    });
  }
};

void run();
