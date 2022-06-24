import Queue from "bull";

import logger from "coral-server/logger";
import Task from "coral-server/queue/Task";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  createJobProcessor,
  JOB_NAME,
  RegenerateStoryTreesData,
  RegenerateStoryTreesProcessorOptions,
} from "./processor";

export interface RegenerateStoryTreesInput {
  tenantID: string;
  jobID: string;
  disableCommenting: boolean;
  disableCommentingMessage?: string;
}

export class RegenerateStoryTreesQueue {
  private task: Task<RegenerateStoryTreesData>;
  private tenantCache: TenantCache;

  constructor(
    queue: Queue.QueueOptions,
    options: RegenerateStoryTreesProcessorOptions
  ) {
    this.task = new Task<RegenerateStoryTreesData>({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor(options),
      queue,
      timeout: 8 * 60 * 60 * 1000, // 8 hours * 60 min * 60 secs * 1000 ms
    });

    this.tenantCache = options.tenantCache;
  }

  public async counts() {
    return this.task.counts();
  }

  public async add({
    tenantID,
    jobID,
    disableCommenting,
    disableCommentingMessage,
  }: RegenerateStoryTreesInput) {
    const log = logger.child(
      {
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    return this.task.add({
      tenantID,
      jobID,
      disableCommenting,
      disableCommentingMessage,
    });
  }

  public process() {
    return this.task.process();
  }
}

export const createRegenerateStoryTreesTask = (
  queue: Queue.QueueOptions,
  options: RegenerateStoryTreesProcessorOptions
) => new RegenerateStoryTreesQueue(queue, options);
