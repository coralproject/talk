import { CronJob } from "cron";
import { Db } from "mongodb";

import { MailerQueue } from "coral-server/queue/tasks/mailer";

import { registerAccountDeletion } from "./accountDeletion";

export interface ScheduledTasks {
  accountDeletion: ScheduledTask;
}

export interface ScheduledTask {
  name: string;
  task: CronJob;
}

export default function startScheduledTasks(
  mongo: Db,
  mailer: MailerQueue
): ScheduledTasks {
  return {
    accountDeletion: {
      name: "Account Deletion",
      task: registerAccountDeletion(mongo, mailer),
    },
  };
}
