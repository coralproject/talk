import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { ArchiverQueue } from "coral-server/queue/tasks/archiver";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import { registerAccountDeletion } from "./accountDeletion";
import { registerFillArchivingQueue } from "./fillArchivingQueue";
import { registerNotificationDigesting } from "./notificationDigesting";

export interface ScheduledJobGroups {
  accountDeletion: ReturnType<typeof registerAccountDeletion>;
  notificationDigesting: ReturnType<typeof registerNotificationDigesting>;
  autoArchivingQueue: ReturnType<typeof registerFillArchivingQueue>;
}

interface Options {
  mongo: MongoContext;
  redis: AugmentedRedis;
  config: Config;
  mailerQueue: MailerQueue;
  archiverQueue: ArchiverQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

export default function startScheduledTasks(
  options: Options
): ScheduledJobGroups {
  const tasks: ScheduledJobGroups = {
    accountDeletion: registerAccountDeletion(options),
    notificationDigesting: registerNotificationDigesting(options),
    autoArchivingQueue: registerFillArchivingQueue(options),
  };

  for (const { name, schedulers } of Object.values(tasks)) {
    for (const scheduler of schedulers) {
      scheduler.job.start();
      scheduler.log.debug({ jobGroupName: name }, "now started job scheduling");
    }
  }

  return tasks;
}
