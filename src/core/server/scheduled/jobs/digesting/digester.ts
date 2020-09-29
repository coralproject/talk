import path from "path";
import { inject, singleton } from "tsyringe";

import { Config, CONFIG } from "coral-server/config";
import { createAsyncIterator } from "coral-server/helpers/createAsyncIterator";
import { pullUserNotificationDigests } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { JWTSigningConfigService } from "coral-server/services/jwt";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import NotificationContext from "coral-server/services/notifications/context";
import { TenantCache } from "coral-server/services/tenant/cache";

import { GQLDIGEST_FREQUENCY } from "coral-server/graph/schema/__generated__/types";

/**
 * DigestElement represents each element that is used for the digesting
 * operations.
 */
interface DigestElement {
  template: string;
  partial: string;
  contexts: Array<DigestibleTemplate["context"]>;
}

@singleton()
export class NotificationDigester {
  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) private readonly config: Config,
    private readonly signingConfig: JWTSigningConfigService,
    private readonly tenantCache: TenantCache,
    private readonly mailerQueue: MailerQueue
  ) {}

  public async run(frequency: GQLDIGEST_FREQUENCY) {
    // For each of the tenant's, process their users notifications.
    for await (const tenant of this.tenantCache) {
      // Create a notification context to handle processing notifications. Note
      // that this will share the current date for all users processed for this
      // Tenant, but this is OK, because we're not using this Date for the
      // digesting operations.
      const ctx = new NotificationContext({
        mongo: this.mongo,
        config: this.config,
        signingConfig: this.signingConfig,
        tenant,
      });

      // Create an iterator for the users.
      const users = createAsyncIterator(() =>
        pullUserNotificationDigests(this.mongo, tenant.id, frequency)
      );

      // Process all the notifications for this Tenant.
      for await (const user of users) {
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
        void this.mailerQueue.add({
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
  }
}
