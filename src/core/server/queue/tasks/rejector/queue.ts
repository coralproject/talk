import { singleton } from "tsyringe";

import { TaskQueueOptions } from "coral-server/queue/options";
import { JobQueue } from "coral-server/queue/queue";
import Task from "coral-server/queue/task";

import { JOB_NAME, RejectorData, RejectorQueueProcessor } from "./processor";

@singleton()
export class RejectorQueue extends Task<RejectorData> implements JobQueue {
  constructor(processor: RejectorQueueProcessor, queue: TaskQueueOptions) {
    super({
      name: JOB_NAME,
      processor,
      queue,
    });
  }
}
