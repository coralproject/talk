import { singleton } from "tsyringe";

import { TaskQueueOptions } from "coral-server/queue/options";
import { JobQueue } from "coral-server/queue/queue";
import Task from "coral-server/queue/tasks/task";

import { JOB_NAME, ScraperData, ScraperQueueProcessor } from "./processor";

@singleton()
export class ScraperQueue extends Task<ScraperData> implements JobQueue {
  constructor(processor: ScraperQueueProcessor, queue: TaskQueueOptions) {
    super({
      name: JOB_NAME,
      processor,
      queue,
    });
  }
}
