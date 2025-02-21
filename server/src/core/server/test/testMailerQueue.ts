import { Job, JobCounts } from "bull";
import { MailerInput, MailerQueue } from "coral-server/queue/tasks/mailer";
import { MailerData } from "coral-server/queue/tasks/mailer/processor";

export class TestMailerQueue implements MailerQueue {
  public async add(input: MailerInput): Promise<Job<MailerData> | undefined> {
    return undefined;
  }

  public async counts(): Promise<JobCounts> {
    return {
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      waiting: 0,
    };
  }

  public async process() {}
}
