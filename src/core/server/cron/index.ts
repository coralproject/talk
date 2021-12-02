import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import { registerAccountDeletion } from "./accountDeletion";
import { registerAutoArchiving } from "./autoArchiving";
import { registerNotificationDigesting } from "./notificationDigesting";
import { registerSeenCommentsCleanup } from "./seenCommentsCleanup";

export interface ScheduledJobGroups {
  accountDeletion: ReturnType<typeof registerAccountDeletion>;
  notificationDigesting: ReturnType<typeof registerNotificationDigesting>;
  autoArchiving: ReturnType<typeof registerAutoArchiving>;
  seenComments: ReturnType<typeof registerSeenCommentsCleanup>;
}

interface Options {
  mongo: MongoContext;
  redis: AugmentedRedis;
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
    autoArchiving: registerAutoArchiving(options),
    seenComments: registerSeenCommentsCleanup(options),
  };

  for (const { name, schedulers } of Object.values(tasks)) {
    for (const scheduler of schedulers) {
      scheduler.job.start();
      scheduler.log.debug({ jobGroupName: name }, "now started job scheduling");
    }
  }

  return tasks;
}
