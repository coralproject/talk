import Queue from "bull";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { CoralEventType } from "coral-server/events/events";
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
  private task: Task<NotifierData>;

  constructor(queue: Queue.QueueOptions, options: Options) {
    const registry = new Map<CoralEventType, NotificationCategory[]>();

    // Notification categories have been grouped by their event name so that
    // each event emitted need only access the associated notification once.
    for (const category of categories) {
      for (const event of category.events as CoralEventType[]) {
        let handlers = registry.get(event);
        if (!handlers) {
          handlers = [];
        }
        handlers.push(category);
        registry.set(event, handlers);
      }
    }

    this.task = new Task({
      jobName: JOB_NAME,
      jobProcessor: createJobProcessor({ registry, ...options }),
      queue,
    });
  }

  public async add(data: NotifierData) {
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
