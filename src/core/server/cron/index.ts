import { CronJob } from "cron";
import { Db } from "mongodb";

import { registerAccountDeletion } from "./accountDeletion";

export interface ScheduledTask {
  name: string;
  task: CronJob;
}

export default function startCronJobs(mongo: Db): ScheduledTask[] {
  const accountDeletionTask: ScheduledTask = {
    name: "Account Deletion",
    task: registerAccountDeletion(mongo),
  };

  return [accountDeletionTask];
}
