import { injectAll, registry, singleton } from "tsyringe";
import { JobQueue } from "./queue";

import { MailerQueue } from "./tasks/mailer";
import { NotifierQueue } from "./tasks/notifier";
import { RejectorQueue } from "./tasks/rejector";
import { ScraperQueue } from "./tasks/scraper";
import { WebhookQueue } from "./tasks/webhook";

export const QUEUE = Symbol("QUEUE");

@singleton()
@registry([
  { token: QUEUE, useClass: MailerQueue },
  { token: QUEUE, useClass: NotifierQueue },
  { token: QUEUE, useClass: WebhookQueue },
  { token: QUEUE, useClass: ScraperQueue },
  { token: QUEUE, useClass: RejectorQueue },
])
export class TaskQueueService {
  constructor(@injectAll(QUEUE) private readonly queues: JobQueue[]) {}

  public process() {
    for (const queue of this.queues) {
      queue.process();
    }
  }
}
