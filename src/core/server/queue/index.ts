import Queue from "bull";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import Task from "talk-server/queue/Task";
import { createMailerTask, Mailer } from "talk-server/queue/tasks/mailer";
import {
  createScraperTask,
  ScraperData,
} from "talk-server/queue/tasks/scraper";
import { createRedisClient } from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";

const createQueueOptions = async (
  config: Config
): Promise<Queue.QueueOptions> => {
  const client = await createRedisClient(config);
  const subscriber = await createRedisClient(config);
  const blockingClient = await createRedisClient(config);

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
  mailer: Mailer;
  scraper: Task<ScraperData>;
}

export async function createQueue(options: QueueOptions): Promise<TaskQueue> {
  // Create the processor queue options. This holds references to the Redis
  // clients that are shared per queue.
  const queueOptions = await createQueueOptions(options.config);

  // Attach process functions to the various tasks in the queue.
  const mailer = createMailerTask(queueOptions, options);
  const scraper = createScraperTask(queueOptions, options);

  // Return the tasks + client.
  return {
    mailer,
    scraper,
  };
}
