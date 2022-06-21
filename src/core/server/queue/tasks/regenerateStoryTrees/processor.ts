import Joi from "joi";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { regenerateStoryTrees } from "coral-server/models/story";
import { updateTenant } from "coral-server/models/tenant";
import { JobProcessor } from "coral-server/queue/Task";
import { I18n } from "coral-server/services/i18n";
import { TenantCache } from "coral-server/services/tenant/cache";

export const JOB_NAME = "regenerateStoryTrees";

export interface RegenerateStoryTreesProcessorOptions {
  mongo: MongoContext;
  tenantCache: TenantCache;
  i18n: I18n;
}

export interface RegenerateStoryTreesData {
  tenantID: string;
  disableCommenting: boolean;
  disableCommentingMessage?: string;
}

const RegenerateStoryTreeDataSchema = Joi.object().keys({
  tenantID: Joi.string(),
  disableCommenting: Joi.boolean(),
  disableCommentingMessage: Joi.string().optional(),
});

export const createJobProcessor = (
  options: RegenerateStoryTreesProcessorOptions
): JobProcessor<RegenerateStoryTreesData> => {
  const { tenantCache, mongo } = options;

  return async (job) => {
    const { value: data, error: err } = RegenerateStoryTreeDataSchema.validate(
      job.data,
      {
        stripUnknown: true,
        presence: "required",
        abortEarly: false,
      }
    );
    if (err) {
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
      disableCommenting,
      disableCommentingMessage,
    }: RegenerateStoryTreesData = data;

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    log.info("beginning regeneration of story trees");

    // Disable commenting if it is enabled
    const previousMessage = tenant.disableCommenting.message;
    if (disableCommenting) {
      await updateTenant(mongo, tenant.id, {
        disableCommenting: {
          enabled: true,
          message: disableCommentingMessage
            ? disableCommentingMessage
            : previousMessage,
        },
      });
    }

    // Do the story tree regeneration
    await regenerateStoryTrees(mongo, tenantID);

    // Re-enable commenting if we previously disabled it because
    // of the disableCommenting flag
    if (disableCommenting) {
      await updateTenant(mongo, tenant.id, {
        disableCommenting: {
          enabled: false,
          message: previousMessage,
        },
      });
    }

    log.info("regeneration of story trees finished");
  };
};
