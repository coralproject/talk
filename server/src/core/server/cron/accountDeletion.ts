import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { retrieveLockedUserScheduledForDeletion } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { I18n } from "coral-server/services/i18n";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import { deleteUser } from "coral-server/services/users/delete";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: MongoContext;
  redis: AugmentedRedis;
  config: Config;
  i18n: I18n;
  mailerQueue: MailerQueue;
  tenantCache: TenantCache;
}

export const NAME = "Account Deletion";

export function registerAccountDeletion(
  options: Options
): ScheduledJobGroup<Options> {
  const job = new ScheduledJob(options, {
    name: `Twice Hourly ${NAME}`,
    cronTime: "0,30 * * * *",
    command: deleteScheduledAccounts,
  });

  return { name: NAME, schedulers: [job] };
}

const deleteScheduledAccounts: ScheduledJobCommand<Options> = async ({
  log,
  mongo,
  redis,
  config,
  i18n,
  mailerQueue,
  tenantCache,
}) => {
  // For each of the tenant's, process their users notifications.
  for await (const tenant of tenantCache) {
    log = log.child({ tenantID: tenant.id }, true);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const now = new Date();
      const user = await retrieveLockedUserScheduledForDeletion(
        mongo,
        tenant.id,
        {
          hours: 1,
        },
        now
      );
      if (!user) {
        log.debug("no more users were scheduled for deletion");
        break;
      }

      log.info({ userID: user.id }, "deleting user");

      await deleteUser(
        mongo,
        redis,
        config,
        i18n,
        user.id,
        tenant.id,
        now,
        tenant.dsa?.enabled
      );

      // If the user has an email, then send them a confirmation that their account
      // was deleted.
      if (user.email) {
        await mailerQueue.add({
          tenantID: tenant.id,
          message: {
            to: user.email,
          },
          template: {
            name: "account-notification/delete-request-completed",
            context: {
              organizationContactEmail: tenant.organization.contactEmail,
              organizationName: tenant.organization.name,
              organizationURL: tenant.organization.url,
            },
          },
        });
      } else {
        log.info({ userID: user.id }, "user did not have an email address");
      }
    }
  }
};
