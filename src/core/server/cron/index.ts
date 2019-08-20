import { CronJob } from "cron";
import { Db } from "mongodb";

import { MailerQueue } from "coral-server/queue/tasks/mailer";

import { registerAccountDeletion } from "./accountDeletion";

export interface ScheduledTask {
  name: string;
  task: CronJob;
}

export default function startCronJobs(
  mongo: Db,
  mailer: MailerQueue
): ScheduledTask[] {
  const accountDeletionTask: ScheduledTask = {
    name: "Account Deletion",
    task: registerAccountDeletion(mongo, mailer),
  };

  return [accountDeletionTask];
}
