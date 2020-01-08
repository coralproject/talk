import Queue from "bull";
import { groupBy } from "lodash";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";
import logger from "coral-server/logger";
import Task from "coral-server/queue/Task";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import {
  categories,
  NotificationCategory,
} from "coral-server/services/notifications/categories";
import TenantCache from "coral-server/services/tenant/cache";

import { createJobProcessor, JOB_NAME, NotifierData } from "./processor";

interface Options {
  mongo: Db;
  mailerQueue: MailerQueue;
  config: Config;
  tenantCache: TenantCache;
  signingConfig: JWTSigningConfig;
}

/**
 * NotifierQueue is designed to handle creating and queuing notifications
 * that could be sent to users.
 */
export class NotifierQueue {
  private registry: Record<SUBSCRIPTION_CHANNELS, NotificationCategory[]>;
  private task: Task<NotifierData>;

  constructor(queue: Queue.QueueOptions, options: Options) {
    // Notification categories have been grouped by their event name so that
    // each event emitted need only access the associated notification once.
    this.registry = groupBy(categories, "event") as Record<
      SUBSCRIPTION_CHANNELS,
      NotificationCategory[]
    >;
    this.task = new Task({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor({ registry: this.registry, ...options }),
      queue,
    });
  }

  public async add(data: NotifierData) {
    // Get all the handlers that are active for this channel.
    const c = this.registry[data.input.channel];
    if (!c || c.length === 0) {
      logger.debug(
        { channel: data.input.channel },
        "no notifications registered on this channel"
      );
      return;
    }

    return this.task.add(data);
  }

  public process() {
    return this.task.process();
  }
}

export const createNotifierTask = (
  queue: Queue.QueueOptions,
  options: Options
) => new NotifierQueue(queue, options);
