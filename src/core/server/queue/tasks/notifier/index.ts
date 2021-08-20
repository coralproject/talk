import Queue from "bull";

import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { CoralEventType } from "coral-server/events";
import Task from "coral-server/queue/Task";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig } from "coral-server/services/jwt";
import {
  categories,
  NotificationCategory,
} from "coral-server/services/notifications/categories";
import { TenantCache } from "coral-server/services/tenant/cache";

import { createJobProcessor, JOB_NAME, NotifierData } from "./processor";

interface Options {
  mongo: MongoContext;
  mailerQueue: MailerQueue;
  config: Config;
  tenantCache: TenantCache;
  signingConfig: JWTSigningConfig;
}

export type NotifierQueue = Task<NotifierData>;

export const createNotifierTask = (
  queue: Queue.QueueOptions,
  options: Options
) => {
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

  return new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor({ registry, ...options }),
    queue,
  });
};
