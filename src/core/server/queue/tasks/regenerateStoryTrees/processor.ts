import Joi from "joi";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { regenerateStoryTrees } from "coral-server/models/story";
import { hasFeatureFlag, updateTenant } from "coral-server/models/tenant";
import { JobProcessor } from "coral-server/queue/Task";
import { I18n } from "coral-server/services/i18n";
import { AugmentedRedis } from "coral-server/services/redis";
import {
  disableFeatureFlag,
  enableFeatureFlag,
} from "coral-server/services/tenant";
import { TenantCache } from "coral-server/services/tenant/cache";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

export const JOB_NAME = "regenerateStoryTrees";

export interface RegenerateStoryTreesProcessorOptions {
  mongo: MongoContext;
  redis: AugmentedRedis;
  tenantCache: TenantCache;
  i18n: I18n;
}

export interface RegenerateStoryTreesData {
  tenantID: string;
  jobID: string;
  disableCommenting: boolean;
  disableCommentingMessage?: string;
}

const RegenerateStoryTreeDataSchema = Joi.object().keys({
  tenantID: Joi.string(),
  jobID: Joi.string(),
  disableCommenting: Joi.boolean(),
  disableCommentingMessage: Joi.string().optional().allow(""),
});

interface ValidateDataResult {
  success: boolean;
  error?: Error;
  data?: RegenerateStoryTreesData;
}

export const validateJobData = (
  data: RegenerateStoryTreesData
): ValidateDataResult => {
  const { value, error } = RegenerateStoryTreeDataSchema.validate(data, {
    stripUnknown: true,
    presence: "required",
    abortEarly: false,
  });

  if (error) {
    return {
      success: false,
      error,
    };
  } else {
    return {
      success: true,
      data: value,
    };
  }
};

export const createJobProcessor = (
  options: RegenerateStoryTreesProcessorOptions
): JobProcessor<RegenerateStoryTreesData> => {
  const { tenantCache, mongo, redis } = options;

  return async (job) => {
    const { success, error: err, data } = validateJobData(job.data);
    if (!success || err || !data) {
      logger.error(
        {
          jobID: job.id,
          jobName: JOB_NAME,
          err,
        },
        "job data did not match expected schema"
      );
      return;
    }

    const {
      tenantID,
      jobID,
      disableCommenting,
      disableCommentingMessage,
    }: RegenerateStoryTreesData = data;

    const log = logger.child(
      {
        jobID: job.id,
        jobStatusID: jobID,
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    let tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    log.info("beginning regeneration of story trees");

    await redis.set(`jobStatus:${jobID}:started`, new Date().toUTCString());

    const previousMessage = tenant.disableCommenting.message;
    const hasZKey = hasFeatureFlag(tenant, GQLFEATURE_FLAG.Z_KEY);
    const hasCommentSeen = hasFeatureFlag(tenant, GQLFEATURE_FLAG.COMMENT_SEEN);

    // Disable commenting if it is enabled
    if (disableCommenting) {
      await updateTenant(mongo, tenant.id, {
        disableCommenting: {
          enabled: true,
          message: disableCommentingMessage
            ? disableCommentingMessage
            : previousMessage,
        },
      });

      // Disable Z_KEY and COMMENT_SEEN if we're disabling comments.
      // This will prevent bugs/issues around these features while we
      // generate the story tree data that is required for them.
      if (hasZKey) {
        await disableFeatureFlag(
          mongo,
          redis,
          tenantCache,
          tenant,
          GQLFEATURE_FLAG.Z_KEY
        );
      }
      if (hasCommentSeen) {
        await disableFeatureFlag(
          mongo,
          redis,
          tenantCache,
          tenant,
          GQLFEATURE_FLAG.COMMENT_SEEN
        );
      }

      // refresh tenant for post steps to run
      tenant = await tenantCache.retrieveByID(tenantID);
    }

    // Do the story tree regeneration
    await regenerateStoryTrees(mongo, redis, tenantID, jobID, log);

    // Re-enable commenting if we previously disabled it because
    // of the disableCommenting flag
    if (disableCommenting) {
      await updateTenant(mongo, tenant!.id, {
        disableCommenting: {
          enabled: false,
          message: previousMessage,
        },
      });

      // Re-enable Z_KEY if it was enabled.
      if (hasZKey) {
        await enableFeatureFlag(
          mongo,
          redis,
          tenantCache,
          tenant!,
          GQLFEATURE_FLAG.Z_KEY
        );
      }
      // Re-enable COMMENT_SEEN if it was enabled.
      if (hasCommentSeen) {
        await enableFeatureFlag(
          mongo,
          redis,
          tenantCache,
          tenant!,
          GQLFEATURE_FLAG.COMMENT_SEEN
        );
      }
    }

    log.info("regeneration of story trees finished");
  };
};
