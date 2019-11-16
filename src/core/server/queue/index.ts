import Queue from "bull";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { I18n } from "coral-server/services/i18n";
import { JWTSigningConfig } from "coral-server/services/jwt";
import { createRedisClient } from "coral-server/services/redis";
import TenantCache from "coral-server/services/tenant/cache";

import { createMailerTask, MailerQueue } from "./tasks/mailer";
import { createNotifierTask, NotifierQueue } from "./tasks/notifier";
import { createScraperTask, ScraperQueue } from "./tasks/scraper";
import { createWebhookTask, WebhookQueue } from "./tasks/webhook";

const createQueueOptions = async (
  config: Config
): Promise<Queue.QueueOptions> => {
  const client = createRedisClient(config);
  const subscriber = createRedisClient(config);

  // Return the options that can be used by the Queue.
  return {
    // Here, we are reusing the clients based on the requested types. This way,
    // any time we need a specific client, we get to use one of the ones that
    // already have been created.
    createClient: type => {
      switch (type) {
        case "subscriber":
          return subscriber;
        case "client":
          return client;
        case "bclient":
          return createRedisClient(config);
      }
    },

    // Because bull uses atomic operations across separate keys, we need to add
    // a prefix to the keys to help the Redis cluster place all those elements
    // together to support the atomic operations. See:
    //  https://redis.io/topics/cluster-tutorial
    prefix: "{queue}",
  };
};

export interface QueueOptions {
  mongo: Db;
  config: Config;
  tenantCache: TenantCache;
  i18n: I18n;
  signingConfig: JWTSigningConfig;
  redis: Redis;
}

export interface TaskQueue {
  mailer: MailerQueue;
  scraper: ScraperQueue;
  notifier: NotifierQueue;
  webhook: WebhookQueue;
}

export async function createQueue(options: QueueOptions): Promise<TaskQueue> {
  // Create the processor queue options. This holds references to the Redis
  // clients that are shared per queue.
  const queueOptions = await createQueueOptions(options.config);

  // Attach process functions to the various tasks in the queue.
  const mailer = createMailerTask(queueOptions, options);
  const scraper = createScraperTask(queueOptions, options);
  const notifier = createNotifierTask(queueOptions, {
    mailerQueue: mailer,
    ...options,
  });
  const webhook = createWebhookTask(queueOptions, options);

  // FIXME: (wyattjoh) remove before committing
  // for (let i = 0; i < 5; i++) {
  //   await webhook.add({
  //     tenantID: "1afc0816-f8bc-4618-be88-737336d51a3a",
  //     eventName: "comments.create",
  //     eventData: {
  //       id: "123",
  //       body: "This is a comment!",
  //     },
  //   });
  // }

  // Return the tasks + client.
  return {
    mailer,
    scraper,
    notifier,
    webhook,
  };
}
