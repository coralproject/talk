# Coral tenant lifecycle utility

This utility creates a restorable BSON archive for one Coral tenant and then,
as a separate explicitly confirmed operation, removes that tenant's documents
from shared live and archive MongoDB databases.

It never archives or deletes the global `queries` or `migrations` collections.

## Safety model

- Stop tenant traffic and drain tenant-related background jobs before running
  `archive`. Keep the tenant quiesced until `purge` finishes.
- Create the required tenant indexes manually before using this utility.
- `archive`, `verify`, and `purge` are separate commands. Purge requires a
  verified manifest, matching source databases, intact checksums, `--execute`,
  and the exact tenant ID in `--confirm`.
- Deletes use majority write concern, bounded batches, and an operator-defined
  pause. The manifest is checkpointed after every batch, so purge can be rerun
  after an interruption.
- The archive directory and files are owner-readable only, but the archive is
  **not encrypted**. Treat it as production data and move it to approved
  storage before deleting the tenant.

The utility does not remove Redis keys or queued jobs. Tenant shutdown must
handle those separately; otherwise stale cache and queue state may survive the
MongoDB purge.

## Requirements

- Node.js 18.16 or newer
- MongoDB Database Tools with `mongodump` and `mongorestore` on `PATH`
- Network access from the local computer to the production MongoDB deployment
- MongoDB permissions to read all listed collections and, for purge, delete
  documents

Install and build:

```sh
cd utilities/tenant-lifecycle
npm install
npm run build
```

## Required indexes

The utility refuses to inspect, archive, or purge an existing collection unless
an index begins with its tenant selector (`tenantID`, or `id` for `tenants`).
Coral already creates suitable indexes for the primary live collections. The
following additional indexes must be created manually before the first run:

```javascript
// Live database.
db.seenComments.createIndex({ tenantID: 1 });
db.dsaReports.createIndex({ tenantID: 1 });
db.notifications.createIndex({ tenantID: 1 });

// Archive database. Run these against the live database instead when Coral
// stores archived collections there.
db.archivedComments.createIndex({ tenantID: 1 });
db.archivedCommentActions.createIndex({ tenantID: 1 });
db.archivedCommentModerationActions.createIndex({ tenantID: 1 });
```

Build indexes using the production team's normal maintenance procedure and
monitor cluster load until every build completes. The utility only checks for
the indexes; it never creates them.

## Connection configuration

Set credentials in environment variables, preferably through the team's secret
manager rather than shell history:

```sh
export MONGODB_URI='mongodb+srv://...'
export MONGODB_DB_NAME='coral'

# Set these only when Coral uses a separate archive deployment or database.
export MONGODB_ARCHIVE_URI='mongodb+srv://...'
export MONGODB_ARCHIVE_DB_NAME='coral'
```

The utility writes each URI to a temporary owner-only MongoDB Database Tools
configuration file. It does not put credentials in child-process arguments or
in the archive manifest. The manifest stores a credential-free source
fingerprint so purge cannot accidentally target a different cluster.

## Runbook

### 1. Prepare the tenant

1. Disable tenant-facing writes.
2. Stop or drain jobs that can write data for the tenant.
3. Confirm replica-set members are healthy and caught up.
4. Confirm enough local disk is available for a compressed logical dump.
5. Run inspection:

```sh
npm run start -- inspect --tenant TENANT_ID
```

Inspection verifies that the tenant exists, checks required tenant-prefixed
indexes, and prints per-collection counts. It does not modify MongoDB.

### 2. Archive

The bundle path must not already exist:

```sh
npm run start -- archive \
  --tenant TENANT_ID \
  --bundle /secure/local/path/TENANT_ID-RUN_DATE \
  --quiesced
```

Each collection is dumped as compressed BSON with its MongoDB metadata. Counts
are taken before and after every dump; any change fails the archive. Live and
archive databases are stored under separate bundle directories.

### 3. Verify

```sh
npm run start -- verify \
  --bundle /secure/local/path/TENANT_ID-RUN_DATE
```

Verification checks file sizes and SHA-256 checksums, streams and validates
every BSON document against the manifest counts, then runs
`mongorestore --dryRun --objcheck --stopOnError`. It performs no database
writes. Do not proceed unless the manifest status is `verified`.

### 4. Purge

Start conservatively and monitor primary load, replication lag, and oplog
headroom. Increase the delay or stop the process if cluster health degrades.

```sh
npm run start -- purge \
  --bundle /secure/local/path/TENANT_ID-RUN_DATE \
  --quiesced \
  --execute \
  --confirm TENANT_ID \
  --batch-size 500 \
  --sleep-ms 100
```

An interrupted purge can be rerun with the same command. The utility reconciles
the checkpoint with remaining document counts and continues. The `tenants`
document is deleted last. Completion requires zero matching documents in every
tenant-scoped collection.

### 5. Finish tenant shutdown

1. Preserve the bundle and `manifest.json` according to retention policy.
2. Clear tenant-specific Redis/cache state using the platform's approved
   process.
3. Confirm no delayed jobs can recreate tenant data.
4. Retain cluster-health logs and the completed manifest as the operation
   record.

## Restore test

Restore archives only into an isolated database. Never test a restore against
the shared production database.

Create a MongoDB Database Tools YAML file containing the isolated target URI,
then restore each source namespace into a new database:

```sh
mongorestore --config=restore-target.yaml \
  --gzip \
  --dir=/secure/local/path/TENANT_ID-RUN_DATE/dump/live \
  --nsFrom='coral.*' \
  --nsTo='tenant_restore.*' \
  --stopOnError

mongorestore --config=restore-target.yaml \
  --gzip \
  --dir=/secure/local/path/TENANT_ID-RUN_DATE/dump/archive \
  --nsFrom='coral.*' \
  --nsTo='tenant_restore.*' \
  --stopOnError
```

If the source database names differ from `coral`, use those names from
`manifest.json`. Compare restored per-collection counts with the manifest
before considering the restore test successful.

## Scope

The archived collections are:

- Live: `tenants`, `sites`, `users`, `invites`, `stories`, `comments`,
  `commentActions`, `commentModerationActions`, `seenComments`, `dsaReports`,
  and `notifications`
- Archive: `archivedComments`, `archivedCommentActions`, and
  `archivedCommentModerationActions`

Media stored in comment revisions is URL metadata; Coral does not use MongoDB
GridFS for these records.
