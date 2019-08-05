#!/usr/bin/env ts-node

import program from "commander";
import spawn from "cross-spawn";
import fs from "fs";
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
  // tslint:disable-next-line:no-console
  console.error("Schema identifier not provided");
  process.exit(1);
}

if (!program.src) {
  // tslint:disable-next-line:no-console
  console.error("Src not provided");
  process.exit(1);
}

if (!config.projects) {
  // tslint:disable-next-line:no-console
  console.error("Missing projects key in .graphqconfig");
  process.exit(1);
}
if (!config.projects[program.schema]) {
  // tslint:disable-next-line:no-console
  console.error(`Project ${program.schema} not found in .graphqconfig`);
  process.exit(1);
}
if (!config.projects[program.schema].schemaPath) {
  // tslint:disable-next-line:no-console
  console.error(
    `SchemaPath for project ${program.schema} not found in .graphqconfig`
  );
  process.exit(1);
}

const args = [
  "--language",
  "typescript",
  "--no-watchman",
  "--src",
  program.src,
  "--artifactDirectory",
  `${program.src}/__generated__`,
  "--schema",
  config.projects[program.schema].schemaPath,
];

if (program.persist) {
  args.push("--persist-output", `${program.src}/persisted-queries.json`);
}

spawn.sync("relay-compiler", args, { stdio: "inherit" });
