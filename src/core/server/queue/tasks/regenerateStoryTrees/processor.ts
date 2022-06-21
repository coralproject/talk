import Joi from "joi";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { regenerateStoryTrees } from "coral-server/models/story";
import { JobProcessor } from "coral-server/queue/Task";
import { TenantCache } from "coral-server/services/tenant/cache";

export const JOB_NAME = "regenerateStoryTrees";

export interface RegenerateStoryTreesProcessorOptions {
  mongo: MongoContext;
  tenantCache: TenantCache;
}

export interface RegenerateStoryTreesData {
  tenantID: string;
}

const RegenerateStoryTreeDataSchema = Joi.object().keys({
  tenantID: Joi.string(),
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

    const { tenantID } = data;

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

    await regenerateStoryTrees(mongo, tenantID);

    log.info("regeneration of story trees finished");
  };
};
