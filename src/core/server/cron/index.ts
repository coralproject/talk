import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import TenantCache from "coral-server/services/tenant/cache";

import { registerAccountDeletion } from "./accountDeletion";
import { ScheduledJobGroup } from "./job";
import { registerNotificationDigesting } from "./notificationDigesting";

export interface ScheduledJobGroups {
  accountDeletion: ScheduledJobGroup;
  notificationDigesting: ScheduledJobGroup;
}

interface Options {
  mongo: Db;
  config: Config;
  mailerQueue: MailerQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

export default function startScheduledTasks(
  options: Options
): ScheduledJobGroups {
  const tasks: ScheduledJobGroups = {
    accountDeletion: registerAccountDeletion(options),
    notificationDigesting: registerNotificationDigesting(options),
  };

  for (const { name, schedulers } of Object.values(tasks)) {
    for (const scheduler of schedulers) {
      scheduler.job.start();
      scheduler.log.debug({ jobGroupName: name }, "now started job scheduling");
    }
  }

  return tasks;
}
