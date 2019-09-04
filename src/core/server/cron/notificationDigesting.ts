import { Db } from "mongodb";
import path from "path";

import { Config } from "coral-server/config";
import { GQLDIGEST_FREQUENCY } from "coral-server/graph/tenant/schema/__generated__/types";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { JWTSigningConfig } from "coral-server/services/jwt";
import NotificationContext from "coral-server/services/notifications/context";
import TenantCache from "coral-server/services/tenant/cache";

import { JobCommand, ScheduledJob, ScheduledJobGroup } from "./job";

interface Options {
  mongo: Db;
  config: Config;
  mailerQueue: MailerQueue;
  signingConfig: JWTSigningConfig;
  tenantCache: TenantCache;
}

export const NAME = "Notification Digesting";

export function registerNotificationDigesting(
  options: Options
): ScheduledJobGroup {
  const hourly = new ScheduledJob({
    name: `Hourly ${NAME}`,
    cronTime: "0 * * * *",
    command: processNotificationDigesting(options, GQLDIGEST_FREQUENCY.HOURLY),
  });

  const daily = new ScheduledJob({
    name: `Daily ${NAME}`,
    cronTime: "0 0 * * *",
    command: processNotificationDigesting(options, GQLDIGEST_FREQUENCY.DAILY),
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

function processNotificationDigesting(
  { mongo, config, signingConfig, tenantCache, mailerQueue }: Options,
  frequency: GQLDIGEST_FREQUENCY
): JobCommand {
  return async job => {
    // For each of the tenant's, process their users notifications.
    for await (const tenant of tenantCache) {
      // Create a notification context to handle processing notifications. Note
      // that this will share the current date for all users processed for this
      // Tenant, but this is OK, because we're not using this Date for the
      // digesting operations.
      const ctx = new NotificationContext({
        mongo,
        config,
        signingConfig,
        tenant,
        log: job.log,
      });

      ctx.log.debug("starting digesting for tenant");

      // Process all the notifications for this Tenant.
      while (true) {
        // Try to get a user that needs digesting.
        const user = await ctx.getDigests(frequency);
        if (!user) {
          // There are no more users to digest for this Tenant.
          ctx.log.debug("no more digests to process for tenant");
          break;
        }

        ctx.log.debug(
          { userID: user.id, digests: user.digests.length },
          "now processing digests for user"
        );

        // Group the digests.
        const digests = user.digests.reduce(
          (acc, entry) => {
            const digest = acc.find(d => d.template === entry.template.name);
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
          },
          [] as DigestElement[]
        );

        // TODO: sort the digest template elements by the digest order.

        // Add the email containing the digest information.
        mailerQueue.add({
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
}
