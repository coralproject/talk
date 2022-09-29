import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { CoralEventType } from "coral-server/events";
import { NotifierCoralEventListenerPayloads } from "coral-server/events/listeners/notifier";
import logger from "coral-server/logger";
import { JobProcessor } from "coral-server/queue/Task";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { NotificationCategory } from "coral-server/services/notifications/categories";
import NotificationContext from "coral-server/services/notifications/context";
import { Notification } from "coral-server/services/notifications/notification";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  filterSuperseded,
  handleHandlers,
  processNewNotifications,
} from "./messages";

export const JOB_NAME = "notifications";

/**
 * NotifierData stores the data used by the notification system.
 */
export interface NotifierData {
  tenantID: string;
  input: NotifierCoralEventListenerPayloads;
}

interface Options {
  mailerQueue: MailerQueue;
  mongo: MongoContext;
  config: Config;
  registry: Map<CoralEventType, NotificationCategory[]>;
  tenantCache: TenantCache;
  signingConfig: JWTSigningConfig;
}

/**
 * CategoryNotification combines the category and notification's to collect the
 * appropriate elements together that can be used for digesting purposes.
 */
export interface CategoryNotification {
  category: NotificationCategory;
  notification: Notification;
}

/**
 * createJobProcessor creates the processor that is used to process the
 * possible notifications and queueing them up in the mailer if they need to be
 * sent.
 *
 * @param options options for the processor
 */
export const createJobProcessor =
  ({
    mailerQueue,
    mongo,
    config,
    registry,
    tenantCache,
    signingConfig,
  }: Options): JobProcessor<NotifierData> =>
  async (job) => {
    const now = new Date();

    // Pull the data out of the model.
    const { tenantID, input } = job.data;

    // Create a new logger to handle logging for this job.
    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    log.debug("starting to handle a notify operation");

    // Get all the handlers that are active for this channel.
    const categories = registry.get(input.type);
    if (!categories || categories.length === 0) {
      return;
    }

    // Grab the tenant from the cache.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      throw new Error("tenant not found with ID");
    }

    // Create a notification context to handle processing notifications.
    const ctx = new NotificationContext({
      mongo,
      config,
      signingConfig,
      tenant,
      now,
    });

    // For each of the handler's we need to process, we should iterate to
    // generate their notifications.
    let notifications = await handleHandlers(ctx, categories, input);

    // Check to see if some of the other notifications that are queued
    // had this notification superseded.
    notifications = notifications.filter(filterSuperseded);

    // Send all the notifications now.
    await processNewNotifications(
      ctx,
      notifications.map(({ notification }) => notification),
      mailerQueue
    );

    log.debug({ notifications: notifications.length }, "notifications handled");
  };
