import { Collection, Document, WithId } from "mongodb";
import { v4 as uuid } from "uuid";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { DSAReport } from "coral-server/models/dsaReport";

import {
  GQLCOMMENT_STATUS,
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
  GQLREJECTION_REASON_CODE,
} from "coral-server/graph/schema/__generated__/types";

import { getLatestRevision } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { moderate } from "../comments/moderation";
import { I18n, translate } from "../i18n";
import { AugmentedRedis } from "../redis";

const BATCH_SIZE = 500;

async function executeBulkOperations<T extends Document>(
  collection: Collection<T>,
  operations: any[]
) {
  // TODO: (wyattjoh) fix types here to support actual types when upstream changes applied
  const bulk: any = collection.initializeUnorderedBulkOp();

  for (const operation of operations) {
    bulk.raw(operation);
  }

  await bulk.execute();
}

interface DSAReportBatch {
  dsaReports: any[];
}

async function moderateComments(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  i18n: I18n,
  tenant: Tenant,
  authorID: string,
  now: Date,
  isArchived = false
) {
  const coll =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();
  const comments = coll.find({ tenantID: tenant.id, authorID });

  const bundle = i18n.getBundle(tenant.locale);
  const translatedExplanation = translate(
    bundle,
    "User account deleted",
    "common-accountDeleted"
  );

  const rejectionReason = {
    code: GQLREJECTION_REASON_CODE.OTHER,
    detailedExplanation: translatedExplanation,
  };

  while (await comments.hasNext()) {
    const comment = await comments.next();
    if (!comment) {
      continue;
    }

    const updateAllCommentCountsArgs = {
      actionCounts: {},
      options: {
        updateShared: !isArchived,
        updateSite: !isArchived,
        updateStory: true,
        updateUser: true,
      },
    };

    const targetStatus =
      comment.childCount > 0
        ? GQLCOMMENT_STATUS.APPROVED
        : GQLCOMMENT_STATUS.REJECTED;

    const args =
      targetStatus === GQLCOMMENT_STATUS.APPROVED
        ? {
            commentID: comment.id,
            commentRevisionID: getLatestRevision(comment).id,
            moderatorID: null,
            status: targetStatus,
          }
        : {
            commentID: comment.id,
            commentRevisionID: getLatestRevision(comment).id,
            moderatorID: null,
            status: targetStatus,
            rejectionReason,
          };

    const { result } = await moderate(
      mongo,
      redis,
      config,
      i18n,
      tenant,
      args,
      now,
      isArchived,
      updateAllCommentCountsArgs
    );

    if (!result.after) {
      continue;
    }
  }
}

async function updateUserDSAReports(
  mongo: MongoContext,
  tenantID: string,
  authorID: string,
  isArchived?: boolean | null
) {
  const batch: DSAReportBatch = {
    dsaReports: [],
  };

  async function processBatch() {
    const dsaReports = mongo.dsaReports();

    await executeBulkOperations<DSAReport>(dsaReports, batch.dsaReports);
    batch.dsaReports = [];
  }

  const collection =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();

  const cursor = collection.find({
    tenantID,
    authorID,
  });
  while (await cursor.hasNext()) {
    const comment = await cursor.next();
    if (!comment) {
      continue;
    }

    const match = mongo.dsaReports().find({
      tenantID,
      commentID: comment.id,
      status: {
        $in: [
          GQLDSAReportStatus.AWAITING_REVIEW,
          GQLDSAReportStatus.UNDER_REVIEW,
        ],
      },
    });

    if (!match) {
      continue;
    }

    const id = uuid();

    const statusChangeHistoryItem = {
      id,
      createdBy: null,
      createdAt: new Date(),
      status: GQLDSAReportStatus.VOID,
      type: GQLDSAReportHistoryType.STATUS_CHANGED,
    };

    batch.dsaReports.push({
      updateMany: {
        filter: {
          tenantID,
          commentID: comment.id,
          status: {
            $in: [
              GQLDSAReportStatus.AWAITING_REVIEW,
              GQLDSAReportStatus.UNDER_REVIEW,
            ],
          },
        },
        update: {
          $set: {
            status: "VOID",
          },
          $push: {
            history: statusChangeHistoryItem,
          },
        },
      },
    });

    if (batch.dsaReports.length >= BATCH_SIZE) {
      await processBatch();
    }
  }

  if (batch.dsaReports.length > 0) {
    await processBatch();
  }
}

async function deleteUserComments(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  i18n: I18n,
  authorID: string,
  tenant: WithId<Readonly<Tenant>>,
  now: Date,
  isArchived?: boolean | null
) {
  await moderateComments(
    mongo,
    redis,
    config,
    i18n,
    tenant,
    authorID,
    now,
    !!isArchived
  );

  const collection =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();

  await collection.updateMany(
    { tenantID: tenant.id, authorID },
    {
      $set: {
        authorID: null,
        revisions: [],
        tags: [],
        deletedAt: now,
      },
    }
  );
}

export async function deleteUser(
  mongo: MongoContext,
  redis: AugmentedRedis,
  config: Config,
  i18n: I18n,
  userID: string,
  tenantID: string,
  now: Date,
  dsaEnabled: boolean,
  requestingUser: string | null = null
) {
  const user = await mongo.users().findOne({ id: userID, tenantID });
  if (!user) {
    throw new Error("could not find user by ID");
  }

  // Check to see if the user was already deleted.
  if (user.deletedAt) {
    throw new Error("user was already deleted");
  }

  const tenant = await mongo.tenants().findOne({ id: tenantID });
  if (!tenant) {
    throw new Error("could not find tenant by ID");
  }

  // If DSA is enabled,
  // Update the user's comment's associated DSAReports; set their status to VOID
  if (dsaEnabled) {
    await updateUserDSAReports(mongo, tenantID, userID);
    if (mongo.archive) {
      await updateUserDSAReports(mongo, tenantID, userID, true);
    }
  }

  // Delete the user's comments.
  await deleteUserComments(
    mongo,
    redis,
    config,
    i18n,
    userID,
    tenant,
    now,
    undefined
  );
  if (mongo.archive) {
    await deleteUserComments(
      mongo,
      redis,
      config,
      i18n,
      userID,
      tenant,
      now,
      true
    );
  }

  // Mark the user as deleted.
  const result = await mongo.users().findOneAndUpdate(
    { tenantID, id: userID },
    {
      $set: {
        deletedAt: now,
      },
      $unset: {
        profiles: "",
        email: "",
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnDocument: "after",
    }
  );

  return result;
}
