import { inject, singleton } from "tsyringe";

import { Config, CONFIG } from "coral-server/config";
import { CoralEventType } from "coral-server/events";
import { NotifierCoralEventListenerPayloads } from "coral-server/events/listeners/notifier";
import {
  Processor,
  ProcessorHandler,
} from "coral-server/queue/tasks/processor";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfigService } from "coral-server/services/jwt";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import {
  categories,
  NotificationCategory,
} from "coral-server/services/notifications/categories";
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

/**
 * CategoryNotification combines the category and notification's to collect the
 * appropriate elements together that can be used for digesting purposes.
 */
export interface CategoryNotification {
  category: NotificationCategory;
  notification: Notification;
}

@singleton()
export class NotifierQueueProcessor implements Processor<NotifierData> {
  private readonly registry = new Map<CoralEventType, NotificationCategory[]>();

  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) private readonly config: Config,
    private readonly signingConfig: JWTSigningConfigService,
    private readonly tenantCache: TenantCache,
    private readonly mailerQueue: MailerQueue
  ) {
    this.registry = new Map<CoralEventType, NotificationCategory[]>();

    // Notification categories have been grouped by their event name so that
    // each event emitted need only access the associated notification once.
    for (const category of categories) {
      for (const event of category.events as CoralEventType[]) {
        let handlers = this.registry.get(event);
        if (!handlers) {
          handlers = [];
        }
        handlers.push(category);
        this.registry.set(event, handlers);
      }
    }
  }

  public process: ProcessorHandler<NotifierData> = async (logger, job) => {
    const now = new Date();

    // Pull the data out of the model.
    const { tenantID, input } = job.data;

    logger.debug("starting to handle a notify operation");

    // Get all the handlers that are active for this channel.
    const handlers = this.registry.get(input.type);
    if (!handlers || handlers.length === 0) {
      return;
    }

    // Grab the tenant from the cache.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      throw new Error("tenant not found with ID");
    }

    // Create a notification context to handle processing notifications.
    const ctx = new NotificationContext({
      mongo: this.mongo,
      config: this.config,
      signingConfig: this.signingConfig,
      tenant,
      now,
    });

    // For each of the handler's we need to process, we should iterate to
    // generate their notifications.
    let notifications = await handleHandlers(ctx, handlers, input);

    // Check to see if some of the other notifications that are queued
    // had this notification superseded.
    notifications = notifications.filter(filterSuperseded);

    // Send all the notifications now.
    await processNewNotifications(
      ctx,
      notifications.map(({ notification }) => notification),
      this.mailerQueue
    );

    logger.debug(
      { notifications: notifications.length },
      "notifications handled"
    );
  };
}
