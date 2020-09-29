import { inject, singleton } from "tsyringe";

import { createAsyncIterator } from "coral-server/helpers/createAsyncIterator";
import { retrieveUserScheduledForDeletion } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks";
import { ScheduledJob, ScheduledJobCommand } from "coral-server/scheduled/job";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { TenantCache } from "coral-server/services/tenant/cache";
import { deleteUser } from "coral-server/services/users/delete";

@singleton()
export class TwiceHourlyAccountDeletionJob extends ScheduledJob {
  constructor(
    private readonly tenantCache: TenantCache,
    @inject(MONGO) private readonly mongo: Mongo,
    private readonly mailerQueue: MailerQueue
  ) {
    super("Twice Hourly Account Deletion", "0,30 * * * *");
  }

  protected run: ScheduledJobCommand = async (logger) => {
    const now = new Date();

    // For each of the tenant's, process their users notifications.
    for await (const tenant of this.tenantCache) {
      logger = logger.child({ tenantID: tenant.id }, true);

      const users = createAsyncIterator(() =>
        retrieveUserScheduledForDeletion(
          this.mongo,
          tenant.id,
          { hours: 1 },
          now
        )
      );

      for await (const user of users) {
        logger.info({ userID: user.id }, "deleting user");

        await deleteUser(this.mongo, user.id, tenant.id, now);

        // If the user has an email, then send them a confirmation that their account
        // was deleted.
        if (user.email) {
          await this.mailerQueue.add({
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
          logger.info(
            { userID: user.id },
            "user did not have an email address"
          );
        }
      }

      logger.debug("no more users were scheduled for deletion");
    }
  };
}
