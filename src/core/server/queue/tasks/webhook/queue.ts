import { singleton } from "tsyringe";

import { TaskQueueOptions } from "coral-server/queue/options";
import { JobQueue } from "coral-server/queue/queue";
import Task from "coral-server/queue/tasks/task";

import { JOB_NAME, WebhookData, WebhookQueueProcessor } from "./processor";

@singleton()
export class WebhookQueue extends Task<WebhookData> implements JobQueue {
  constructor(processor: WebhookQueueProcessor, queue: TaskQueueOptions) {
    super({
      name: JOB_NAME,
      processor,
      queue,
    });
  }
}
