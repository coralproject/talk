import program from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";

const CLIENT_ROOT = "./src/core/client";

program
  .version("0.1.0")
  .usage("--bundle stream")
  .option("--bundle <name>", "Find gql recursively in the bundle")
  .option("--persist", "Use persisted queries")
  .description("Compile relay gql data")
  .parse(process.argv);

const schema = "../server/src/core/server/graph/schema/schema.graphql";

if (!program.bundle) {
  // eslint-disable-next-line no-console
  console.error("bundle not provided");
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
  CLIENT_ROOT,
  "--include",
  `./framework/**`,
  "--include",
  `./${program.bundle}/**`,
  "--artifactDirectory",
  `${CLIENT_ROOT}/${program.bundle}/__generated__`,
  "--schema",
  schema,
];

// Set the persisted query path.
const persist = program.persist
  ? `${CLIENT_ROOT}/${program.bundle}/persisted-queries.json`
  : null;
if (persist) {
  args.push("--persist-output", persist);
}

spawn.sync("relay-compiler", args, { stdio: "inherit" });

if (persist) {
  if (fs.existsSync(persist)) {
    // Create the new filename.
    const generated = "../server/src/core/server/graph/persisted/__generated__";

    // Create the generated directory if it doesn't exist.
    fs.ensureDirSync(generated);

    // Copy the file over to the destination directory.
    fs.copySync(persist, `${generated}/${program.bundle}.json`, {
      overwrite: true,
    });
  }
}
