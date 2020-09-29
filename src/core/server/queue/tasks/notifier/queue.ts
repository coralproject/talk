import { singleton } from "tsyringe";

import { TaskQueueOptions } from "coral-server/queue/options";
import { JobQueue } from "coral-server/queue/queue";
import Task from "coral-server/queue/tasks/task";

import { JOB_NAME, NotifierData, NotifierQueueProcessor } from "./processor";

@singleton()
export class NotifierQueue extends Task<NotifierData> implements JobQueue {
  constructor(processor: NotifierQueueProcessor, queue: TaskQueueOptions) {
    super({
      name: JOB_NAME,
      processor,
      queue,
    });
  }
}
