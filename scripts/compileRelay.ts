#!/usr/bin/env ts-node

import program from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";
import path from "path";

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../.graphqlconfig"), "utf8")
);

program
  .version("0.1.0")
  .usage("--src ./src/core/client/stream --schema tenant")
  .option("--src <folder>", "Find gql recursively in this folder")
  .option("--schema <schema>", "Identifier of schema")
  .option("--persist", "Use persisted queries")
  .description("Compile relay gql data")
  .parse(process.argv);

if (!program.schema) {
  // eslint-disable-next-line no-console
  console.error("Schema identifier not provided");
  process.exit(1);
}

if (!program.src) {
  // eslint-disable-next-line no-console
  console.error("Src not provided");
  process.exit(1);
}

if (!config.projects) {
  // eslint-disable-next-line no-console
  console.error("Missing projects key in .graphqconfig");
  process.exit(1);
}
if (!config.projects[program.schema]) {
  // eslint-disable-next-line no-console
  console.error(`Project ${program.schema} not found in .graphqconfig`);
  process.exit(1);
}
if (!config.projects[program.schema].schemaPath) {
  // eslint-disable-next-line no-console
  console.error(
    `SchemaPath for project ${program.schema} not found in .graphqconfig`
  );
  process.exit(1);
}

const args = [
  "--language",
  "typescript",
  "--no-watchman",
  "--customScalars.Time=String",
  "--customScalars.Cursor=unknown",
  "--customScalars.Locale=string",
  "--src",
  program.src,
  "--artifactDirectory",
  `${program.src}/__generated__`,
  "--schema",
  config.projects[program.schema].schemaPath,
];

// Set the persisted query path.
const persist = program.persist
  ? `${program.src}/persisted-queries.json`
  : null;
if (persist) {
  args.push("--persist-output", persist);
}

spawn.sync("relay-compiler", args, { stdio: "inherit" });

if (persist) {
  if (fs.existsSync(persist)) {
    // Create the new filename.
    const name = path.basename(program.src);
    const generated = "./src/core/server/graph/persisted/__generated__";

    // Create the generated directory if it doesn't exist.
    fs.ensureDirSync(generated);

    // Copy the file over to the destination directory.
    fs.copySync(persist, `${generated}/${name}.json`, {
      overwrite: true,
    });
  }
}
