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

const downloadDocuments = async (db: Db, tenantID: string, collectionName: string, outputDir: string) => {
  const collection = db.collection(collectionName);
  const cursor = collection.find({ tenantID });

  const outputPath = path.join(outputDir, `${collectionName}.json`);
  const stream = fs.createWriteStream(outputPath);

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) {
      continue;
    }

    stream.write(`${JSON.stringify(doc)}\n`);
  }

  stream.close();
}

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

    const niceTenantName = getNiceTenantName(tenant.organization.name);
    const relOutputDir = path.join(config.outputDir, niceTenantName);
    ensureDirectoryExists(relOutputDir);

    await downloadDocuments(db, tenantID, "archivedCommentModerationActions", relOutputDir);
    await downloadDocuments(db, tenantID, "archivedCommentActions", relOutputDir);
    await downloadDocuments(db, tenantID, "archivedComments", relOutputDir);
    await downloadDocuments(db, tenantID, "commentActions", relOutputDir);
    await downloadDocuments(db, tenantID, "commentModerationActions", relOutputDir);
    await downloadDocuments(db, tenantID, "comments", relOutputDir);
    await downloadDocuments(db, tenantID, "dsaReports", relOutputDir);
    await downloadDocuments(db, tenantID, "invites", relOutputDir);
    await downloadDocuments(db, tenantID, "migrations", relOutputDir);
    await downloadDocuments(db, tenantID, "notifications", relOutputDir);
    await downloadDocuments(db, tenantID, "queries", relOutputDir);
    await downloadDocuments(db, tenantID, "seenComments", relOutputDir);
    await downloadDocuments(db, tenantID, "sites", relOutputDir);
    await downloadDocuments(db, tenantID, "stories", relOutputDir);
    await downloadDocuments(db, tenantID, "tenants", relOutputDir);
    await downloadDocuments(db, tenantID, "users", relOutputDir);
  }

  process.exit();
};

void run();
