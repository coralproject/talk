import Queue from "bull";
import { Db } from "mongodb";

import { Config } from "talk-common/config";
import Task from "talk-server/services/queue/Task";
import {
  createMailerTask,
  MailerData,
} from "talk-server/services/queue/tasks/mailer";
import {
  createScraperTask,
  ScraperData,
} from "talk-server/services/queue/tasks/scraper";
import { createRedisClient } from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";

const createQueueOptions = (config: Config): Queue.QueueOptions => {
  const client = createRedisClient(config);
  const subscriber = createRedisClient(config);
  const blockingClient = createRedisClient(config);

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
          return blockingClient;
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
}

export interface TaskQueue {
  mailer: Task<MailerData>;
  scraper: Task<ScraperData>;
}

export function createQueue(options: QueueOptions): TaskQueue {
  // Create the processor queue options. This holds references to the Redis
  // clients that are shared per queue.
  const queueOptions = createQueueOptions(options.config);

  // Attach process functions to the various tasks in the queue.
  const mailer = createMailerTask(queueOptions, options);
  const scraper = createScraperTask(queueOptions, options);

  // Return the tasks + client.
  return {
    mailer,
    scraper,
  };
}
