#!/usr/bin/env ts-node

import program from "commander";
import fs from "fs-extra";
import { ExecException, exec } from "child_process";

const CLIENT_ROOT = "./src/core/client";

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

if (persist && fs.existsSync(persist)) {
  // Create the new filename.
  const generated = "./src/core/server/graph/persisted/__generated__";

  // Create the generated directory if it doesn't exist.
  fs.ensureDirSync(generated);

  // Copy the file over to the destination directory.
  fs.copySync(persist, `${generated}/${program.bundle}.json`, {
    overwrite: true,
  });
}

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

// combine graphql files together for bundle
exec(
  `cat ./src/core/server/graph/schema/schema.graphql \
    ./src/core/client/framework/lib/relay/local.graphql \
    ./src/core/client/${program.bundle}/local/local.graphql > \
    ./src/core/client/${program.bundle}/local/combined.graphql`,
  logExec
);

exec(
  `npm run relay -- src/core/client/${program.bundle}/relay.config.json`,
  logExec
);
