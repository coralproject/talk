import fs from "fs";
import { Db } from "mongodb";
import path from "path";
import { argv } from "process";

import {
  ArgumentDefinition,
  ArgumentResult,
  ArgumentValueType,
  getArgs,
} from "./args";
import { Config } from "./config";
import { createMongo } from "./mongo";

interface Tenant {
  id: string;
  organization: {
    name: string;
  };
}

const argumentDefinitions: ArgumentDefinition[] = [
  {
    shortName: "-c",
    fullName: "--config",
    valueType: ArgumentValueType.String,
  },
];

const ensureDirectoryExists = (dir: string) => {
  if (fs.existsSync(dir)) {
    return;
  }

  fs.mkdirSync(dir, { recursive: true });
};

const getNiceTenantName = (name: string) => {
  const regex = / /g;
  const niceTenantName = name.replace(regex, "");

  return niceTenantName;
};

const awaitWrite = (stream: fs.WriteStream, data: string) => {
  return new Promise<boolean>((resolve) => {
    stream.write(data, (err) => {
      if (err) {
        resolve(false);
      }

      resolve(true);
    });
  });
};

const downloadDocuments = async (
  db: Db,
  tenantID: string,
  collectionName: string,
  outputDir: string,
  isTenant = false
) => {
  const collection = db.collection(collectionName);
  const cursor = isTenant
    ? collection.find({ id: tenantID })
    : collection.find({ tenantID });

  const outputPath = path.join(outputDir, `${collectionName}.json`);
  const stream = fs.createWriteStream(outputPath);

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) {
      continue;
    }

    const line = isTenant
      ? `${JSON.stringify(doc, null, 2)}\n`
      : `${JSON.stringify(doc)}\n`;
    await awaitWrite(stream, line);
  }

  return new Promise<boolean>((resolve) => {
    stream.close((err) => {
      if (err) {
        resolve(false);
      }

      resolve(true);
    });
  });
};

const run = async () => {
  const result = getArgs(argv, argumentDefinitions);
  const configPath: ArgumentResult<any> = result.args.find(
    (a) => a.definition.fullName === "--config"
  ) ?? {
    definition: argumentDefinitions[0],
    value: "config.json",
  };

  const config = new Config(configPath.value as string);

  const { db } = await createMongo(config.mongoURI, config.mongoDBName);

  ensureDirectoryExists(config.outputDir);

  const tenants = db.collection<Readonly<Tenant>>("tenants");

  for (const tenantID of config.tenantIDs) {
    const tenant = await tenants.findOne({ id: tenantID });
    if (!tenant) {
      console.warn(`unable to find tenant: ${tenantID}`);
      continue;
    }

    console.log(`downloading ${tenant.organization.name}...`);

    const niceTenantName = getNiceTenantName(tenant.organization.name);
    const relOutputDir = path.join(config.outputDir, niceTenantName);
    ensureDirectoryExists(relOutputDir);

    await downloadDocuments(
      db,
      tenantID,
      "archivedCommentModerationActions",
      relOutputDir
    );
    await downloadDocuments(
      db,
      tenantID,
      "archivedCommentActions",
      relOutputDir
    );
    await downloadDocuments(db, tenantID, "archivedComments", relOutputDir);
    await downloadDocuments(db, tenantID, "commentActions", relOutputDir);
    await downloadDocuments(
      db,
      tenantID,
      "commentModerationActions",
      relOutputDir
    );
    await downloadDocuments(db, tenantID, "comments", relOutputDir);
    await downloadDocuments(db, tenantID, "dsaReports", relOutputDir);
    await downloadDocuments(db, tenantID, "invites", relOutputDir);
    await downloadDocuments(db, tenantID, "migrations", relOutputDir);
    await downloadDocuments(db, tenantID, "notifications", relOutputDir);
    await downloadDocuments(db, tenantID, "queries", relOutputDir);
    await downloadDocuments(db, tenantID, "seenComments", relOutputDir);
    await downloadDocuments(db, tenantID, "sites", relOutputDir);
    await downloadDocuments(db, tenantID, "stories", relOutputDir);
    await downloadDocuments(db, tenantID, "tenants", relOutputDir, true);
    await downloadDocuments(db, tenantID, "users", relOutputDir);
  }

  console.log("Done.");

  process.exit();
};

void run();
