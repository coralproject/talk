import Queue from "bull";

import Task from "coral-server/queue/Task";

import {
  createJobProcessor,
  JOB_NAME,
  WebhookData,
  WebhookProcessorOptions,
} from "./processor";

export type WebhookQueue = Task<WebhookData>;

export const createWebhookTask = (
  queue: Queue.QueueOptions,
  options: WebhookProcessorOptions
) =>
  new Task({
    jobName: JOB_NAME,
    jobProcessor: createJobProcessor(options),
    queue,
  });
