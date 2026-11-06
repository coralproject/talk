import { parseArgs } from "util";

import { archiveTenant, inspectTenant, verifyArchive } from "./archive";
import { purgeTenant } from "./purge";

const USAGE = `Usage:
  npm run start -- inspect --tenant <tenant-id>
  npm run start -- archive --tenant <tenant-id> --bundle <new-directory> --quiesced
  npm run start -- verify --bundle <directory>
  npm run start -- purge --bundle <directory> --quiesced --execute --confirm <tenant-id>

Environment:
  MONGODB_URI              required live MongoDB URI
  MONGODB_DB_NAME          live database name (default: coral)
  MONGODB_ARCHIVE_URI      optional archive MongoDB URI (defaults to live)
  MONGODB_ARCHIVE_DB_NAME  optional archive database name (defaults to live)

Purge tuning:
  --batch-size <number>     documents per delete batch (default: 500)
  --sleep-ms <number>       delay between batches (default: 100)
`;

function requiredOption(value: string | undefined, option: string): string {
  if (!value) {
    throw new Error(`${option} is required`);
  }
  return value;
}

async function run(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    strict: true,
    options: {
      tenant: { type: "string" },
      bundle: { type: "string" },
      quiesced: { type: "boolean", default: false },
      execute: { type: "boolean", default: false },
      confirm: { type: "string" },
      "batch-size": { type: "string", default: "500" },
      "sleep-ms": { type: "string", default: "100" },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help || positionals.length !== 1) {
    process.stdout.write(USAGE);
    if (!values.help) {
      process.exitCode = 1;
    }
    return;
  }

  const command = positionals[0];
  switch (command) {
    case "inspect":
      await inspectTenant(requiredOption(values.tenant, "--tenant"));
      break;
    case "archive":
      if (!values.quiesced) {
        throw new Error(
          "--quiesced is required to assert tenant writes and jobs are stopped"
        );
      }
      await archiveTenant(
        requiredOption(values.tenant, "--tenant"),
        requiredOption(values.bundle, "--bundle")
      );
      break;
    case "verify":
      await verifyArchive(requiredOption(values.bundle, "--bundle"));
      break;
    case "purge": {
      const bundle = requiredOption(values.bundle, "--bundle");
      const confirmation = requiredOption(values.confirm, "--confirm");
      if (!values.quiesced) {
        throw new Error(
          "--quiesced is required to assert tenant writes and jobs are stopped"
        );
      }
      if (!values.execute) {
        throw new Error(
          "--execute is required for the destructive purge phase"
        );
      }

      const { readManifest } = await import("./manifest");
      const manifest = await readManifest(bundle);
      if (confirmation !== manifest.tenantID) {
        throw new Error("--confirm must exactly match the archived tenant ID");
      }
      await purgeTenant(bundle, {
        batchSize: Number(values["batch-size"]),
        sleepMS: Number(values["sleep-ms"]),
      });
      break;
    }
    default:
      throw new Error(`unknown command "${command}"\n\n${USAGE}`);
  }
}

void run().catch((err) => {
  process.stderr.write(
    `tenant-lifecycle failed: ${
      err instanceof Error ? err.message : String(err)
    }\n`
  );
  process.exitCode = 1;
});
