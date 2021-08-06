import { Db } from "mongodb";
import path from "path";

import { Config } from "coral-server/config";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { JWTSigningConfig } from "coral-server/services/jwt";
import NotificationContext from "coral-server/services/notifications/context";
import { TenantCache } from "coral-server/services/tenant/cache";

import { GQLDIGEST_FREQUENCY } from "coral-server/graph/schema/__generated__/types";

import {
  ScheduledJob,
  ScheduledJobCommand,
  ScheduledJobGroup,
} from "./scheduled";

interface Options {
  mongo: Db;
  archive: Db;
  config: Config;
  mailerQueue: MailerQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

export const NAME = "Notification Digesting";

export function registerNotificationDigesting(
  options: Options
): ScheduledJobGroup<Options> {
  const hourly = new ScheduledJob(options, {
    name: `Hourly ${NAME}`,
    cronTime: "0 * * * *",
    command: processNotificationDigesting(GQLDIGEST_FREQUENCY.HOURLY),
  });

  const daily = new ScheduledJob(options, {
    name: `Daily ${NAME}`,
    cronTime: "0 0 * * *",
    command: processNotificationDigesting(GQLDIGEST_FREQUENCY.DAILY),
  });

  return {
    name: NAME,
    schedulers: [hourly, daily],
  };
}

/**
 * DigestElement represents each element that is used for the digesting
 * operations.
 */
interface DigestElement {
  template: string;
  partial: string;
  contexts: Array<DigestibleTemplate["context"]>;
}

const processNotificationDigesting = (
  frequency: GQLDIGEST_FREQUENCY
): ScheduledJobCommand<Options> => async ({
  log,
  mongo,
  archive,
  config,
  signingConfig,
  tenantCache,
  mailerQueue,
}) => {
  // For each of the tenant's, process their users notifications.
  for await (const tenant of tenantCache) {
    // Create a notification context to handle processing notifications. Note
    // that this will share the current date for all users processed for this
    // Tenant, but this is OK, because we're not using this Date for the
    // digesting operations.
    const ctx = new NotificationContext({
      mongo,
      archive,
      config,
      signingConfig,
      tenant,
      log,
    });

    ctx.log.debug("starting digesting for tenant");

    // Process all the notifications for this Tenant.
    for await (const user of ctx.digest(frequency)) {
      ctx.log.debug(
        { userID: user.id, digests: user.digests.length },
        "now processing digests for user"
      );

      // Group the digests.
      const digests = user.digests.reduce((acc, entry) => {
        const digest = acc.find((d) => d.template === entry.template.name);
        if (digest) {
          digest.contexts.push(entry.template.context);
        } else {
          acc.push({
            template: entry.template.name,
            partial: path.basename(entry.template.name),
            contexts: [entry.template.context],
          });
        }

        return acc;
      }, [] as DigestElement[]);

      // TODO: sort the digest template elements by the digest order.

      // Add the email containing the digest information.
      void mailerQueue.add({
        tenantID: tenant.id,
        message: {
          to: user.email!,
        },
        template: {
          name: "notification/digest",
          context: {
            digests,
            organizationName: tenant.organization.name,
            organizationURL: tenant.organization.url,
            unsubscribeURL: await ctx.generateUnsubscribeURL(user),
          },
        },
      });
    }
  }
};
